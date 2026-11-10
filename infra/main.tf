# The store the site's document excerpts are served from.
#
# A few pages cut out of a meeting document's PDF and published beside it, so
# an agenda item resting on one letter can link to that letter rather than to
# a 200-page packet the reader then has to search. There are 622 of them and
# they weigh 483 MB.
#
# They used to be committed under `static/excerpts/` and published with the
# site, which stopped working: they were 63% of a deploy artifact that had
# reached 767 MB against GitHub Pages' 1 GB ceiling, and the deploy job could
# no longer finish it -- two runs in a row sat in `syncing_files` for ten
# minutes and then aborted.
#
# So the bucket is the only copy. That is the whole reason for the versioning,
# the lifecycle rule and the `prevent_destroy` below: there is no second copy
# in git to restore from any more.
#
# `npm run excerpts:upload` is what puts a file here;
# `npm run excerpts:download` fetches the corpus into a fresh checkout; and
# `EXCERPT_ORIGIN` in `src/lib/router.ts` is the one line that has to change
# to move the store somewhere else.

terraform {
  required_version = ">= 1.6"

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 7.0"
    }
  }

  # State is local, and committed nowhere -- see .gitignore. There is exactly
  # one bucket here and one person who applies it, so a remote backend would
  # be ceremony. To add one later:
  #
  # backend "gcs" {
  #   bucket = "<a state bucket>"
  #   prefix = "civics/excerpts"
  # }
}

provider "google" {
  project = var.project_id
  region  = var.location
}

resource "google_storage_bucket" "excerpts" {
  name     = var.bucket_name
  location = var.location

  storage_class = "STANDARD"

  # Uniform access: one bucket-wide policy rather than an ACL per object.
  # Per-object ACLs are what make a public store leak -- a file uploaded
  # without the right ACL is quietly unreachable, and the upload script would
  # have to remember to set one on all 622.
  uniform_bucket_level_access = true

  # Public read is granted below, so the project's inherited setting has to be
  # left alone rather than enforced. Stated rather than defaulted, because it
  # is the line that decides whether the site's links resolve at all.
  public_access_prevention = "inherited"

  # Every replaced or deleted object stays retrievable. This is the safety net
  # that lets the bucket be the only copy.
  versioning {
    enabled = true
  }

  # ...but not forever: a year, then the old version goes. Without this the
  # store would grow by every re-cut of every excerpt and never shrink.
  lifecycle_rule {
    condition {
      days_since_noncurrent_time = var.noncurrent_version_retention_days
      with_state                 = "ARCHIVED"
    }
    action {
      type = "Delete"
    }
  }

  # An apply must not be able to empty this. `force_destroy` would let a
  # `destroy` take 622 public documents with it, and `prevent_destroy` means
  # even an explicit `tofu destroy` stops rather than asks -- deleting the
  # bucket is a thing to do by hand, having thought about it, not something to
  # discover in a plan's output.
  force_destroy = false

  lifecycle {
    prevent_destroy = true
  }
}

# Public read.
#
# These are public records the city has already published; this site exists to
# republish them, and a reader following a link from a meeting page has no
# account here to authenticate with. So `allUsers`.
#
# `objectViewer` rather than `legacyObjectReader` carries `storage.objects.list`
# with it, which means the store is browsable -- anyone can enumerate what is
# in it. That is wanted rather than tolerated: a public index of the documents
# this site rests on is the same disclosure the site itself is for. Swap to
# `roles/storage.legacyObjectReader` to serve the files without the listing.
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.excerpts.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
