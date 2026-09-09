# narayan-portfolio

Personal CV / portfolio site for Narayan Thakur — Network & Security Engineer.

Plain HTML/CSS/JS, no build step, deploys directly on GitHub Pages with the
custom domain **narayanthakur.in**.

## Structure
```
index.html      → all page content (home, experience, certification, about, connect)
css/style.css    → dark "console rack" theme
js/script.js     → tab switching, mobile nav, deep-linking
CNAME            → tells GitHub Pages to serve this repo on narayanthakur.in
```

## Local preview
Just open `index.html` in a browser — no server or build tools required.

## Before you deploy
- Update the LinkedIn URL: search `index.html` for `https://www.linkedin.com/`
  (two spots — hero button and Connect tab) and replace with your real
  profile URL, e.g. `https://www.linkedin.com/in/your-handle`.
- Double-check the email and phone numbers in the Connect tab.

## Deploy — see the step-by-step guide provided alongside this file for:
1. Pushing this code to GitHub
2. Enabling GitHub Pages
3. Pointing narayanthakur.in at GitHub Pages via DNS
4. Verifying HTTPS
