variable "event_bus_name" {
  description = "이벤트 브릿지 버스 이름"
  type        = string
}

variable "rule_name" {
  description = "이벤트 룰 이름"
  type        = string
}

variable "lambda_arn" {
  description = "타겟 Lambda 함수의 ARN"
  type        = string
}

variable "lambda_name" {
  description = "타겟 Lambda 함수의 이름"
  type        = string
}