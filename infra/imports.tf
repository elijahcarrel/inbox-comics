import {
  to = aws_s3_bucket.syndication_images
  id = local.syndication_images_bucket_name[terraform.workspace]
}

import {
  to = aws_s3_bucket_cors_configuration.syndication_images
  id = local.syndication_images_bucket_name[terraform.workspace]
}

import {
  to = aws_s3_bucket_server_side_encryption_configuration.syndication_images
  id = local.syndication_images_bucket_name[terraform.workspace]
}

import {
  to = aws_s3_bucket_policy.syndication_images_general_policy
  id = local.syndication_images_bucket_name[terraform.workspace]
}
