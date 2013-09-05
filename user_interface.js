var HYBRID = (function (hybrid) {
	"use strict";


	hybrid.UserInterface = function UserInterface(graphicsManager) {
        var cursor = new hybrid.Cursor(graphicsManager);
        var performanceCounter = new hybrid.PerformanceCounter(graphicsManager);

        this.update = function (ticks) {
            performanceCounter.update(ticks);
        };

        this.render = function () {
            performanceCounter.render();
            cursor.render();
        };

        this.getCursor = function () {
            return cursor;
        };
    }

	return hybrid;

}(HYBRID || {}));