var HYBRID = (function (hybrid) {
	"use strict";

	hybrid.Cursor = function Cursor(graphicsManager) {
        var position = new hybrid.Position(10000, 10000);
        var visible = false;

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
                context.strokeStyle = '#FFFFFF';
                context.globalAlpha = 0.75;

                context.fillRect(position.getX(), position.getY(), 1, 1);

                context.beginPath();
                context.moveTo(graphicsManager.fixPixelUICoord(position.getX()),
                    graphicsManager.fixPixelUICoord(position.getY() + 3));
                context.lineTo(graphicsManager.fixPixelUICoord(position.getX()),
                    graphicsManager.fixPixelUICoord(position.getY() + 7));
                context.stroke();

                context.beginPath();
                context.moveTo(graphicsManager.fixPixelUICoord(position.getX()),
                    graphicsManager.fixPixelUICoord(position.getY() - 3));
                context.lineTo(graphicsManager.fixPixelUICoord(position.getX()),
                    graphicsManager.fixPixelUICoord(position.getY() - 7));
                context.stroke();

                context.beginPath();
                context.moveTo(graphicsManager.fixPixelUICoord(position.getX() + 3),
                    graphicsManager.fixPixelUICoord(position.getY()));
                context.lineTo(graphicsManager.fixPixelUICoord(position.getX() + 7),
                    graphicsManager.fixPixelUICoord(position.getY()));
                context.stroke();

                context.beginPath();
                context.moveTo(graphicsManager.fixPixelUICoord(position.getX() - 3),
                    graphicsManager.fixPixelUICoord(position.getY()));
                context.lineTo(graphicsManager.fixPixelUICoord(position.getX() - 7),
                    graphicsManager.fixPixelUICoord(position.getY()));
                context.stroke();

                context.globalAlpha = 1;
            }
        };
    }

	return hybrid;

}(HYBRID || {}));