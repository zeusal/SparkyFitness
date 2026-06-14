locals {
  # Lightsail needs an explicit AZ; "<region>a" is valid in every Lightsail region.
  availability_zone = "${var.aws_region}a"

  # The compose file is embedded verbatim into user-data so this module is
  # fully self-contained (no need to push anything to GitHub first).
  compose_content = file("${path.module}/files/docker-compose.budget.yml")

  user_data = templatefile("${path.module}/user-data.sh.tftpl", {
    domain             = var.domain
    static_ip          = aws_lightsail_static_ip.app.ip_address
    db_name            = var.db_name
    db_user            = var.db_user
    db_password        = var.db_password
    db_app_user        = var.db_app_user
    db_app_password    = var.db_app_password
    api_encryption_key = var.api_encryption_key
    better_auth_secret = var.better_auth_secret
    disable_signup     = var.disable_signup ? "true" : "false"
    admin_email        = var.admin_email
    log_level          = var.log_level
    ghcr_namespace     = var.ghcr_namespace
    image_tag          = var.image_tag
    ghcr_username      = var.ghcr_username
    ghcr_token         = var.ghcr_token
    compose_content    = local.compose_content
  })

  # Ports always open: 80 (HTTP + Let's Encrypt challenge) and 443 (HTTPS).
  # Port 22 only when open_ssh = true; otherwise use the Lightsail browser console.
  ports = concat(
    [
      { port = 80, cidr = "0.0.0.0/0" },
      { port = 443, cidr = "0.0.0.0/0" },
    ],
    var.open_ssh ? [{ port = 22, cidr = var.ssh_cidr }] : []
  )
}

resource "aws_lightsail_instance" "app" {
  name              = "${var.project}-${var.environment}"
  availability_zone = local.availability_zone
  blueprint_id      = var.blueprint_id
  bundle_id         = var.bundle_id
  user_data         = local.user_data

  dynamic "add_on" {
    for_each = var.enable_auto_snapshot ? [1] : []
    content {
      type          = "AutoSnapshot"
      snapshot_time = var.snapshot_time
      status        = "Enabled"
    }
  }

  # user_data only runs on first boot (cloud-init). Changing it here would force
  # Lightsail to REPLACE the instance — destroying the database. Ignore it so a
  # later `apply` never recreates a live box; runtime config is changed in-place
  # on the instance (/opt/sparkyfitness/.env + Caddyfile). A fresh deploy (empty
  # state) still gets the latest user_data because ignore_changes only affects
  # updates, not creation.
  lifecycle {
    ignore_changes = [user_data]
  }

  tags = {
    Name = "${var.project}-${var.environment}"
  }
}

# Free static IP so the public address survives stop/start and reboots.
resource "aws_lightsail_static_ip" "app" {
  name = "${var.project}-${var.environment}-ip"
}

resource "aws_lightsail_static_ip_attachment" "app" {
  static_ip_name = aws_lightsail_static_ip.app.name
  instance_name  = aws_lightsail_instance.app.name
}

# Firewall: replaces the Lightsail defaults with exactly the ports above.
resource "aws_lightsail_instance_public_ports" "app" {
  instance_name = aws_lightsail_instance.app.name

  dynamic "port_info" {
    for_each = local.ports
    content {
      protocol  = "tcp"
      from_port = port_info.value.port
      to_port   = port_info.value.port
      cidrs     = [port_info.value.cidr]
    }
  }
}
