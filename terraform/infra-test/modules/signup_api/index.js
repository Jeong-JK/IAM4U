const AWS = require("aws-sdk");
const mysql = require("mysql2/promise");

const s3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    const { name, age, gender, bio, imageBase64 } = body;

    if (!name || !imageBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "이름과 사진은 필수입니다." }),
      };
    }

    // S3에 저장할 파일 이름 생성
    const fileName = `profile-images/${Date.now()}-${name}.jpg`;
    const buffer = Buffer.from(imageBase64, "base64");

    // S3 업로드
    await s3
      .putObject({
        Bucket: process.env.S3_BUCKET,
        Key: fileName,
        Body: buffer,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
      })
      .promise();

    const imageUrl = `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Aurora 저장
    const connection = await mysql.createConnection({
      host: process.env.AURORA_ENDPOINT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || "matchdb",
    });

    await connection.execute(
      `INSERT INTO users (name, age, gender, bio, image_url) VALUES (?, ?, ?, ?, ?)`,
      [name, age, gender, bio, imageUrl]
    );

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "가입 완료!", imageUrl }),
    };
  } catch (err) {
    console.error("❌ 가입 처리 실패:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "서버 오류", error: err.message }),
    };
  }
};