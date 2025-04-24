import React, { useEffect } from 'react';
import axios from 'axios';
import './SignupForm.scss';
import { Auth } from 'aws-amplify';

const ROOT = 'https://jxsbyfmks7.execute-api.ap-northeast-2.amazonaws.com/prod';


const SignupForm = ({ onSubmit, onChange, register, error, onFileChange }) => {
  let form = null;

  useEffect(() => {
    const scrollToTop = () => {
      form.scrollIntoView({ block: 'start' });
    };

    scrollToTop();
  }, [error, form]);
  return (
    <div className="signupForm form">
      <form onSubmit={(e) => {
        e.preventDefault();
        handleSignUp(register, register.file);  // 선택된 파일 넘기기
      }} ref={le => (form = le)}>
        <p className="error">{error}</p>
        <label htmlFor="mbit" required>
          MBTI
        </label>
        <select
          name="mbti"
          id="mbti"
          required
          value={register.mbti}
          onChange={onChange}
        >
          <option value="">mbti를 선택해 주세요.</option>
          <option value="intj">INTJ 용의주도한 전략가</option>
          <option value="intp">INTP 논리적인 사색가</option>
          <option value="entj">ENTJ 대담한 통솔자</option>
          <option value="entp">ENTP 뜨거운 논쟁을 즐기는 변론가</option>
          <option value="infj">INFJ 선의의 옹호자</option>
          <option value="infp">INFP 열정적인 중재자</option>
          <option value="enfj">ENFJ 정의로운 사회운동가</option>
          <option value="enfp">ENFP 재기발랄한 활동가</option>
          <option value="istj">ISTJ 청렴결백한 논리주의자</option>
          <option value="isfj">ISFJ 용감한 수호자</option>
          <option value="estj">ESTJ 엄격한 관리자</option>
          <option value="esfj">ESFJ 사교적인 외교관</option>
          <option value="istp">ISTP 만능 재주꾼</option>
          <option value="isfp">ISFP 호기심 많은 예술가</option>
          <option value="estp">ESTP 모험을 즐기는 사업가</option>
          <option value="esfp">ESFP 자유로운 영혼의 연예인</option>
        </select>
        <p>
          mbti를 모르신다면
          <a href="https://www.16personalities.com/ko/%EB%AC%B4%EB%A3%8C-%EC%84%B1%EA%B2%A9-%EC%9C%A0%ED%98%95-%EA%B2%80%EC%82%AC">
            mbti 사이트
          </a>
          에서 검사를 부탁드립니다.
        </p>
        <label htmlFor="email">email</label>
        <input
          type="email"
          name="email"
          required
          value={register.email}
          onChange={onChange}
          maxLength="100"
        />
        <label htmlFor="password">password</label>
        <input
          type="password"
          name="password"
          required
          value={register.password || ''}
          onChange={onChange}
          maxLength="18"
          minLength="6"
        />
        <label htmlFor="passwordConfirm">password confirm</label>
        <input
          type="password"
          name="passwordConfirm"
          required
          value={register.passwordConfirm || ''}
          onChange={onChange}
          maxLength="18"
          minLength="6"
        />
        <label htmlFor="name">name</label>
        <input
          type="text"
          name="name"
          required
          value={register.name || ''}
          onChange={onChange}
          maxLength="13"
        />
        <p className="title">성별</p>
        <div className="gender-area">
          <input
            type="radio"
            name="gender"
            value="female"
            id="female"
            checked={register.gender === 'female'}
            onChange={onChange}
            required
          />
          <label htmlFor="female">여성</label>
          <input
            type="radio"
            name="gender"
            value="male"
            id="male"
            checked={register.gender === 'male'}
            onChange={onChange}
          />
          <label htmlFor="male">남성</label>
        </div>
        <label htmlFor="file">프로필 사진</label>
        <input
          type="file"
          name="file"
          id="file"
          onChange={onFileChange}
          accept="image/x-png,image/gif,image/jpeg"
          required
        />
        <label htmlFor="description">자기소개</label>
        <textarea
          type="text"
          name="description"
          maxLength="60"
          value={register.description}
          onChange={onChange}
        />
        <button>Sign up</button>
      </form>
    </div>
  );
};

const handleSignUp = async (register, file) => {
  try {
    // 1️⃣ Presigned URL 요청
    const presignedRes = await axios.put(`${ROOT}/api/upload`, {
      fileName: file.name,
      fileType: file.type
    });
    const { uploadURL, key } = presignedRes.data;

    // 2️⃣ S3로 파일 업로드
    await axios.put(uploadURL, file, {
      headers: { 'Content-Type': file.type }
    });

    console.log('✅ 파일 업로드 성공:', key);

    // 3️⃣ Cognito 회원가입
    const { email, password } = register;
    await Auth.signUp({
      username: email,
      password,
      attributes: { email },
    });

    // 4️⃣ 추가 서버 회원가입 API 호출 (있다면)
    await axios.post(`${ROOT}/api/signup`, {
      ...register,
      profileImage: key
    });

    alert('가입 성공!');
  } catch (error) {
    console.error('회원가입 에러:', error);
 
    if (error.response) {
       console.error('서버 응답 에러:', error.response.data);
    } else if (error.message) {
       console.error('에러 메시지:', error.message);
    }
 
    alert('가입 실패!');
 }
 
};
export default SignupForm;
