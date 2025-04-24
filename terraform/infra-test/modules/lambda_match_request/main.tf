resource "aws_lambda_function" "match_request" {
  function_name = "match-request-handler"
  handler       = var.handler
  runtime       = var.runtime
  role          = var.lambda_role_arn
  filename      = "${path.module}/lambda.zip"
  source_code_hash = filebase64sha256("${path.module}/lambda.zip")
  timeout       = var.timeout

  environment {
    variables = {
      SQS_URL = var.sqs_url
    }
  }
}

locals {
  lambda_filename = "${path.module}/lambda.zip"
}
