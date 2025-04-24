resource "aws_sqs_queue" "match_queue" {
  name                      = "match-request-queue"
  visibility_timeout_seconds = 30
  message_retention_seconds  = 86400
}

resource "aws_sqs_queue" "match_request" {
  name = "match-request-queue-dev"
}