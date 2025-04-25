resource "aws_db_subnet_group" "this" {
  name       = "datingapp-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name = "datingapp-db-subnet-group"
  }
}

resource "aws_rds_cluster" "this" {
  cluster_identifier         = "datingapp-cluster"
  engine                     = "aurora-mysql"
  engine_version             = "5.7.mysql_aurora.2.11.3" # 최신 버전 확인 가능
  engine_mode                = "provisioned"             # ✅ 수정
  database_name              = var.db_name
  master_username            = var.db_user
  master_password            = var.db_password
  backup_retention_period    = 1
  skip_final_snapshot        = true
  db_subnet_group_name       = aws_db_subnet_group.this.name
  vpc_security_group_ids     = var.sg_ids

  tags = {
    Name = "datingapp-aurora-cluster"
  }
}

resource "aws_rds_cluster_instance" "this" {
  identifier         = "datingapp-cluster-instance-1"
  cluster_identifier = aws_rds_cluster.this.id
  instance_class     = "db.t3.small" # ✅ 변경 가능 (요금/성능에 따라)
  engine             = aws_rds_cluster.this.engine
  engine_version     = aws_rds_cluster.this.engine_version
  publicly_accessible = true

  tags = {
    Name = "datingapp-cluster-instance-1"
  }
}
