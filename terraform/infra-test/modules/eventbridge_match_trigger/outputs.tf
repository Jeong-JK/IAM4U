output "event_bus_name" {
  description = "생성된 EventBridge 버스 이름"
  value       = aws_cloudwatch_event_bus.match_event_bus.name
}

output "event_rule_arn" {
  description = "이벤트 룰 ARN"
  value       = aws_cloudwatch_event_rule.match_event_rule.arn
}