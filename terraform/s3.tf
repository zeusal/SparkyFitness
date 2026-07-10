resource "aws_s3_bucket" "uploads" {
  bucket = "${var.project}-${var.environment}-uploads"

  tags = {
    Name = "${var.project}-${var.environment}-uploads"
  }
}

resource "aws_s3_bucket_versioning" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Block all public access — uploads are served via the backend, not directly from S3
resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ── Backups bucket ────────────────────────────────────────────────────────────

resource "aws_s3_bucket" "backups" {
  bucket = "${var.project}-${var.environment}-backups"

  tags = {
    Name = "${var.project}-${var.environment}-backups"
  }
}

resource "aws_s3_bucket_versioning" "backups" {
  bucket = aws_s3_bucket.backups.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "backups" {
  bucket = aws_s3_bucket.backups.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "backups" {
  bucket = aws_s3_bucket.backups.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lifecycle: move backups to cheaper storage after 30 days, delete after 90
resource "aws_s3_bucket_lifecycle_configuration" "backups" {
  count  = var.use_ministack ? 0 : 1 # MiniStack does not support lifecycle rules
  bucket = aws_s3_bucket.backups.id

  rule {
    id     = "archive-and-expire"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    expiration {
      days = 90
    }
  }
}
