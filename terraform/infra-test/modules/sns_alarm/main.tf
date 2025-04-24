resource "aws_sns_topic" "match_notify" {
  name = "match-success-topic"
}

# (선택) 이메일 구독자 추가 예시
# resource "aws_sns_topic_subscription" "email" {
#   topic_arn = aws_sns_topic.match_notify.arn
#   protocol  = "email"
#   endpoint  = "your-email@example.com"
# }

resource "aws_sqs_queue" "match_queue" {
  name = "match-queue"
}