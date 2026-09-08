# EECMI Mobile

Mobile app for **Ecclessia Eden Commission Ministries International** (EECMI), Kampala, Uganda.
Built with Expo (SDK 57) and Expo Router. It mirrors the core content of the EECMI website and
submits forms to the same backend (Express + MongoDB).

## Core screens

| Tab | Route | What it does |
| --- | --- | --- |
| Home | `src/app/(tabs)/index.tsx` | Hero, scripture banner, vision/mission, program overview, values, CTA |
| Programs | `src/app/(tabs)/programs.tsx` | The six core ministry programs; tap through to `program/[id]` for detail |
| News | `src/app/(tabs)/news.tsx` | Field stories with category filtering |
| Get Involved | `src/app/(tabs)/involved.tsx` | Volunteer, Partner, and Prayer forms → live API |
| Contact | `src/app/(tabs)/contact.tsx` | Tap to call / WhatsApp / email, contact form, newsletter, about + leadership |

Shared building blocks live in `src/components/ui/`, static ministry content in
`src/constants/content.ts`, the brand theme in `src/constants/theme.ts`, and the API client in
`src/lib/api.ts`.

## Get started

```bash
npm install
cp .env.example .env   # optional: point EXPO_PUBLIC_API_URL at a local backend
npx expo start
```

Open in the [Expo Go](https://expo.dev/go) app, an
[Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/), an
[iOS simulator](https://docs.expo.dev/workflow/ios-simulator/), or the web (`w`).

## Backend

Form submissions and reads go to the EECMI API. Set the base URL with `EXPO_PUBLIC_API_URL`
(see `.env.example`); it defaults to the deployed Render service. Public endpoints used:

- `POST /api/contact`, `POST /api/volunteer`, `POST /api/partner`, `POST /api/prayer`
- `POST /api/newsletter/subscribe`
- `GET /api/resources`, `GET /api/prayer/public`

## Checks

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
npx expo export --platform web   # full route bundle / static render
```
