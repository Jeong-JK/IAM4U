terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
      configuration_aliases = [aws.us_east]
    }
  }
}

provider "aws" {
  region = "ap-northeast-2"
}

provider "aws" {
  alias  = "us_east"
  region = "us-east-1"
}

module "vpc" {
  source     = "../../modules/vpc"
  cidr_block = var.vpc_cidr
}

module "iam" {
  source = "../../modules/iam"
}

module "dynamodb" {
  source = "../../modules/dynamodb"
}

module "rds" {
  source      = "../../modules/rds"
  db_name     = var.db_name
  db_user     = var.db_user
  db_password = var.db_password
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.public_subnet_ids
  sg_ids      = [module.vpc.rds_sg_id]
}

module "route53" {
  source      = "../../modules/route53"
  domain_name = var.domain_name

  providers = {
    aws         = aws
    aws.us_east = aws.us_east
  }
}

module "cognito" {
  source = "../../modules/cognito"

  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
}