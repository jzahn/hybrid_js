var HYBRID = (function (hybrid) {
	"use strict";

	hybrid.SubPea = function SubPea(graphicsManager, inputManager, ship) {
		var active = false;
		var position = new hybrid.Position(10000, 10000);
		position.setPosition(10, 10);

		var LIFETIME = 3000;
		var timeActive = 0;

		this.update = function  update(ticks) {
			if (inputManager.mouse1) {
				active = true;
				timeActive = 0;
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
				context.fillRect(position.getX(), position.getY(), 1, 1);
			}

			context.restore();
		}
	}

	return hybrid;

}(HYBRID || {}));