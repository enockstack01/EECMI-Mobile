# EECMI Mobile

Mobile app for **Ecclessia Eden Commission Ministries International** (EECMI), Kampala, Uganda.
Built with Expo (SDK 57) and Expo Router. Sign-in is required; content and forms use the same
backend as the website (Express + MongoDB, Clerk auth).

## Screens

| Tab | Route | What it does |
| --- | --- | --- |
| Home | `src/app/(tabs)/index.tsx` | Hero, scripture, vision/mission, program preview, values, CTA |
| Devotions | `src/app/(tabs)/devotions.tsx` | Published devotion materials; `devotion/[id]` reads text / plays audio / opens PDF, with "save for offline" and "save to account" |
| News | `src/app/(tabs)/news.tsx` | News & updates from `/api/news` (static fallback); `news/[id]` for detail |
| Get Involved | `src/app/(tabs)/involved.tsx` | Volunteer, Partner, Prayer forms → live API |
| Account | `src/app/(tabs)/account.tsx` | Profile (phone / location / interests / notify), activity feed, saved devotions, sign out |

Other routes: `(auth)/sign-in` · `(auth)/sign-up` · `notifications` · `programs` · `contact` ·
`program/[id]` · `about` · `resources`.

- **Auth** — `src/app/_layout.tsx` wraps the tree in `<ClerkProvider>` (secure-store token cache
  from `@clerk/clerk-expo/token-cache`) and `Stack.Protected` gates the app vs the `(auth)` group.
- **Platform content** — `src/hooks/use-site-content.ts` reads `GET /api/content` (admin-managed
  from the website's admin panel) and falls back to `src/constants/content.ts`.
- **Notifications** — `src/hooks/use-notifications.ts` polls the unread count on app foreground;
  the header bell shows a badge.
- API client: `src/lib/api.ts` (+ `src/hooks/use-api.ts` for token-bound calls).

## Get started

```bash
npm install
cp .env.example .env          # EXPO_PUBLIC_API_URL + EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
npx expo start
```

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
npx expo export --platform web
```

## Building an installable app (EAS)

EAS is already configured (`eas.json`, project `fdfa43b9-2b09-4418-bc31-104c7d06ca29`,
owner `enockstack`). The `EXPO_PUBLIC_*` values are baked into each build profile in `eas.json`.

```bash
npm i -g eas-cli          # one time
eas login                 # sign in as enockstack

# Android — produces a downloadable .apk you can install directly
eas build --platform android --profile preview

# iOS — simulator build (no Apple account needed); for a device build you need an
# Apple Developer account and to register the device UDID, then drop --profile preview
# for `--profile production` or configure an ad-hoc profile.
eas build --platform ios --profile preview
```

Each build finishes with a page on `expo.dev` that has the install link / QR (Android APK is
directly downloadable; iOS needs TestFlight or an ad-hoc profile). Ship JS-only updates later
with `eas update --branch preview`.

### Before the first production build

- Swap the Clerk **test** key for a production key in `eas.json` (and `.env`) — the current
  `pk_test_...` instance is fine for the preview build and testing.
- Set `CLOUDINARY_URL` on the backend (Render) so admin devotion file uploads work; until then
  admins can paste external file URLs.
