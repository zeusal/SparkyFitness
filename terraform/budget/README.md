# SparkyFitness — Budget deployment (AWS Lightsail)

A "save-money" Terraform module that runs the **whole app on a single AWS Lightsail
instance**: frontend + backend + PostgreSQL + an automatic-HTTPS reverse proxy
(Caddy), all as Docker containers. Designed for **personal use (you + 1 person)**.

It is intentionally separate from the parent `terraform/` module (the
"professional" EC2 + RDS + SES + Secrets Manager setup). Nothing here touches that.

## What you get

| Resource | Notes | Cost |
|---|---|---|
| Lightsail instance `small_2_0` | 2 GB RAM / 2 vCPU / 60 GB SSD, 3 TB transfer included | ~12 USD/mo |
| Static IP | Free while attached | $0 |
| PostgreSQL | Runs as a container on the same box (no RDS) | included |
| Caddy reverse proxy | Free Let's Encrypt HTTPS when a `domain` is set | included |
| Watchtower | Auto-pulls your new app images and recreates the containers | included |
| Auto daily snapshots | Whole-instance backup, incremental | ~1–2 USD/mo |
| **Total** | | **~13–14 USD/mo** |

The **frontend and backend run your own images** from GitHub Container Registry
(`ghcr.io/<ghcr_namespace>/sparkyfitness-{frontend,server}`), built by the repo's
existing GitHub Actions workflows. PostgreSQL and Caddy use upstream images.

Deliberately **left out** (per your requirements): RDS, SES/email, OIDC, MiniStack,
Garmin and MCP services.

## How access works

There is **no IP allow-list** (your phone's IP is dynamic). Access is controlled
in two layers instead:

1. **App login** — create your 2 accounts, then set `disable_signup = true` so
   nobody else can register.
2. **HTTPS endpoint** — set a `domain` and Caddy serves the app over TLS from
   anywhere (web browser **and** the Android app point to `https://<domain>`).

SSH is **closed by default**; use the Lightsail **browser SSH console** (works
without any open port). Open port 22 only via `open_ssh = true` if you must.

## Prerequisites

- [Terraform ≥ 1.6](https://developer.hashicorp.com/terraform/downloads)
- AWS credentials configured once: `aws configure` (an IAM user with Lightsail +
  EC2 describe permissions is enough).
- A domain **or** a free [DuckDNS](https://www.duckdns.org) subdomain (optional —
  you can start without one and add it later).

## Usage

```bash
cd terraform/budget

# 1. Fill in your values + secrets
cp terraform.tfvars.example terraform.tfvars
#   generate secrets:
#   openssl rand -hex 24   (db passwords)
#   openssl rand -hex 32   (api key, better auth secret)
nano terraform.tfvars

# 2. Deploy
terraform init
terraform apply
```

`terraform apply` prints the **static IP**, the **app URL**, and the **next steps**.

### First boot (~3–5 min)

The instance installs Docker and starts the stack automatically. Watch progress
from the Lightsail browser SSH console:

```bash
sudo tail -f /var/log/sparky-bootstrap.log
cd /opt/sparkyfitness && docker compose ps
```

### Turn on HTTPS

1. Set a DNS **A record**: `fitness.midominio.com` → the static IP from the output
   (DuckDNS: just paste the IP in your DuckDNS dashboard).
2. Put that name in `terraform.tfvars` → `domain = "fitness.midominio.com"`.
3. `terraform apply`. On the next boot Caddy fetches the certificate automatically.

> Changing `domain` recreates the instance (it's baked into first-boot config).
> Your data survives if you keep snapshots; for a zero-downtime change you can
> instead edit `/opt/sparkyfitness/.env` + `Caddyfile` on the box and
> `docker compose up -d`.

### Lock it down

After both accounts exist, set `disable_signup = true` and `terraform apply`.

## Updating the app (image lifecycle)

The infra (Terraform) and the app (Docker images) have separate lifecycles:

1. You change code and `git push`.
2. GitHub Actions builds and pushes new images to ghcr (`Manually Publish Docker
   Images`, or on a published release).
3. **Watchtower** (running on the box) checks the registry hourly and, when the
   `:latest` tag has a new digest, pulls it and recreates the **frontend/server**
   containers automatically. The server applies DB migrations on startup.

So normally you do **nothing on the server** — just push and wait up to an hour.
To force an immediate update from the Lightsail browser SSH console:

```bash
cd /opt/sparkyfitness && docker compose pull && docker compose up -d
```

Notes:
- Watchtower only touches the two **labelled** services. Postgres and Caddy are
  never auto-updated (safer).
- Your data lives in volumes/disk (`./postgresql`, `./uploads`, `./backup`,
  `caddy-data`), so image updates never lose data.
- If you prefer reproducible deploys over auto-updates, set `image_tag` to a fixed
  release tag instead of `latest` and bump it when you want to upgrade.

### Public vs private ghcr packages

- **Public** (simplest): make the two packages public in GitHub → no credentials
  needed anywhere. Leave `ghcr_username`/`ghcr_token` empty.
- **Private:** set `ghcr_username` + a `ghcr_token` (PAT with `read:packages`).
  First boot runs `docker login ghcr.io` so both the initial pull and Watchtower
  can authenticate.

## Android app

The mobile app just needs its API base URL pointed at `https://<your-domain>`.
Build/install the APK from `SparkyFitnessMobile/` (it is not on the Play Store).

## Backups

- **Automatic:** daily Lightsail snapshots (`enable_auto_snapshot = true`).
- **Manual / portable:** the repo's `db_backup.sh` dumps PostgreSQL to
  `/opt/sparkyfitness/backup`; copy it off-box or to S3 if you want extra safety.

To restore, create a new instance from a snapshot in the Lightsail console.

## Cost control

- One fixed monthly price — Lightsail bundles include transfer, so no surprise bills.
- Set a **billing alarm** ($20) in AWS Billing just in case.
- `terraform destroy` removes everything when you no longer need it.

## Notes / caveats

- Secrets are written to the instance `.env` on first boot and therefore live in
  your local Terraform **state** — keep `terraform.tfstate` and `*.tfvars` private
  (already git-ignored here). The parent module uses Secrets Manager if you ever
  want that instead.
- Your ghcr workflows build multi-arch (amd64+arm64) images, but Lightsail bundles
  are x86 — which is fine, the amd64 variant is used automatically.
- `ghcr_token` (if used) is also written to the box and stored in Terraform state;
  keep state/`*.tfvars` private, or use public packages to avoid the token entirely.
