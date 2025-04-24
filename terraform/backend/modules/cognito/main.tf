resource "aws_cognito_user_pool" "this" {
  name = "datingapp-user-pool"

  auto_verified_attributes = ["email"]

  schema {
    name     = "email"
    required = true
    attribute_data_type = "String"
  }
}

resource "aws_cognito_user_pool_client" "this" {
  name         = "datingapp-client"
  user_pool_id = aws_cognito_user_pool.this.id

  generate_secret = false
  allowed_oauth_flows = ["code"]
  allowed_oauth_scopes = ["email", "openid", "profile"]
  allowed_oauth_flows_user_pool_client = true

  callback_urls = ["https://www.datingapp.store/callback"]
  logout_urls   = ["https://www.datingapp.store/logout"]

  supported_identity_providers = ["COGNITO", "Google"]

  access_token_validity  = 60     # 60분
  id_token_validity      = 60     # 60분
  refresh_token_validity = 30     # 30일

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
}

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.this.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    authorize_scopes = "email profile openid"
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
  }

  attribute_mapping = {
    email = "email"
    name  = "name"
  }
}

# ✅ 사용자 풀 도메인 연결
resource "aws_cognito_user_pool_domain" "this" {
  domain       = "datingapp"  # datingapp.auth.ap-northeast-2.amazoncognito.com
  user_pool_id = aws_cognito_user_pool.this.id
}
