var HYBRID = (function (hybrid) {
	"use strict";
	
	hybrid.InputManager = function InputManager() {
        this.vk_w = false;
        this.vk_a = false;
        this.vk_s = false;
        this.vk_d = false;
        this.vk_space = false;
        this.vk_ctl = false;
        this.vk_tab = false;
        this.vk_shift = false;
        this.vk_tilde = false;

        this.vk_1 = false;
        this.vk_2 = false;
        this.vk_3 = false;
        this.vk_4 = false;
        this.vk_5 = false;
        this.vk_6 = false;
        this.vk_7 = false;
        this.vk_8 = false;
        this.vk_9 = false;
        this.vk_0 = false;

        this.mouse1 = false;
        this.mouse2 = false;
        this.mouse3 = false;
        this.mouseWheel = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseWorldX = 0;
        this.mouseWorldY = 0;

        this.reset = function reset() {
            this.mouseWheel = 0;
        };
    }

    return hybrid;

}(HYBRID || {}));