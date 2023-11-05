resource "mongodbatlas_cluster" "inbox_comics" {
  project_id = local.mongodb_project_id[terraform.workspace]
  name = local.mongodb_cluster_name[terraform.workspace]
  cluster_type = "REPLICASET"

  provider_name = "TENANT"
  backing_provider_name = "AWS"
  provider_region_name = "US_WEST_2"
  provider_instance_size_name = "M0"

  auto_scaling_disk_gb_enabled = false
}
