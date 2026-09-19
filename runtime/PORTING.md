# Minecraft 26.2 input runtime port

This is a derivative port of [Mouse-mouse](https://github.com/kafei520-CN/Mouse-mouse) commit `5ab275ef8069052e3af967e9e19bc4a2e54f33e1`, by kafei520-CN, licensed GPL-3.0-only. Its source and license are in `mouse-mouse/`. The native splitter executable was compiled from the included `splitter.cpp`.

The runtime targets Minecraft 26.2, Fabric Loader 0.19.3, Fabric API 0.158.0+26.2, Java 25, and Fabric Loom 1.17. The game mod builds and a development Minecraft 26.2 client reaches the main menu. The native Raw Input splitter starts and listens on localhost.

Two simultaneous instances, independent keyboard movement and camera rotation, GUI clicks, and unfocused gameplay have not been validated. This runtime must not be advertised as fully working until those tests pass.
