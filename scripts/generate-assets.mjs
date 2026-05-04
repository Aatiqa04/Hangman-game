// Generates Play Store and Android launcher assets from SVG sources.
// Run: node scripts/generate-assets.mjs
//
// Outputs:
//   store-assets/icon-512.png        — Play Store listing (512×512, no transparency)
//   store-assets/feature-1024x500.png — Play Store feature graphic
//   store-assets/icon-1024.png       — high-res master
//   android/app/src/main/res/mipmap-*/ic_launcher.png + ic_launcher_round.png
//   android/app/src/main/res/mipmap-*/ic_launcher_foreground.png + background xml
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out  = join(root, 'store-assets');
const androidRes = join(root, 'android', 'app', 'src', 'main', 'res');

const PURPLE = '#7c5cff';
const PURPLE_DEEP = '#3a1d8a';
const CYAN = '#22d3ee';
const BG_DARK = '#0b0d18';
const BG_MID  = '#1c1f3b';

// --- Icon SVG (square; safe-zone aware so adaptive masks don't clip) -----
const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="35%" cy="30%" r="80%">
      <stop offset="0%"  stop-color="${PURPLE}"/>
      <stop offset="60%" stop-color="${PURPLE_DEEP}"/>
      <stop offset="100%" stop-color="${BG_DARK}"/>
    </radialGradient>
    <linearGradient id="gallows" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#c4b5fd"/>
      <stop offset="100%" stop-color="${PURPLE}"/>
    </linearGradient>
    <radialGradient id="moon" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef3c7" stop-opacity="0.95"/>
      <stop offset="100%" stop-color="${CYAN}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" fill="url(#bg)"/>

  <!-- Moon glow -->
  <circle cx="380" cy="140" r="90" fill="url(#moon)"/>

  <!-- Stars -->
  <circle cx="100" cy="120" r="3" fill="#fff" opacity="0.9"/>
  <circle cx="160" cy="80"  r="2" fill="#fff" opacity="0.7"/>
  <circle cx="430" cy="290" r="2.5" fill="#fff" opacity="0.8"/>
  <circle cx="80"  cy="240" r="2" fill="#fff" opacity="0.6"/>

  <!-- Gallows (centered, kept inside 80% safe zone for adaptive icon) -->
  <line x1="120" y1="430" x2="392" y2="430" stroke="url(#gallows)" stroke-width="14" stroke-linecap="round"/>
  <line x1="170" y1="430" x2="170" y2="120" stroke="url(#gallows)" stroke-width="14" stroke-linecap="round"/>
  <line x1="170" y1="120" x2="320" y2="120" stroke="url(#gallows)" stroke-width="14" stroke-linecap="round"/>
  <line x1="320" y1="120" x2="320" y2="170" stroke="#d6c8ff" stroke-width="8" stroke-linecap="round"/>

  <!-- Stick figure (no rope — friendlier app icon) -->
  <circle cx="320" cy="210" r="36" fill="rgba(255,255,255,0.06)" stroke="#fff" stroke-width="9"/>
  <!-- happy face -->
  <circle cx="307" cy="204" r="4" fill="#fff"/>
  <circle cx="333" cy="204" r="4" fill="#fff"/>
  <path d="M 302 220 Q 320 234 338 220" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
  <!-- torso -->
  <line x1="320" y1="246" x2="320" y2="340" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
  <!-- arms raised in V -->
  <line x1="320" y1="270" x2="280" y2="232" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
  <line x1="320" y1="270" x2="360" y2="232" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
  <!-- legs -->
  <line x1="320" y1="340" x2="290" y2="395" stroke="#fff" stroke-width="9" stroke-linecap="round"/>
  <line x1="320" y1="340" x2="350" y2="395" stroke="#fff" stroke-width="9" stroke-linecap="round"/>

  <!-- Letters dangling -->
  <text x="100" y="320" font-family="Inter, system-ui, sans-serif" font-size="40" font-weight="800" fill="#c4b5fd" opacity="0.85">A</text>
  <text x="60"  y="380" font-family="Inter, system-ui, sans-serif" font-size="32" font-weight="800" fill="#22d3ee" opacity="0.7">_</text>
  <text x="140" y="180" font-family="Inter, system-ui, sans-serif" font-size="34" font-weight="800" fill="#fbbf24" opacity="0.8">?</text>
