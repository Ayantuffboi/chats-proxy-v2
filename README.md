# Chat's Proxy v2

Xbox-inspired Kode Mono web workspace with editable keyboard shortcuts and a small Node.js diagnostics backend.

## Important limitation
This is **not** a general-purpose web proxy. It does not fetch arbitrary URLs for visitors, conceal destinations, or bypass school/network filtering. The backend only checks two fixed, harmless diagnostic endpoints.

## Files
- `index.html` — UI, tabs/workspace, settings, editable keybinds.
- `server.js` — Node.js web server and fixed-endpoint diagnostics.
- `package.json` — Render start configuration.

## Deploy on Render (Chromebook-friendly)
1. Create a GitHub repository named `chats-proxy-v2`.
2. Upload `index.html`, `server.js`, and `package.json` to the repository root.
3. Commit the files.
4. In Render, choose **New + → Web Service**.
5. Connect the GitHub repository.
6. Set **Runtime** to Node.
7. Set **Build Command** to `npm install`.
8. Set **Start Command** to `npm start`.
9. Choose the free instance if available, then deploy.
10. Open the `onrender.com` URL Render gives you.

No terminal or Chromebook Linux environment is required. The app uses Node's built-in modules and Node's built-in `fetch` (Node 18+).

## Keyboard shortcuts
Open **Settings / Keybinds**, click a shortcut field, then press the desired key combination. It saves in the browser's local storage. Some browser-reserved combinations cannot be intercepted by a webpage.

Defaults:
- New tab: Ctrl+T
- Close active tab: Ctrl+W
- Back: Alt+Left
- Forward: Alt+Right
- Refresh: Ctrl+R
- Focus address: Ctrl+L
- Home: Alt+Home
- Settings: Ctrl+,

## Diagnostics
The Diagnostics page checks `/api/status` and `/api/diagnostics`. The latter checks only `example.com` and `httpbin.org`; edit `TESTS` in `server.js` only for destinations you own or are authorized to test.

## GitHub Pages
This build uses a same-origin `/api` backend, so deploy the whole app to Render as a Web Service. GitHub Pages alone cannot run `server.js`.
