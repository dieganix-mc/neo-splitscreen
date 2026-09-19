# Neo Splitscreen

Neo Splitscreen is an **independent Minecraft Java Edition split-screen project** for Windows 10/11. It no longer launches or depends on Nucleus Co-op.

## Current status

**Development prototype; not gameplay-ready.** The native Windows component detects raw keyboard and mouse HID entries, finds visible Java windows, and arranges exactly two windows side by side or top and bottom. Physical device pairing, per-instance keyboard and mouse routing, unfocused gameplay, and independent first-person camera movement are **not implemented**. No claim of full or 100% compatibility is made.

The older `v0.1.0` release is a Nucleus Co-op setup companion. It does not match the independent direction of this source tree and should not be used as proof of a self-contained implementation.

## Build this prototype

Requires Node.js and Visual Studio 2022 C++ Build Tools on Windows.

```powershell
npm install
npm run build:native
npm start
```

`npm run dist` builds a prototype installer. Do not publish it as a gameplay-ready release.

## Native component

`native/neo_windows.cpp` uses the Windows Raw Input device list to enumerate keyboard and mouse HID entries, `EnumWindows` to find visible Java processes, and `SetWindowPos` to arrange two windows. Some physical keyboards appear as multiple HID entries, so the enumeration count is not a reliable count of players.

## Research and next engineering steps

Windows ordinary input is shared by the focused window. Independent gameplay requires a device-specific input route into each Minecraft process and handling of Minecraft's focus-dependent behavior. A version-specific Minecraft mod with a native Raw Input bridge is a possible path that avoids third-party process injection. It will require separate Minecraft profiles, account and launcher handling, and hardware validation across movement, clicks, scroll, inventory, menus, simultaneous camera motion, and input unlock or recovery.

## Credits

The interface design was informed by the user-provided Universal Split Screen screenshot; the screenshot's instructions are third-party content. This repository contains no Nucleus Co-op or Proto Input code or binaries. Neo is not affiliated with Mojang or Microsoft.
