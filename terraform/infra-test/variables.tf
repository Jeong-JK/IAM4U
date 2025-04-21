variable "aws_region" {
  description = "AWS 리전"
  default     = "ap-northeast-2"
}

variable "vpc_id" {
  description = "공통 VPC ID (팀원 Output)"
  type        = string
}

variable "subnet_ids" {
  description = "공통 Subnet 목록 (팀원 Output)"
  type        = list(string)
}

variable "aurora_endpoint" {
  description = "Aurora 엔드포인트 (팀원 Output)"
  type        = string
}

variable "s3_bucket" {
  default = "motherfucker-yongmin"
}

variable "db_user" {
  default = "match"
}
variable "db_password" {
  default = "Qwer!234"
}
variable "db_name" {
  default = "matchdb"
}