// S3 image upload and profile submission
import React, { useState } from 'react';

export default function Profile() {
  const [profile, setProfile] = useState({
    nickname: '',
    bio: '',
    interests: '',
    photo: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfile(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // S3 업로드 or 백엔드 연동은 추후 처리
    console.log('프로필 데이터:', profile);
    alert('프로필이 저장되었습니다.');
  };

  const handleUploadToS3 = async (file: File) => {
    // 1. 백엔드에서 presigned URL 요청
    const res = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ filename: file.name, filetype: file.type }),
    });
  
    const { uploadUrl, fileUrl } = await res.json();
  
    // 2. 해당 URL에 실제 파일 업로드
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
  
    return fileUrl; // 저장된 이미지 주소
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form on Submit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-5 text-center">내 프로필 작성</h2>

        <label className="block mb-2 font-medium">닉네임</label>
        <input type="text"
          name="nickname"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          placeholder="예: 하늘을나는토끼"
          required
        />

        <label className="block mb-2 font-medium">자기소개</label>
        <text areaname="bio"
          rows={3}
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          placeholder="자신을 소개해보세요"
        />

        <label className="block mb-2 font-medium">관심사</label>
        <input type="text"
          name="interests"
          onChange={handleChange}
          className="w-full p-2 mb-4 border rounded"
          placeholder="예: 음악, 영화, 운동"
        />

        <label className="block mb-2 font-medium">프로필 사진</label>
        <input type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full mb-5"
        />

        <button type="submit"
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          저장하기
        </button>
      </form>
    </div>
  );
}
