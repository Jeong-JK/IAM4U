🧠 MatchMinds - 팀 프로젝트 소개

📌 프로젝트 개요
MatchMinds는 사용자의 성향(MBTI), 위치 정보, 관심사를 기반으로 최적의 상대를 매칭해주는 소개팅 플랫폼입니다.
AWS 인프라를 적극 활용하여 높은 확장성, 실시간 매칭, 보안성 강화, 자동화된 CI/CD 배포, 모니터링 체계를 구축했습니다.

✨ 주요 흐름 요약

◎ 사용자 접근

1. 사용자는 Route53 도메인을 통해 S3 + CloudFront에 배포된 React SPA에 접근합니다.
2. WAF를 통해 기본적인 웹 공격을 방어하며, Security Group으로 네트워크를 제한합니다.

◎ 회원가입 및 로그인

1. Cognito를 통해 회원가입 및 인증을 진행합니다.
2. 회원가입 시, 입력한 임시 데이터는 DynamoDB에 저장되고, 인증 완료 후 RDS로 최종 이관됩니다.

◎ API 서비스

1. 사용자의 모든 API 요청은 API Gateway를 통해 Lambda로 전달되어 처리됩니다.
2. Lambda는 RDS(MySQL) 또는 DynamoDB와 통신하여 데이터 처리를 수행합니다.

◎ 실시간 매칭 채팅

1. SignalR 기반 WebSocket 서버를 통해 사용자 간 실시간 매칭 및 채팅이 이루어집니다.
2. 빠른 매칭 속도를 위해 Redis를 세션 및 캐시 서버로 활용합니다.

◎ 백엔드 확장성 확보

1. 매칭 로직과 실시간 서버는 Docker 컨테이너로 관리되며, **EKS (Elastic Kubernetes Service)**에 배포됩니다.
2. VPC Peering을 통해 AuroraDB, Redis와 안전하게 통신합니다.

◎ CI/CD 자동화

1. 개발자는 GitHub에 코드를 Push하면 GitHub Action이 자동 빌드를 수행합니다.
2. ArgoCD를 통해 EKS에 자동 배포되며, Slack 알림을 통해 배포 상태를 모니터링합니다.

◎ 모니터링 및 알림

1. 서비스 모니터링은 CloudWatch + Lambda로 로그를 수집하고 S3에 저장합니다.
2. 저장된 로그는 Athena로 분석 후, Grafana를 통해 대시보드로 시각화합니다.
3. 장애 발생 시 Slack을 통해 실시간 알림을 받습니다.

📚 사용 기술 스택
프론트엔드 - React, JavaScript, AWS S3, AWS CloudFront, AWS WAF
백엔드 - AWS Lambda, API Gateway, Cognito, RDS(MySQL), DynamoDB, SignalR, Redis
인프라 - AWS EKS, Docker, AuroraDB, VPC Peering
CI/CD - GitHub Action, ArgoCD, Slack 알림
모니터링 - CloudWatch, Athena, Grafana, Slack
기타 - Route53(도메인 관리), SNS(이메일 인증용)

🎯 기대 효과
확장성: EKS와 VPC Peering 구조로 대규모 트래픽 대응
보안 강화: WAF, Cognito, Security Group 적용
실시간성 확보: SignalR 기반 실시간 매칭/채팅 구현
운영 자동화: GitHub Actions + ArgoCD를 통한 무중단 배포
효율적인 모니터링: Grafana + Slack 연동 실시간 알림 체계 구축

👥 팀원 역할 분담
오세빈	- 프론트엔드 개발 (React SPA, S3 + CloudFront 배포)
정재근	- 백엔드 서버 개발 (Lambda, RDS, DynamoDB, API Gateway)
이용민	- 인프라 설계 및 구축 (EKS, VPC Peering, WAF 설정)
조건호	- CI/CD 구축 (GitHub Action, ArgoCD, Slack 연동)
김종명	- 모니터링 구축 (CloudWatch, Athena, Grafana)