</svg>
`;

// Adaptive icon foreground: same drawing but transparent background and inset
// (Android crops to 66% safe zone — we keep all art within it).
const adaptiveForegroundSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="432" height="432" viewBox="0 0 432 432">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#c4b5fd"/>
      <stop offset="100%" stop-color="${PURPLE}"/>
    </linearGradient>
  </defs>
  <!-- inside safe zone (108..324 px) -->
  <g transform="translate(108, 108) scale(0.4218)">
    <line x1="40" y1="430" x2="392" y2="430" stroke="url(#g)" stroke-width="22" stroke-linecap="round"/>
    <line x1="100" y1="430" x2="100" y2="60" stroke="url(#g)" stroke-width="22" stroke-linecap="round"/>
    <line x1="100" y1="60"  x2="320" y2="60" stroke="url(#g)" stroke-width="22" stroke-linecap="round"/>
    <line x1="320" y1="60"  x2="320" y2="120" stroke="#d6c8ff" stroke-width="14" stroke-linecap="round"/>

    <circle cx="320" cy="170" r="50" fill="none" stroke="#fff" stroke-width="14"/>
    <circle cx="303" cy="162" r="6" fill="#fff"/>
    <circle cx="337" cy="162" r="6" fill="#fff"/>
    <path d="M 296 184 Q 320 204 344 184" stroke="#fff" stroke-width="8" fill="none" stroke-linecap="round"/>
    <line x1="320" y1="220" x2="320" y2="340" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
    <line x1="320" y1="248" x2="270" y2="200" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
    <line x1="320" y1="248" x2="370" y2="200" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
    <line x1="320" y1="340" x2="288" y2="400" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
    <line x1="320" y1="340" x2="352" y2="400" stroke="#fff" stroke-width="14" stroke-linecap="round"/>
  </g>
</svg>
`;

// --- Feature graphic (1024x500, no transparency) -------------------------
const featureSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="500" viewBox="0 0 1024 500">
  <defs>
    <radialGradient id="bg" cx="30%" cy="40%" r="85%">
      <stop offset="0%"  stop-color="${PURPLE}" stop-opacity="0.55"/>
      <stop offset="60%" stop-color="${BG_MID}"/>
      <stop offset="100%" stop-color="${BG_DARK}"/>
    </radialGradient>
    <linearGradient id="title" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"  stop-color="#fff"/>
      <stop offset="50%" stop-color="#c4b5fd"/>
      <stop offset="100%" stop-color="${CYAN}"/>
    </linearGradient>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"  stop-color="#c4b5fd"/>
      <stop offset="100%" stop-color="${PURPLE}"/>
    </linearGradient>
  </defs>

  <rect width="1024" height="500" fill="url(#bg)"/>

  <!-- Stars -->
  <g fill="#fff" opacity="0.7">
    <circle cx="60"  cy="60"  r="2"/>
    <circle cx="140" cy="120" r="1.5"/>
    <circle cx="280" cy="40"  r="2"/>
    <circle cx="420" cy="80"  r="1.5"/>
    <circle cx="900" cy="60"  r="2"/>
    <circle cx="980" cy="160" r="1.5"/>
    <circle cx="700" cy="40"  r="2"/>
    <circle cx="80"  cy="380" r="2"/>
    <circle cx="200" cy="430" r="1.5"/>
    <circle cx="950" cy="420" r="2"/>
  </g>

  <!-- Hangman scene on the right -->
  <g transform="translate(700, 70)">
    <line x1="0"   y1="380" x2="280" y2="380" stroke="url(#g)" stroke-width="10" stroke-linecap="round"/>
    <line x1="50"  y1="380" x2="50"  y2="20"  stroke="url(#g)" stroke-width="10" stroke-linecap="round"/>
    <line x1="50"  y1="20"  x2="200" y2="20"  stroke="url(#g)" stroke-width="10" stroke-linecap="round"/>
    <line x1="200" y1="20"  x2="200" y2="60"  stroke="#d6c8ff" stroke-width="6" stroke-linecap="round"/>
    <circle cx="200" cy="100" r="28" fill="rgba(255,255,255,0.05)" stroke="#fff" stroke-width="7"/>
    <circle cx="190" cy="94" r="3" fill="#fff"/>
    <circle cx="210" cy="94" r="3" fill="#fff"/>
    <path d="M 188 110 Q 200 122 212 110" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <line x1="200" y1="128" x2="200" y2="220" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <line x1="200" y1="150" x2="170" y2="115" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <line x1="200" y1="150" x2="230" y2="115" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <line x1="200" y1="220" x2="175" y2="280" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
    <line x1="200" y1="220" x2="225" y2="280" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
  </g>

  <!-- Title and tagline on the left -->
  <text x="60" y="200" font-family="Inter, system-ui, sans-serif" font-size="110" font-weight="800" fill="url(#title)" letter-spacing="6">HANGMAN</text>
  <text x="64" y="260" font-family="Inter, system-ui, sans-serif" font-size="26" font-weight="500" fill="#c4b5fd" opacity="0.9">Guess the word before time runs out.</text>
  <text x="64" y="320" font-family="Inter, system-ui, sans-serif" font-size="20" font-weight="600" fill="#22d3ee" opacity="0.85">4 modes · 6 categories · 4 difficulties</text>

  <!-- Word strip placeholder -->
  <g transform="translate(60, 360)">
    ${['G', 'U', 'E', 'S', 'S'].map((ch, i) => `
      <g transform="translate(${i * 60}, 0)">
        <rect width="50" height="60" rx="8" fill="rgba(124, 92, 255, 0.18)" stroke="${PURPLE}" stroke-width="2"/>
        <text x="25" y="44" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="32" font-weight="800" fill="#fff">${ch}</text>
      </g>
    `).join('')}
  </g>
