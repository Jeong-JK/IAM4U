let ROOT, SOCKET_ROOT;

if (process.env.NODE_ENV === 'development') {
  ROOT = 'http://localhost:8081';
  SOCKET_ROOT = 'http://localhost:8081';
} else {
  ROOT = 'https://jxsbyfmks7.execute-api.ap-northeast-2.amazonaws.com/prod';
  SOCKET_ROOT = 'http://3.38.152.226:8080';
}

export const config = Object.freeze({
  ROOT, //: process.env.REACT_APP_ROOT,
  SOCKET_ROOT //: process.env.REACT_APP_SOCKET_ROOT
});

