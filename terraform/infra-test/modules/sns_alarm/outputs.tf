output "topic_arn" {
  description = "SNS Topic ARN"
  value       = aws_sns_topic.match_notify.arn
}

output "queue_url" {
  value = aws_sqs_queue.match_queue.id
}