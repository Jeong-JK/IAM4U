// models/chatMessage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user'); // 유저 모델
const Chat = require('./chat'); // 챗 모델

const ChatMessage = sequelize.define('ChatMessage', {
  content: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'chat_messages'
});

// 관계 설정
ChatMessage.belongsTo(Chat);
ChatMessage.belongsTo(User, { as: 'speaker' });

module.exports = ChatMessage;
