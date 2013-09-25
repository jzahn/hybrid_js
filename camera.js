var HYBRID = (function (hybrid) {
	"use strict";

	hybrid.Camera = function Camera(graphicsManager, inputManager) {
        var position = new hybrid.Position(10000, 10000);
        var scale = 1;
        var activeObject;
        var MIN_SCALE = 0.3;
        var MAX_SCALE = 8;
        var SCALE_INCREMENT = 0.95;

        this.setPosition = function setPosition(pX, pY) {
            position.set(pX, pY);
        };

        this.getX = function getX() {
            return position.getX();
        };

        this.getY = function getY() {
            return position.getY();
        };

        this.getScale = function getScale() {
            return scale;
        };

        var setScale = function setScale(pScale) {
            if (pScale >= MIN_SCALE && pScale <= MAX_SCALE) {
                scale = pScale;
            }
        };

        this.update = function update(ticks) {
            if (activeObject) {
                position.setPosition(activeObject.getPosition().getX(),
                    activeObject.getPosition().getY());
            }

            if (inputManager.mouseWheel > 0) {
                setScale(this.getScale() / SCALE_INCREMENT);
            } 
            else if (inputManager.mouseWheel < 0) {
                setScale(this.getScale() * SCALE_INCREMENT);
            }
        };

        this.setActiveObject = function setActiveObject(pActiveObject) {
            activeObject = pActiveObject;
        };

        this.doTransform = function doTransform() {
            var context = graphicsManager.getCanvas().getContext("2d");
            var halfScreenWidth = graphicsManager.getCanvas().width / 2;
            var halfScreenHeight = graphicsManager.getCanvas().height / 2;
            context.translate(halfScreenWidth - position.getX() * scale,
                -halfScreenHeight - position.getY() * scale);
            context.scale(scale, scale);
        };

        this.getUIPosition = function getUIPosition(worldPosition) {
            // do math
            // TODO
            var uiPosition = undefined;
            return uiPosition;
        }

        this.getWorldX = function getWorldX(uiX) {
            return (position.getX() + uiX - (graphicsManager.getCanvas().width / 2)) / scale;
        }

        this.getWorldY = function getWorldY(uiY) {
            return (position.getY() - uiY + (graphicsManager.getCanvas().height / 2)) / scale;
        }
    }

    return hybrid;

}(HYBRID || {}));