/*jslint vars: true, browser: true, devel: true */

function Timer() {
    "use strict";

    var MAX_TICKS = 500;

    var ticks = 0;
    var lastTicks = 0;
    var ticksThisIteration = 0;

    this.tick = function () {
        lastTicks = ticks;
        ticks = Date.now();
        ticksThisIteration = ticks - lastTicks;

        if (ticksThisIteration > MAX_TICKS) {
            ticksThisIteration = MAX_TICKS;
        }

        return ticksThisIteration;
    };
}

//var timer = new Timer();