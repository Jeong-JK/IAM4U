variable "lambda_role_arn" {
  description = "Lambda 실행 역할 ARN"
  type        = string
}

variable "sqs_queue_arn" {
  description = "SQS 큐 ARN"
  type        = string
}

variable "aurora_endpoint" {
  description = "Aurora 접속 엔드포인트"
  type        = string
}

variable "sns_topic_arn" {
  description = "SNS 알림 주제 ARN"
  type        = string
}

variable "handler" {
  description = "Lambda 핸들러"
  type        = string
  default     = "index.handler"
}

variable "runtime" {
  description = "Lambda 런타임"
  type        = string
  default     = "nodejs20.x"
}

variable "filename" {
  default = "lambda.zip"
}

variable "timeout" {
  description = "Lambda 실행 제한 시간"
  type        = number
  default     = 15
}

variable "batch_size" {
  description = "SQS 메시지 배치 크기"
  type        = number
  default     = 1
}

variable "sqs_url" {
  description = "SQS queue URL for sending match results"
  type        = string
}