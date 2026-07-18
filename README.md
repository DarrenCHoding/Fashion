# MONO — A Study in Monochrome

A luxury fashion brand website built with pure **HTML, CSS and JavaScript** — no frameworks, no build step. Inspired by the editorial minimalism of maisons like Jacquemus, Balenciaga and Brunello Cucinelli.

All photography is served from **Shutterstock** preview URLs as demonstration/dummy imagery.

## Highlights

- **Editorial hero** — full-bleed campaign image with masked line-reveal typography and scroll parallax
- **Shop experience** — 8-product collection grid with category filters, hover actions, quick-view modal with size selector, and a slide-in cart drawer persisted in `localStorage`
- **Campaign & lookbook** — grayscale-to-color hover treatments, drag-to-scroll lookbook strip
- **Atelier story** — dark craft section with facts and parallax imagery
- **Details** — preloader, custom blend-mode cursor, marquee ticker, hide-on-scroll header, mobile full-screen menu, toast notifications, newsletter validation
- **Accessible & responsive** — semantic landmarks, ARIA states, keyboard escape handling, `prefers-reduced-motion` support, breakpoints down to small phones

## Structure

```
index.html      — single-page site (hero, collection, campaign, lookbook, atelier, newsletter, footer)
css/style.css   — design tokens, layout, components, motion
js/main.js      — cart, quick view, filters, reveals, parallax, drag scroll
```

## Run it

Open `index.html` in a browser, or serve locally:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Design system

| Token | Value |
| --- | --- |
| Ink | `#0a0a0a` |
| Paper | `#f4f2ee` |
| Display type | Cormorant Garamond |
| UI type | Archivo |

Imagery is intentionally treated in greyscale-first with colour revealed on interaction — the brand idea: *“Colour asks for attention. Form earns it.”*
