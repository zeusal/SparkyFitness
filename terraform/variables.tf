# ── Switch ────────────────────────────────────────────────────────────────────

variable "use_ministack" {
  description = "Set to true to target MiniStack (local AWS emulator). Set to false for real AWS."
  type        = bool
  default     = true
}

variable "ministack_endpoint" {
  description = "MiniStack API endpoint. Only used when use_ministack = true."
  type        = string
  default     = "http://localhost:4566"
}

# ── AWS Credentials (real AWS only) ──────────────────────────────────────────

variable "aws_access_key_id" {
  description = "AWS access key ID. Leave empty when using IAM roles or profiles."
  type        = string
  default     = ""
  sensitive   = true
}

variable "aws_secret_access_key" {
  description = "AWS secret access key. Leave empty when using IAM roles or profiles."
  type        = string
  default     = ""
  sensitive   = true
}

variable "aws_region" {
  description = "AWS region."
  type        = string
  default     = "us-east-1"
}

# ── General ───────────────────────────────────────────────────────────────────

variable "environment" {
  description = "Deployment environment label (e.g. dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "project" {
  description = "Project name prefix used in resource names."
  type        = string
  default     = "sparkyfitness"
}

# ── EC2 ───────────────────────────────────────────────────────────────────────

variable "ec2_instance_type" {
  description = "EC2 instance type. t2.micro is free-tier eligible; t3a.micro is the cheapest non-free option."
  type        = string
  default     = "t2.micro"
}

variable "ec2_key_pair_name" {
  description = "Name of an existing EC2 key pair for SSH access. Leave empty to skip key pair association."
  type        = string
  default     = ""
}

variable "ec2_volume_size_gb" {
  description = "Root EBS volume size in GB."
  type        = number
  default     = 20
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH into the EC2 instance. Restrict to your IP for security (e.g. \"1.2.3.4/32\")."
  type        = string
}

variable "allowed_admin_cidr" {
  description = "CIDR block allowed to reach the backend API port (3010) and MiniStack port (4566). Restrict to your IP for security (e.g. \"1.2.3.4/32\")."
  type        = string
}

# ── S3 ────────────────────────────────────────────────────────────────────────

variable "s3_uploads_bucket" {
  description = "Name for the S3 bucket used for user uploads (profile pictures, exercise images)."
  type        = string
  default     = "sparkyfitness-uploads"
}

variable "s3_backups_bucket" {
  description = "Name for the S3 bucket used for database backups."
  type        = string
  default     = "sparkyfitness-backups"
}

# ── RDS ───────────────────────────────────────────────────────────────────────

variable "rds_instance_class" {
  description = "RDS instance type. db.t3.micro is the cheapest (~$13/mo Single-AZ). Only used when use_ministack = false."
  type        = string
  default     = "db.t3.micro"
}

variable "rds_storage_gb" {
  description = "Allocated storage for the RDS instance in GB."
  type        = number
  default     = 20
}

variable "rds_multi_az" {
  description = "Enable Multi-AZ for RDS (higher availability, doubles cost). Recommended for prod only."
  type        = bool
  default     = false
}

variable "rds_backup_retention_days" {
  description = "Number of days to retain automated RDS backups (0 disables backups)."
  type        = number
  default     = 7
}

# ── SES ───────────────────────────────────────────────────────────────────────

variable "ses_email_identity" {
  description = "Email address or domain to verify in SES for sending transactional emails."
  type        = string
  default     = "no-reply@example.com"
}

# ── App secrets ───────────────────────────────────────────────────────────────

variable "db_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "sparkyfitness_db"
}

variable "db_user" {
  description = "PostgreSQL superuser name."
  type        = string
  default     = "sparky"
}

variable "db_password" {
  description = "PostgreSQL superuser password."
  type        = string
  sensitive   = true
}

variable "db_app_user" {
  description = "PostgreSQL application user name."
  type        = string
  default     = "sparkyapp"
}

variable "db_app_password" {
  description = "PostgreSQL application user password."
  type        = string
  sensitive   = true
}

variable "api_encryption_key" {
  description = "64-character hex encryption key for the server. Generate with: openssl rand -hex 32"
  type        = string
  sensitive   = true
}

variable "better_auth_secret" {
  description = "Secret for BetterAuth session signing."
  type        = string
  sensitive   = true
}

variable "frontend_url" {
  description = "Public URL of the frontend (used for CORS). Set to the EC2 public IP/domain after provisioning (e.g. \"http://<EC2_IP>:8080\")."
  type        = string
  default     = "http://localhost:8080"
}
