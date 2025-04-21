variable "region" {
  default = "ap-northeast-2"
}

variable "s3_bucket" {
  description = "이미 존재하는 S3 버킷 이름"
  type        = string
}

variable "aurora_endpoint" {}
variable "db_user" {}
variable "db_password" {}
variable "db_name" {
  default = "matchKing"
}