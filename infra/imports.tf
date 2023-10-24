import {
  to = mongodbatlas_cluster.inbox_comics
  id = "${local.mongodb_project_id[terraform.workspace]}-${local.mongodb_cluster_name[terraform.workspace]}"
}
