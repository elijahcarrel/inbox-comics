resource "aws_s3_bucket" "syndication_images" {
  bucket = local.syndication_images_bucket_name[terraform.workspace]
}

resource "aws_s3_bucket_cors_configuration" "syndication_images" {
  bucket = aws_s3_bucket.syndication_images.id
  cors_rule {
    allowed_headers = [
      "*"
    ]
    allowed_methods = [
      "PUT",
      "POST",
      "DELETE"
    ]
    allowed_origins = [
      "https://*.retool.com"
    ]
    expose_headers = []
    max_age_seconds = 0
  }

  cors_rule {
    allowed_headers = []
    allowed_methods = [
      "GET"
    ]
    allowed_origins = [
      "https://*.retool.com",
      "https://*.vercel.com",
      "https://*.inboxcomics.com"
    ]
    expose_headers = []
    max_age_seconds = 0
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "syndication_images" {
  bucket = aws_s3_bucket.syndication_images.id

  rule {
    apply_server_side_encryption_by_default {
      kms_master_key_id = ""
      sse_algorithm     = "AES256"
    }

    bucket_key_enabled = true
  }
}

resource "aws_s3_bucket_public_access_block" "syndication_images" {
  bucket = "${aws_s3_bucket.syndication_images.id}"

  block_public_acls   = false
  block_public_policy = false
}


resource "aws_s3_bucket_policy" "syndication_images_general_policy" {
  bucket = aws_s3_bucket.syndication_images.id
  policy = data.aws_iam_policy_document.syndication_images_general_policy.json

  # We need to disable the public access block before applying the policy, otherwise
  # applying the policy will fail with a 403.
  depends_on = [
    aws_s3_bucket_public_access_block.syndication_images
  ]
}

data "aws_iam_policy_document" "syndication_images_general_policy" {
  statement {
    principals {
      type = "AWS"
      identifiers = ["*"]
    }

    effect = "Allow"

    actions = [
      "s3:GetObject",
    ]

    sid = "PublicReadGetObject"

    resources = [
      "${aws_s3_bucket.syndication_images.arn}/*",
    ]

  }
}