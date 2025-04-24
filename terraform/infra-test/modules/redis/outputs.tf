output "primary_endpoint" {
  description = "Redis 기본 엔드포인트"
  value       = aws_elasticache_cluster.redis.cache_nodes[0].address
}

output "security_group_id" {
  description = "Redis 접근용 보안 그룹 ID"
  value       = aws_security_group.redis.id
}