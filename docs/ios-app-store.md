# Ara Skills iOS App Store Handoff

Ara Skills now has a Capacitor iOS shell in `ios/`.

## Local Commands

```bash
npm run ios:sync
npm run ios:open
```

`ios:sync` updates the native project after web or Capacitor config changes.
`ios:open` opens the project in Xcode.

## Current Native Setup

- Bundle ID: `com.araskills.app`
- App name: `Ara Skills`
- iOS project: `ios/App/App.xcodeproj`
- Web source: `https://araskills.com`
- App icon: official Ara Skills logo
- Launch image: official Ara Skills logo

This shell loads the production Ara Skills site because the Next.js app uses
server-rendered pages, API routes, Supabase auth, and Stripe routes that should
continue running on Vercel.

## Before App Store Submission

1. Enroll in the Apple Developer Program.
2. Create the app record in App Store Connect with bundle ID `com.araskills.app`.
3. Open `ios/App/App.xcodeproj` in Xcode.
4. Set the signing team, version, build number, and deployment target.
5. Test on a real iPhone through Xcode.
6. Prepare App Store screenshots and app description.
7. Provide a demo account if App Review needs to test signed-in areas.
8. Add a privacy policy URL and complete App Privacy details.
9. Confirm payments and subscriptions follow Apple rules for the app category.
10. Archive in Xcode and upload the build to App Store Connect.

## App Review Risk

Apple may reject apps that are only a repackaged website. For a stronger
submission, add app-specific value over time, such as native push notifications,
saved-job alerts, offline saved items, native share sheets, or iOS-specific
onboarding.
