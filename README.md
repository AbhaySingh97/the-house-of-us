# The House of Us 🗝️
### A First-Person Romantic 3D Browser Adventure

*The House of Us* is a complete, polished, playable first-person 3D browser game. The player receives a heartfelt invitation to explore a connected, atmospheric mansion prepared specifically for them. As they walk through corridors and open hinged doors, they discover personal letters, solve tactile puzzles, rekindle forgotten memories, and unlock the final romantic sanctuary.

---

## 🌟 Key Features

- **Physically Connected 3D House**: One continuous, seamless architectural layout containing 5 interconnected rooms and connecting corridors:
  1. **Entrance Hall**: Starting vestibule with welcome letter, antique mirror, coat rack, and hidden brass key.
  2. **The Memory Room**: Cozy salon with a crackling stone fireplace, writing desk, memory frames, and velvet keepsake box.
  3. **The Secret Library**: Tall mahogany bookcases, reading armchair, scholar's desk, and secret combination drawer.
  4. **The Conservatory of Seasons**: Indoor glass greenhouse with a tiered stone water fountain, blooming rose shrubs, and 4 romantic pedestal lanterns.
  5. **The Sanctuary of Us**: Grand marble rotunda bathed in soft starlight, candlelit pillars, thousands of red rose petals, and the Celestial Keepsake Chest.
- **Buttery Smooth First-Person Exploration**:
  - **Desktop**: WASD movement with smooth acceleration/damping, mouse pointer lock, and `[E]` key interaction.
  - **Mobile**: Responsive virtual on-screen joystick, drag-to-look touch surface, and dedicated touch `[Interact]` button.
  - Wall sliding collision physics and door clearance that prevent clipping.
- **Interactive Story & Physical Hinged Doors**:
  - Reusable 3D doors that smoothly swing on edge hinge pivots.
  - Locked progression requiring specific discovered keys or puzzle solutions.
- **Tactile Romantic Puzzles**:
  - **Chapter II (Keepsakes)**: Place three symbolic items (*Hourglass*, *Rose Quartz*, *Music Box*) into the velvet slots in the order hinted by the love letter.
  - **Chapter III (Combination Lock)**: Turn three brass tumblers to the chapters revealed in the library books (`7 - 2 - 4`).
  - **Chapter IV (Garden Lanterns)**: Kindle four glass lanterns in the natural rhythm of the day (*Dawn* → *Meadow* → *Twilight* → *Starlight*).
  - **Chapter V (Celestial Riddle)**: Touch the three pillars of love (*Memories* → *Growth* → *Forever*) to open the chest.
- **Procedural Romantic Audio (Web Audio API)**:
  - 100% self-contained synthesizer: gentle rain on glass, warm romantic ambient piano chords, door creaks, footsteps, chimes, and harp fanfares. Zero external audio file dependencies or broken 404s.
- **Personalized Climax**:
  - Celebratory rose petal / confetti shower.
  - Heartfelt customizable love letter with recipient and sender names.
  - Interactive final question with personalized touching responses.

---

## 🛠️ Tech Stack

- **React 19**
- **Vite 8**
- **Three.js**
- **@react-three/fiber**
- **@react-three/drei**
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React**
- **Canvas Confetti**
- **Web Audio API**

---

## 🚀 Quick Start

### 1. Installation
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Creates an optimized static bundle in the `dist/` directory ready for deployment to any web host (Vercel, Netlify, GitHub Pages, etc.).

