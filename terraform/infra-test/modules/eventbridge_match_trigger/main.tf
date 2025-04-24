resource "aws_cloudwatch_event_bus" "match_event_bus" {
  name = var.event_bus_name
}

resource "aws_cloudwatch_event_rule" "match_event_rule" {
  name        = var.rule_name
  description = "매칭 요청 이벤트를 트리거합니다."
  event_bus_name = aws_cloudwatch_event_bus.match_event_bus.name
  event_pattern = jsonencode({
    source = ["match.request"]
    detail-type = ["MatchRequest"]
  })
}

resource "aws_cloudwatch_event_target" "lambda_target" {
  rule      = aws_cloudwatch_event_rule.match_event_rule.name
  arn       = var.lambda_arn
  event_bus_name = aws_cloudwatch_event_bus.match_event_bus.name
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.match_event_rule.arn
}