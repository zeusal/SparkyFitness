# ── MiniStack (local AWS emulation) ──────────────────────────────────────────
# Use this file to test against MiniStack running on your machine or EC2.
#
#   terraform init
#   terraform apply -var-file=environments/ministack.tfvars

use_ministack      = true
ministack_endpoint = "http://localhost:4566"

aws_region  = "us-east-1"
environment = "dev"

# Restrict SSH and admin access to localhost only when testing with MiniStack
allowed_ssh_cidr   = "127.0.0.1/32"
allowed_admin_cidr = "127.0.0.1/32"

# Placeholder secrets — safe to commit, only used locally
db_name            = "sparkyfitness_db"
db_user            = "sparky"
db_password        = "changeme_dev"
db_app_user        = "sparkyapp"
db_app_password    = "changeme_dev"
api_encryption_key = "0000000000000000000000000000000000000000000000000000000000000000"
better_auth_secret = "dev-better-auth-secret-change-in-prod"
frontend_url       = "http://localhost:8080"
ses_email_identity = "no-reply@example.com"
