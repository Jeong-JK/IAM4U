provider "aws" {
  region = var.aws_region
}

# IAM (공통 역할)
module "iam" {
  source = "./modules/iam"
}


# Lambda (매칭 요청 처리)
module "lambda_match_request" {
  source          = "./modules/lambda_match_request"
  lambda_role_arn = module.iam.lambda_role_arn
  sqs_url         = module.sqs_queue.sqs_url
}


# SQS (매칭 대기열 큐)
module "sqs_queue" {
  source = "./modules/sqs_queue"
}


# module "lambda_match_logic" {
#   source = "./modules/lambda_match_logic"
#   sqs_url = module.sqs_queue.sqs_url
# }

# # Lambda (매칭 로직 실행)
# module "lambda_match_logic" {
#   source           = "./modules/lambda_match_logic"
#   lambda_role_arn  = module.iam.lambda_role_arn
#   sqs_queue_arn    = module.sqs_queue.queue_arn
#   aurora_endpoint  = var.aurora_endpoint
#   sns_topic_arn    = module.sns_alarm.topic_arn
# }

module "lambda_match_logic" {
  source           = "./modules/lambda_match_logic"
  lambda_role_arn  = module.iam.lambda_role_arn
  sqs_queue_arn    = module.sqs_queue.queue_arn
  sqs_url          = module.sqs_queue.sqs_url     
  aurora_endpoint  = var.aurora_endpoint
  sns_topic_arn    = module.sns_alarm.topic_arn
}

# SNS
module "sns_alarm" {
  source      = "./modules/sns_alarm"
  topic_name  = "match-alarm-topic"
}


# API Gateway → Lambda 연결
module "api_gateway" {
  source       = "./modules/api_gateway"
  lambda_arn   = module.lambda_match_request.lambda_arn
  lambda_name  = module.lambda_match_request.lambda_name
}

# Redis (대기열 처리)
module "redis" {
  source     = "./modules/redis"
  vpc_id     = var.vpc_id
  subnet_ids = var.subnet_ids
}

module "signup_api" {
  source           = "./modules/signup_api"
  region           = var.aws_region
  s3_bucket        = var.s3_bucket
  aurora_endpoint  = var.aurora_endpoint
  db_user          = var.db_user
  db_password      = var.db_password
  db_name          = var.db_name
}