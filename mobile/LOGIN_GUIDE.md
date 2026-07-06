# Expo Go login troubleshooting guide

## Why login was failing
The Expo app was trying to connect to an outdated local backend address. Expo Go on a phone cannot use localhost the way the emulator does, so it needs your PC's LAN IP or a tunnel-based URL.

## What I changed
- The app now resolves the backend URL dynamically.
- A local override was added in [mobile/.env](mobile/.env) to point Expo to the current development machine IP.

## How to run it yourself
1. Start the backend:
   - Open a terminal in [mobile/securebi-backend](mobile/securebi-backend)
   - Run: `npm start`

2. Confirm the backend is reachable:
   - Visit: `http://192.168.210.10:4000/api/v1/health`
   - You should see: `{"status":"ok"}`

3. Start Expo:
   - Open a terminal in [mobile](mobile)
   - Run: `npm start`

4. Open the app in Expo Go:
   - Scan the QR code from your phone.
   - If the phone is on the same Wi‑Fi network, it should reach the backend.

## If login still fails
- Make sure the backend is still running.
- Make sure the IP in [mobile/.env](mobile/.env) matches your computer's current LAN IP.
- Run `ipconfig` and replace the IP if it changed.
- Restart the Expo app after changing the IP.

## Demo credentials
You can try these accounts:
- `courier@gmail.com` / `password123`
- `wekesaleone27@gmail.com` / `password123`
