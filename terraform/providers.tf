terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# When use_ministack = true, all AWS API calls are redirected to MiniStack.
# When use_ministack = false, standard AWS credentials and endpoints are used.
provider "aws" {
  region = var.aws_region

  # MiniStack / LocalStack credentials (ignored by real AWS when not overriding endpoints)
  access_key = var.use_ministack ? "test" : var.aws_access_key_id
  secret_key = var.use_ministack ? "test" : var.aws_secret_access_key

  # Redirect every service to the MiniStack endpoint when enabled
  dynamic "endpoints" {
    for_each = var.use_ministack ? [1] : []
    content {
      ec2            = var.ministack_endpoint
      s3             = var.ministack_endpoint
      ses            = var.ministack_endpoint
      iam            = var.ministack_endpoint
      sts            = var.ministack_endpoint
      ssm            = var.ministack_endpoint
      secretsmanager = var.ministack_endpoint
    }
  }

  # MiniStack does not validate credentials or regions
  skip_credentials_validation = var.use_ministack
  skip_metadata_api_check     = var.use_ministack
  skip_requesting_account_id  = var.use_ministack

  # Required for S3 path-style access in MiniStack
  s3_use_path_style = var.use_ministack

  default_tags {
    tags = {
      Project     = "sparkyfitness"
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
