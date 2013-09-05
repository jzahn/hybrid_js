var HYBRID = (function (hybrid) {
	"use strict";

	hybrid.PerformanceCounter = function PerformanceCounter(graphicsManager) {
        var position = new hybrid.Position(10000, 10000);
        position.setPosition(10, 10);
        var visible = true;
        var tickSum = 0;
        var fps = 0;
        var frames = 0;

        this.setPosition = function setPosition(x, y) {
            position.setPosition(x, y);
        };

        this.setVisible = function setVisible(visibility) {
            visible = visibility;
        };

        this.render = function render() {
            if (visible) {
                var context = graphicsManager.getCanvas().getContext("2d");
                context.fillStyle = '#FFFFFF';
                context.font = '10pt sans-serif';
                context.textBaseline = 'top';
                context.fillText("fps: " + fps, position.getX(), position.getY());
            }
        };

        this.update = function update(ticks) {
            tickSum += ticks;
            frames++;
            if (tickSum >= 1000) {
                fps = frames;
                frames = 0;
                tickSum = 0;
            }
        };
    }

    return hybrid;

}(HYBRID || {}));