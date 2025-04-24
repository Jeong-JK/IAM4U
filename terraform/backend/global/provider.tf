provider "aws" {
  region = "ap-northeast-2"
}

provider "aws" {
  alias  = "us_east"
  region = "us-east-1"
}
