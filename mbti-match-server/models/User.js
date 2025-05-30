// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const userSchema = new Schema(
//   {
//     email: {
//       type: String,
//       unique: true,
//       required: true
//     },
//     password: {
//       type: String,
//       select: false,
//       required: true
//     },
//     mbti: {
//       type: {
//         id: Number,
//         type: String
//       },
//       level0: [
//         {
//           type: String
//         }
//       ],
//       level1: [
//         {
//           type: String
//         }
//       ],
//       level2: [
//         {
//           type: String
//         }
//       ],
//       level3: [
//         {
//           type: String
//         }
//       ],
//       level4: [
//         {
//           type: String
//         }
//       ]
//     },
//     name: {
//       type: String,
//       required: true
//     },
//     location: {
//       latitude: {
//         type: Number,
//         default: 0
//       },
//       longitude: {
//         type: Number,
//         default: 0
//       }
//     },
//     profile_image: {
//       type: String
//     },
//     dob: {
//       type: Date
//     },
//     gender: {
//       type: String
//     },
//     description: {
//       type: String,
//       default: ''
//     },
//     mail_confirm: {
//       type: Boolean,
//       default: false
//     },
//     dislike_users: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User'
//       }
//     ],
//     like_me: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: 'User'
//       }
//     ],
//     chats: [
//       {
//         type: mongoose.Schema.ObjectId,
//         ref: 'Chat'
//       }
//     ]
//   },
//   {
//     timestamps: { createdAt: 'created_at' }
//   }
// );

// module.exports = mongoose.model('User', userSchema);

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mbti: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'users'
});

module.exports = User;
