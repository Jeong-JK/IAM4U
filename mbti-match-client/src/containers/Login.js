import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { withRouter } from 'react-router-dom';
import LoginForm from '../components/Login/LoginForm';
import Logo from '../components/Logo/Logo';
import {
  changeLoginForm,
  getGeolocation,
  successUserAuthentication
} from '../actions';
import { postLogin } from '../api';
import { objectKeysToCamelCase } from '../utility/formattingData';
import { Auth } from 'aws-amplify';
import awsconfig from '../aws-config';
import { Amplify } from 'aws-amplify';

Amplify.configure(awsconfig);

const API_URL = 'https://jxsbyfmks7.execute-api.ap-northeast-2.amazonaws.com/prod';

const Login = () => {
  const [error, setError] = useState('');
  const login = useSelector(state => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/profile'); // ✅ v6 방식
  };

  useEffect(() => {
    const getPosition = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      // <button onClick={handleLoginSuccess}>로그인</button>);
    };

    getPosition()
      .then(position => {
        console.log(position.coords);
        dispatch(
          getGeolocation('login', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        );
      })
      .catch(() => {
        setError('현재 위치를 받아올 수 없습니다.');
      });
  }, [dispatch]);

  const onChange = ev => {
    const { value, name } = ev.target;
    dispatch(
      changeLoginForm({
        name,
        value
      })
    );
  };

  const onSubmit = async ev => {
    ev.preventDefault();
    try {
      // ✅ Cognito 로그인
      const user = await Auth.signIn(login.email, login.password);
      const idToken = user.signInUserSession.idToken.jwtToken;
  
      // ✅ JWT 저장
      localStorage.setItem('jwt', idToken);
  
      // ✅ 백엔드에서 유저 정보 요청 (API Gateway + Lambda)
      const token = localStorage.getItem('jwt');
      if (!token) {
        setError('로그인 세션이 유효하지 않습니다. 다시 로그인 해주세요.');
        return;
      }
      
      const res = await fetch(`${API_URL}/auth/user`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
  
      if (res.ok) {
        const data = await res.json();
        console.log('✅ 유저 정보:', data);
      
        if (data && typeof data.user === 'object' && data.user !== null) {
          const safeUser = objectKeysToCamelCase(data.user);
          dispatch(successUserAuthentication(safeUser));
          navigate('/profile');
        } else {
          setError('유저 정보를 불러오지 못했습니다.');
        }
      } else {
        // 서버 에러일 때 안전하게 처리
        console.error(`❌ 서버 오류 [${res.status}]`);
        let errorMsg = '서버 오류가 발생했습니다.';
        try {
          const errorData = await res.json();
          errorMsg = errorData.message || errorMsg;
        } catch (parseErr) {
          console.error('에러 메시지 파싱 실패:', parseErr);
        }
        setError(errorMsg);
      }
    } catch (err) {
      console.error('API 호출 실패:', err);
      if (err.name === 'UserNotConfirmedException') {
        setError('이메일 인증이 필요합니다.');
      } else if (err.name === 'NotAuthorizedException') {
        setError('아이디 또는 비밀번호가 잘못되었습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    }};

  return (
    <>
      <Logo />
      <LoginForm
        onChange={onChange}
        onSubmit={onSubmit}
        error={error}
        login={login}
      />
    </>
  );
};

export default Login;
