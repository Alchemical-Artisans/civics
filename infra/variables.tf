# The Google Cloud project that holds the bucket.
#
# No default: the project is an account's, not the repository's, and guessing
# one would be a request against somebody else's cloud. Put it in
# `terraform.tfvars` -- see README.md.
variable "project_id" {
  description = "The Google Cloud project the excerpt bucket lives in."
  type        = string
}

# The bucket's name, which is global across all of Google Cloud and so cannot
# be taken back once the links point at it.
#
# Named for files rather than for excerpts because the excerpts are only the
# first thing to go in it: `static/references/` is a second small store of the
# same kind -- a figure out of a published report, a record the city holds and
# publishes nowhere -- and it can join this bucket under its own prefix
# without the URLs reading oddly. That is also why every object sits under an
# `excerpts/` prefix rather than at the root.
#
# `EXCERPT_ORIGIN` in `src/lib/router.ts` spells this name out, because the
# site is built without ever reading this file, and `router.spec.ts` fails if
# the two disagree.
variable "bucket_name" {
  description = "Globally unique name of the bucket serving the excerpt store."
  type        = string
  default     = "haverhill-civics-files"
}

# A single region rather than a multi-region: the readers are in Haverhill,
# `us-east1` is the closest of them, and regional storage is a little under
# half the price of multi-region for the same class.
variable "location" {
  description = "Bucket location."
  type        = string
  default     = "US-EAST1"
}

# How long a replaced or deleted object stays retrievable.
#
# This is what stands in for the history git is no longer keeping. The bucket
# is the only copy of these files now, so a bad `--prune` or an overwritten
# excerpt has to be recoverable; a year is long enough that anyone would have
# noticed, and the versions cost storage on 483 MB rather than on anything
# large.
variable "noncurrent_version_retention_days" {
  description = "Days a noncurrent object version is kept before deletion."
  type        = number
  default     = 365
}
