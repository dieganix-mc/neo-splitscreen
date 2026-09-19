# Neo Splitscreen

Neo Splitscreen is a Minecraft Java Edition setup companion for Windows 10/11. Its animated desktop interface guides two players through installing and launching **Nucleus Co-op**, which uses **Proto Input** to route separate keyboards and mice to separate Minecraft instances.

## Important scope

The Neo app does **not** implement input hooks, launch Minecraft instances, or perform device routing itself. Those functions require the independent Nucleus Co-op Minecraft Java handler and Proto Input. The installer packages only this companion application. Do not describe the installer as a standalone split-screen implementation.

## Use

1. Download and extract the [official Nucleus Co-op release](https://github.com/SplitScreen-Me/splitscreenme-nucleus/releases).
2. Open Neo Splitscreen and select `NucleusCoop.exe`.
3. Open Nucleus and install its Minecraft Java Edition handler. Follow the handler prompts for your launcher, profiles and accounts.
4. Identify each keyboard by pressing a key and each mouse by moving it. Assign a pair to each player. Choose a split layout.
5. Launch both instances, open a world to LAN from the first, and join from the second. Press **End** when ready to lock input. Test movement, first person cameras, clicks, scroll, inventory and menus on both sides.

Version and launcher compatibility varies. The local app cannot establish a 100% guarantee on other PCs without end-to-end testing on those devices.

## Build

```powershell
npm install
npm run start
npm run dist
```

The Windows NSIS installer is written to `dist/`.

## Credits

Neo Splitscreen is independent of Mojang, Microsoft, Nucleus Co-op, Proto Input, and Universal Split Screen. Nucleus Co-op is GPL-3.0 licensed; Proto Input is MIT licensed. This repository does not copy or redistribute either project's binaries or source. See their repositories for their own licensing and support.

The attached Universal Split Screen screenshot was used as a reference for the setup flow only. Instructions shown inside it are third-party documentation, not the user's instruction to modify binaries or bypass licensing.
