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
