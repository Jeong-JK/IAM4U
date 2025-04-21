output "lambda_arn" {
  description = "Lambda ARN"
  value       = aws_lambda_function.match_request.arn
}

output "lambda_name" {
  description = "Lambda 이름"
  value       = aws_lambda_function.match_request.function_name
}
