package cn.kafei.mouse;

import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientLifecycleEvents;
import net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents;
import net.fabricmc.fabric.api.client.keymapping.v1.KeyMappingHelper;
import net.fabricmc.fabric.api.client.networking.v1.ClientPlayConnectionEvents;
import com.mojang.blaze3d.platform.InputConstants;
import net.minecraft.client.KeyMapping;
import net.minecraft.resources.Identifier;
import net.minecraft.network.chat.Component;
import org.lwjgl.glfw.GLFW;

public class MousemouseFabric implements ClientModInitializer {
    private static boolean notified = false;

    @Override
    public void onInitializeClient() {
        MousemouseCommon.CONFIG_KEY = KeyMappingHelper.registerKeyMapping(
            new KeyMapping("key.mouse.config", InputConstants.Type.KEYSYM, GLFW.GLFW_KEY_UNKNOWN,
                KeyMapping.Category.register(Identifier.fromNamespaceAndPath("mouse", "main")))
        );

        ClientLifecycleEvents.CLIENT_STARTED.register(mc -> MousemouseCommon.initClient());
        ClientLifecycleEvents.CLIENT_STOPPING.register(mc -> MousemouseCommon.onShutdown());
        ClientTickEvents.START_CLIENT_TICK.register(mc -> MousemouseCommon.onTickStart());
        ClientTickEvents.END_CLIENT_TICK.register(mc -> MousemouseCommon.onTickEnd());

        ClientPlayConnectionEvents.JOIN.register((handler, sender, client) -> {
            if (!SplitterLauncher.startFailed || notified) return;
            notified = true;
            client.execute(() -> {
                if (client.player != null) {
                    client.player.sendSystemMessage(Component.translatable("mouse.chat.splitter_failed"));
                }
            });
        });
    }
}

