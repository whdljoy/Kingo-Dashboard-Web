const express = require("express");
const Caver = require("caver-js");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mysql = require("mysql");
const ipfsClient = require("ipfs-http-client");
const asyncify = require("express-asyncify");
const router = asyncify(express.Router());
const DEPLOYED_ABI = require("./contractinfo/deployedABI.json");
const DEPLOYED_ADDRESS = require("./contractinfo/deployedAddress.json");
// const { cav, ipfs, IPFSCONTRACT } = require("./variables");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);
const schedule = require("node-schedule");

const Web3 = require("web3");
const app = express();
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.set("port", process.env.PORT || 5000);

const web3 = new Web3("ws://some.local-or-remote.node:8546");

const config = {
  rpcURL: "https://api.baobab.klaytn.net:8651",
};

let ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const caver = new Caver(config.rpcURL);
const IPFSCONTRACT = new caver.klay.Contract(DEPLOYED_ABI, DEPLOYED_ADDRESS);

function MetadataSchema(database) {
  return {
    title: "Transaction",
    transactions: {
      description: database,
    },
  };
}

const feePayer = caver.klay.accounts.wallet.add(
  //클레이튼 개인키로 추가해줍니다.
  "0x8cafa33df8c1740720bc4815ce7c7cd61d18aaf396bb2a3da5e197f0c7b85aff"
);

app.get("/api/uploadIpfs", async (req, res) => {
  const index = req.query.hash;
  console.log(index);
  let database;
  connection.query(
    `SELECT * from transaction where _hash=${index}`,
    async (err, rows, fields) => {
      if (err) throw err;
      database = rows;
      const transactions = MetadataSchema(database);
      const ipfsres = await ipfs.add(Buffer.from(JSON.stringify(transactions)));
      const url = "https://ipfs.infura.io/ipfs/" + ipfsres[0].hash;

      const { rawTransaction: senderRawTransaction } =
        await caver.klay.accounts.signTransaction({
          type: "FEE_DELEGATED_SMART_CONTRACT_EXECUTION",
          from: feePayer.address,
          to: DEPLOYED_ADDRESS["key"],
          data: IPFSCONTRACT.methods.setIpfsAddress(index, url).encodeABI(),
          gas: "500000",
          value: caver.utils.toPeb("0", "KLAY"),
        });

      caver.klay
        .sendTransaction({
          senderRawTransaction: senderRawTransaction,
          feePayer: feePayer.address,
        })
        .then(function (receipt) {
          console.log(receipt.transactionHash);
          connection.query(
            `UPDATE TRANSACTION set _hashreceipt="${receipt.transactionHash}" where _hash=${index}`,
            async (err, rows) => {
              if (err) throw err;
              res.json({ status: 200 });
            }
          );
        });
    }
  );

  // const transactions = MetadataSchema(database);

  // const ipfsres = await ipfs.add(Buffer.from(JSON.stringify(transactions)));
  // const url = "https://ipfs.infura.io/ipfs/" + ipfsres[0].hash;
});

// id, token, geo 쿼리 보내서 리턴 받는 튜토리얼
app.get("/api/queryprac", function (req, res) {
  const user_id = req.query.id;
  const token = req.query.token;
  const geo = req.query.geo;

  res.json({
    user_id: user_id,
    token: token,
    geo: geo,
  });
});

app.get("/api/getHash", (req, res) => {
  const address = req.query.address;
  let hash = [];
  let receipt = [];
  let add = [];

  connection.query(
    `SELECT * from transaction where _to="${address}" or _from="${address}"`,
    (err, rows, fields) => {
      if (err) throw err;
      for (let i = 0; i < rows.length; i++) {
        hash.push(rows[i]._hash);
        receipt.push(rows[i]._hashreceipt);
      }
      const noDuplHash = hash.filter((el, idx) => {
        return hash.indexOf(el) === idx;
      });
      const noDuplReceipt = receipt.filter((el, idx) => {
        return receipt.indexOf(el) === idx;
      });
      add.push(noDuplHash);
      add.push(noDuplReceipt);
      res.json(add);
    }
  );
});

