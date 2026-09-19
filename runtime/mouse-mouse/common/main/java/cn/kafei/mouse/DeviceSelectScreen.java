package cn.kafei.mouse;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import net.minecraft.client.gui.GuiGraphicsExtractor;
import net.minecraft.client.gui.components.Button;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.network.chat.Component;

public class DeviceSelectScreen extends Screen {
    private static final Pattern ID = Pattern.compile("Device\\s+(\\d+)");
    private final Screen parent;
    private final List<String> devices = MouseConfig.readDeviceList();
    private final Set<Integer> selected = new HashSet<>(InstanceDeviceSelectionService.getSelectedDeviceIds());
    private int page;

    public DeviceSelectScreen(Screen parent) {
        super(Component.translatable("mouse.screen.title"));
        this.parent = parent;
    }

    @Override
    public void extractBackground(GuiGraphicsExtractor graphics, int mouseX, int mouseY, float tick) {
        graphics.fill(0, 0, width, height, 0xBB10131C);
    }

    @Override
    protected void init() {
        int left = width / 2 - 200;
        int top = 38;
        int pageSize = Math.max(1, Math.min(7, (height - 110) / 24));
        int start = page * pageSize;
        for (int index = start; index < Math.min(devices.size(), start + pageSize); index++) {
            String line = devices.get(index);
            Matcher match = ID.matcher(line);
            int id = match.find() ? Integer.parseInt(match.group(1)) : -1;
            String name = line.length() > 53 ? line.substring(0, 50) + "..." : line;
            addRenderableWidget(Button.builder(Component.literal((selected.contains(id) ? "[x] " : "[ ] ") + name), button -> {
                if (selected.contains(id)) selected.remove(id); else selected.add(id);
                button.setMessage(Component.literal((selected.contains(id) ? "[x] " : "[ ] ") + name));
            }).bounds(left, top + (index - start) * 24, 400, 20).build());
        }
        if (devices.isEmpty()) {
            addRenderableWidget(Button.builder(Component.translatable("mouse.screen.refresh"), button ->
                minecraft.gui.setScreen(new DeviceSelectScreen(parent))).bounds(left + 150, top + 40, 100, 20).build());
        }
        if (devices.size() > pageSize) {
            addRenderableWidget(Button.builder(Component.literal("<"), button -> { page = Math.max(0, page - 1); rebuildWidgets(); })
                .bounds(left, height - 54, 24, 20).build());
            addRenderableWidget(Button.builder(Component.literal(">"), button -> { page = Math.min((devices.size() - 1) / pageSize, page + 1); rebuildWidgets(); })
                .bounds(left + 376, height - 54, 24, 20).build());
        }
        addRenderableWidget(Button.builder(Component.translatable("mouse.screen.save"), button -> {
            ArrayList<Integer> ids = new ArrayList<>(selected);
            InstanceDeviceSelectionService.setSelectedDeviceIds(ids);
            InputIsolationService.setIsolationEnabled(!ids.isEmpty());
            InjectedKeyboardState.clear();
            VirtualMouseService.reset();
            IPCClient.getInstance().reconnect(ids);
            minecraft.gui.setScreen(parent);
        }).bounds(left, height - 28, 196, 20).build());
        addRenderableWidget(Button.builder(Component.translatable("mouse.screen.cancel"), button -> minecraft.gui.setScreen(parent))
            .bounds(left + 204, height - 28, 196, 20).build());
    }

    @Override
    public void extractRenderState(GuiGraphicsExtractor graphics, int mouseX, int mouseY, float tick) {
        graphics.centeredText(font, title, width / 2, 16, 0xFFFFFFFF);
        if (devices.isEmpty()) {
            graphics.centeredText(font, Component.translatable(SplitterLauncher.startFailed
                ? "mouse.screen.splitter_failed" : "mouse.screen.no_devices"), width / 2, height / 2, 0xFFFF7777);
        }
        super.extractRenderState(graphics, mouseX, mouseY, tick);
    }
}
