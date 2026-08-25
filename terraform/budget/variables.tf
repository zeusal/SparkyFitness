# ── General ───────────────────────────────────────────────────────────────────

variable "aws_region" {
  description = "AWS region. Lightsail's closest region to Madrid is Paris (eu-west-3). Ireland is eu-west-1."
  type        = string
  default     = "eu-west-1"
}

variable "project" {
  description = "Project name prefix used in resource names."
  type        = string
  default     = "sparkyfitness"
}

variable "environment" {
  description = "Deployment environment label."
  type        = string
  default     = "prod"
}

# ── Lightsail instance ────────────────────────────────────────────────────────

variable "bundle_id" {
  description = "Lightsail plan. small_2_0 = 2 GB/2 vCPU (~12 USD/mo). micro_2_0 = 1 GB (~7 USD). medium_2_0 = 4 GB (~24 USD)."
  type        = string
  default     = "small_2_0"
}

variable "blueprint_id" {
  description = "Lightsail OS image. amazon_linux_2023 is minimal and Docker-ready."
  type        = string
  default     = "amazon_linux_2023"
}

# ── Application images (GitHub Container Registry) ────────────────────────────

variable "ghcr_namespace" {
  description = "GitHub owner/namespace where your images live, e.g. images become ghcr.io/<namespace>/sparkyfitness-{server,frontend}."
  type        = string
  default     = "zeusal"
}

variable "image_tag" {
  description = "Tag to deploy. Use 'latest' so Watchtower auto-updates when CI pushes a new build; or pin a release tag for reproducibility."
  type        = string
  default     = "latest"
}

variable "ghcr_username" {
  description = "GitHub username for pulling PRIVATE ghcr images. Leave empty if your packages are public (defaults to ghcr_namespace when a token is set)."
  type        = string
  default     = ""
}

variable "ghcr_token" {
  description = "GitHub Personal Access Token with read:packages, ONLY needed if your ghcr packages are private. Leave empty for public packages."
  type        = string
  sensitive   = true
  default     = ""
}

# ── Access / firewall ─────────────────────────────────────────────────────────

variable "domain" {
  description = <<-EOT
    Public domain (or free DuckDNS subdomain) that will point to the instance, e.g. "fitness.midominio.com".
    When set, Caddy issues a free Let's Encrypt certificate and the app is served over HTTPS.
    Leave empty to start over plain HTTP at http://<static-ip> (you can add the domain later).
  EOT
  type        = string
  default     = ""
}

variable "open_ssh" {
  description = "Open port 22 to the internet. Keep false and use the Lightsail browser SSH console instead (more secure)."
  type        = bool
  default     = false
}

variable "ssh_cidr" {
  description = "CIDR allowed to SSH when open_ssh = true. Restrict to your IP if you can (e.g. 1.2.3.4/32)."
  type        = string
  default     = "0.0.0.0/0"
}

# ── Backups ───────────────────────────────────────────────────────────────────

variable "enable_auto_snapshot" {
  description = "Enable Lightsail automatic daily snapshots of the whole instance (cheap, incremental). Acts as your backup."
  type        = bool
  default     = true
}

variable "snapshot_time" {
  description = "Daily auto-snapshot time in UTC, format HH:00 (e.g. 03:00)."
  type        = string
  default     = "03:00"
}

# ── App behaviour ─────────────────────────────────────────────────────────────

variable "disable_signup" {
  description = "Disable new user registration. Set false for the very first boot to create your 2 accounts, then true."
  type        = bool
  default     = false
}

variable "admin_email" {
  description = "Email of the account that gets admin rights on startup. Optional. No email is ever sent."
  type        = string
  default     = ""
}

variable "log_level" {
  description = "Server log level (ERROR, WARN, INFO, DEBUG)."
  type        = string
  default     = "ERROR"
}

# ── Database / secrets ────────────────────────────────────────────────────────
# These are written into the instance .env on first boot. Keep your *.tfvars out
# of git (see .gitignore). Prefer hex/base64 values without shell-special chars.

variable "db_name" {
  description = "PostgreSQL database name."
  type        = string
  default     = "sparkyfitness_db"
}

variable "db_user" {
  description = "PostgreSQL superuser name (used for init/migrations)."
  type        = string
  default     = "sparky"
}

variable "db_password" {
  description = "PostgreSQL superuser password. Generate with: openssl rand -hex 24"
  type        = string
  sensitive   = true
}

variable "db_app_user" {
  description = "PostgreSQL limited application user name."
  type        = string
  default     = "sparkyapp"
}

variable "db_app_password" {
  description = "PostgreSQL application user password. Generate with: openssl rand -hex 24"
  type        = string
  sensitive   = true
}

variable "api_encryption_key" {
  description = "64-char hex data-encryption key. Generate with: openssl rand -hex 32"
  type        = string
  sensitive   = true
}

variable "better_auth_secret" {
  description = "Secret for BetterAuth session/2FA signing. Generate with: openssl rand -hex 32. NEVER change after setup."
  type        = string
  sensitive   = true
}
