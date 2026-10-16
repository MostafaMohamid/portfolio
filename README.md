# Mostafa Mohamed — Portfolio

Personal portfolio site. Static HTML, CSS and vanilla JavaScript. No build step, no dependencies.

## Structure

```
portfolio/
├── index.html        # all page content
├── css/style.css     # all styles and keyframe animations
├── js/main.js        # loader, cursor, particle canvas, scroll reveals, skill bars
├── favicon.svg
├── robots.txt
├── vercel.json       # clean URLs + cache headers for css/js
└── .gitignore
```

## Run locally

Open `index.html` directly in a browser, or serve it:

```bash
python3 -m http.server 3000
# then open http://localhost:3000
```

A server is preferable during development because `index.html` links assets with
absolute paths (`/css/style.css`), which only resolve correctly when served from
the folder root.

## Deploy to Vercel

### Option A — GitHub (recommended)

1. Create a repository and push this folder:
   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/MostafaMohamid/portfolio.git
   git push -u origin main
   ```
2. Go to vercel.com → **Add New → Project** → import the repository.
3. Leave every build setting empty:
   - Framework Preset: **Other**
   - Build Command: *(blank)*
   - Output Directory: *(blank)*
   - Install Command: *(blank)*
4. Click **Deploy**. Every later push to `main` redeploys automatically.

### Option B — Vercel CLI

```bash
npm i -g vercel
cd portfolio
vercel          # preview deployment
vercel --prod   # production deployment
```

## Custom domain

Project → Settings → Domains → add your domain, then point it at Vercel:
an `A` record to `76.76.21.21` for a root domain, or a `CNAME` to
`cname.vercel-dns.com` for a subdomain such as `www`.

## Editing

- Text, jobs, projects → `index.html`
- Colors → the `:root` variables at the top of `css/style.css`
- Skill percentages → the `data-w` attribute on each `.fill` element in `index.html`
- Particle density and link distance → the `resize()` and `draw()` functions in `js/main.js`
