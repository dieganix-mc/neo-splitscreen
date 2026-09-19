# Neo Splitscreen

Neo Splitscreen is an independent Minecraft Java Edition split-screen project for Windows 10/11. It does not use Nucleus Co-op.

## Current status

This development build includes a native Windows device/window helper and a Minecraft 26.2 Fabric input mod. The mod builds and launches on Minecraft 26.2. Its Raw Input splitter starts and listens locally. **Two-instance gameplay, separate camera movement, and unfocused input have not been validated.** It is not a 100% working release.

The desktop application can install the 26.2 mod into chosen Minecraft game directories and arrange two visible Java windows. Each game instance must use Minecraft 26.2, Fabric Loader, Fabric API, and a separate game directory. Device assignment is opened inside each game with Alt + F8.

## Build

Requires Node.js, Visual Studio 2022 C++ Build Tools, and Java 25 on Windows.

```powershell
cd runtime/mouse-mouse
.\gradlew.bat build
cd ../..
npm install
npm run dist
```

The installer is written to `dist/`. This is a development installer, not a verified gameplay release.

## Native input runtime and license

The game-side input router is a derivative port of [Mouse-mouse](https://github.com/kafei520-CN/Mouse-mouse) commit `5ab275ef8069052e3af967e9e19bc4a2e54f33e1`, by kafei520-CN, licensed GPL-3.0-only. Its source, license, and native `splitter.cpp` are under `runtime/mouse-mouse/`. The bundled `splitter.exe` is compiled from that source. The Neo desktop shell is MIT licensed. This repository and its source archives provide the corresponding source for the runtime.

The earlier v0.1.0 release is a superseded Nucleus Co-op setup companion and does not satisfy this project's independent goal.

Neo is not affiliated with Mojang or Microsoft.
