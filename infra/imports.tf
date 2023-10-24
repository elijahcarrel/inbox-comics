import {
  to = mongodbatlas_cluster.inbox_comics
  id = "${local.mongodb_project_id[terraform.workspace]}-${local.mongodb_cluster_name[terraform.workspace]}"
}
import {
  to = aws_ses_email_identity.sender
  id = "comics@inboxcomics.com"
}

import {
  to = aws_ses_email_identity.bounces
  id = "inboxcomics+bounces@gmail.com"
}

import {
  to = aws_ses_domain_identity.example
  id = "inboxcomics.com"
}

import {
  to = aws_ses_configuration_set.common_message_configuration
  id = "CommonMessageConfiguration"
}
