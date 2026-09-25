# SpotJar website

Static site for [spotjar.app](https://spotjar.app): a landing page with a scroll-driven story and
the privacy policy and imprint. Plain HTML, CSS and vanilla JS: no framework, no build step, no npm, and no
requests to other domains at runtime.

## Structure

```
index.html            Landing page
policy/index.html     Privacy policy
imprint/index.html    Imprint (Impressum)
css/base.css          Fonts, design tokens, reset, header/footer/buttons (shared)
css/landing.css       Landing page only: hero, pinned scene, floating jar, steps
css/policy.css        Policy page only
js/scroll-scene.js    Maps scroll position to scene state (classes + custom properties)
img/                  Web-ready images (logo, jar icon, screenshots, app icons)
fonts/                Fredoka + Inter as Latin-subset variable woff2 (+ source TTFs, OFL licences)
images/               Source images (not deployed); raw app screenshots in images/mocks/
favicon.ico, apple-touch-icon.png, robots.txt, sitemap.xml, CNAME, .nojekyll
.github/workflows/pages.yml   Deploys to GitHub Pages on push to main
```

## How the scene works

`#how` is a 420vh section with a sticky, viewport-high stage inside. `js/scroll-scene.js`
computes the progress `p` (0–1) through that section and derives everything from it, and
from nothing else:

| p | classes on `#how` | caption |
|---|---|---|
| 0–0.20 | `s-empty` until the first letter; `--chars` on `.typed` types the name | Find it in Maps |
| 0.20–0.40 | `s-found`: pin drops, place card slides in | Found a spot worth keeping? |
| 0.40–0.50 | `s-press`: Share button pressed | Tap Share |
| 0.50–0.84 | `s-sheet`: share sheet up; from 0.64 also `s-pick` | Tap Share → Pick SpotJar |
| 0.84–1 | `s-saved`: toast "In your jar" | It's in your jar |

The floating `.jar` shows from `p ≥ 0.40`, fills to level 1 at `p ≥ 0.84`, then one level per
`.sj-step` whose top is above 55% of the viewport, and fades out once the steps section is
scrolled past. All movement is CSS transitions. Without JS the page is a plain long read.

## Replacing screenshots

Screenshots are shown at max 280px wide, so export them at **560 × 1218** (the ratio of an iPhone screenshot), without
a device frame. Put a WebP and a JPEG fallback in `img/` under the same name:

```sh
cwebp -q 80 -resize 560 0 raw.png -o img/app-new-spot.webp
sips -s format jpeg -s formatOptions 80 -Z 1218 raw.png --out img/app-new-spot.jpg
```

Keep each file under 250 KB. Steps 1 and 3 still use placeholders (`.shot--todo`); swap each
one for the same `<picture>` markup the other steps use, and write a real `alt` text.

Current sources in `images/mocks/`: `spotList.png` (step 2, until there is a "create spot"
screen with note and categories), `tripDetails.png` (step 4), `tripMap.png` (step 5).

## Run locally

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>. To check the no-JS fallback, disable JavaScript in the dev
tools. To check that nothing loads from other domains, watch the Network tab.

## Deploying

In the repository settings under **Pages**, set the source to **GitHub Actions**. Every push to
`main` then deploys through `.github/workflows/pages.yml`, which just copies the files.

Custom domain: `CNAME` contains `spotjar.app`. With Actions deployments GitHub reads the
domain from the Pages settings, not from the file, so enter it there too, point DNS at GitHub
Pages, and turn on **Enforce HTTPS** (the policy says the site is only served over HTTPS).

All paths are relative, so the site also works under `user.github.io/repo/`. Only `canonical`,
`og:url`, `og:image`, `robots.txt` and `sitemap.xml` name the domain.
