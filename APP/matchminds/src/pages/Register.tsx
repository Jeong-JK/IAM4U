// Cognito register integration goes here
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    gender: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // 추후 Cognito 연동 예정
    console.log('회원가입 정보:', form);
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">회원가입</h2>

        <input name="email"
          type="email"
          placeholder="이메일"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input name="password"
          type="password"
          placeholder="비밀번호"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input name="confirmPassword"
          type="password"
          placeholder="비밀번호 확인"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input name="name"
          type="text"
          placeholder="이름"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
          required
        />
        <input name="age"
          type="number"
          placeholder="나이"
          className="w-full mb-3 p-2 border rounded"
          onChange={handleChange}
          required
        />
        <select name="gender"
          className="w-full mb-4 p-2 border rounded"
          onChange={handleChange}
          required
        >
          <option value="">성별 선택</option>
          <option value="male">남성</option>
          <option value="female">여성</option>
        </select>

        <button type="submit"
          className="w-full bg-pink-500 text-white p-2 rounded hover:bg-pink-600"
        >
          가입하기
        </button>
      </form>
    </div>
  );
}

