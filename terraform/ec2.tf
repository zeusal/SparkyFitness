# Skip EC2 provisioning against MiniStack — it does not emulate EC2 well
# (networking, user-data, and instance profiles are no-ops in MiniStack).
# EC2 resources are only created when use_ministack = false.

data "aws_ami" "amazon_linux_2023" {
  count       = var.use_ministack ? 0 : 1
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

locals {
  user_data = <<-EOF
    #!/bin/bash
    set -euo pipefail

    # Install Docker
    dnf update -y
    dnf install -y docker git awscli
    systemctl enable --now docker
    usermod -aG docker ec2-user

    # Install Docker Compose plugin
    mkdir -p /usr/local/lib/docker/cli-plugins
    curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
      -o /usr/local/lib/docker/cli-plugins/docker-compose
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

    # Pull app secrets from Secrets Manager and write .env
    SECRET=$(aws secretsmanager get-secret-value \
      --region ${var.aws_region} \
      --secret-id ${aws_secretsmanager_secret.app.name} \
      --query SecretString --output text)

    mkdir -p /opt/sparkyfitness
    cd /opt/sparkyfitness

    # Write .env from secrets (jq parses the JSON secret into KEY=VALUE lines)
    dnf install -y jq
    echo "$SECRET" | jq -r 'to_entries[] | "\(.key)=\(.value)"' > .env

    # Append S3 and AWS config
    cat >> .env <<ENVEOF
    AWS_ENDPOINT_URL=
    AWS_DEFAULT_REGION=${var.aws_region}
    AWS_S3_UPLOADS_BUCKET=${aws_s3_bucket.uploads.bucket}
    AWS_S3_BACKUPS_BUCKET=${aws_s3_bucket.backups.bucket}
    DB_PATH=/opt/sparkyfitness/postgresql
    SERVER_BACKUP_PATH=/opt/sparkyfitness/backup
    SERVER_UPLOADS_PATH=/opt/sparkyfitness/uploads
    ENVEOF

    # Download compose file
    curl -fsSL \
      https://raw.githubusercontent.com/zeusal/SparkyFitness/main/docker/docker-compose.prod.yml \
      -o docker-compose.yml

    # Start the stack
    docker compose up -d
  EOF
}

resource "aws_instance" "sparkyfitness" {
  count = var.use_ministack ? 0 : 1

  ami                    = data.aws_ami.amazon_linux_2023[0].id
  instance_type          = var.ec2_instance_type
  key_name               = var.ec2_key_pair_name != "" ? var.ec2_key_pair_name : null
  vpc_security_group_ids = [aws_security_group.sparkyfitness.id]
  subnet_id              = tolist(data.aws_subnets.default.ids)[0]
  iam_instance_profile   = aws_iam_instance_profile.ec2.name

  user_data                   = base64encode(local.user_data)
  user_data_replace_on_change = true

  root_block_device {
    volume_type           = "gp3"
    volume_size           = var.ec2_volume_size_gb
    delete_on_termination = true
    encrypted             = true
  }

  tags = {
    Name = "${var.project}-${var.environment}"
  }
}

resource "aws_eip" "sparkyfitness" {
  count    = var.use_ministack ? 0 : 1
  instance = aws_instance.sparkyfitness[0].id
  domain   = "vpc"

  tags = {
    Name = "${var.project}-${var.environment}-eip"
  }
}
