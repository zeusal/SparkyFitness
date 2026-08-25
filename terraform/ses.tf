# SES email identity — verify the sender address used by the server
resource "aws_ses_email_identity" "sender" {
  email = var.ses_email_identity
}

# SES configuration set for tracking (real AWS only — MiniStack skips)
resource "aws_ses_configuration_set" "main" {
  count = var.use_ministack ? 0 : 1
  name  = "${var.project}-${var.environment}"
}
