# SpotJar website

Static, bilingual website for [spotjar.app](https://spotjar.app). Plain HTML, CSS and vanilla JavaScript, with no build step, framework, analytics or external runtime requests.

The design follows the Flutter app's light palette and shapes in `app-spotjar/lib/ui/core/themes/`: cream `#F6F1E8`, cards `#FFFCF7`, charcoal `#2B2421`, petrol `#247E76` and orange `#F4772E`. Fredoka and Inter are self-hosted. The landing pages work with JavaScript disabled; JavaScript only handles language preference and first-visit detection.

## Structure

```text
index.html                  English landing page
de/index.html               German landing page
policy/ and imprint/        English legal pages
de/datenschutz/             German privacy policy
de/impressum/               German imprint
de/konto-loeschen/          German account deletion instructions
delete-account/            English account deletion instructions
t/ and j/                   Shared-trip and group-invite app links
css/base.css                Shared app palette, typography, header and footer
css/landing.css             Responsive landing-page layout
css/policy.css              Legal and app-link pages
js/lang.js                  Language detection and remembered language choice
img/illustrations/          Optimized artwork copied from the app
img/                        Screenshots, logos, markers and app icons
fonts/                      Local variable WOFF2 fonts and licenses
images/badges/              App Store and Google Play badges
.github/workflows/pages.yml GitHub Pages deployment
```

## Run locally

```sh
python3 -m http.server 8000
```

Open <http://localhost:8000/de/> or <http://localhost:8000/>. The layout adapts to phone, tablet and desktop widths and respects reduced-motion preferences.

## Artwork

The illustrations come from `../app-spotjar/assets/images/illustrations/`. PNGs are optimized as transparent WebP images; the jar and map markers use the app's SVG originals.

| Website asset | App source |
| --- | --- |
| `spotjar-full.svg` | `jar/SpotJar_Jar_Complete_Full_Open.svg` |
| `save-a-spot.webp` | `onbaording_spotToJar.png` |
| `plan-a-trip.webp` | `onbaording_jarToTrip.png` |
| `pack-your-bag.webp` | `onbaording_packaging.png` |

The four `img/marker-*.svg` files come from `../app-spotjar/assets/images/marker/` (`marker_open.svg`, `marker_viewed.svg`, `marker_mustSee.svg`, and `marker_favorite.svg`).

Keep exported web artwork in `img/` so the existing deployment includes it. Source PNGs remain in the app. Screenshots have WebP sources and JPEG fallbacks in `img/`; update both language versions when replacing them.

The three landing-page screenshots come from `../Marketing/Mocks/v1.1.3/`, exported at 560 × 1216 pixels in both formats:

| Website asset (WebP and JPEG) | Marketing source |
| --- | --- |
| `app-spot-list` | `2.png` — populated spot list |
| `app-trip-route` | `6.png` — Kyoto trip map |
| `app-trip-days` | `5.png` — Kyoto day plan |

## Deploying

The existing GitHub Actions workflow deploys pushes to `main` to GitHub Pages. It copies the static files without a build step. This repository uses the custom domain `spotjar.app`; preserve `CNAME`, `.well-known/` and the `t/` and `j/` app-link pages.

English pages live at the root and German pages under `de/`. Keep both versions in sync, including language-switch links and `hreflang` metadata. Asset and navigation paths are relative so the site can also be previewed under a repository subpath.
