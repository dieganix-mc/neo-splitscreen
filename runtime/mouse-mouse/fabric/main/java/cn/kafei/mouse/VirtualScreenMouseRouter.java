package cn.kafei.mouse;

import net.minecraft.client.Minecraft;
import net.minecraft.client.gui.screens.Screen;
import net.minecraft.client.input.MouseButtonEvent;
import net.minecraft.client.input.MouseButtonInfo;

public final class VirtualScreenMouseRouter {
    private static final double WHEEL_DELTA = 120.0;

    private VirtualScreenMouseRouter() {
    }

    public static void dispatchMove(Screen screen, double guiX, double guiY, int activeButton, double dragX, double dragY) {
        screen.mouseMoved(guiX, guiY);
        if (activeButton != -1) {
            screen.mouseDragged(new MouseButtonEvent(guiX, guiY, new MouseButtonInfo(activeButton, 0)), dragX, dragY);
        }
        screen.afterMouseMove();
    }

    public static void dispatchClick(Screen screen, double guiX, double guiY, int button) {
        screen.afterMouseAction();
        screen.mouseClicked(new MouseButtonEvent(guiX, guiY, new MouseButtonInfo(button, 0)), false);
    }

    public static void dispatchRelease(Screen screen, double guiX, double guiY, int button) {
        screen.mouseReleased(new MouseButtonEvent(guiX, guiY, new MouseButtonInfo(button, 0)));
    }

    public static void dispatchScroll(Minecraft mc, Screen screen, double guiX, double guiY, int rolling) {
        double rawOffsetY = rolling / WHEEL_DELTA;
        if (rawOffsetY == 0.0) {
            return;
        }
        boolean discreteScroll = mc.options.discreteMouseScroll().get();
        double scrollSensitivity = mc.options.mouseWheelSensitivity().get();
        double scrollOffsetY = (discreteScroll ? Math.signum(rawOffsetY) : rawOffsetY) * scrollSensitivity;
        screen.mouseScrolled(guiX, guiY, 0.0, scrollOffsetY);
        screen.afterMouseAction();
    }
}

