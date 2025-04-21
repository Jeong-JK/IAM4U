output "queue_url" {
  description = "SQS 큐 URL"
  value       = aws_sqs_queue.match_queue.id
}

output "queue_arn" {
  description = "SQS 큐 ARN"
  value       = aws_sqs_queue.match_queue.arn
}

output "sqs_url" {
  value = aws_sqs_queue.match_request.id
}