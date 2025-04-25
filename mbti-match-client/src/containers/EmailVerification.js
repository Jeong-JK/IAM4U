import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from 'aws-amplify';

const EmailVerification = () => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state && location.state.email;


  if (!email) {
    navigate('/login');
    return null;
  }

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      const result = await Auth.confirmSignUp(email, code);
      console.log('✅ Cognito 인증 결과:', result);   // 디버깅용
      alert('✅ 이메일 인증이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      console.error('인증 실패:', err);
      if (err.code === 'NotAuthorizedException') {
        setError('이미 인증된 계정입니다.');
      } else if (err.code === 'CodeMismatchException') {
        setError('❌ 인증번호가 올바르지 않습니다.');
      } else if (err.code === 'ExpiredCodeException') {
        setError('❌ 인증번호가 만료되었습니다. 재전송 해주세요.');
      } else {
        setError('❌ 인증 중 알 수 없는 오류가 발생했습니다.');
      }
    }
  };
  

  const handleResend = async () => {
    try {
      await Auth.resendSignUp(email);
      alert('📧 인증번호가 다시 전송되었습니다.');
    } catch (err) {
      console.error('재전송 실패:', err);
      setError('인증번호 재전송 중 오류 발생.');
    }
  };

  return (
    <div>
      <h2>이메일 인증</h2>
      <p>{email} 으로 전송된 인증번호를 입력하세요.</p>
      <form onSubmit={handleConfirm}>
        <input
          type="text"
          placeholder="인증번호 입력"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit">인증 확인</button>
      </form>
      <button onClick={handleResend}>인증번호 재전송</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default EmailVerification;
