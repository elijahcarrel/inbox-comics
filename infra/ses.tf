resource "aws_ses_email_identity" "sender" {
  email = "comics@inboxcomics.com"
}

resource "aws_ses_email_identity" "bounces" {
  email = "inboxcomics+bounces@gmail.com"
}

resource "aws_ses_domain_identity" "example" {
  domain = "inboxcomics.com"
}

resource "aws_ses_configuration_set" "common_message_configuration" {
  name = "CommonMessageConfiguration"
}
