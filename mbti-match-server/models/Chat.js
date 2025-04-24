// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const chatSchema = new Schema({
//   users: [
//     {
//       type: mongoose.Schema.ObjectId,
//       ref: 'User',
//       required: true
//     }
//   ],
//   messages: [
//     {
//       content: {
//         type: String
//       },
//       speaker: {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User'
//       },
//       createAt: {
//         type: Date,
//         default: Date.now
//       },
//       isRead: false
//     }
//   ]
// });

// module.exports = mongoose.model('Chat', chatSchema);

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chat = sequelize.define('Chat', {
  // 기본 Chat 속성은 없음 (id만 필요)
}, {
  tableName: 'chats'
});

module.exports = Chat;
