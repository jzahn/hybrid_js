var HYBRID = (function (hybrid) {
	"use strict";

	hybrid.Grid = function Grid(graphicsManager, camera) {
        var GRID_SIZE = 100;

        this.render = function () {
            var halfScreenWidth = (graphicsManager.getCanvas().width / 2) / camera.getScale();
            var halfScreenHeight = (graphicsManager.getCanvas().height / 2) / camera.getScale();
            var context = graphicsManager.getCanvas().getContext("2d");

            context.save();

            context.strokeStyle = '#00FF00';
            context.globalAlpha = 1;

            // draw centerlines
            context.beginPath();
            context.moveTo(graphicsManager.fixPixelCoord(camera.getX() - halfScreenWidth),
                graphicsManager.fixPixelCoord(0));
            context.lineTo(graphicsManager.fixPixelCoord(camera.getX() + halfScreenWidth),
                graphicsManager.fixPixelCoord(0));
            context.stroke();

            context.beginPath();
            context.moveTo(graphicsManager.fixPixelCoord(0),
                graphicsManager.fixPixelCoord(camera.getY() + halfScreenHeight));
            context.lineTo(graphicsManager.fixPixelCoord(0),
                graphicsManager.fixPixelCoord(camera.getY() - halfScreenHeight));
            context.stroke();

            context.globalAlpha = 0.35;

            // draw verts along x positive
            var i;
            for (i = GRID_SIZE;
                    i < halfScreenWidth + camera.getX();
                    i += GRID_SIZE) {
                context.beginPath();
                context.moveTo(graphicsManager.fixPixelCoord(i),
                    graphicsManager.fixPixelCoord(camera.getY() + halfScreenHeight));
                context.lineTo(graphicsManager.fixPixelCoord(i),
                    graphicsManager.fixPixelCoord(camera.getY() - halfScreenHeight));
                context.stroke();
            }

            // draw verts along x negative
            for (i = GRID_SIZE;
                    i < halfScreenWidth - camera.getX();
                    i += GRID_SIZE) {
                context.beginPath();
                context.moveTo(graphicsManager.fixPixelCoord(-i),
                    graphicsManager.fixPixelCoord(camera.getY() + halfScreenHeight));
                context.lineTo(graphicsManager.fixPixelCoord(-i),
                    graphicsManager.fixPixelCoord(camera.getY() - halfScreenHeight));
                context.stroke();
            }

            // draw horz along y positive
            for (i = GRID_SIZE;
                    i < halfScreenHeight + camera.getY();
                    i += GRID_SIZE) {
                context.beginPath();
                context.moveTo(graphicsManager.fixPixelCoord(camera.getX() - halfScreenWidth),
                    graphicsManager.fixPixelCoord(i));
                context.lineTo(graphicsManager.fixPixelCoord(camera.getX() + halfScreenWidth),
                    graphicsManager.fixPixelCoord(i));
                context.stroke();
            }

            // draw horz along y negative
            for (i = GRID_SIZE;
                    i < halfScreenHeight - camera.getY();
                    i += GRID_SIZE) {
                context.beginPath();
                context.moveTo(graphicsManager.fixPixelCoord(camera.getX() - halfScreenWidth),
                    graphicsManager.fixPixelCoord(-i));
                context.lineTo(graphicsManager.fixPixelCoord(camera.getX() + halfScreenWidth),
                    graphicsManager.fixPixelCoord(-i));
                context.stroke();
            }

            context.restore();
        };
    }

	return hybrid;

}(HYBRID || {}));