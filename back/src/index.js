const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mysql = require("mysql");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig);

const app = express();
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.set("port", process.env.PORT || 5000);

// 모든 userinfo 테이블의 모든 정보 가져오기
app.get("/users", (req, res) => {
  connection.query("SELECT * from userinfo", (error, rows, fields) => {
    if (error) throw error;
    console.log("User info is: ", rows);
    res.json(rows);
  });
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

// 기능 구현

app.get("/api/transaction", (req, res) => {
  if (req.query.who === "all") {
    connection.query(
      `SELECT * from transaction where _to=${req.query.address} or _from=${req.query.address}`,
      (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
      }
    );
  } else if (req.query.who === "to") {
    connection.query(
      `SELECT * from transaction where _to=${req.query.address}`,
      (err, rows, fields) => {
        if (err) throw err;
        res.json(rows);
      }
    );
  } else if (req.query.who === "from") {
    connection.query(
      `SELECT * from transaction where _from = ${req.query.address}`,
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
app.post("/api/createTx", (req, res) => {
  let toPoint;
  let fromPoint;

  let sql = `INSERT INTO transaction (_from, _to, _point, _type, _date, _hash) VALUES (?)`;

  const _from = req.body._from;
  const _to = req.body._to;
  const point = req.body.point;
  const type = req.body.type;
  const date = new Date();
  const hash = req.body.hash;

  let values = [_from, _to, point, type, date, hash];

  connection.query(
    `SELECT _username, _point${type} from user where _username = "${_from}" or _username="${_to}"`,
    (err, rows) => {
      if (err) throw err;
      const variable1 = rows[0][Object.keys(rows[0])[1]];
      const variable2 = rows[1][Object.keys(rows[1])[1]];
      rows[0][Object.keys(rows[0])[0]] == _from
        ? ((fromPoint = variable1), (toPoint = variable2))
        : ((fromPoint = variable2), (toPoint = variable1));
    }
  );

  console.log(fromPoint);
  console.log(toPoint);

  if (fromPoint < point) {
    return res.json({ status: "포인트가 부족합니다." });
  }
  let sql1 = `UPDATE USER set _point${type}=_point${type}-${point} where _username="${_from}"`;
  let sql2 = `UPDATE USER set _point${type}=_point${type}+${point} where _username="${_to}"`;
  connection.query(sql1, (err, rows) => {
    if (err) throw err;
  });

  connection.query(sql2, (err, rows) => {
    if (err) throw err;
  });

  connection.query(sql, [values], (err, data, fields) => {
    if (err) throw err;

    return res.json({ status: "200" });
  });
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

app.listen(app.get("port"), () => {
  console.log("Express server listening on port " + app.get("port"));
});
