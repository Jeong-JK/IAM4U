variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the VPC"
}

variable "db_name" {
  type        = string
  description = "RDS DB name"
}

variable "db_user" {
  type        = string
  description = "RDS DB user"
}

variable "db_password" {
  type        = string
  sensitive   = true
  description = "RDS DB password"
}

variable "domain_name" {
  type        = string
  description = "Base domain name (e.g., datingapp.store)"
}

variable "public_subnet_cidrs" {
  type        = list(string)
  description = "List of public subnet CIDR blocks"
}

variable "google_client_id" {
  type = string
}

variable "google_client_secret" {
  type = string
}