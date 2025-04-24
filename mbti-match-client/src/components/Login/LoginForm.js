import React from 'react';
import { Link } from 'react-router-dom';
import './login.scss';
import { Auth } from 'aws-amplify';
import awsconfig from '../../aws-config';
import { Amplify } from 'aws-amplify';

Amplify.configure(awsconfig);

const LoginForm = ({ onSubmit, onChange, login, error }) => {
  let renderErrors = '';
  if (Array.isArray(error)) {
    renderErrors = error.map(error => <p className="error">{error}</p>);
  } else {
    renderErrors = <p className="error">{error}</p>;
  }
  return (
    <div className="loginForm form">
      <div className="errors">{renderErrors}</div>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          name="email"
          placeholder="email"
          maxLength="80"
          value={login ? login.email : ''}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="password"
          value={login ? login.password : ''}
          onChange={onChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <Link to="/signup" className="button">
        Sign up
      </Link>
    </div>
  );
};

const handleLogin = async (login) => {
  try {
    const user = await Auth.signIn(login.email, login.password);
    const jwt = user.signInUserSession.idToken.jwtToken;
    localStorage.setItem('jwt', jwt);
    alert('로그인 성공!');
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};
export default LoginForm;
