output "rds_cluster_id" {
  description = "ID of the Aurora RDS cluster"
  value       = aws_rds_cluster.this.id
}

output "endpoint" {
  description = "Writer endpoint of the RDS cluster"
  value       = aws_rds_cluster.this.endpoint
}

output "reader_endpoint" {
  description = "Reader endpoint of the RDS cluster"
  value       = aws_rds_cluster.this.reader_endpoint
}
