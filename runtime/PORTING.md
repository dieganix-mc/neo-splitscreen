# Minecraft 26.2 input runtime port

This branch contains work in progress on a Minecraft Java 26.2 Fabric input runtime. It is **not functional and must not be released as a working installer**.

The starting point is [Mouse-mouse](https://github.com/kafei520-CN/Mouse-mouse) commit `5ab275ef8069052e3af967e9e19bc4a2e54f33e1`, by kafei520-CN, licensed GPL-3.0-only. Its source and license are included under `mouse-mouse/`. The native splitter executable from the upstream repository is excluded; only source is retained. This is a derivative port, not an original implementation of the game-side input router.

## Port changes so far

- Target Minecraft 26.2, Fabric Loader 0.19.3, Fabric API 0.158.0+26.2, Java 25, and Fabric Loom 1.17.
- Use the non-obfuscated Loom plugin and no mappings line, following Fabric's 26.2 template.
- Start migrating screen, window-handle, inventory slot, and mouse-option APIs.

## Known blocker

`gradlew.bat compileJava` still fails with numerous Minecraft 26.2 API errors. The GUI rendering and input callback APIs need a substantial port. The Mixin targets and exact two-player behavior also need runtime tests after compilation. No 26.2 mod jar exists yet.

The standalone Neo desktop app in the repository can detect devices and arrange windows, but it cannot substitute for this game-side code. The older v0.1.0 installer launches Nucleus Co-op and is marked superseded.
