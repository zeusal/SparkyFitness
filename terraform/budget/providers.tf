terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Credentials are taken from the environment, ~/.aws/credentials, or an IAM role.
# Never hard-code keys here. Run `aws configure` once before `terraform apply`.
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "terraform"
      Mode        = "budget"
    }
  }
}
