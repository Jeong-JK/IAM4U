const express = require('express');
const Keygrip = require('keygrip');
// const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const logger = require('morgan');

const passport = require('./passport');
const indexRouter = require('./routes/index');

// const mysql = require('mysql2');
// const { Sequelize } = require('sequelize');

const app = express();
let ORIGIN_ROOT;

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
  ORIGIN_ROOT = 'http://localhost:3000';
} else {
  ORIGIN_ROOT = 'https://d5ip4x13p5ucr.cloudfront.net';
}

// mongoose.connect(process.env.DATABASE_URI, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true,
//   useFindAndModify: false,
//   useCreateIndex: true
// });

const sequelize = require('./config/database');

sequelize.authenticate()
  .then(() => console.log('✅ MySQL 연결 성공'))
  .catch(err => console.error('❌ MySQL 연결 실패:', err));

const User = require('./models/User');

sequelize.sync()
  .then(() => console.log('📦 테이블 동기화 완료'))
  .catch(err => console.error('테이블 동기화 실패:', err));

app.use(
  cors({
    origin: ORIGIN_ROOT,
    credentials: true
  })
);

app.use(
  cookieSession({
    name: 'session',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    keys: new Keygrip(['key1', 'key2'], 'SHA384', 'base64'),
    httpOnly: true
  })
);

// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', () => console.log('connection'));

// MySQL 연결 풀 설정
// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '비밀번호',
//   database: 'mbti_match'
// });

// // 연결 테스트
// db.getConnection((err, connection) => {
//   if (err) {
//     console.error('❌ MySQL 연결 실패:', err);
//     return;
//   }
//   console.log('✅ MySQL 연결 성공');
//   connection.release(); // 풀에서 연결 반환
// });

// module.exports = db; // 필요시 export

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

module.exports = app;
