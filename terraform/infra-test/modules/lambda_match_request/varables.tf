variable "lambda_role_arn" {
  description = "Lambda 실행 역할 ARN"
  type        = string
}

variable "sqs_url" {
  description = "SQS 큐 URL"
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


variable "timeout" {
  description = "Lambda 실행 제한 시간"
  type        = number
  default     = 10
}

variable "filename" {
  default = "lambda.zip"
}