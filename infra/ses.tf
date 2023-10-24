resource "aws_ses_email_identity" "sender" {
  email = local.comics_email_sender[terraform.workspace]
}

resource "aws_ses_email_identity" "bounces" {
  email = local.bounce_email_recipient[terraform.workspace]
}

resource "aws_ses_domain_identity" "example" {
  domain = local.domain[terraform.workspace]
}

resource "aws_ses_configuration_set" "common_message_configuration" {
  name = "common-message-configuration-${local.environment[terraform.workspace]}"
  reputation_metrics_enabled = true
  delivery_options {
    tls_policy = "Optional"
  }
}
