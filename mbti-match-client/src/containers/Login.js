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
      },
      <button onClick={handleLoginSuccess}>로그인</button>);
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
      .catch(error => {
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
      const jwt = user.signInUserSession.idToken.jwtToken;
  
      // ✅ JWT 저장
      localStorage.setItem('jwt', jwt);
  
      // ✅ 백엔드에서 유저 정보 요청 (API Gateway + Lambda)
      const res = await fetch('https://wfqynf004c.execute-api.ap-northeast-2.amazonaws.com/prod/auth/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
  
      const data = await res.json();
      console.log('✅ 유저 정보:', data);
  
      // ✅ Redux 저장
      dispatch(successUserAuthentication(objectKeysToCamelCase(data.user)));
  
      // ✅ 이동
      navigate('/profile');
  
    } catch (err) {
      console.error('로그인 실패:', err);
      setError('로그인에 실패했습니다.');
    }
  };

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
