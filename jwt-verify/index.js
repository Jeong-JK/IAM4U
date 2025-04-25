const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios');

let pems;

// 최초 1회 JWK 가져오기
const getPems = async (userPoolId) => {
  if (pems) return pems;

  const url = `https://cognito-idp.ap-northeast-2.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
  const { data } = await axios.get(url);

  pems = {};
  data.keys.forEach(key => {
    pems[key.kid] = jwkToPem(key);
  });
  return pems;
};

exports.handler = async (event) => {
  const token = event.headers.Authorization.split(' ')[1];
  const decoded = jwt.decode(token, { complete: true });

  const userPoolId = 'ap-northeast-2_he0NwXfAK';
  const pems = await getPems(userPoolId);
  const pem = pems[decoded.header.kid];

  if (!pem) {
    return { statusCode: 401, body: JSON.stringify({ message: 'Invalid token' }) };
  }

  try {
    jwt.verify(token, pem, { issuer: `https://cognito-idp.ap-northeast-2.amazonaws.com/${userPoolId}` });
    return { statusCode: 200, 
      header: { 'Access-Control-Allow-Origin': '*' }, 
      body: JSON.stringify({ user: { username: decoded.payload['cognito:username'] } }) };
  } catch (err) {
    console.error('JWT 검증 실패:', err);
    return { statusCode: 401, body: JSON.stringify({ message: 'JWT 검증 실패' }) };
  }
};
