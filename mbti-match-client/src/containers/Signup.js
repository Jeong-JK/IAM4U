import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SignupForm from '../components/Signup/SignupForm';
import BackTab from '../components/BackTab/BackTab';
import { changeRegisterForm, getGeolocation } from '../actions';
import axios from 'axios';
import { Auth, Amplify } from 'aws-amplify';
import awsconfig from '../aws-config';

Amplify.configure(awsconfig);

const ROOT = 'https://jxsbyfmks7.execute-api.ap-northeast-2.amazonaws.com/prod';

const Signup = () => {
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const register = useSelector(state => state.register);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      position => {
        dispatch(getGeolocation('register', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }));
      },
      () => setError('현재 위치를 받아올 수 없습니다.')
    );
  }, [dispatch]);

  const onChange = ev => {
    const { value, name } = ev.target;
    dispatch(changeRegisterForm({ name, value }));
  };

  const onFileChange = ev => {
    const selectedFile = ev.target.files[0];
    dispatch(changeRegisterForm({ name: 'file', value: selectedFile }));
  };

  const onSubmit = async ev => {
    ev.preventDefault();
    const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    const { email, password, passwordConfirm, name, mbti, gender, file } = register;

    if ([email, password, passwordConfirm, name, mbti, gender].includes('')) {
      setError('모두 입력하세요.');
      return;
    }

    if (!passwordReg.test(password)) {
      setError('비밀번호는 숫자와 영문 포함 6자 이상 18자 이하로 입력해주세요.');
      return;
    }

    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const presignedRes = await axios.post(`${ROOT}/api/upload`, {
        fileName: file.name,
        fileType: file.type
      }, { headers: { 'Content-Type': 'application/json' } });

      const { uploadURL, key } = presignedRes.data;
      await axios.put(uploadURL, file, { headers: { 'Content-Type': file.type } });

      await Auth.signUp({ username: email, password, attributes: { email } });

      await axios.post(`${ROOT}/api/signup`, { email, password, name, mbti, gender, profileImage: key });

      alert('가입 성공! 이메일 인증 코드를 입력하세요.');
      setIsSignupComplete(true);

    } catch (error) {
      console.error('회원가입 에러:', error);
      setError('회원가입 중 오류 발생!');
    }
  };

  const handleConfirmCode = async () => {
    try {
      await Auth.confirmSignUp(register.email, code);
      alert('✅ 이메일 인증이 완료되었습니다!');
      navigate('/login');
    } catch (err) {
      console.error('인증 실패:', err);
      setError('❌ 인증번호가 잘못되었거나 만료되었습니다.');
    }
  };

  return (
    <>
      <BackTab title={'Sign up'} />
      <SignupForm
        register={register}
        onChange={onChange}
        onFileChange={onFileChange}
        onSubmit={onSubmit}
        error={error}
        isSignupComplete={isSignupComplete}
        code={code}
        setCode={setCode}
        handleConfirmCode={handleConfirmCode}
        handleResendCode={async () => {
          try {
            await Auth.resendSignUp(register.email);
            alert('📧 인증번호가 다시 전송되었습니다.');
          } catch (err) {
            console.error('재전송 실패:', err);
            setError('인증번호 재전송 중 오류 발생.');
          }
        }}
      />
    </>
  );
};

export default Signup;