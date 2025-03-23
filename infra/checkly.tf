variable "checkly_api_key" {}
variable "checkly_account_id" {}

provider "checkly" {
  api_key = var.checkly_api_key
  account_id = var.checkly_account_id
}

resource "checkly_check" "new-user-page-loads" {
  name                      = "new-user-page-loads"
  type                      = "BROWSER"
  frequency                 = 1440
  activated                 = true
  muted                     = false
  should_fail               = false
  run_parallel              = true
  locations                 = ["ca-central-1", "us-east-1"]
  script                    = file("${path.module}/../checkly/new-user-page-loads.spec.ts")
  degraded_response_time    = 15000
  max_response_time         = 30000
  tags                      = []
  ssl_check_domain          = ""
  alert_settings {
    escalation_type = "RUN_BASED"
    run_based_escalation {
      failed_run_threshold = 1
    }
    time_based_escalation {
      minutes_failing_threshold = 5
    }
    reminders {
      amount   = 0
      interval = 5
    }
  }
  retry_strategy {
    type                 = "LINEAR"
    base_backoff_seconds = 60
    max_retries          = 2
    max_duration_seconds = 600
    same_region          = true
  }
  use_global_alert_settings = true
}
