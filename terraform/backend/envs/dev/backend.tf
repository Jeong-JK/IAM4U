terraform {
  backend "s3" {
    bucket         = "iam4u-tf-state"        # 🔁 실제 생성한 S3 버킷 이름
    key            = "dev/terraform.tfstate"     # 상태 파일 경로 (버킷 안)
    region         = "ap-northeast-2"            # 서울 리전
    dynamodb_table = "iam4u-tf-lock"           # 상태 잠금용 DynamoDB 테이블
    encrypt        = true                        # 상태 파일 암호화
  }
}


