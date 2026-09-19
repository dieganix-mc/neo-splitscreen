package cn.kafei.mouse;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphicsExtractor;

public final class VirtualCursorOverlayRenderer {
    private VirtualCursorOverlayRenderer() { }

    public static void extractCursor(Minecraft mc, GuiGraphicsExtractor graphics, float partialTick) {
        if (!VirtualMouseService.shouldRenderOverlay(mc)) return;
        int x = (int) Math.round(VirtualMouseService.getRenderGuiX(mc, partialTick));
        int y = (int) Math.round(VirtualMouseService.getRenderGuiY(mc, partialTick));
        int tint = VirtualMouseService.getCursorFillColor();
        graphics.fill(x - 7, y - 2, x + 8, y + 3, 0xFF000000);
        graphics.fill(x - 2, y - 7, x + 3, y + 8, 0xFF000000);
        graphics.fill(x - 6, y - 1, x + 7, y + 2, tint);
        graphics.fill(x - 1, y - 6, x + 2, y + 7, tint);
    }
}
