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

Tried on 2026-11-10 and set aside — the links stay on
`https://storage.googleapis.com/haverhill-civics-files/…`, which is what
`EXCERPT_ORIGIN` names.

A plain CNAME to a bucket serves **HTTP only** —
[Google's own documentation](https://cloud.google.com/storage/docs/hosting-static-website-http)
is explicit that CNAME records do not support HTTPS — so the attempt went
through Gandi web forwarding, where the domain already is, rather than a
load balancer or a second DNS provider. It worked once, briefly: an
HTTP-only forward preserved the full path
(`files.alchemicalartisans.com/excerpts/<id>/<name>.pdf` 302'd to the matching
object), which answered the question this section used to leave open. But
Gandi's HTTPS forward took several hours to provision, and recreating the
rule to get there replaced the working one with a flat redirect that drops
the path on every request, HTTP and HTTPS alike, landing on the bucket root
instead of the object -- which is public too, and serves back the bucket's
own XML file listing rather than a 404, so the failure mode is quiet. Gandi's
UI gives no visible way to ask for both HTTPS and a preserved path in one
rule, and chasing that further stopped being worth it against a store that
already works at its direct URL.

If this is revisited, the options are the same three, and the path-dropping
failure is the one to design around rather than discover again:

- **Gandi web forwarding** — free, already the domain's registrar, but as of
  this attempt the HTTPS variant does not preserve the path. Test with a real
  excerpt URL before changing `EXCERPT_ORIGIN`, not a bare domain:
  `curl -sI https://files.alchemicalartisans.com/excerpts/city-council-2026-08-25/surplus-city-vehicles/order.pdf`
  and check the `location` header carries the whole path, not just the bucket.
- **A proxy in front of the bucket** — Cloudflare's free plan terminates HTTPS,
  caches, and is built to pass the path through unmodified. It wants the whole
  zone's nameservers, which today are Gandi's.
- **An external HTTPS load balancer**, entirely within Google Cloud, with a
  managed certificate and optionally Cloud CDN. About $18–20 a month for the
  forwarding rule before any traffic, and no dependency on a registrar's own
  forwarding product doing the right thing with a path.

Moving later is still a one-line change to `EXCERPT_ORIGIN` and a rebuild
either way -- the site is fully prerendered, so there is nothing to migrate
and no stale internal link to chase.

## Cost

483 MB of standard regional storage is about $0.01 a month. Egress is $0.12/GB
and uncached, so it scales with readers actually opening PDFs; a crawler
walking the whole store costs about six cents. The versioning adds a second
copy of anything replaced, for a year.
