resource "aws_lambda_function" "match_logic" {
  function_name = "match-logic-handler"
  handler       = var.handler
  runtime       = var.runtime
  role          = var.lambda_role_arn
  filename      = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")
  timeout       = var.timeout

  environment {
    variables = {
      AURORA_ENDPOINT = var.aurora_endpoint
      SNS_TOPIC_ARN   = var.sns_topic_arn
    }
  }
}

resource "aws_lambda_event_source_mapping" "from_sqs" {
  event_source_arn = var.sqs_queue_arn
  function_name    = aws_lambda_function.match_logic.arn
  batch_size       = var.batch_size
  enabled          = true
}

locals {
  lambda_filename = "${path.module}/lambda.zip"
}