// Cognito login integration goes here
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 Cognito 연결은 추후
    navigate('/profile');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">로그인</h2>
        <input type="email" placeholder="이메일" className="w-full mb-3 p-2 border rounded" required />
        <input type="password" placeholder="비밀번호" className="w-full mb-3 p-2 border rounded" required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">로그인</button>
      </form>
    </div>
  );
}