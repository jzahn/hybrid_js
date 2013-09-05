var HYBRID = (function (hybrid) {
	"use strict";

	hybrid.Heading = function Heading() {
        var degrees = 0;

        var boundsCheck = function boundsCheck() {
            if (degrees < 0 || degrees >= 360) {
                degrees %= 360;
            }
        };

        this.getHeading = function getHeading() {
            // degrees is negated because of world matrix -y
            return -degrees;
        };

        this.setHeading = function setHeading(pDegrees) {
            // degrees is negated because of world matrix -y
            degrees = -pDegrees;
            boundsCheck();
        };

        this.getRadians = function getRadians() {
            return degrees * Math.PI / 180;
        };
    }

	return hybrid;

}(HYBRID || {}));