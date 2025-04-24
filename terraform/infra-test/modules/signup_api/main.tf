provider "aws" {
  region = var.region
}

# resource "aws_s3_bucket" "user_images" {
#   bucket = var.s3_bucket

#   cors_rule {
#     allowed_headers = ["*"]
#     allowed_methods = ["PUT", "POST", "GET"]
#     allowed_origins = ["*"]
#   }
# }

resource "aws_iam_role" "lambda_role" {
  name = "lambda-signup-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      },
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic_execution" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_policy" "lambda_s3_policy" {
  name = "lambda-s3-policy"

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = ["s3:PutObject"],
        Resource = "arn:aws:s3:::${var.s3_bucket}/*"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_s3_attachment" {
  role       = aws_iam_role.lambda_role.name
  policy_arn = aws_iam_policy.lambda_s3_policy.arn
}

resource "aws_lambda_function" "signup" {
  filename         = data.archive_file.lambda_zip.output_path
  function_name    = "signup-handler"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  environment {
    variables = {
      S3_BUCKET       = var.s3_bucket
    #   AWS_REGION      = var.region
      AURORA_ENDPOINT = var.aurora_endpoint
      DB_USER         = var.db_user
      DB_PASSWORD     = var.db_password
      DB_NAME         = var.db_name
    }
  }
}

data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "./lambda"
  output_path = "./lambda.zip"
}

resource "aws_apigatewayv2_api" "signup_api" {
  name          = "signup-api"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.signup_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.signup.invoke_arn
  integration_method     = "POST"
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "signup_route" {
  api_id    = aws_apigatewayv2_api.signup_api.id
  route_key = "POST /signup"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.signup_api.id
  name        = "$default"
  auto_deploy = true
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.signup.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.signup_api.execution_arn}/*/*"
}