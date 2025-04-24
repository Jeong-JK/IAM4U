output "lambda_role_arn" {
  description = "Lambda 실행에 사용할 IAM 역할 ARN"
  value       = aws_iam_role.lambda_exec_role.arn
}