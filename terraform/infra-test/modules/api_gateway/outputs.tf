output "invoke_url" {
  description = "API Gateway 기본 URL"
  value       = aws_apigatewayv2_api.http_api.api_endpoint
}