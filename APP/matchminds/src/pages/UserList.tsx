// Like button triggers match API (stored in DB)
import React from 'react';

type User = {
  id: number;
  nickname: string;
  bio: string;
  interests: string;
  photoUrl: string;
};

const dummyUsers: User[] = [
  {
    id: 1,
    nickname: '햇살좋은날',
    bio: '영화와 산책을 좋아해요 🍿🌳',
    interests: '영화, 산책, 독서',
    photoUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 2,
    nickname: '운동하는사람',
    bio: '운동하면서 삶의 활력을 얻어요!',
    interests: '헬스, 러닝, 클라이밍',
    photoUrl: 'https://via.placeholder.com/150',
  },
  {
    id: 3,
    nickname: '감성러버',
    bio: '카페투어와 감성 사진 찍기 좋아요 ☕📸',
    interests: '카페, 사진, 인디음악',
    photoUrl: 'https://via.placeholder.com/150',
  },
];

const handleLike = async (likedId: string) => {
    const currentUserId = localStorage.getItem("userId"); // Cognito IDToken에서 추출했다고 가정
  
    try {
      const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/match`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요 시 Authorization 헤더 추가 (Cognito ID 토큰)
        },
        body: JSON.stringify({
          liker: currentUserId,
          liked: likedId,
        }),
      });
  
      if (res.ok) {
        alert('좋아요가 등록되었습니다!');
      } else {
        alert('오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };
export default function UserList() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">유저 목록</h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl mx-auto">
        {dummyUsers.map((user) => (
          <div key={user.id} className="bg-white shadow rounded-2xl p-4">
            <img src={user.photoUrl}
              alt={`${user.nickname}의 사진`}
              className="rounded-xl w-full h-48 object-cover mb-3"
            />
            <h3 className="text-xl font-semibold">{user.nickname}</h3>
            <p className="text-sm text-gray-600">{user.bio}</p>
            <div className="mt-2 text-sm text-gray-500">
              <strong>관심사:</strong> {user.interests}
            </div>
            <button onClick={() => handleLike(user.id.toString())} className="mt-4 w-full bg-pink-500 text-white py-1.5 rounded hover:bg-pink-600">
              좋아요 ❤️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

