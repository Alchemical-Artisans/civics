# The excerpt store

One bucket, holding the document excerpts the site links to: a few pages cut
out of a meeting document's PDF and published beside it, so an agenda item
resting on one letter can link to that letter rather than to a 200-page packet
the reader then has to search.

They were committed under `static/excerpts/` and published with the site until
2026-11-10. There are 622 of them and they weigh 483 MB — 63% of a deploy
artifact that had reached 767 MB against GitHub Pages' 1 GB ceiling. That is
where it stopped publishing: two deploys in a row sat in `syncing_files` for
ten minutes and then aborted
([run 42838157185](https://github.com/Alchemical-Artisans/civics/actions/runs/42838157185),
and the one before it), with the build itself green both times.

Taking them out leaves 283 MB. More than half of what remains is the day and
week calendar views — 10,906 files and 165 MB under `/calendar/day`, another
1,558 and 29 MB under `/calendar/week` — so that is where to look next if the
artifact becomes a problem again. Moving the excerpts does not touch it.

**The bucket is the only copy.** `excerpts/` is gitignored and a clone does not
carry it. That is why `main.tf` turns on object versioning, keeps a noncurrent
version for a year, and sets `prevent_destroy` on the bucket — there is no
second copy in git to restore from any more.

## Applying

Needs OpenTofu and a Google Cloud project you can create a bucket in.

```bash
cp terraform.tfvars.example terraform.tfvars
```

Put the project id in it, then:

```bash
tofu init
```

```bash
tofu plan
```

```bash
tofu apply
```

The apply prints `excerpt_origin`, which must match `EXCERPT_ORIGIN` in
`src/lib/router.ts`. It does already; `scripts/lib/excerpt-store.spec.mjs`
fails if the two are ever changed apart.

## Filling it

From the repository root, with `gcloud` authenticated against the same project:

```bash
npm run excerpts:upload
```

That syncs `excerpts/` upward, adding and overwriting but never deleting, and
ends by fetching one object over plain HTTPS to prove the store is actually
serving — nothing in an upload itself would fail if the public read grant were
missing, and the symptom would be every excerpt link on the site returning 403.

A fresh checkout gets the corpus with:

```bash
npm run excerpts:download
```

Neither direction deletes anything unless asked. Withdrawing a file, or
dropping a local stray, is `--prune`:

```bash
npm run excerpts:upload -- --prune
```

```bash
npm run excerpts:download -- --prune
```

Both refuse when the side they would read from holds fewer than a hundred
files, which is what tells an incomplete checkout or an unpopulated bucket
apart from a real withdrawal. Whichever side of the sync is empty, deletion
would destroy the corpus — upward that is a checkout without the files
emptying the store, downward it is an empty store emptying the checkout, which
is exactly the state the bucket is in before its first upload.

## Serving it from a subdomain

The links point at `https://storage.googleapis.com/haverhill-civics-files/…`
today. Pointing them at `https://files.alchemicalartisans.com/…` instead is a
one-line change to `EXCERPT_ORIGIN` and a rebuild: the site is fully
prerendered and rebuilt on every push, so there is nothing to migrate and no
stale internal link to chase.

What is not settled is how that subdomain reaches the bucket. A plain CNAME to
a bucket serves **HTTP only** —
[Google's own documentation](https://cloud.google.com/storage/docs/hosting-static-website-http)
is explicit that CNAME records do not support HTTPS — so one of:

- **Gandi web forwarding**, where the domain already is. Free, but Gandi does
  not document whether a forward preserves the path, and a forward that drops
  it would land every excerpt on the bucket root. Test it against a real
  excerpt URL before changing `EXCERPT_ORIGIN`:
  `curl -sI https://files.alchemicalartisans.com/excerpts/city-council-2026-08-25/surplus-city-vehicles/order.pdf`
  and check the `location` header carries the whole path.
- **A proxy in front of the bucket** — Cloudflare's free plan terminates HTTPS
  and caches, which also cuts egress. It wants the whole zone's nameservers,
  which today are Gandi's.
- **An external HTTPS load balancer**, entirely within Google Cloud, with a
  managed certificate and optionally Cloud CDN. About $18–20 a month for the
  forwarding rule before any traffic.

## Cost

483 MB of standard regional storage is about $0.01 a month. Egress is $0.12/GB
and uncached, so it scales with readers actually opening PDFs; a crawler
walking the whole store costs about six cents. The versioning adds a second
copy of anything replaced, for a year.
