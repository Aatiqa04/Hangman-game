# Play Store Listing — Hangman

## App identity
- **App name:** Hangman
- **Package ID:** `com.yourname.hangman`  ← change to your real reverse-domain ID before publishing
- **Default language:** English (United States)

## Short description (≤ 80 characters)
> Modern Hangman with 4 modes, 6 categories, and beautiful animations.

## Full description (≤ 4000 characters)
> Guess the word before time runs out — and before the figure is fully drawn.
>
> **Hangman** is a beautifully redesigned take on the timeless word-guessing puzzle. With smooth animations, satisfying sound effects, and four game modes that ramp from cozy to nail-biting, it's a game you'll come back to every day.
>
> **Game modes**
> • **Campaign** — climb 10+ levels of escalating difficulty, with three lives that carry over.
> • **Classic** — pick a category and difficulty for a single, focused puzzle.
> • **Time Attack** — solve as fast as you can; bonuses for finishing with seconds to spare.
> • **Categories** — stay in one theme while difficulty ramps every two levels.
>
> **Features**
> • Six categories: Animals, Countries, Movies, Science, Food, Sports.
> • Four difficulty levels: Easy, Medium, Hard, Expert — fewer lives the harder you go.
> • Hint system, streak bonuses, score tracking with personal bests.
> • Animated stick figure that swings, slumps when you lose, and **dances when you win**.
> • Confetti celebrations on every correct letter.
> • Synth sound effects (mute toggle in-game).
> • Works offline — no account, no ads, no tracking.
>
> Whether you're warming up over morning coffee or chasing a perfect streak, Hangman is a polished little brain-tickler in your pocket.

## Category
- **Type:** Game
- **Category:** Word

## Content rating (recommended path through the IARC questionnaire)
- Violence: depicts a stick figure on a gallows. Choose: **Mild — implied/cartoon violence**.
  This will likely return **PEGI 7 / ESRB Everyone 10+** depending on region.
- No: drugs, gambling, profanity, user-generated content, ads, in-app purchases, location.

## Data safety form
- **Data collected:** None.
- **Data shared:** None.
- **Encryption in transit:** Not applicable (no data leaves the device).
- **Data deletion:** Uninstall the app.

## Required graphics (already generated in `store-assets/`)
- ✅ Icon 512×512 — `icon-512.png`
- ✅ Feature graphic 1024×500 — `feature-1024x500.png`
- ⏳ Phone screenshots (need 2–8) — capture on device after first run, 1080×1920 or larger.
  Suggested shots:
    1. Main menu with stats panel
    2. Mid-game with the figure partially drawn and a guessed word
    3. The dance animation on a win
    4. Time Attack with the timer ticking
    5. Category selection chips
- (Optional) Tablet screenshots — 7-inch and 10-inch.

## Privacy policy
- ✅ Draft at `store-assets/PRIVACY_POLICY.md`. **You must host this on a public URL** (GitHub Pages or any free static host) and paste the link into the Play Console listing.

## Target API level
- ✅ targetSdkVersion 36 (set in `android/variables.gradle`) — meets Play's 2026 requirement.

---

# Build & sign the AAB

```bash
# 1. Make sure the web build is up to date
npm run build

# 2. Sync to native Android
npx cap sync

# 3. Open in Android Studio (creates .aab via Build > Generate Signed Bundle/APK)
npx cap open android
```

In Android Studio:

1. **Build > Generate Signed Bundle / APK > Android App Bundle**
2. Create a new keystore (save the .jks file outside the repo) — you must keep this file forever; without it you cannot ship updates.
3. Choose **release**, then build.
4. Upload the resulting `app-release.aab` to Play Console.

# Pre-launch checklist

- [ ] Replaced `com.yourname.hangman` with your real package ID in `capacitor.config.json`, `android/app/build.gradle`, and `android/app/src/main/res/values/strings.xml`.
- [ ] Bumped `versionCode` and `versionName` in `android/app/build.gradle` for each release.
- [ ] Hosted privacy policy at a stable URL.
- [ ] Tested on at least one real Android device (or emulator) with the back button, mute toggle, hint, and full game loop.
- [ ] Decided on a content rating route (the hanging imagery means most likely Everyone 10+ / PEGI 7).
- [ ] Created Google Play Developer account ($25 one-time fee).
