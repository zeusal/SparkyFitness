# SparkyFitness — AWS Deployment (Cheapest Option)

This guide deploys SparkyFitness on a single AWS EC2 instance using Docker Compose and MiniStack to emulate AWS services (S3, SES, SQS, etc.) for testing.

## Cheapest AWS Setup

| Resource | Choice | Est. cost/month |
|---|---|---|
| EC2 instance | `t2.micro` (free tier) or `t3a.micro` | $0 – $6.90 |
| EBS volume | 20 GB gp3 | ~$1.60 |
| Elastic IP | 1 static IP | ~$0 (free while attached) |
| Data transfer | First 100 GB out free | $0 – varies |
| **Total** | | **~$0–$8.50/mo** |

> **Free tier:** New AWS accounts get `t2.micro` free for 12 months (750 hrs/month).

---

## 1. Launch EC2 Instance

### Via AWS Console

1. Go to **EC2 → Launch Instance**
2. Choose **Amazon Linux 2023** (AMI) — free, minimal, Docker-ready
3. Instance type: `t2.micro` (free tier) or `t3a.micro` (non-free-tier cheapest)
4. Storage: **20 GB gp3** (cheaper than gp2)
5. Security Group — open these inbound ports:
   - `22` (SSH) — your IP only
   - `8080` (frontend) — 0.0.0.0/0
   - `3010` (API, optional) — your IP only
   - `4566` (MiniStack) — your IP only (for testing)
6. Create or reuse a key pair and download `.pem`

### Via AWS CLI (one-liner)

```bash
aws ec2 run-instances \
  --image-id ami-0c02fb55956c7d316 \
  --instance-type t2.micro \
  --key-name YOUR_KEY_PAIR \
  --security-group-ids YOUR_SG_ID \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":20,"VolumeType":"gp3"}}]' \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=sparkyfitness}]'
```

---

## 2. Connect and Install Docker

```bash
ssh -i your-key.pem ec2-user@<EC2_PUBLIC_IP>

# Install Docker
sudo dnf update -y
sudo dnf install -y docker
sudo systemctl enable --now docker
sudo usermod -aG docker ec2-user
newgrp docker

# Install Docker Compose plugin
sudo mkdir -p /usr/local/lib/docker/cli-plugins
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
docker compose version
```

---

## 3. Upload Your Files

From your local machine:

```bash
# Copy the docker directory and env file
scp -i your-key.pem -r ./docker ec2-user@<EC2_PUBLIC_IP>:~/sparkyfitness/
scp -i your-key.pem .env ec2-user@<EC2_PUBLIC_IP>:~/sparkyfitness/.env
```

Or clone your repo directly on the instance:

```bash
git clone https://github.com/zeusal/sparkyfitness.git ~/sparkyfitness
cd ~/sparkyfitness
cp docker/.env.example .env
# Edit .env with your values
nano .env
```

---

## 4. Configure Environment

Edit `.env` — minimum required changes:

```env
SPARKY_FITNESS_FRONTEND_URL=http://<EC2_PUBLIC_IP>:8080

# Generate strong secrets:
# openssl rand -hex 32
SPARKY_FITNESS_API_ENCRYPTION_KEY=<64-char hex>
BETTER_AUTH_SECRET=<strong secret>

SPARKY_FITNESS_DB_NAME=sparkyfitness_db
SPARKY_FITNESS_DB_USER=sparky
SPARKY_FITNESS_DB_PASSWORD=<strong password>
SPARKY_FITNESS_APP_DB_USER=sparkyapp
SPARKY_FITNESS_APP_DB_PASSWORD=<strong password>

# MiniStack settings (for local AWS emulation)
AWS_ENDPOINT_URL=http://ministack:4566
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
```

---

## 5. Start the Stack

### Option A — All-in-one (recommended)

`docker-compose.aws.yml` already includes MiniStack. One command starts everything:

```bash
cd ~/sparkyfitness
docker compose -f docker/docker-compose.aws.yml --env-file .env up -d
```

### Option B — Standalone `docker run` for MiniStack

The Docker network is created by `docker compose up`. If you want to run MiniStack separately **before** the compose stack, create the network first:

```bash
cd ~/sparkyfitness

# Create the network that compose will also use
docker network create sparkyfitness-network

# Start MiniStack standalone
docker run -d \
  --name ministack \
  --network sparkyfitness-network \
  -p 4566:4566 \
  ministackorg/ministack

# Then start the rest of the stack (skip the built-in ministack service)
docker compose -f docker/docker-compose.aws.yml --env-file .env up -d \
  sparkyfitness-db sparkyfitness-server sparkyfitness-frontend
```

---

## 6. Verify

```bash
# Check all containers are running
docker compose -f docker/docker-compose.aws.yml ps

# Check MiniStack health
curl http://localhost:4566/_ministack/health

# Check frontend
curl -s -o /dev/null -w "%{http_code}" http://localhost:8080

# View logs
docker compose -f docker/docker-compose.aws.yml logs -f
```

---

## 7. MiniStack AWS Service Endpoints

When testing from the EC2 instance or within the Docker network, use:

| Service | Endpoint |
|---|---|
| All AWS APIs | `http://ministack:4566` (internal) |
| External access | `http://<EC2_IP>:4566` |

Example — create an S3 bucket for testing:

```bash
aws --endpoint-url=http://localhost:4566 \
    --region us-east-1 \
    s3 mb s3://sparkyfitness-uploads
```

---

## Tips for Staying Cheap

- Stop the instance when not testing: `aws ec2 stop-instances --instance-ids <id>` (EBS still billed, but EC2 isn't)
- Use a **Spot Instance** for even lower cost (up to 90% off, but interruptible)
- Attach an **Elastic IP** before stopping to keep a static address
- Set a **CloudWatch billing alarm** at $5 so you're notified before charges stack up

---

## Switching to Real AWS Services (Later)

When ready to replace MiniStack with real AWS, change these env vars:

```env
# Remove or leave blank to use real AWS
AWS_ENDPOINT_URL=

# Use real IAM credentials
AWS_ACCESS_KEY_ID=<real key>
AWS_SECRET_ACCESS_KEY=<real secret>
AWS_DEFAULT_REGION=us-east-1
```

And remove the `ministack` service from the compose file.