### 4. Local Production Preview
```bash
npm run preview
```
Serves the compiled `dist/` folder locally at [http://localhost:4173](http://localhost:4173) to preview the real production build before pushing live.

---

## 🎮 Controls

### Desktop
| Action | Key / Control |
| :--- | :--- |
| **Move** | `W`, `A`, `S`, `D` or Arrow Keys |
| **Look Around** | Mouse (Click canvas to enable Pointer Lock) |
| **Interact / Inspect** | `E` key when prompted |
| **Sprint** | Hold `Shift` |
| **Pause / Settings** | `Escape` key |

### Mobile & Tablets
| Action | Touch Gesture |
| :--- | :--- |
| **Walk** | Drag left on-screen virtual joystick thumbpad |
| **Sprint** | Push joystick to outer rim (>85%) or tap **[Sprint ON]** toggle |
| **Look Around** | Drag anywhere on the right half of the screen |
| **Interact / Inspect** | Tap the large glowing bottom-right **[Interact]** button (or tap prompt directly) |
| **Pause / Settings** | Tap the top-right gold **[Pause]** button |

#### 📱 Mobile Engine Optimizations:
- **Independent Multi-Touch Pointer Tracking**: Movement joystick and look camera use isolated `pointerId` capture (`setPointerCapture`) so two thumbs never cross-interfere or cause camera jumping.
- **Accidental Scroll & Gesture Protection**: `overscroll-behavior: none` and `touch-action: none` completely eliminate pull-to-refresh, address-bar bouncing, and accidental page scrolling.
- **Dynamic Viewport Height (`100dvh`)**: Perfectly locks the scene to the screen whether browser address bars are expanded or collapsed.
- **Responsive Modals (`modal-scrollable`)**: All puzzle dialogs, letters, and menus feature contained vertical scrolling (`touch-action: pan-y`) and work seamlessly in both portrait and landscape orientation.
- **High-DPI Performance Throttling**: R3F `<Canvas>` DPR is capped to 1.75 (`dpr={[1, Math.min(window.devicePixelRatio, 1.75)]}`), saving 50%+ GPU fill-rate on 3x/4x Retina and OLED phone screens for smooth 60fps.
- **Tactile Haptic Feedback**: Tapping interact triggers gentle haptic pulses on supported mobile devices (`navigator.vibrate`).

---

## 💌 Personalizing The Game

All narrative content, letters, names, memories, and the final reveal are centralized in one single configuration file:

👉 `src/config/gameConfig.ts`

You can customize:
- `names.recipientName`: The name of the person you love (e.g. `"Sophia"`, `"Alex"`).
- `names.senderName`: Your name or sign-off (e.g. `"Ethan"`, `"Yours, Always"`).
- `narrative.welcomeNote`: The initial note found on the console table.
- `narrative.letters`: The romantic letters for each chapter.
- `narrative.finalSurprise`: The text of the final letter, closing, question prompt, and interactive response feedback.
- `puzzles.*.hint`: Hints given if the player gets stuck.

> **Note**: Modifying `src/config/gameConfig.ts` does **not** require touching 3D math, shaders, or room coordinates. Simply edit the strings and rebuild with `npm run build`.

---

## 🌐 Static Web Hosting & Deployment Guide

*The House of Us* compiles into a 100% self-contained static site inside the `dist/` folder. All assets use relative paths (`base: './'`), so the game works out-of-the-box on root domains, subdirectories, or CDNs.

### Option 1: Vercel (Recommended — Zero Config)
1. Push this repository to GitHub/GitLab.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select this repository.
4. Framework Preset will auto-detect **Vite**.
5. Build command: `npm run build`
6. Output directory: `dist`
7. Click **Deploy**. Your game will be live with free global CDN and HTTPS!

Alternatively, deploy directly using the Vercel CLI:
```bash
npm i -g vercel
vercel
```

---

### Option 2: Netlify
#### Via Drag & Drop (Instant):
1. Run `npm run build` locally.
2. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
3. Drag and drop the `dist/` folder directly into your browser.
4. Your game goes live immediately with a shareable URL.

#### Via Netlify CLI:
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

---

### Option 3: GitHub Pages
Because `vite.config.ts` uses `base: './'`, deploying to GitHub Pages requires no URL tweaking.

#### Automated Deployment with GitHub Actions:
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### Manual Deployment with `gh-pages`:
```bash
npm install -D gh-pages
npx gh-pages -d dist
```

---

### Option 4: Cloudflare Pages
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and navigate to **Workers & Pages**.
2. Click **Create Application** > **Pages** > **Connect to Git**.
3. Set **Build command**: `npm run build`
4. Set **Build output directory**: `dist`
5. Click **Save and Deploy**.

---

### Option 5: Self-Hosting with Nginx
Copy the contents of `dist/` to `/var/www/the-house-of-us`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/the-house-of-us;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache immutable static assets
    location ~* \.(?:css|js|woff2?|svg|png|jpg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

---

## 🧩 Story Walkthrough & Puzzle Solutions

1. **Entrance Hall**:
   - Inspect the welcome note on the console table.
   - Pick up the **Ornate Brass Key** beside the dried lavender.
   - Walk down Corridor 1 and press `E` to unlock and open Door 1.
2. **The Memory Room**:
   - Read the Chapter I letter on the desk.
   - Inspect the Velvet Keepsake Box. Place the three items in sequence:
     1. *Antique Brass Hourglass* (Time)
     2. *Raw Rose Quartz* (Feeling)
     3. *Enamelled Music Box* (Melody)
   - Take the **Silver Heart Key** and unlock Door 2 on the east wall.
3. **The Secret Library**:
   - Read the Chapter II letter and examine the stacked volumes:
     - Volume I (The First Glance): Chapter 7
     - Volume II (The Second Chance): Chapter 2
     - Volume III (Four Seasons): Chapter 4
   - Inspect the 3-dial lock on the desk. Turn the dials to `7 - 2 - 4`.
   - Take the **Verdant Conservatory Key** and unlock Door 3 on the north wall.
4. **The Conservatory of Seasons**:
   - Read the Chapter III letter on the garden stone bench.
   - Touch the 4 lanterns surrounding the fountain in order of the sky:
     1. *Dawn* (South - Amber)
     2. *Meadow* (East - Green)
     3. *Twilight* (North - Purple)
     4. *Starlight* (West - Rose Gold)
   - The Grand Double Doors to the Sanctuary will automatically unlock and swing open.
5. **The Sanctuary of Us**:
   - Walk down the rose petal corridor into the sunlit marble rotunda.
   - Inspect the Celestial Keepsake Chest. Touch the three pillars:
     1. *MEMORIES* (The Foundation)
     2. *GROWTH* (The Journey)
     3. *FOREVER* (The Promise)
   - Enjoy the celebratory shower and read the personalized final surprise message!

---

## 🧪 Automated Test Verification

Run all test suites locally:
```bash
# Test 1: Complete 16-step gameplay route & puzzle unlock state machine
npx tsx test-gameplay.mjs

# Test 2: Mobile touch pointer events, joystick math & responsive layouts
npx tsx test-mobile-suite.mjs

# Test 3: Personalized message configuration and static dist bundle integrity
npx tsx test-personalization.mjs
```
All three test suites are verified passing at 100%.
