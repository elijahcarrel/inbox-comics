import {
  to = mongodbatlas_cluster.inbox_comics
  id = "${local.mongodb_project_id[terraform.workspace]}-${local.mongodb_cluster_name[terraform.workspace]}"
}

import {
  to = improvmx_domain.inbox_comics
  id = "inboxcomics.com"
}

import {
  to = improvmx_email_forward.global_forward
  id = "inboxcomics.com_inboxcomics.com"
}
