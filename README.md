# FSA Goal Reporter

A touch-friendly, soccer-themed web app to record goals during matches and instantly generate a polished snippet to paste into team chats. Built to run offline as a Progressive Web App (PWA) and easy to host on GitHub Pages.

## Features
- Mobile-first UI with large tap targets and iOS-friendly controls
- Fixed roster picker for scorer and optional assist
- Minute picker (1–50) with automatic `'` suffix
- 3×3 goal diagram: tap a zone (top/middle/bottom × left/center/right)
- Goal attributes (throw-in, breakaway, volley, cross, through pass, etc.)
- Fun narrative that combines zone + attributes
- Single “Generate and Copy” button; multiline, emoji-enhanced output
- Local storage to remember selections during a game + Reset button
- PWA: installable and offline-capable (manifest + service worker)

## Quick Start
- Open `index.html` directly in a browser, or serve locally (see below) for full PWA behavior.
- Select Scorer, optional Assist, and the Minute.
- Tap a zone on the goal diagram.
- Check any relevant attributes.
- Tap “Generate and Copy” and paste the snippet into your chat.

## Example Snippet
```
⚽ FSA GOAL! ⚽

⚽ Scorer: Ben
🤝 Assist: Everett
⏱️ Minute: 23'

📝 Details:
Buries it into the bottom right corner on a breakaway from a through pass. ✨🎯

Let's go FSA!
```

## Roster
To update the team list, edit the `PLAYERS` array in `script.js`.

## Local Development
A service worker requires `https:` or `localhost`. Use any static file server, for example:

- Python: `python3 -m http.server 8000`
- Node (serve): `npx serve -l 8000`

Then open `http://localhost:8000/`.

## Deploy to GitHub Pages
1. Push these files to your repository (root is fine).
2. In GitHub: Settings → Pages → Build and deployment → Source: “Deploy from a branch”.
3. Select your default branch and root (`/`), then save.
4. Visit your Pages URL. The service worker will install and cache assets on first load.

Notes:
- `manifest.webmanifest` and `sw.js` live at the site root and are referenced by `index.html`.
- Icons are lightweight SVGs in `icons/` with a striped pitch background and centered soccer ball.

## Files
- `index.html` – App UI
- `style.css` – Visuals and layout
- `script.js` – Logic, storage, and snippet generation
- `manifest.webmanifest` – PWA metadata
- `sw.js` – Service worker cache
- `icons/` – App icons

## Privacy
This app works offline and does not send data anywhere. All data stays in your browser’s local storage.

