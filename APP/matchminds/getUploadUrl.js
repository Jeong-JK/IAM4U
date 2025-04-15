const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const BUCKET_NAME = 'your-bucket-name';

exports.handler = async (event) => {
  const { filename, filetype } = JSON.parse(event.body);

  const key = `profiles/${Date.now()}-${filename}`;

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: filetype,
    Expires: 60,
  });

  const fileUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;

  return {
    statusCode: 200,
    body: JSON.stringify({ uploadUrl, fileUrl }),
  };
};