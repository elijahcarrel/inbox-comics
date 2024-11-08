resource "improvmx_domain" "inbox_comics" {
  domain = "inboxcomics.com"
}

resource "improvmx_email_forward" "global_forward" {
  domain            = "inboxcomics.com"
  alias_name        = "inboxcomics.com"
  destination_email = "inboxcomics@gmail.com"
}
