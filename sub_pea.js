var HYBRID = (function (hybrid) {
	"use strict";

	hybrid.SubPea = function SubPea(graphicsManager, inputManager, ship) {
		var active = false;
		var position = new hybrid.Position(10000, 10000);

		var LIFETIME = 3000;
		var timeActive = 0;

		var SIZE = 2;

		this.update = function  update(ticks) {
			if (inputManager.mouse1 && !active) {
				active = true;
				timeActive = 0;
				//position.setPosition(ship.getPosition().getX(), ship.getPosition().getY());
				position.setPosition(inputManager.mouseWorldX, inputManager.mouseWorldY);
				console.log("Shots fired at: " + inputManager.mouseWorldX + ", " + inputManager.mouseWorldY);
			}
			else {
				timeActive += ticks;
				if (timeActive > LIFETIME) {
					active = false;
					timeActive = 0;
				}
			}
		}

		this.render = function render() {
			var context = graphicsManager.getCanvas().getContext("2d");
            context.save();

            context.fillStyle = '#FFFFFF';
            context.strokeStyle = '#FFFFFF';
            context.globalAlpha = 1;

			if (active) {
				var halfSize = SIZE / 2;

				context.fillRect(graphicsManager.fixPixelCoord(position.getX() - halfSize),
					graphicsManager.fixPixelCoord(position.getY() - halfSize), SIZE, SIZE);
			}

			context.restore();
		}
	}

	return hybrid;

}(HYBRID || {}));