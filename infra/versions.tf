terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }

    mongodbatlas = {
      source = "mongodb/mongodbatlas"
      version = "~> 2.0"
    }

    checkly = {
      source = "checkly/checkly"
      version = "~> 1.0"
    }
  }

  required_version = ">= 1.5.7"
}

provider "aws" {
  region = "us-west-2"
}

provider "mongodbatlas" {}