</svg>
`;

async function ensureDir(p) { await mkdir(p, { recursive: true }); }
async function writePng(svg, w, h, dest) {
  const buf = await sharp(Buffer.from(svg)).resize(w, h).png().toBuffer();
  await writeFile(dest, buf);
  console.log(`  wrote ${dest} (${w}×${h})`);
}

async function main() {
  await ensureDir(out);

  // Play Store listing assets
  console.log('Generating Play Store assets…');
  await writePng(iconSvg(512), 512, 512, join(out, 'icon-512.png'));
  await writePng(iconSvg(1024), 1024, 1024, join(out, 'icon-1024.png'));
  await writePng(featureSvg, 1024, 500, join(out, 'feature-1024x500.png'));

  // Adaptive icon foreground (transparent) — drop into mipmap-anydpi-v26
  console.log('Generating adaptive icon foregrounds…');
  const fgSizes = {
    'mipmap-mdpi':    108,
    'mipmap-hdpi':    162,
    'mipmap-xhdpi':   216,
    'mipmap-xxhdpi':  324,
    'mipmap-xxxhdpi': 432,
  };
  for (const [folder, size] of Object.entries(fgSizes)) {
    const dir = join(androidRes, folder);
    await ensureDir(dir);
    await writePng(adaptiveForegroundSvg, size, size, join(dir, 'ic_launcher_foreground.png'));
  }

  // Legacy launcher icons (the regular ic_launcher.png that older devices use)
  const legacySizes = {
    'mipmap-mdpi':    48,
    'mipmap-hdpi':    72,
    'mipmap-xhdpi':   96,
    'mipmap-xxhdpi':  144,
    'mipmap-xxxhdpi': 192,
  };
  for (const [folder, size] of Object.entries(legacySizes)) {
    const dir = join(androidRes, folder);
    await ensureDir(dir);
    await writePng(iconSvg(size), size, size, join(dir, 'ic_launcher.png'));
    await writePng(iconSvg(size), size, size, join(dir, 'ic_launcher_round.png'));
  }

  // Adaptive-icon XML and background color
  await ensureDir(join(androidRes, 'mipmap-anydpi-v26'));
  await writeFile(
    join(androidRes, 'mipmap-anydpi-v26', 'ic_launcher.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`,
  );
  await writeFile(
    join(androidRes, 'mipmap-anydpi-v26', 'ic_launcher_round.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`,
  );
  await ensureDir(join(androidRes, 'values'));
  await writeFile(
    join(androidRes, 'values', 'ic_launcher_background.xml'),
    `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#1c1f3b</color>
</resources>
`,
  );

  console.log('\nDone. See store-assets/ for Play Store uploads.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
