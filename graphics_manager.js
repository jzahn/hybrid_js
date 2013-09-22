var HYBRID = (function (hybrid) {
    "use strict";

    hybrid.GraphicsManager = function GraphicsManager() {
        var canvas;

        this.initialize = function initialize() {
            canvas = document.createElement("canvas");
            canvas.className = "nopad nocursor";
            document.body.appendChild(canvas);

            this.resizeCanvas();
        };

        this.resizeCanvas = function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        this.clearCanvas = function clearCanvas() {
            var originalCanvasWidth = canvas.width;
            canvas.width = 0;
            canvas.width = originalCanvasWidth;
        };

        this.getCanvas = function getCanvas() {
            return canvas;
        };

        this.fixPixelCoord = function fixPixelCoord(pCoord) {
            return pCoord; // TODO remove references to this function;
        };

        this.fixPixelUICoord = function fixPixelUICoord(pCoord) {
            return Math.round(pCoord) + 0.5;
        };

        this.setGameTransform = function setGameTransform() {
            var context = canvas.getContext("2d");
            context.setTransform(1, 0, 0, -1, 0, 0);
        };

        this.setUiTransform = function setUiTransform() {
            var context = canvas.getContext("2d");
            context.setTransform(1, 0, 0, 1, 0, 0);
        };

    }

    return hybrid;

}(HYBRID || {}));