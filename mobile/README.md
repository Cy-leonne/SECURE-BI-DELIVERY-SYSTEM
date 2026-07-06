# Mobile App

React Native (Expo) app for courier/customer workflows.

## Features implemented

- Password login against backend API
- Delivery create/assign/verify flow
- POD lookup
- Delivery status list

## Run

1. In `mobile`:
   - `npm install --no-workspaces`
2. Start Expo:
   - `npm run start`
3. Open Android/iOS emulator or Expo Go app.

## API base URL

- Configured in `src/api.ts` as `http://10.0.2.2:4000/api/v1` (Android emulator).
- For physical device, replace with your PC LAN IP.

## Development build (dev client)

Use a development build when Expo Go doesn't support your SDK.

1. Install deps and the dev client:

```bash
npm install --no-workspaces
npx expo install expo-dev-client
```

2. Build a development client (EAS):

```bash
# Android
npx eas build --platform android --profile development

# iOS
npx eas build --platform ios --profile development
```

3. Install the built app on your device (download from EAS build page), then start Metro in dev-client mode:

```bash
npx expo start --dev-client
```

4. Open the installed dev client app on your device and connect to the Metro server to use live reload and debugging.

Notes:
- You must be logged in with `npx eas login` and have `eas-cli` configured.
- For Android you can also install the APK via `adb install <path-to-apk>`.
