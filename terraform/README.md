# SparkyFitness Terraform

Provisions S3 (uploads + backups), SES, Secrets Manager, IAM, security groups, EC2, and Elastic IP.

A single variable (`use_ministack`) switches between MiniStack and real AWS — no other code changes needed.

## Prerequisites

- [Terraform ≥ 1.6](https://developer.hashicorp.com/terraform/downloads)
- MiniStack running: `docker run -d -p 4566:4566 ministackorg/ministack`
- (For real AWS) AWS credentials configured via env vars, `~/.aws/credentials`, or an IAM role

## Quick Start — MiniStack

```bash
cd terraform

terraform init

terraform apply -var-file=environments/ministack.tfvars
```

MiniStack resources provisioned:
- S3 buckets: `sparkyfitness-dev-uploads`, `sparkyfitness-dev-backups`
- SES identity: `no-reply@example.com`
- Secrets Manager secret: `sparkyfitness/dev/app`
- IAM role + instance profile (for reference)
- Security group (for reference)
- **EC2 is skipped** — MiniStack's EC2 emulation is too limited; run Docker Compose directly

## Switch to Real AWS

1. Copy and fill in the aws.tfvars template:
   ```bash
   cp environments/aws.tfvars environments/aws.local.tfvars
   # edit aws.local.tfvars — never commit real secrets
   ```

2. Apply:
   ```bash
   terraform apply -var-file=environments/aws.local.tfvars
   ```

3. After the first apply, update `frontend_url` in your tfvars to match the output `ec2_public_ip`, then apply again:
   ```bash
   terraform apply -var-file=environments/aws.local.tfvars \
     -var="frontend_url=http://$(terraform output -raw ec2_public_ip):3004"
   ```

## Resources Created

| Resource | MiniStack | Real AWS | Est. cost/mo |
|---|---|---|---|
| S3 uploads bucket | ✓ | ✓ | ~$0.02/GB |
| S3 backups bucket | ✓ | ✓ | ~$0.02/GB |
| SES email identity | ✓ | ✓ | $0 (1k emails free) |
| Secrets Manager | ✓ | ✓ | ~$0.40 |
| IAM role + profile | ✓ | ✓ | free |
| Security group | ✓ | ✓ | free |
| RDS PostgreSQL | ✗ (Docker Compose) | ✓ | ~$13 (db.t3.micro) |
| EC2 instance | ✗ | ✓ | $0–$7 (t2.micro free tier) |
| Elastic IP | ✗ | ✓ | $0 (free while attached) |
| S3 lifecycle rules | ✗ | ✓ | — |
| SES configuration set | ✗ | ✓ | — |

## Destroy

```bash
terraform destroy -var-file=environments/ministack.tfvars
```
