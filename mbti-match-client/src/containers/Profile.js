import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Tab from '../components/Tab/TabList';
import View from '../components/Profile/View';
import { getLogout } from '../api';
import { logoutUser } from '../actions';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => ({
    user: state.user
  }));
  // console.log(user?.type);

  const onLogoutClick = async () => {
    getLogout().then(response => {
      dispatch(logoutUser());
    });
  };

  const callProtectedAPI = async () => {
    const token = localStorage.getItem('jwt');
    if (!token) return alert('로그인이 필요합니다.');
  
    try {
      const res = await fetch('https://jxsbyfmks7.execute-api.ap-northeast-2.amazonaws.com/prod/auth/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log('응답:', data);
    } catch (err) {
      console.error('API 호출 오류:', err);
    }
  };
  
  return (
    <>
      <Tab />
      <div className="content">
        <View user={user} />
        <Link to="/profile/edit" className="link-button">
          수정하기
        </Link>
        <button href="#none" onClick={onLogoutClick} className="link-button">
          로그아웃
        </button>
        <button onClick={callProtectedAPI}>내 정보 불러오기</button>
      </div>
    </>
  );
};

export default Profile;
