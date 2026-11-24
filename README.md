# saigon-2050 — prototype

A 13-page reading of the HCMC master plan — three daily-life questions, five places, one rendering and four tools. The persistent `Trang đầu · Mục lục · Tra cứu điểm` nav and `/muc-luc/` index were added after the manual UI/UX audit:

| Type | Route | Answer |
|---|---|---|
| question | `/` | Đi làm sẽ nhanh hơn không? — Có, nhưng theo lịch (4 investment periods) |
| question | `/ngap/` | Đường tôi có còn ngập không? — Có quy hoạch, nhưng không có lịch |
| question | `/cay-xanh/` | Sẽ có thêm công viên gần nhà không? — Có, nhưng bản vẽ chỉ quyết ở cấp vùng |
| place | `/thu-duc/` | Cực đổi mới sáng tạo — đô thị tri thức mở |
| place | `/ben-thanh/` | Lõi trung tâm — nút đo khoảng cách của mô hình đa cực |
| place | `/can-gio/` | Khu dự trữ sinh quyển — lớp giữ, không phải lớp mở |
| place | `/tan-son-nhat/` | Sân bay ở lại — vùng có thêm Long Thành |
| place | `/vung-tau/` | Cực cảng biển của thành phố mở rộng |
| rendering | `/my-khanh/` | Góc nhìn TOD đảo Mỹ Khánh — mở mặt tiền đô thị ra sông |
| tool | `/chu-giai/` | 32 swatches (sheet 15) + stroke grammar (07, 12, 18) |
| tool | `/tra-cuu/` | Click map → land class (15) + nearest road ≤1 km (07) + both drainage sheets (12, 13) |
| tool | `/can-chinh/` | Click sheet 15 + enter a coordinate → affine fit and residuals |
| tool | `/ban-do/` | Leaflet + OSM, five schematic markers, labelled ước lệ |
| index | `/muc-luc/` | 13 trang, nhóm theo câu hỏi / địa điểm / góc nhìn / công cụ |

Static Astro site, no framework JS (Leaflet 1.9.4, vendored, only on the map pages;
a small inline plate-zoom wrapper in the layout). Vietnamese-first, phone-first. All pages
share `src/layouts/Base.astro`, which now carries the persistent
`Trang đầu · Mục lục · Tra cứu điểm` nav, a skip link, and a shared `Đọc tiếp` block generated
from `src/data/site.ts`. The time strip adapts to the source's own vocabulary — years on the
commute page, unnamed rounds on the drainage page — and is left out where the source has no
staging at all (green space, places).

## Run

```bash
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static output in dist/
pnpm preview
```

## Deploy a controlled preview

This is a static Astro build. For a small, invited audience:

1. Build with the public URL and, optionally, a feedback inbox:

   ```bash
   cd web
   SITE_URL=https://your-preview.pages.dev \
   PUBLIC_FEEDBACK_EMAIL=you@example.com \
   pnpm build
   ```

   `SITE_URL` enables canonical and Open Graph URLs. Without it those tags are omitted
   rather than pointing at localhost. Without `PUBLIC_FEEDBACK_EMAIL`, the footer asks
   reviewers to reply to the message that carried the link.

2. Publish `web/dist` at the root of a domain or subdomain. All asset and navigation links
   are root-absolute; do not deploy under a project subpath (for example
   `user.github.io/repo/`) without adding an Astro `base`.

3. The build is preview-gated: `Base.astro` emits `noindex,nofollow`,
   `public/robots.txt` disallows crawlers, and `public/_headers` adds
   `X-Robots-Tag: noindex, nofollow`. Keep all three until the drawing set is cleared for
   public release. Put Cloudflare Access (or another auth gate) in front if the URL is not
   secret.

4. `public/_headers` sets long-lived caching for `/calib`, `/plates`, `/fonts`, `/vendor`
   and `/_astro` on Cloudflare Pages/Netlify. `404.html` is generated; the host must serve
   it for unknown paths.

5. The sampler now loads 4,800 px copies (`/calib/*-4800.webp`) only after a point is
   chosen, or when a shared `?lat=&lon=` link is opened. The 8,000 px sheet 15 remains for
   `/can-chinh/`; sheets 07, 12 and 13 are served only as 4,800 px copies. The full sheet 15
   is still reachable under `/calib/`; if the pre-stamp drawings are not cleared for
   publication, gate or remove it.

