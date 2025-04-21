const AWS = require("aws-sdk");
const sqs = new AWS.SQS();
const sns = new AWS.SNS();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");

    if (!body.userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "userId는 필수입니다." }),
      };
    }

    const message = {
      userId: body.userId,
      timestamp: new Date().toISOString(),
    };

    const sqsParams = {
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify(message),
    };

    const snsParams = {
      TopicArn: process.env.SNS_TOPIC_ARN,
      Message: `[매칭 요청] userId: ${message.userId}`,
    };

    // SQS와 SNS 병렬 전송
    await Promise.all([
      sqs.sendMessage(sqsParams).promise(),
      sns.publish(snsParams).promise(),
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "매칭 요청 처리 및 알림 완료",
        data: message,
      }),
    };
  } catch (err) {
    console.error("처리 중 오류:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: "서버 오류: 요청을 처리하지 못했습니다." }),
    };
  }
};
