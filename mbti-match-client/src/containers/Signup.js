// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// // import { withRouter } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import SignupForm from '../components/Signup/SignupForm';
// import BackTab from '../components/BackTab/BackTab';
// import { changeRegisterForm, getGeolocation, registerMember } from '../actions';
// import { objectKeysToCamelCase } from '../utility/formattingData';
// import { postSignup } from '../api';

// const Signup = () => {
//   const [error, setError] = useState('');
//   const [file, setFile] = useState(null);
//   const register = useSelector(state => state.register);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const getPosition = () => {
//       return new Promise((resolve, reject) => {
//         navigator.geolocation.getCurrentPosition(resolve, reject);
//       });
//     };

//     getPosition()
//       .then(position => {
//         console.log(position.coords);
//         dispatch(
//           getGeolocation('register', {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//           })
//         );
//       })
//       .catch(error => {
//         setError('현재 위치를 받아올 수 없습니다.');
//       });
//   }, [dispatch]);

//   const onChange = ev => {
//     const { value, name } = ev.target;
//     dispatch(
//       changeRegisterForm({
//         name,
//         value
//       })
//     );
//   };

//   const onFileChange = ev => {
//     setFile(ev.target.files[0]);
//   };

//   const onSubmit = async ev => {
//     ev.preventDefault();
//     const passwordReg = new RegExp(
//       '^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{6,18}$'
//     );
//     const { email, password, passwordConfirm, name, mbti, gender } = register;

//     if ([email, password, passwordConfirm, name, mbti, gender].includes('')) {
//       setError('모두 입력하세요.');
//       return;
//     }

//     if (!passwordReg.test(password)) {
//       setError(
//         '비밀번호는 숫자와 영문 포함 6자 이상 18자 이하로 입력해주세요.'
//       );
//       return;
//     }

//     if (password !== passwordConfirm) {
//       setError('비밀번호가 일치하지 않습니다.');
//       dispatch(
//         changeRegisterForm({
//           key: 'password',
//           value: ''
//         })
//       );
//       dispatch(
//         changeRegisterForm({
//           key: 'passwordConfirm',
//           value: ''
//         })
//       );
//       return;
//     }

//     const formData = new FormData();
//     formData.append('file', file);
//     await postSignup(formData, register).then(result =>
//       dispatch(registerMember(objectKeysToCamelCase(result.data)))
//     );
//     // history.push('/profile');
//   };

//   return (
//     <>
//       <BackTab title={'Sign up'} />
//       <SignupForm
//         register={register}
//         onChange={onChange}
//         onFileChange={onFileChange}
//         onSubmit={onSubmit}
//         error={error}
//       />
//     </>
//   );
// };

// export default Signup;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import SignupForm from '../components/Signup/SignupForm';
import BackTab from '../components/BackTab/BackTab';
import { changeRegisterForm, getGeolocation, registerMember } from '../actions';
import { objectKeysToCamelCase } from '../utility/formattingData';
import { postSignup } from '../api';
import { Auth } from 'aws-amplify';

const Signup = () => {
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [isSignupComplete, setIsSignupComplete] = useState(false);
  const register = useSelector(state => state.register);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getPosition = () => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
    };

    getPosition()
      .then(position => {
        dispatch(
          getGeolocation('register', {
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
    dispatch(changeRegisterForm({ name, value }));
  };

  const onFileChange = ev => {
    const selectedFile = ev.target.files[0];
    dispatch(changeRegisterForm({ name: 'file', value: selectedFile }));
  };
  

  const onSubmit = async ev => {
    ev.preventDefault();
    const passwordReg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,18}$/;
    const { email, password, passwordConfirm, name, mbti, gender } = register;

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
      dispatch(changeRegisterForm({ key: 'password', value: '' }));
      dispatch(changeRegisterForm({ key: 'passwordConfirm', value: '' }));
      return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', register.email);
    formData.append('password', register.password);
    formData.append('name', register.name);
    formData.append('mbti', register.mbti);
    formData.append('gender', register.gender);

    try {
      const result = await postSignup(formData, register);

    console.log('[DEBUG] postSignup result.data:', result.data); // ✅ 확인용

    await dispatch(registerMember(objectKeysToCamelCase(result.data)));
  
      // ✅ 회원가입 성공 시 이메일 인증 페이지로 이동
    alert('회원가입 성공! 이메일로 전송된 인증 코드를 입력해주세요.');
    setIsSignupComplete(true);
  
    } catch (err) {
      console.error('회원가입 오류:', err);
      setError('회원가입 중 오류가 발생했습니다.');
    }
  }

  // ✅ 인증 코드 확인 핸들러
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
        isSignupComplete={isSignupComplete}   // ✅ 추가
        code={code}                           // ✅ 추가
        setCode={setCode}                     // ✅ 추가
        handleConfirmCode={handleConfirmCode} // ✅ 추가
        handleResendCode={async () => {       // ✅ 재전송 핸들러
          try {
            await Auth.resendSignUp(register.email);
            alert('📧 인증번호가 다시 전송되었습니다.');
          } catch (err) {
            console.error('재전송 실패:', err);
            setError('인증번호 재전송 중 오류 발생.');
          }
        }}
      />

    {isSignupComplete && (
        <div style={{ padding: '20px' }}>
          <h3>이메일로 받은 인증 코드를 입력하세요</h3>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="인증 코드 입력"
          />
          <button onClick={handleConfirmCode}>인증 완료</button>
        </div>
      )}
    </>
  );
};

export default Signup;
