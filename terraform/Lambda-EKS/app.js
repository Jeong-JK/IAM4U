const mysql = require('mysql2/promise');
const Redis = require('ioredis');
const AWS = require('aws-sdk');
const http = require('http');

// ✅ 환경변수
const {
  AURORA_ENDPOINT,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  REDIS_ENDPOINT,
  SNS_TOPIC_ARN,
  AWS_REGION
} = process.env;

// ✅ AWS Config (Region)
AWS.config.update({ region: AWS_REGION });
const sns = new AWS.SNS();
const redis = new Redis(REDIS_ENDPOINT);

console.log("🚀 Matchmaking Service Started!");

const server = http.createServer(async (req, res) => {
  console.log(`📥 [${req.method}] ${req.url} 요청`);

  // ✅ 1. 가입 (이메일 등록 → SNS 구독)
  if (req.url === "/signup" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      const { email } = JSON.parse(body);
      if (!email) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "이메일은 필수입니다." }));
        return;
      }

      try {
        await sns.subscribe({
          Protocol: 'email',
          TopicArn: SNS_TOPIC_ARN,
          Endpoint: email
        }).promise();

        console.log(`✅ 구독 요청 완료: ${email}`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "구독 확인 메일을 확인해주세요!" }));
      } catch (err) {
        console.error("❌ 구독 등록 에러:", err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "구독 등록 실패", detail: err.message }));
      }
    });

  // ✅ 2. 로그인 (이메일 인증 확인)
  } else if (req.url === "/login" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", async () => {
      const { email } = JSON.parse(body);
      if (!email) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "이메일은 필수입니다." }));
        return;
      }

      try {
        const subs = await sns.listSubscriptionsByTopic({
          TopicArn: SNS_TOPIC_ARN
        }).promise();

        const sub = subs.Subscriptions.find(sub => sub.Endpoint === email);
        const confirmed = sub && sub.SubscriptionArn !== 'PendingConfirmation';

        if (!confirmed) {
          res.writeHead(403);
          res.end(JSON.stringify({ error: "이메일 인증이 완료되지 않았습니다. 메일을 확인하세요!" }));
          return;
        }

        console.log(`✅ 인증 완료: ${email}`);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "로그인 성공!" }));
      } catch (err) {
        console.error("❌ 로그인 확인 에러:", err);
        res.writeHead(500);
        res.end(JSON.stringify({ error: "로그인 처리 중 오류 발생", detail: err.message }));
      }
    });

  // ✅ 3. 매칭 로직
  } else if (req.url === "/match" && req.method === "POST") {
    const userId = Math.floor(Math.random() * 10000);  // 테스트용 랜덤 userId
    console.log(`👤 User ${userId} 매칭 요청`);

    try {
      await redis.lpush("match-queue", userId);
      const queueLength = await redis.llen("match-queue");
      console.log(`📦 현재 대기열 길이: ${queueLength}`);

      if (queueLength >= 2) {
        const user1 = await redis.rpop("match-queue");
        const user2 = await redis.rpop("match-queue");
        console.log(`🎉 매칭 성공: ${user1} vs ${user2}`);

        const connection = await mysql.createConnection({
          host: AURORA_ENDPOINT,
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME
        });
        await connection.execute(
          "INSERT INTO match_log (matched_at) VALUES (NOW())"
        );
        await connection.end();
        console.log("✅ 매칭 기록 DB 저장 완료");

        await sns.publish({
          TopicArn: SNS_TOPIC_ARN,
          Subject: "💘 매칭 성공 알림",
          Message: `🎉 매칭이 완료되었습니다: ${user1} vs ${user2}`
        }).promise();
        console.log("📧 SNS 메일 알림 전송 완료");

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: `✅ 매칭 성공! ${user1} vs ${user2} / DB 저장 + 메일 알림 완료!` }));
      } else {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "🕒 대기 중입니다. 매칭 상대를 기다리는 중..." }));
      }
    } catch (err) {
      console.error("❌ 서버 에러:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "서버 오류", detail: err.message }));
    }

  // ❌ 4. 나머지 경로
  } else {
    res.writeHead(404);
    res.end();
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
