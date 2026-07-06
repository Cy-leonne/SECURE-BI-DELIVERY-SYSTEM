Windows Desktop (Electron) wrapper

Development (starts Expo web + Electron):

```powershell
cd mobile
npm install
npm run desktop:dev
```

Production (packaging not included):

```powershell
cd mobile
npm install
npm run web
# build an Electron package with your preferred packager (electron-builder, electron-forge)
```
