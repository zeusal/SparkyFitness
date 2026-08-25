output "static_ip" {
  description = "Public static IP of the instance. Point your domain's A record here."
  value       = aws_lightsail_static_ip.app.ip_address
}

output "instance_name" {
  description = "Lightsail instance name (use it for the browser SSH console / snapshots)."
  value       = aws_lightsail_instance.app.name
}

output "app_url" {
  description = "URL where the app will be reachable once boot finishes (~3-5 min)."
  value       = var.domain != "" ? "https://${var.domain}" : "http://${aws_lightsail_static_ip.app.ip_address}"
}

output "next_steps" {
  description = "What to do right after apply."
  value = var.domain != "" ? join("\n", [
    "1. Create a DNS A record: ${var.domain} -> ${aws_lightsail_static_ip.app.ip_address}",
    "2. Wait ~3-5 min for first boot; Caddy gets the HTTPS cert automatically once DNS resolves.",
    "3. Open https://${var.domain}, register your 2 accounts.",
    "4. Re-apply with disable_signup = true to lock registration.",
    ]) : join("\n", [
    "1. Wait ~3-5 min for first boot.",
    "2. Open http://${aws_lightsail_static_ip.app.ip_address}, register your 2 accounts.",
    "3. Re-apply with disable_signup = true to lock registration.",
    "4. When ready, set the 'domain' variable and re-apply to get HTTPS.",
  ])
}
