const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  
  // const { liker, liked } = JSON.parse(event.body);
  // await dynamo.put({
  //   TableName: 'MatchTable',
  //   Item: {
  //     liker,
  //     liked,
  //     timestamp: new Date().toISOString()
  //   }
  // }).promise();

  const params = {
    TableName: 'MatchTable',
    Item: {
      liker: body.liker,
      liked: body.liked,
      timestamp: new Date().toISOString(),
    },
  };

  await dynamo.put(params).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({ message: '매칭 저장 완료' }),
  };
};