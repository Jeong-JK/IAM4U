

import React from 'react';
import './App.scss';
import { useSelector } from 'react-redux';
import {
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { CONFIRMED_NOT_AUTHENTICATED } from './contants/actionTypes';

import Login from './containers/Login';
import Signup from './containers/Signup';
import ListMembers from './containers/ListMembers';
import Profile from './containers/Profile';
import Edit from './containers/Edit';
import ChatList from './containers/ChatList';
import ChatView from './containers/ChatView';
import NotFound from './containers/NotFound';
import MainLoading from './containers/MainLoading';



// ✅ 로그인 여부 판단용 커스텀 라우터
const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" state={{ from: location }} />;
};

const NotLoggedInRoute = ({ children }) => {
  const isAuthenticated = useSelector(state => state.isAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/profile" />;
};

const App = () => {
  const dispatch = useDispatch();
  const { isMainLoading } = useSelector(state => ({
    isMainLoading: state.isMainLoading
  }));

  useEffect(() => {
    dispatch({ type: CONFIRMED_NOT_AUTHENTICATED });
  }, []);

  
  return (
    <div className="app">
      <div className="wrap">
        {isMainLoading ? (
          <MainLoading />
        ) : (
            <Routes>
              {/* 홈 리디렉션 */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* 로그인/회원가입 */}
              <Route path="/login" element={
                <NotLoggedInRoute><Login /></NotLoggedInRoute>
              } />
              <Route path="/signup" element={
                <NotLoggedInRoute><Signup /></NotLoggedInRoute>
              } />

              {/* 인증 필요 라우트 */}
              <Route path="/profile/edit" element={
                <PrivateRoute><Edit /></PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute><Profile /></PrivateRoute>
              } />
              <Route path="/users/list" element={
                <PrivateRoute><ListMembers /></PrivateRoute>
              } />
              <Route path="/chats" element={
                <PrivateRoute><ChatList /></PrivateRoute>
              } />
              <Route path="/chat/room/:roomId" element={
                <PrivateRoute><ChatView /></PrivateRoute>
              } />



              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
        )}
      </div>
    </div>
  );
};

export default App;
