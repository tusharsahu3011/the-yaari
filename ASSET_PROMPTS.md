# 🎨 The Yaari — Complete Visual Asset Specification & AI Prompt Catalog

This master specification document contains all design rules, prompts, dimensions, color palettes, and lighting setups required to generate consistent, cinema-grade OTT assets for **The Yaari** (inspired by Amazon Prime Video's aesthetic).

---

## 🏛️ 1. Master Design System Rules (Brand Guidelines)

* **Design Aesthetic**: Amazon Prime Video meets High-End Multiplayer Gaming (Glossy, 3D clay/isometric render, dramatic cinematic rim lighting, deep dark obsidian backdrops).
* **Base Theme Colors**:
  - Deep Dark Obsidian: `#030610` / `#050813`
  - Prime Electric Cyan: `#00a8e1` / `#06b6d4`
  - Neon Accent Purple: `#8b5cf6` / `#a855f7`
  - Hot Pink / Rose: `#ec4899` / `#f43f5e`
  - High-Stakes Gold: `#f59e0b` / `#fbbf24`
* **Common Negative Prompt** (for Midjourney / Flux / DALL-E / Imagen):
  ```
  text, watermark, blurry, low resolution, artifacts, distorted hands, noisy background, white background, cluttered, low quality, oversaturated
  ```

---

## 💎 2. Brand Identity Assets

### A. "The Yaari" Official App Icon & Monogram
* **Target File**: `public/assets/brand/the-yaari-icon.png`
* **Format & Aspect Ratio**: `1:1` (1024 × 1024 px PNG)
* **Usage**: Favicon, Apple Touch Icon, Navbar brand logo, App switcher.
* **Prompt**:
  ```
  A premium, glossy 3D app icon for an OTT streaming and multiplayer gaming platform called "The Yaari". Centered icon features a sleek modern gaming controller fusing with a glowing electric-cyan smile curve. Glossy translucent glassmorphism finish, neon magenta-purple and cyan edge rim lighting, deep obsidian dark background (#030610), Apple squircle app icon shape, 8k render, Unreal Engine 5, Octane render, raytracing.
  ```

### B. "The Yaari" Horizontal Brand Wordmark & Banner
* **Target File**: `public/assets/brand/the-yaari-logo.png`
* **Format & Aspect Ratio**: `16:9` or `4:1` (1600 × 400 px)
* **Usage**: Homepage header, emails, sponsor decks.
* **Prompt**:
  ```
  Minimalist, high-end entertainment brand logo wordmark for "the yaari". Modern bold geometric lowercase sans-serif typography in pure white, with an iconic electric-cyan curved smile arc sweeping beneath the letters like Amazon Prime Video. Vibrant subtle purple and cyan ambient glow, luxury dark obsidian background, 3D bevel effect, ultra-clean studio lighting.
  ```

---

## 🃏 3. Flagship Playable Games (3D Billboards & Poster Art)

### Game 1: Bhabhi (Get Away) — Flagship Card Classic
* **Target Files**:
  - `public/assets/home/card-bhabhi.png` (Poster / Hero Backdrop)
  - `public/assets/bhabhi/entry-cards-chips.png` (Lobby 3D prop)
* **Format**: `16:9` (1920 × 1080 px) or `1:1` (1254 × 1254 px)
* **Dominant Color**: Royal Hot Pink (`#ec4899`) & Emerald Gold (`#10b981`)
* **Prompt**:
  ```
  Cinematic 3D render of a high-stakes South Asian royal card game "Bhabhi Get Away". In the center, a floating fan of four glossy playing cards highlighting the Ace of Spades (A♠) and King of Hearts, topped with an ornate glowing golden royal crown. Stacks of frosted purple and gold casino chips, velvety deep emerald green and dark obsidian poker felt table below. Dramatic cinematic volumetric rim lighting with hot pink and neon gold particle effects, moody dark atmosphere, Octane 3D render, 8k resolution.
  ```

### Game 2: Undercover — Social Deduction Hit
* **Target File**: `public/assets/home/card-undercover.png`
* **Format**: `16:9` (1920 × 1080 px) or `1:1` (1254 × 1254 px)
* **Dominant Color**: Neon Purple (`#a855f7`) & Deep Indigo (`#1e1b4b`)
* **Prompt**:
  ```
  Atmospheric 3D cinematic scene of a modern party deduction game "Undercover". A stylized mysterious silhouette detective wearing a fedora and trench coat holding a glowing neon purple magnifying glass. A floating confidential top-secret Manila dossier stamped with red "CLASSIFIED" and a glowing digital fingerprint hologram. Rainy neon cyberpunk city street reflections in the background, moody noir atmosphere, intense purple and cyan rim lights, Octane 3D render, Unreal Engine 5 render.
  ```

### Game 3: Spyfall — Secret Location Interrogation
* **Target File**: `public/assets/home/card-spyfall.png`
* **Format**: `16:9` (1920 × 1080 px) or `1:1` (1254 × 1254 px)
* **Dominant Color**: Warm Amber Gold (`#f59e0b`) & Charcoal Black
* **Prompt**:
  ```
  Cinematic 3D spy thriller scene for "Spyfall". An open metallic espionage briefcase on a dark marble table, revealing a high-tech glowing radar locator screen, satellite coordinates hologram, passport, and a miniature surveillance microphone. Dramatic warm amber and golden tungsten spotlight casting sharp shadows, dark espionage agency headquarters, cinematic haze and dust particles, 8k resolution, raytracing.
  ```

---

## 🚀 4. Pipeline Games (Upcoming Release Posters)

### 1. Teen Patti Flush (Card Classic)
* **Target File**: `public/assets/home/icon-teenpatti.png`
* **Prompt**:
  ```
  Luxury 3D illustration of Teen Patti Indian card game. Three glowing gold-trimmed cards showing a Pure Sequence Trio, surrounded by scattered gold coins, shimmering rubies, and ornate Indian royal palace motifs. Deep velvet green felt, warm royal gold ambient lighting, festive luxury celebration, Octane 3D render.
  ```

### 2. Decrypto (Code Transmission)
* **Target File**: `public/assets/home/icon-decrypto.png`
* **Prompt**:
  ```
  Vintage 1980s retro-futuristic spy encryption room. A bulky mechanical tape recorder with spinning reels, an amber CRT computer terminal displaying secret 3-digit numerical codes, glowing vacuum tubes, and an audio waveform visualizer. Neon teal and cyan ambient glow, dark room, 3D isometric render, photorealistic.
  ```

### 3. Codenames (Word Association)
* **Target File**: `public/assets/home/icon-codenames.png`
* **Prompt**:
  ```
  3D spy table layout showing a grid of 25 miniature beige word cards. Two stylized agent figurines—one in red trench coat and sunglasses, one in blue trench coat—standing on opposite sides. In the center, a mysterious black assassin card glowing with subtle red danger light. Mahogany desk, moody overhead desk lamp, cinematic, 8k.
  ```

### 4. Avalon: Secret Identities (Arthurian Legend)
* **Target File**: `public/assets/home/icon-avalon.png`
* **Prompt**:
  ```
  Epic fantasy 3D artwork of King Arthur's Holy Grail and Excalibur sword embedded into an ancient stone altar. Surrounding the altar are two glowing knight shields—one lion crest glowing pure gold, one red dragon crest glowing ominous crimson. Stormy Camelot fortress backdrop with lightning, cinematic fantasy art, Octane render.
  ```

### 5. Secret Chancellor (Political Deduction)
* **Target File**: `public/assets/home/icon-chancellor.png`
* **Prompt**:
  ```
  Dramatic 1930s European parliament legislative hall. A heavy wooden voting podium with a brass ballot box, stamped red and blue policy cards scattered across, and a gleaming golden chancellor eagle seal badge. Deep shadows, authoritarian noir lighting, dusty beam of sunlight piercing through tall marble columns, 3D render.
  ```

### 6. Ultimate Werewolf (Village Deduction)
* **Target File**: `public/assets/home/icon-werewolf.png`
* **Prompt**:
  ```
  Eerie 3D stylized gothic night scene. A full glowing silver moon over a sleepy medieval village with timbered cottages. In the foreground, glowing amber werewolf eyes peeking through misty pine trees alongside an ancient wooden gallows and lantern. Dark midnight blue and cold moonlight atmosphere, mystical fog, 8k render.
  ```

### 7. Two Rooms and a Boom (Party Hostage Swap)
* **Target File**: `public/assets/home/icon-tworooms.png`
* **Prompt**:
  ```
  Split-screen 3D concept render of two adjoining bunker rooms. Left room bathed in emergency blue light showing a presidential seal; right room bathed in pulsating red alarm light showing a retro digital countdown briefcase bomb. A heavy metallic vault doorway between them swinging open, high action, cinematic octane render.
  ```

### 8. Wavelength (Telepathic Spectrum)
* **Target File**: `public/assets/home/icon-wavelength.png`
* **Prompt**:
  ```
  Whimsical retro-futuristic 3D psychic dial device. A giant circular analog rainbow gauge with a rotating pointer dial, radiating holographic telepathic brainwaves and pastel sparkles. Vintage 1970s cream and brass plastic aesthetic, soft diffused studio light, dreamy colorful aesthetic, 8k render.
  ```

---

## 📺 5. Ad Banner Placeholder Specifications

| Slot ID | Standard Size | Aspect Ratio | Location |
| :--- | :--- | :--- | :--- |
| `home-hero-leaderboard` | `728 × 90 px` | ~8:1 | Directly below Home Hero Billboard |
| `home-midfeed-sponsor` | `970 × 250 px` | ~4:1 | Between Content Rows 2 and 3 |
| `catalog-infeed-sponsor` | `728 × 90 px` | ~8:1 | Bottom of All Games Catalog Page |
| `bhabhi-entry-leaderboard` | `728 × 90 px` | ~8:1 | Bottom of Bhabhi Game Lobby Page |

---

## 🛠️ 6. How to Generate Assets

Aap in prompts ko kisi bhi AI image tool mein direct paste kar sakte hain:
1. **Antigravity Image Generator**: Chat mein bolna `"Generate image for [game name]"` aur yeh model automatically high-res image create kar ke `public/assets/` mein save kar dega!
2. **Midjourney v6**: Prompt ke aage `--ar 16:9 --style raw --v 6.1` add karein.
3. **DALL-E 3 / ChatGPT Plus**: Prompt direct paste karein aur "wide landscape format" specify karein.
4. **Flux 1.1 Pro**: Seed + negative prompt ke sath generate karein.

