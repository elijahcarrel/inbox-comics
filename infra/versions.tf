terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.16"
    }
  }

  required_providers {
    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = "1.12.1"
    }
  }

  required_version = ">= 1.5.7"
}

provider "aws" {
  region = "us-west-2"
}

provider "mongodbatlas" {}
