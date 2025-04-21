output "api_gateway_url" {
  value = module.api_gateway.invoke_url
}

output "match_request_lambda" {
  value = module.lambda_match_request.lambda_name
}

output "match_logic_lambda" {
  value = module.lambda_match_logic.lambda_name
}

output "sqs_url" {
  value = module.sqs_queue.queue_url
}

output "redis_endpoint" {
  value = module.redis.primary_endpoint
}
