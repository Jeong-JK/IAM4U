terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  required_version = ">= 1.3.0"
}

provider "aws" {
  region = "ap-northeast-2" # 서울 리전
}

provider "aws" {
  alias  = "us_east"
  region = "us-east-1" # 버지니아 리전 (ACM 인증서 발급용)
}

