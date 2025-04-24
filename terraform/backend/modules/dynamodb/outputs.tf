resource "aws_dynamodb_table" "matches" {
  name         = "UserMatches"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "UserID"

  attribute {
    name = "UserID"
    type = "S"
  }

  tags = {
    Name = "datingapp-dynamodb"
  }
}