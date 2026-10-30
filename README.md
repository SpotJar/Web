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

The optimized WebP illustrations come from `../app-spotjar/assets/images/illustrations/`:

| Website asset | App source |
| --- | --- |
| `spotjar-full.webp` | `jar/SpotJar_full_open.png` |
| `save-a-spot.webp` | `onbaording_spotToJar.png` |
| `plan-a-trip.webp` | `onbaording_jarToTrip.png` |
| `pack-your-bag.webp` | `onbaording_packaging.png` |

Keep exported web artwork in `img/` so the existing deployment includes it. Source PNGs remain in the app. Screenshots have WebP sources and JPEG fallbacks in `img/`; update both language versions when replacing them.

## Deploying

The existing GitHub Actions workflow deploys pushes to `main` to GitHub Pages. It copies the static files without a build step. This repository uses the custom domain `spotjar.app`; preserve `CNAME`, `.well-known/` and the `t/` and `j/` app-link pages.

English pages live at the root and German pages under `de/`. Keep both versions in sync, including language-switch links and `hreflang` metadata. Asset and navigation paths are relative so the site can also be previewed under a repository subpath.
