output "vpc_id" {
  value = aws_vpc.this.id
}

output "public_subnet_ids" {
  value = [
    aws_subnet.public_2a.id,
    aws_subnet.public_2c.id
  ]
}

output "rds_sg_id" {
  value = aws_security_group.rds_sg.id
}
