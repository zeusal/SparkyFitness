# RDS PostgreSQL — only provisioned for real AWS.
# In MiniStack mode the database runs as a container in Docker Compose.

# Subnet group: use all default-VPC subnets (multi-AZ capable, no extra cost)
resource "aws_db_subnet_group" "main" {
  count      = var.use_ministack ? 0 : 1
  name       = "${var.project}-${var.environment}-db-subnet-group"
  subnet_ids = tolist(data.aws_subnets.default.ids)

  tags = {
    Name = "${var.project}-${var.environment}-db-subnet-group"
  }
}

# Dedicated security group for RDS — only the EC2 instance can reach it
resource "aws_security_group" "rds" {
  count       = var.use_ministack ? 0 : 1
  name        = "${var.project}-${var.environment}-rds-sg"
  description = "Allow PostgreSQL from EC2 only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "PostgreSQL from EC2"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.sparkyfitness.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project}-${var.environment}-rds-sg"
  }
}

resource "aws_db_instance" "postgres" {
  count = var.use_ministack ? 0 : 1

  identifier        = "${var.project}-${var.environment}-db"
  engine            = "postgres"
  engine_version    = "16"
  instance_class    = var.rds_instance_class
  allocated_storage = var.rds_storage_gb
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = var.db_name
  username = var.db_user
  password = var.db_password
  port     = 5432

  db_subnet_group_name   = aws_db_subnet_group.main[0].name
  vpc_security_group_ids = [aws_security_group.rds[0].id]

  # Single-AZ = cheapest; set to true for production resilience
  multi_az = var.rds_multi_az

  # Disable public access — EC2 connects over the private VPC
  publicly_accessible = false

  # Backups retained for 7 days (required for point-in-time recovery)
  backup_retention_period = var.rds_backup_retention_days
  backup_window           = "03:00-04:00"
  maintenance_window      = "Mon:04:00-Mon:05:00"

  # Prevent accidental deletion in production
  deletion_protection       = var.environment == "prod"
  skip_final_snapshot       = var.environment != "prod"
  final_snapshot_identifier = var.environment == "prod" ? "${var.project}-${var.environment}-final-snapshot" : null

  tags = {
    Name = "${var.project}-${var.environment}-db"
  }
}
