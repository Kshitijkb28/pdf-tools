# Kshitij Bhardwaj — Portfolio

A 3D, animated portfolio site for [Kshitij Bhardwaj](https://kshitijkb28.github.io) — Full Stack Engineer.

Inspired by [nikolaradeski.com](https://nikolaradeski.com). Built with React + Three.js + Framer Motion.

---

## Stack

- **React 19** + **TypeScript** (Vite 8)
- **Three.js** + **@react-three/fiber** + **@react-three/drei** — interactive 3D hero scene
- **Framer Motion** — reveal animations, magnetic buttons, 3D card tilt, scroll-driven transforms
- **Lenis** — buttery smooth scroll
- **Tailwind CSS 3** — utility styling, design tokens
- **Fontshare** — Clash Display (display) + General Sans (body)
- **lucide-react** — icon set (plus custom brand SVGs in `src/components/BrandIcons.tsx`)

## Features

- Distorted 3D sphere + torus knot + ambient floating spheres that react to cursor
- Custom blended cursor (difference mode) with magnetic button attraction
- Word-by-word reveal animations on headings
- Scroll-driven section transitions, vertical timeline fill, infinite marquee
- 3D-tilt skill cards with cursor spotlight
- Live click-to-copy email, working contact form (mailto fallback)
- Fully responsive (mobile hamburger menu, clamped typography)
- Respects `prefers-reduced-motion`

---

## Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (http://localhost:5173)
npm run dev

# 3. Production build
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## Deploy to GitHub Pages

This is configured as a **user page** (root repo `kshitijkb28.github.io`, serves at the root domain).

### First-time setup

1. Create the repo on GitHub: **`kshitijkb28/kshitijkb28.github.io`** (must be public for free Pages).
2. Link this folder to the repo:
   ```bash
   git init
   git remote add origin https://github.com/kshitijkb28/kshitijkb28.github.io.git
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git push -u origin main
   ```
3. In GitHub → repo **Settings** → **Pages** → set **Source** to **Deploy from a branch** → **Branch: `gh-pages`** → **Folder: `/ (root)`** → Save.

### Deploy (one command)

```bash
npm run deploy
```

This runs `npm run build` automatically, then pushes `dist/` to the `gh-pages` branch. Your site updates at **https://kshitijkb28.github.io** within 1–2 minutes.

---

## Editing content

All resume content lives in a single typed file: [`src/data/resume.ts`](src/data/resume.ts). Edit it to update the site — every component re-renders from this source.

The original LaTeX resume ships as `/resume.tex` (linked by the "Download CV" + "Resume" buttons).

> **Want to serve a PDF instead?** Compile `main.tex` locally (`pdflatex main.tex`) or via [Overleaf](https://overleaf.com), drop the output into `public/resume.pdf`, then change the two `href="/resume.tex"` references in `src/components/Navbar.tsx` and `src/components/Hero.tsx` to `href="/resume.pdf"`.

---

## Project structure

```
portfolio/
├── public/
│   ├── favicon.svg          # 'K' monogram
│   └── resume.tex           # Downloadable CV (LaTeX source)
├── src/
│   ├── components/          # UI (Hero, Scene3D, Projects, Contact, ...)
│   ├── data/resume.ts       # All resume content (single source of truth)
│   ├── hooks/               # useLenis, useMousePosition
│   ├── App.tsx              # Composition + global smooth-scroll
│   ├── index.css            # Tailwind + design tokens + cursor styles
│   └── main.tsx             # Entry
├── index.html               # Fontshare preconnect + meta tags
├── tailwind.config.js       # Design tokens (colors, fonts, radii, keyframes)
├── vite.config.ts           # base: '/', build target es2020
└── package.json             # homepage + deploy scripts
```

## Performance notes

- The 3D scene is lazy-loaded via `React.lazy` — initial bundle stays small (~120 kB gzip).
- `Scene3D` chunk is ~254 kB gzip (Three.js + drei are heavy, loaded only when Hero mounts).
- WebGL `preserveDrawingBuffer: true` is enabled so screenshotting tools can capture the scene.
- All motion is disabled when the user has `prefers-reduced-motion: reduce` set.

---

Built with care. ✦
