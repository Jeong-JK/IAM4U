// React Router setup
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import UserList from './pages/UserList';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/users" element={<UserList />} />
      <Route path="*" element={<Login />} /> {/* 기본 리디렉션 */}
    </Routes>
  );
}
