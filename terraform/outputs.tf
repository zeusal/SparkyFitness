output "uploads_bucket_name" {
  description = "S3 bucket name for user uploads."
  value       = aws_s3_bucket.uploads.bucket
}

output "backups_bucket_name" {
  description = "S3 bucket name for database backups."
  value       = aws_s3_bucket.backups.bucket
}

output "ses_email_identity" {
  description = "SES verified email identity."
  value       = aws_ses_email_identity.sender.email
}

output "secrets_arn" {
  description = "ARN of the Secrets Manager secret holding app configuration."
  value       = aws_secretsmanager_secret.app.arn
}

output "ec2_public_ip" {
  description = "Public IP of the EC2 instance. Set SPARKY_FITNESS_FRONTEND_URL to http://<this>:3004"
  value       = var.use_ministack ? "N/A (MiniStack mode — EC2 not provisioned)" : (
    length(aws_eip.sparkyfitness) > 0 ? aws_eip.sparkyfitness[0].public_ip : "no EIP"
  )
}

output "frontend_url" {
  description = "Frontend URL to open in your browser."
  value = var.use_ministack ? "http://localhost:3004" : (
    length(aws_eip.sparkyfitness) > 0
      ? "http://${aws_eip.sparkyfitness[0].public_ip}:3004"
      : "http://${aws_instance.sparkyfitness[0].public_ip}:3004"
  )
}

output "ministack_endpoint" {
  description = "MiniStack endpoint in use (empty when targeting real AWS)."
  value       = var.use_ministack ? var.ministack_endpoint : "real AWS"
}
