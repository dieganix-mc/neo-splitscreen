package cn.kafei.mouse.mixin;

import cn.kafei.mouse.VirtualCursorOverlayRenderer;
import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.GuiGraphicsExtractor;
import net.minecraft.client.gui.screens.Screen;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(Screen.class)
public class ScreenCursorMixin {
    @Inject(method = "extractRenderState", at = @At("TAIL"))
    private void mouse$drawCursor(GuiGraphicsExtractor graphics, int mouseX, int mouseY, float tick, CallbackInfo ci) {
        VirtualCursorOverlayRenderer.extractCursor(Minecraft.getInstance(), graphics, tick);
    }
}
