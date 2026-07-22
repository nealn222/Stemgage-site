# STEMgage Site

## Setup

1. Install [Node.js](https://nodejs.org/) if you don't already have it.
2. Open this folder in a terminal (or in VS Code, then open a terminal there).
3. Install dependencies:
   ```
   npm install
   ```
4. Start the local dev server:
   ```
   npm run dev
   ```
5. Open the URL it prints (usually `http://localhost:5173`) in your browser. The page will hot-reload as you edit code.

## Editing

- All the page content, components, and styling live in `src/App.jsx` — this is the same code from your Claude artifact.
- Text, colors, events, and team members are defined near the top of the file in plain JS arrays/objects (`challenges`, `events`, `team`) — edit those directly to update content.
- Styling is a single CSS string near the bottom of the file (the `styles` variable) — no Tailwind or external CSS framework needed.

## Building for deployment

```
npm run build
```
This outputs a `dist/` folder with static files you can upload to any static host (Netlify, Vercel, GitHub Pages, etc.).
