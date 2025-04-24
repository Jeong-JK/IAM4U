output "lambda_name" {
  value = aws_lambda_function.match_logic.function_name
}

output "lambda_arn" {
  value = aws_lambda_function.match_logic.arn
}