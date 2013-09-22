var HYBRID = (function (hybrid) {
	"use strict";

	hybrid.Ship = function Ship(graphicsManager, inputManager) {
        var MAX_VELOCITY = 5000;
        var ACCELERATION = 5;
        var TURN_RATE = 1;

        var velocity = 0;

        var position = new hybrid.Position(10000, 10000);
        position.setPosition(0, 0);

        var heading = new hybrid.Heading();
        var headingChanged = false;
        var headingSin = 0, headingCos = 0;

        var subPea = new hybrid.SubPea(graphicsManager, inputManager, this);

        var doTrig = function () {
            headingSin = Math.sin(heading.getRadians());
            headingCos = Math.cos(heading.getRadians());
            headingChanged = false;
        };

        doTrig();

        var calculateDeltaX = function (ticks) {
            // something screwy with -
            return -headingSin * velocity / (1000 / ticks);
        };

        var calculateDeltaY = function (ticks) {
            // something screwy with -
            return -headingCos * velocity / (1000 / ticks);
        };

        this.render = function () {
            var context = graphicsManager.getCanvas().getContext("2d");
            context.save();

            context.translate(position.getX(), position.getY());
            context.rotate(heading.getRadians());

            context.fillStyle = '#FF0000';

            context.beginPath();
            context.moveTo(graphicsManager.fixPixelCoord(0),
                graphicsManager.fixPixelCoord(10));
            context.lineTo(graphicsManager.fixPixelCoord(5),
                graphicsManager.fixPixelCoord(-5));
            context.lineTo(graphicsManager.fixPixelCoord(-5),
                graphicsManager.fixPixelCoord(-5));
            context.fill();

            context.restore();

            subPea.render();
        };

        var applyInput = function (ticks) {
            var ticksMultiplier = ticks / 16;

            if (inputManager.vk_w && velocity <= MAX_VELOCITY) {
                velocity += ACCELERATION * ticksMultiplier;
            }
            if (inputManager.vk_s && velocity > 0) {
                velocity -= ACCELERATION * ticksMultiplier;
                if (velocity < ACCELERATION) {
                    velocity = 0;
                }
            }
            if (inputManager.vk_d) {
                heading.setHeading(heading.getHeading() + (TURN_RATE * ticksMultiplier));
                headingChanged = true;
            }
            if (inputManager.vk_a) {
                heading.setHeading(heading.getHeading() - (TURN_RATE * ticksMultiplier));
                headingChanged = true;
            }
        };

        this.update = function (ticks) {
            applyInput(ticks);
            if (headingChanged) {
                doTrig();
            }

            position.setPosition(position.getX() + calculateDeltaX(ticks),
                position.getY() - calculateDeltaY(ticks));

            subPea.update(ticks);
        };

        this.getPosition = function () {
            return position;
        };
    }

	return hybrid;

}(HYBRID || {}));