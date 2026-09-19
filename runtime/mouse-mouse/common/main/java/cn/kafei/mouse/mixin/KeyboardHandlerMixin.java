package cn.kafei.mouse.mixin;

import cn.kafei.mouse.InputIsolationService;
import net.minecraft.client.KeyboardHandler;
import net.minecraft.client.input.KeyEvent;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

@Mixin(KeyboardHandler.class)
public class KeyboardHandlerMixin {
    // 屏蔽游戏内原生键盘输入，只保留 Raw Input IPC 注入的选中设备输入。
    @Inject(method = "keyPress", at = @At("HEAD"), cancellable = true)
    private void mouse$blockNativeKeyboard(long windowPointer, int action, KeyEvent event, CallbackInfo ci) {
        if (InputIsolationService.isInjectedKeyboardEvent()) {
            return;
        }
        if (InputIsolationService.shouldBlockKeyboard(windowPointer, event.key())) {
            ci.cancel();
        }
    }


}

