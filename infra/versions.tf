terraform {
  required_version = ">= 1.5.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.16"
    }

    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = ">= 1.12.1"
    }

    improvmx = {
      source  = "issyl0/improvmx"
      version = ">= 0.6.0"
    }
  }
}

provider "aws" {
  region = "us-west-2"
}

provider "mongodbatlas" {}

provider "improvmx" {}
