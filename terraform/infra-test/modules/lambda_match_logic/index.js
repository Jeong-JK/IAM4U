const AWS = require("aws-sdk");
const mysql = require("mysql2/promise");
const sns = new AWS.SNS();

exports.handler = async (event) => {
  const results = [];

  for (const record of event.Records || []) {
    try {
      const body = JSON.parse(record.body || "{}");
      const userId = body.userId || "user-unknown";

      const connection = await mysql.createConnection({
        host: process.env.AURORA_ENDPOINT,
        user: process.env.DB_USER,           // 환경변수화
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME || "matchdb",
      });

      await connection.execute(
        "INSERT INTO match_log (user_id, matched_at) VALUES (?, NOW())",
        [userId]
      );

      await connection.end();

      await sns.publish({
        TopicArn: process.env.SNS_TOPIC_ARN,
        Subject: "매칭 완료 알림",
        Message: `✅ 매칭 성공: ${userId}`,
      }).promise();

      console.log(`✔️ 매칭 성공 처리됨: ${userId}`);
      results.push({ userId, status: "SUCCESS" });

    } catch (err) {
      console.error("❌ 처리 중 오류 발생:", err);
      results.push({ status: "ERROR", error: err.message });
    }
  }

  // SQS 트리거는 별도 응답 필요 없음
  return;
};
