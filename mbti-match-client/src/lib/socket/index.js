import io from 'socket.io-client';
import { MESSAGE, ERROR, JOIN, LEAVE } from '../../contants/socketEventTypes';
import { config } from '../../config';

const { SOCKET_ROOT } = config;

export default function() {
  // const socket = io.connect(SOCKET_ROOT);
  const socket = io('wss://datingapp.store', {
    path: '/socket.io/',
    transports: ['websocket'],
    secure: true
  });

  socket.on(ERROR, function(err) {
    console.log(err);
  });

  const receiveNewMessage = cb => {
    socket.on(MESSAGE, cb);
  };

  const joinRoom = data => {
    socket.emit(JOIN, data);
  };

  const sendMessage = data => {
    socket.emit(MESSAGE, data);
  };

  const leaveRoom = roomId => {
    socket.removeListener(MESSAGE);
    socket.removeListener(ERROR);
    socket.emit(LEAVE, roomId);
  };

  return {
    joinRoom,
    sendMessage,
    receiveNewMessage,
    leaveRoom
  };
}
