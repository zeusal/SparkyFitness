# Store app secrets in AWS Secrets Manager so the EC2 instance can pull them
# at startup instead of embedding them in user-data or .env files.

locals {
  app_secrets = {
    SPARKY_FITNESS_DB_NAME            = var.db_name
    SPARKY_FITNESS_DB_USER            = var.db_user
    SPARKY_FITNESS_DB_PASSWORD        = var.db_password
    SPARKY_FITNESS_APP_DB_USER        = var.db_app_user
    SPARKY_FITNESS_APP_DB_PASSWORD    = var.db_app_password
    SPARKY_FITNESS_API_ENCRYPTION_KEY = var.api_encryption_key
    BETTER_AUTH_SECRET                = var.better_auth_secret
    SPARKY_FITNESS_FRONTEND_URL       = var.frontend_url
    SPARKY_FITNESS_EMAIL_HOST         = ""
    SPARKY_FITNESS_EMAIL_PORT         = "587"
    SPARKY_FITNESS_EMAIL_SECURE       = "true"
    SPARKY_FITNESS_EMAIL_USER         = ""
    SPARKY_FITNESS_EMAIL_PASS         = ""
    SPARKY_FITNESS_EMAIL_FROM         = var.ses_email_identity
  }
}

resource "aws_secretsmanager_secret" "app" {
  name                    = "${var.project}/${var.environment}/app"
  recovery_window_in_days = var.use_ministack ? 0 : 7

  tags = {
    Name = "${var.project}-${var.environment}-app-secrets"
  }
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id     = aws_secretsmanager_secret.app.id
  secret_string = jsonencode(local.app_secrets)
}
