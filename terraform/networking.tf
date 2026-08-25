# Use the default VPC to stay free — no NAT gateway costs
data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "sparkyfitness" {
  name        = "${var.project}-${var.environment}-sg"
  description = "SparkyFitness application security group"
  vpc_id      = data.aws_vpc.default.id

  # SSH
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  # Frontend (Nginx)
  ingress {
    description = "Frontend HTTP"
    from_port   = 3004
    to_port     = 3004
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Backend API (admin / trusted access only)
  ingress {
    description = "Backend API"
    from_port   = 3010
    to_port     = 3010
    protocol    = "tcp"
    cidr_blocks = [var.allowed_admin_cidr]
  }

  # MiniStack (admin / testing only)
  ingress {
    description = "MiniStack AWS emulator"
    from_port   = 4566
    to_port     = 4566
    protocol    = "tcp"
    cidr_blocks = [var.allowed_admin_cidr]
  }

  egress {
    description = "Allow all outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project}-${var.environment}-sg"
  }
}
