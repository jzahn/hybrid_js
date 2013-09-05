var HYBRID = (function (hybrid) {
	"use strict";

	hybrid.Position = function Position(pMaxX, pMaxY) {
        var MAX_X = pMaxX;
        var MAX_Y = pMaxY;
        var x = 0, y = 0;

        var boundsCheck = function boundsCheck() {
            var diff = 0;

            if (x > MAX_X) {
                diff = x - MAX_X;
                x = -x + diff;
            } 
            else if (x < -MAX_X) {
                diff = -x - MAX_X;
                x = -x - diff;
            }

            if (y > MAX_Y) {
                diff = y - MAX_Y;
                y = -y + diff;
            } 
            else if (y < -MAX_Y) {
                diff = -y - MAX_Y;
                y = -y - diff;
            }
        };

        this.getX = function getX() {
            return x;
        };

        this.getY = function getY() {
            return y;
        };

        this.setPosition = function setPosition(pX, pY) {
            x = pX;
            y = pY;
            boundsCheck();
        };
    }

    return hybrid;

}(HYBRID || {}));