Cloudflare Pages settings: root directory `web`, build command `pnpm build`, output
directory `dist`, Node 20 or newer (the local build used Node 26).

## GitHub Pages

This repository deploys `main` with [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
to **https://gowwre.github.io/saigon-2050/**.

- The workflow sets `SITE_URL=https://gowwre.github.io/saigon-2050/` and
  `BASE_PATH=/saigon-2050`, then runs `pnpm build:pages`.
- `build:pages` runs Astro and then `scripts/base-path.mjs`, which prefixes the
  root-absolute links, CSS font URLs and inline script paths for the project subpath. A
  plain `pnpm build` remains root-relative for local preview.
- Pages source: **GitHub Actions** (Settings → Pages). The workflow requests the required
  `pages: write` and `id-token: write` permissions.
- The site is still `noindex,nofollow` with a disallow-all `robots.txt`. Remove those
  preview gates before treating the Pages URL as a public launch.

## What is real, what is provisional

- **Evidence:** the plate is cropped at native 300 dpi from sheet **08** of the
  drawing set (`08_DH-GT-DT-DS-HK_TTP.pdf`), specifically the *Sơ đồ phân kỳ đầu tư*
  inset — the four investment periods 2026–2030, 2030–2035, 2035–2045, after 2045.
- **Verified against the drawing:** the four periods and their colours; 18 metro
  lines and 14 LRT lines in the legend; the existence of a separate "after 2045" bucket.
- **Interpretation (not yet source-verified at place level):** the framing that a
  reader's commute changes according to which phase their line falls into; "5–10 years"
  for the 2026–2035 groups.
- **Correction during the content pass:** an earlier draft claimed most of the network
  was scheduled after 2035. Pixel analysis of the phase diagram puts roughly 57% of the
  MRT line length in 2026–2035, so that claim was removed, not softened.
- **Address fallback:** the old disabled address form was a fake door; it is now a CTA
  pointing at `/tra-cuu/`. Place-level address lookup still needs a geocoder and the
  georeferencing work, so the site does not pretend to accept an address.
- **Legend chips:** the colour chips under each frame use RGB values sampled from the
  drawing's own legend, so the text and the plate can be decoded against each other.

## Tried and rejected

Per-frame maps (cumulative phase footprints extracted by colour) were built and then
removed. Three reasons: the source's network diagram is portrait, so at 300 px it reads
as a pale vertical smear; the derived views look authoritative while being an
interpretation; and the phase colours may include base layers (the red bucket draws one
long corridor, not an urban network), which makes a per-phase map risky to caption
honestly. The single full plate plus legend chips does the same job without the claim.

## The third question: green space

`/cay-xanh/` answers "will there be a park near me?" with a refusal that is still an
answer: **the land-use sheet decides green at regional scale, not at park scale.**

- Measured on the calibrated raster: in a 7 km window around the centre, park/forest/
  agricultural fills cover **2.7%** of the drawing. Tao Đàn, 23/9 and Thảo Cầm Viên are not
  drawn as parks — they sit inside the red "khu trung tâm thành phố" polygon. Verified by
  sampling their coordinates directly, not by eye.
- So the page shows two derived plates: the whole-sheet green mask, and a side-by-side
  "drawing / green-only" pair at the centre. Both are captioned as *trích màu* (colour
  extraction), not as official maps.
- The conclusion is honest rather than flattering: if you live on the belt you gain green;
  if you live in the existing core, the master plan promises no specific park — that is a
  phân khu 1/2000 question.

## Sheet registration (measured)

All 26 sheets share one A0 frame (14042×9933 px) but only some share the *map* frame.
Phase correlation of gradient images over a 4×4 tile grid (2400 px working width) says:

| Sheet | Offset vs 15 | Reading |
|---|---|---|
| 06 | 0, 0 | same frame; also nearly the same drawing (4.8% of gradient pixels differ) |
| 07 | 0, −2 | same frame |
| 12 | −3, −2 | same frame |
| 13 | +1, −1 | same frame |
| 08 | 0, +216 | same scale, map block shifted; different composition |
| 18, 19, 22 | n/a | perspective renders, no map frame |

Consequence: one calibration (sheet 15) covers 06/07/12/13 to within ~0.4 km, which is
inside the sampler's error. The transform, the four GCP residuals and the 32-entry legend
palette now live in **`src/data/plan.json`**; `/tra-cuu/` reads them from there.

## Design system (v0.1)

| Token | Value |
|---|---|
| paper | `#F7F3EA` |
| ink | `#16130F` |
| mute | `#6E655A` |
| rule | `#DCD3C4` |
| wash | `#EDE6D8` |
| seal | `#B03A2E` — status and stamp only |

- Type: Be Vietnam Pro (self-hosted WOFF2, latin + vietnamese subsets); answer
  `clamp(34px, 7vw, 54px)`, body 17/26, captions 12–13 px, mono for dates.
- Certainty is a **line grammar**, not a colour: solid = decided/built,
  dashed = planned, faded = vision.
- Hairlines only; radius 0; no shadows, no dark mode, no icons for abstract ideas.
- Signature component: the four-stop **time strip** at the top of every answer.

## Files

```
src/pages/index.astro      the page (content + markup)
src/pages/muc-luc.astro    the 13-page index (grouped navigation)
src/components/            AddressCta, ReadNext
src/data/site.ts           the page index: sections, labels, blurbs
src/styles/global.css      tokens, type, strip, plate, nav, lookup, footer
public/fonts/              Be Vietnam Pro subsets + OFL license
public/plates/phan-ky.webp the evidence plate (cropped from sheet 08 at 300 dpi)
public/calib/              8,000 px sheet 15 + 4,800 px sampler copies
public/og.jpg              1,200×630 link-preview image
public/robots.txt          preview-only crawler block
public/_headers            cache and basic security headers for static hosts
public/vendor/leaflet/     vendored Leaflet 1.9.4 + BSD license
screenshots/               commute-*, flooding-*, question-green-*, place-*, lookup-*, calibration-tool.png
screenshots/ux-test/       before/after UI/UX evidence from the manual review
screenshots/deploy-check/  final lookup result after the deployment fixes
src/data/plan.json         calibration (fx/fy, residuals), sheet registration, 32-entry legend palette
../tools/                  numpy scripts behind the registration and green-space numbers
```

## What the second page taught us

The pattern generalises, and the strip survives — but only because it changes vocabulary.
The commute page's strip is dated (2030 / 2050 / 2075); the drainage drawing has no years
at all, only "hiện trạng / quy hoạch đợt đầu / quy hoạch dài hạn". Forcing the same dates
onto flooding would have been the first lie on the site. A shared component with
per-source labels is the right abstraction, and it is now the strongest editorial move we
have: **the page tells you what kind of schedule exists, if any.**

## The place template

`/thu-duc/` is the first of five curated places. The template:

1. kicker (`ĐỊA ĐIỂM · 01`) + place name;
2. one sentence stating the plan's role for the place, quoting the drawing's own words;
3. two short frames — *in the model*, *in the perspective* — each backed by a plate;
4. "Điều này nghĩa gì với bạn";
5. **"Điều bản vẽ không quyết định"** — no parcel boundaries, heights or densities, with a
   pointer to phân khu 1/2000. This block is mandatory on every place page.

Deliberately absent: a land-use category for the place. Reading the colour at a point is
honest only once the sheet is georeferenced and the legend palette is sampled; until then
it would be a guess dressed as data.

All five places are done: Thủ Đức, Bến Thành, Cần Giờ, Tân Sơn Nhất and **Vũng Tàu**. The
calibration unblocked the airport (10.8188, 106.6520 — the crop lands on it every time, which
is why that page can make a claim instead of a guess). Vũng Tàu needed no coordinate work at
all: it is not a *place* in the old city, it is one of the five poles, and the drawing puts it
inside the planning boundary.

The Vũng Tàu page also carries the fact that reframes the whole dossier: sheet 01's
`ranh giới và phạm vi lập quy hoạch` (red outline) encloses TP.HCM **plus Bình Dương plus
Bà Rịa – Vũng Tàu**, with Côn Đảo in an inset — the post-merger city. Every "regional"
statement on this site is a statement about that city, not about the pre-2025 boundary.

## State GIS: tested, not usable from outside

The city's planning GIS (`gisxaydung.tphcm.gov.vn`, ArcGIS JS 4.34) was the preferred
geometry source. It is not consumable by a third-party site:

- `Access-Control-Allow-Origin` is pinned to `https://gisxaydung.tphcm.gov.vn`;
- the REST endpoints (`api-gisxaydung.tphcm.gov.vn/arcm/rest/...`) answer most requests
  with `200` and a **zero-byte body** (SPA fallback / WAF), and `arcgis/rest/services`
  returns 404;
- `data.hochiminhcity.gov.vn` is a DNN portal with no public API endpoint.

So `/ban-do/` uses OpenStreetMap tiles and **hand-placed markers at known place
coordinates**, not the plan's geometry. It is explicitly labelled "ước lệ" and says what
it does not show. If API access is ever granted, this page is the shell the state layers
would plug into.

## The transit readout on `/tra-cuu/`

A click now returns two answers: the land-use class at the point (sheet 15) and the nearest
drawn road class within 1 km (sheet 07). Sheet 07 is on the same map frame, offset
`p07 = p15 + (6.7, 0) px` at 8000 px — verified by local NCC at four landmarks, not assumed.

What it reports and what it cannot:

- three colours only: green = đường cao tốc, vành đai; red = quốc lộ; magenta = đường tỉnh
  **and** đường cấp đô thị — the drawing's own legend uses one magenta for both, which is a
  defect in the legend, not a choice we made;
- the red centre line of an expressway is the same red as a quốc lộ, so a red hit within
  5 px of the green casing is merged into "cao tốc, vành đai";
- **hiện trạng cải tạo (solid) vs quy hoạch xây mới (dashed) is not read.** That distinction
  is carried by line style, not colour, so the page shows the crop and says so — the reader
  looks at the dashes.

## The legend decoder

`/chu-giai/` exists because the site kept quoting legends one page at a time. It renders the
32 land-use swatches **from `src/data/plan.json`** (so the decoder and the sampler can never
drift apart), the three road types with their hex values, and a full-resolution crop of sheet
12's three-column legend — the clearest object in the set for the grammar the site keeps
insisting on: **colour = what, stroke = when.**

It also records the two legend defects found while building the sampler: sheet 07 uses one
magenta for both *đường tỉnh* and *đường cấp đô thị*, and an expressway's red centre line is
the same red as a quốc lộ.

## Reading a rendering

`/my-khanh/` is the first page on the site that reads a **perspective** (sheet 22's
`TOD ven sông – đảo Mỹ Khánh` tile) rather than a map. The template is the same, with two
substitutions:

- the "what it shows" frame becomes directional — *the drawing says this land turns to face
  the river, not away from it* — because a rendering has no areas, no heights, no phases;
- the mandatory "Điều bản vẽ không quyết định" block carries more weight than on any other
  page: a perspective can be right in orientation and wrong in proportion, and there is
  nothing in the dossier to check it against yet.

The plate keeps the drawing's own bilingual title in frame, so the claim ("opening the city
to the river") is visibly the author's, not the site's.

## Sheet 18 settles the green question

The third question used to rest on a negative finding (sheet 15 does not draw neighbourhood
parks). Sheet 18 states the definition instead:

> *Xác định không gian xanh của đô thị bao gồm hành lang xanh, vành đai xanh, nêm xanh, công
> viên hoặc rừng tự nhiên, nhân tạo trong đô thị.*

followed by the typology: ecological corridors along rivers and canals; public, sports and
thematic parks; nature reserves, forest, arboreta; rural village green; agricultural green;
buffer and infrastructure green. It is a **network** definition — corridor, belt, wedge — and
the legend draws `hành lang xanh` as a band with arrows at both ends: a connection, not a
place. That is why a "green corridor" through your ward does not become a park in your ward,
and it is the honest answer the page now gives instead of only a refusal.

Two new plates: sheet 18's green-water structure map on `/cay-xanh/`, and sheet 18's word
legend on `/chu-giai/` — the one legend in the set that names landscape types instead of
assigning colours to land categories.

## Why the drainage sheets are shown, not read

Sheets 12 and 13 are on the same frame (verified: 12 at +6/+10 px, 13 at +2/−4 px) and are
now registered and displayed at the clicked point in `/tra-cuu/`. They are deliberately
**not interpreted**:

- their legends are three-column — *hiện trạng*, *QH đợt đầu*, *QH dài hạn* — and the
  columns differ by **stroke style** (solid vs dashed, double line vs dashed), not by fill
  colour, so a colour sample cannot say which phase a channel belongs to;
- the sheets are line-and-symbol diagrams: the hiện trạng pipes are drawn in black, and black
  is also every label and boundary on the sheet, so "nearest black line" is meaningless;
- water fills are indistinguishable from the sea and the rivers at this scale.

What the page does instead: draws the same 4.3 km window from both sheets, states which is
which, and points at the legend on `/ngap/`. The reading is left to the reader, which is the
same call made for the road dashes — and for the same reason.

## Tried and rejected: reading the dash pattern

The one thing the transit readout refuses to do is tell *hiện trạng cải tạo* (solid) from
*quy hoạch xây mới* (dashed). It was attempted, three ways, on sheet 07 at 8000 px
(35 m/px, stroke width 2–3 px):

1. **Connected components** in a 7 km window: solid lines merge at junctions, so component
   size tracks network density rather than stroke pattern (a visibly solid magenta network
   reported 56 components).
2. **Run length along the best of 12 directions** from the nearest pixel: integer sampling
   drifts off a 2-px line after ~20 px — solid lines gave runs of 21–26 px, dashed 7–21 px,
   overlapping.
3. **Duty cycle along the local PCA direction** with ±1 px tolerance: 0.05–1.00 for lines
   that are plainly solid, because webp-over-JPEG antialiasing plus a slightly wrong angle
   loses the stroke.

The signal is there for a human eye, not for a threshold. What shipped instead: the road
crop is zoomed **4.3×** so the dash pattern is legible in the page, the caption says which
stroke means what, and the readout keeps to colour.

## Rejected: a park-distance statistic

Before writing `/cay-xanh/` I tried to publish a real number — median share of planned green
within 500 m of 18 named points — and dropped it. The colour classifier is not reliable
enough at that scale: inner-city parks are drawn *inside* other polygons, so the mask
under-counts them (it reported 0% at Tân Phú and 10% at Bến Thành, where the actual drawing
shows a few green slivers along the river); pale fills wash toward the pink/olive legend
swatches, so hits and misses trade places with a threshold change. The per-place table
survived several rounds of fixing and still produced numbers I would not defend. What
remains is the structural reading, which is visible at a glance and does not depend on a
threshold.

## Calibration flow (to unlock place lookup)

`/can-chinh/` shows sheet 15 at 8000 px with Leaflet. For each landmark: zoom, click the
exact point, type the Google Maps coordinate (right-click → copy). Four points are enough
to solve and check. The page solves two independent least-squares fits
(`x = a·lon + b·lat + c`, `y = d·lon + e·lat + f`) and prints residuals plus a JSON blob.

**Calibrated** with 4 GCPs: mean residual 3.6 px, max 7.2 px (≈ 125 m). The resulting
`fx`/`fy` are the missing transform. With them, a sampler can map any
lat/lon to sheet pixels, crop around it, and read the legend colour at the point — no
state API required.

## Queue — closed

The three items this README carried are done, and two of them ended in a refusal rather than
a feature. Recording them as such:

1. **Dash pattern (solid vs dashed).** Attempted twice — 8000 px and native 14042 px. Native
   resolution separates the extremes (component span 0.97–1.00 for solid, 0.02–0.12 for
   dashed) but ~40% of samples fall between 0.2 and 0.8 where a dashed segment merges with a
   junction. Not shipped. The sampler shows a **10× crop** centred on the matched line and
   says the distinction is carried by the stroke; the reader makes the call.
2. **Mỹ Khánh / the TOD renderings.** Delivered as `/my-khanh/`, the first page that reads a
   perspective (sheet 22) instead of a map. See "Reading a rendering" above.
3. **Sheet 18's word legend.** Delivered in two places: the definition ("bao gồm hành lang
   xanh, vành đai xanh, nêm xanh, công viên hoặc rừng tự nhiên, nhân tạo trong đô thị") and
   the `hành lang xanh` arrow symbol now sit on `/cay-xanh/`, and the full legend crop sits on
   `/chu-giai/`. See "Sheet 18 settles the green question" above.

## Next

Nothing on the site is waiting on a decision. What is left is enhancement, in rough order of
value per hour:

1. **Per-district cut of the merge.** Sheet 01's boundary makes Bình Dương and Bà Rịa – Vũng
   Tàu part of the city; the site says so on `/vung-tau/` and nowhere else. A page that cuts
   the historic core, the Bình Dương belt and the coastal strip by what the plan promises each
   would be the first comparative page.
2. **Sheet 18 layers in the sampler.** The green/water sheet is the only one whose legend is a
   typology rather than a palette; extending `/tra-cuu/` to it would let a click answer "is this
   a corridor, a belt, or a patch" — the question `/cay-xanh/` can only answer city-wide.
3. **A full legend page per sheet.** `/chu-giai/` covers three sheets; the set has 26, and the
   ones that matter (05, 17, 21) have legends nobody has read yet.
