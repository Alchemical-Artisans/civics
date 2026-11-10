# The origin `EXCERPT_ORIGIN` in `src/lib/router.ts` has to match.
#
# Printed so an apply ends by stating the URL the site must be built against,
# rather than leaving someone to assemble it out of the bucket name.
output "excerpt_origin" {
  description = "Base URL of the excerpt store, no trailing slash."
  value       = "https://storage.googleapis.com/${google_storage_bucket.excerpts.name}"
}

# Where `npm run excerpts:upload` syncs to.
output "bucket_uri" {
  description = "gs:// URI of the excerpt store."
  value       = "gs://${google_storage_bucket.excerpts.name}"
}