app.get("/api/mapping", (req, res) => {
  const skkuid = req.query.skkuid;
  connection.query(
    `SELECT * from mapping where skkuid=${skkuid}`,
    (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

app.post("api/mapping", (req, res) => {
  const skkuid = req.body.skkuid;
  const address = req.body.address;
  let sql = `INSERT INTO transaction (skkuid, address) VALUES (?)`;
  let values = [skkuid, address];
  connection.query(sql, [values], (err, data, fields) => {
    if (err) throw err;
    return res.json({ status: "200" });
  });
});

app.get("/api/result/:index", async (req, res) => {
  const index = req.params.index;

  const vari = await IPFSCONTRACT.methods.getIpfsAddress(index).call();

  res.json(vari);
});

// 기능 구현

app.get("/api/transaction", (req, res) => {
  if (req.query.who === "all") {
    connection.query(
      `SELECT * from transaction where _to="${req.query.address}" or _from="${req.query.address}"`,
      (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
      }
    );
  } else if (req.query.who === "to") {
    connection.query(
      `SELECT * from transaction where _to="${req.query.address}"`,
      (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
      }
    );
  } else if (req.query.who === "from") {
    connection.query(
      `SELECT * from transaction where _from = "${req.query.address}"`,
      (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
      }
    );
  } else {
    res.json({
      from: "",
      to: "",
      value: "",
      type: "",
      create_date: "",
      hash: "",
    });
  }
});

// transaction을 만들어 내는
app.post("/api/createTx", async (req, res) => {
  let fromPoint;
  let toPoint;

  const _from = req.body._from;
  const _to = req.body._to;
  const _point = req.body._point;

  const _type = "A"; // ip 주소에 따라 _type 설정해줄 것
  const _txtype = "TRANSFER"; // _txtype(단순히 포인트의 이동인지 아니면 사이트로부터 받는 것인지 등등)
  const _date = new Date();
  const _hash = null;
  const _hashreceipt = null;
  const _signedTransaction = req.body._signedTransaction;
  // _from, _to, _point에 대한 정보를 sign함. 이후에 어떤 transaction에 대하여 누가 서명했는지 알기 위해서는 transaction으로 부터 _from, _to, _point 정보를 가져와서 web3js method로 알 수 있음.

  // const address = web3.eth.personal.ecRecover(
  //   JSON.stringify({ _from: _from, _to: _to, _point: _point }),
  //   _signedTransaction
  // );

  // address.then((res) => {
  //   if (res !== _from) {
  //     return res.json({ status: "잘못된 서명" });
  //   }
  // });

  let sql = `INSERT INTO transaction (_from, _to, _point, _type, _txtype, _date, _hash, _hashreceipt, _signedTransaction) VALUES (?)`;
  let values = [
    _from,
    _to,
    _point,
    _type,
    _txtype,
    _date,
    _hash,
    _hashreceipt,
    _signedTransaction,
  ];

  connection.query(
    `SELECT _username, _point${_type} from user where _username = "${_from}" or _username="${_to}"`,
    (err, rows) => {
      if (err) throw err;
      const variable1 = rows[0][Object.keys(rows[0])[1]];
      const variable2 = rows[1][Object.keys(rows[1])[1]];

      rows[0][Object.keys(rows[0])[0]] == _from
        ? ((fromPoint = variable1), (toPoint = variable2))
        : ((fromPoint = variable2), (toPoint = variable1));

      if (fromPoint < _point) {
        return res.json({ status: "point가 부족합니다." });
      }
      let sql1 = `UPDATE USER set _point${_type}=_point${_type}-${_point} where _username="${_from}"`;
      let sql2 = `UPDATE USER set _point${_type}=_point${_type}+${_point} where _username="${_to}"`;
      connection.query(sql1, (err, rows) => {
        if (err) throw err;
      });
      connection.query(sql2, (err, rows) => {
        if (err) throw err;
      });
      connection.query(sql, [values], (err, rows) => {
        if (err) res.json({ status: err });

        return res.json({ status: "200" });
      });
    }
  );
});

// 발생한 모든 transaction을 가져옴.
app.get("/api/viewAll", (req, res) => {
  connection.query(`SELECT * from transaction`, (err, rows, fields) => {
    if (err) throw err;
    res.json(rows);
  });
});

// 특정 타입에 대한 from의 포인트를 가져옴.
app.get("/api/checkPointsFrom", (req, res) => {
  const type = req.query.type;
  const _from = req.query._from;
  connection.query(
    `SELECT _point${type} from user where _username = "${_from}"`,
    (err, rows) => {
      if (err) throw err;
      res.json(rows[0]);
    }
  );
});

app.get("/api/graph", (req, res) => {
  connection.query(
    `SELECT * from graph where _account="${req.query.id}"`,
    (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

// id에 대한 쿼리를 같이 보내면 해당 유저에 대한 정보를 가져올 수 있음.
app.get("/api/userinfo", (req, res) => {
  connection.query(
    `SELECT * from user where _username="${req.query.id}"`,
    (err, rows, fields) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

// 그냥 연습용 api
app.post("/api/tester", (req, res) => {
  const type = req.body.type;
  const point = 1 * req.body.point;
  const _from = req.body._from;

  connection.query(
    `UPDATE USER set _point${type}=_point${type}-${point} where _username="${_from}"`,
    (err, rows) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

app.get("/api/:id", (req, res) => {
  const type = req.params.id;
  res.json({
    user_id: type,
    token: type,
    geo: type,
  });
});

var j = schedule.scheduleJob("0 0 0 * * *", function () {
  let sql = `UPDATE graph set Today = (Select POINT FROM (Select user._pointA+user._pointB+user._pointC+user._pointD AS POINT FROM user Inner join graph ON user._username = graph._account)A)`;
  let sql1 = `UPDATE graph set Day_6 = Day_5`;
  let sql2 = `UPDATE graph set Day_5 = Day_4`;
  let sql3 = `UPDATE graph set Day_4 = Day_3`;
  let sql4 = `UPDATE graph set Day_3 = Day_2`;
  let sql5 = `UPDATE graph set Day_2 = Day_1`;
  let sql6 = `UPDATE graph set Day_1 = Today`;

  connection.query(sql1, (err, rows) => {
    if (err) throw err;
  });

  connection.query(sql2, (err, rows) => {
    if (err) throw err;
  });

  connection.query(sql3, (err, rows) => {
    if (err) throw err;
  });

  connection.query(sql4, (err, rows) => {
    if (err) throw err;
  });

  connection.query(sql5, (err, rows) => {
    if (err) throw err;
  });

  connection.query(sql6, (err, rows) => {
    if (err) throw err;
  });

  connection.query(sql, (err, rows) => {
    if (err) throw err;
  });
  console.log("매일 0시 0분");
});

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
