/*jslint vars: true, browser: true, devel: true, plusplus: true*/

(function () {
    "use strict";

    var canvas = null;

    function Timer() {
        var MAX_TICKS = 500;

        var ticks = 0;
        var lastTicks = 0;
        var ticksThisIteration = 0;

        this.tick = function () {
            lastTicks = ticks;
            ticks = Date.now();
            ticksThisIteration = ticks - lastTicks;

            if (ticksThisIteration > MAX_TICKS) {
                ticksThisIteration = MAX_TICKS;
            }

            return ticksThisIteration;
        };
    }

    var timer = new Timer();

    function Position(pMaxX, pMaxY) {
        var maxX = pMaxX;
        var maxY = pMaxY;
        var x = 0, y = 0;

        var boundsCheck = function () {
            var diff = 0;

            if (x > maxX) {
                diff = x - maxX;
                x = -x + diff;
            } else if (x < -maxX) {
                diff = -x - maxX;
                x = -x - diff;
            }

            if (y > maxY) {
                diff = y - maxY;
                y = -y + diff;
            } else if (y < -maxY) {
                diff = -y - maxY;
                y = -y - diff;
            }
        };

        this.getX = function () {
            return x;
        };

        this.getY = function () {
            return y;
        };

        this.setPosition = function (pX, pY) {
            x = pX;
            y = pY;
            boundsCheck();
        };
    }

    function Camera() {
        var position = new Position(10000, 10000);

        this.setPosition = function (pX, pY) {
            position.set(pX, pY);
        };
    }

    var camera = new Camera();

    function PerformanceCounter() {
        var position = new Position(10000, 10000);
        position.setPosition(10, 10);
        var visible = true;
        var tickSum = 0;

        var fps = 0;
        var frames = 0;

        this.setPosition = function (x, y) {
            position.setPosition(x, y);
        };

        this.setVisible = function (visibility) {
            visible = visibility;
        };

        this.render = function () {
            var context = canvas.getContext('2d');
            context.fillStyle = '#FFFFFF';
            context.font = '10pt sans-serif';
            context.textBaseline = 'top';
            context.fillText("fps: " + fps, position.getX(), position.getY());
        };

        this.update = function (ticks) {
            tickSum += ticks;
            frames++;
            if (tickSum > 1000) {
                fps = frames;
                frames = 0;
                tickSum = 0;
            }
        };
    }

    var performanceCounter = new PerformanceCounter();

    function Cursor() {
        var position = new Position(10000, 10000);
        var toggle = true;
        var visible = false;

        this.setPosition = function (x, y) {
            position.setPosition(x, y);
        };

        this.setVisible = function (visibility) {
            visible = visibility;
        };

        this.render = function () {
            var context = canvas.getContext('2d');

            context.lineWidth = 5;

            if (toggle) {
                context.fillStyle = '#FF0000';
                context.strokeStyle = '#0000FF';
            } else {
                context.fillStyle = '#0000FF';
                context.strokeStyle = '#FF0000';
            }

            if (visible) {
                context.fillRect(position.getX(), position.getY(), 50, 50);
                context.strokeRect(position.getX(), position.getY(), 50, 50);
            }
        };

        this.update = function () {
            toggle = !toggle;
        };
    }

    var cursor = new Cursor();

    var clearCanvas = function () {
        var originalCanvasWidth = canvas.width;
        canvas.width = 0;
        canvas.width = originalCanvasWidth;
    };

    var render = function () {
        clearCanvas();
        cursor.render();
        performanceCounter.render();
    };

    var update = function (ticks) {
        cursor.update(ticks);
        performanceCounter.update(ticks);
    };

    var gameLoop = function () {
        update(timer.tick());
        render();
    };

    var resizeCanvas = function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.onresize = function () {
        resizeCanvas();
    };

    var onMouseMove = function (event) {
        cursor.setPosition(event.clientX, event.clientY);
    };

    var onMouseOut = function () {
        cursor.setVisible(false);
    };

    var onMouseOver = function () {
        cursor.setVisible(true);
    };

    var initializeCanvas = function () {
        canvas = document.createElement("canvas");
        canvas.className = "nopad nocursor";
        document.body.appendChild(canvas);

        resizeCanvas();

        canvas.addEventListener('mousemove', onMouseMove, false);
        canvas.addEventListener('mouseout', onMouseOut, false);
        canvas.addEventListener('mouseover', onMouseOver, false);
    };

    var initialize = function () {
        initializeCanvas();

        setInterval(gameLoop, 16);
    };

    initialize();

}());