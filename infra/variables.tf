# Maps are generally from terraform cloud workspace name to value.
locals {
  syndication_images_bucket_name = {
    inbox-comics-staging = "inbox-comics-syndication-images-staging"
    inbox-comics-prod    = "syndication-images"
  }

  mongodb_project_id = {
    inbox-comics-staging = "inbox-comics-staging"
    inbox-comics-prod    = "inbox-comics-prod"
  }

  mongodb_cluster_name = {
    inbox-comics-staging = "inbox-comics-staging-0"
    inbox-comics-prod    = "inboxcomics0" # Named this way for historical reasons. Difficult to rename.
  }
}
