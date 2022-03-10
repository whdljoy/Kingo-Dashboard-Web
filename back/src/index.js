const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mysql = require("mysql");
const Web3 = require("web3");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);

const app = express();
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.set("port", process.env.PORT || 5000);

const web3 = new Web3(
  Web3.givenProvider || "ws://some.local-or-remote.node:8546"
);

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

// 기능 구현

app.get("/api/transaction", (req, res) => {
  if (req.query.who === "all") {
    connection.query(
      `SELECT * from userinfo where _to=${req.query.address} or _from=${req.query.address}`,
      (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
      }
    );
  } else if (req.query.who === "to") {
    connection.query(
      `SELECT * from userinfo where _to=${req.query.address}`,
      (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
      }
    );
  } else if (req.query.who === "from") {
    connection.query(
      `SELECT * from userinfo where _from = ${req.query.address}`,
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

  const address = web3.eth.personal.ecRecover(
    JSON.stringify({ _from, _to, _point }),
    _signedTransaction
  );

  address.then((res) => {
    if (res !== _from) {
      return res.json({ status: "잘못된 서명" });
    }
  });

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

// id에 대한 쿼리를 같이 보내면 해당 유저에 대한 정보를 가져올 수 있음.
app.get("/api/userinfo", (req, res) => {
  console.log(req);
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
  console.log(typeof type);
  console.log(point);
  console.log(typeof _from);
  connection.query(
    `UPDATE USER set _point${type}=_point${type}-${point} where _username="${_from}"`,
    (err, rows) => {
      if (err) throw err;
      res.json(rows);
    }
  );
  console.log("helloworld!");
});

app.get("/api/:id", (req, res) => {
  const type = req.params.id;
  res.json({
    user_id: type,
    token: type,
    geo: type,
  });
});

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
