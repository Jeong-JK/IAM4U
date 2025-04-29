// server.js

const app = require('./app');
const { createServer } = require('http');
const { Server } = require('socket.io');

// HTTP 서버 생성
const httpServer = createServer(app);

// socket.io 서버 생성 + CORS 설정 추가
const io = new Server(httpServer, {
  cors: {
    origin: [
      'https://d1v49ms01qjcg7.cloudfront.net',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// 소켓 이벤트 연결 (너가 만든 socket/index.js)
require('./socket/index')(io);

// 서버 시작
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`\u2705 Express + Socket.io 서버 실행 중 (포트 ${PORT})`);
});
