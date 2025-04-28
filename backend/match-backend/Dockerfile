# 베이스 이미지는 Node.js LTS 버전 사용
FROM node:18

# 앱 디렉터리 생성
WORKDIR /usr/src/app

# package.json 복사 (지금은 텅 비어있지만 기본 흐름 맞춰야해)
COPY package.json ./

# 의존성 설치
RUN npm install

# 앱 소스 복사
COPY . .

# 80포트 사용 (우리는 k8s쪽에서도 80으로 통일했지)
EXPOSE 80

# 서버 실행
CMD ["node", "app.js"]
