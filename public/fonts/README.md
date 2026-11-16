# Fonts

Self-hosted [Montserrat](https://github.com/JulietaUla/Montserrat) (SIL Open Font License 1.1),
subset to Latin so the site does not depend on Google Fonts:

- `montserrat-latin-var.woff2` — upright, variable weight 400–800 (Basic Latin + Latin-1 + common punctuation)
- `montserrat-latin-800-italic.woff2` — ExtraBold Italic, Basic Latin only (the "Eddie." wordmark and hero name)

They are declared in `src/index.css` and preloaded in `index.html`.

To regenerate (e.g. to add characters), take the Latin variable files from the
`@fontsource-variable/montserrat` npm package and subset them with fonttools:

```bash
fonttools varLib.instancer montserrat-latin-wght-normal.woff2 wght=400:800 -o normal.ttf
pyftsubset normal.ttf --unicodes="U+0020-007E,U+00A0-00FF,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026" \
  --layout-features='*' --flavor=woff2 --output-file=montserrat-latin-var.woff2

fonttools varLib.instancer montserrat-latin-wght-italic.woff2 wght=800 -o italic.ttf
pyftsubset italic.ttf --unicodes="U+0020-007E,U+2019" --layout-features='kern,liga' \
  --flavor=woff2 --output-file=montserrat-latin-800-italic.woff2
```
