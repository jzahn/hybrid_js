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
        var visible = false;

        this.setPosition = function (x, y) {
            position.setPosition(x, y);
        };

        this.setVisible = function (visibility) {
            visible = visibility;
        };

        this.render = function () {
            if (visible) {
                var context = canvas.getContext('2d');
                context.fillStyle = '#FFFFFF';
                context.strokeStyle = '#FFFFFF';
                context.globalAlpha = 0.75;

                context.fillRect(position.getX(), position.getY(), 1, 1);

                context.beginPath();
                context.moveTo(position.getX() + 0.5, position.getY() + 3 + 0.5);
                context.lineTo(position.getX() + 0.5, position.getY() + 7 + 0.5);
                context.stroke();

                context.beginPath();
                context.moveTo(position.getX() + 0.5, position.getY() - 3 + 0.5);
                context.lineTo(position.getX() + 0.5, position.getY() - 7 + 0.5);
                context.stroke();

                context.beginPath();
                context.moveTo(position.getX() + 3 + 0.5, position.getY() + 0.5);
                context.lineTo(position.getX() + 7 + 0.5, position.getY() + 0.5);
                context.stroke();

                context.beginPath();
                context.moveTo(position.getX() - 3 + 0.5, position.getY() + 0.5);
                context.lineTo(position.getX() - 7 + 0.5, position.getY() + 0.5);
                context.stroke();

                context.globalAlpha = 1;
            }
        };
    }

    var cursor = new Cursor();

    function Grid() {
        this.render = function () {
            var context = canvas.getContext('2d');
            context.strokeStyle = '#00FF00';
            context.globalAlpha = 0.75;

            context.beginPath();
            context.moveTo(50 + 0.5, 0.5);
            context.lineTo(50 + 0.5, canvas.height + 0.5);
            context.stroke();

            context.beginPath();
            context.moveTo(0.5, 50 + 0.5);
            context.lineTo(canvas.width + 0.5, 50 + 0.5);
            context.stroke();

            context.globalAlpha = 1;
        };
    }

    var grid = new Grid();

    var clearCanvas = function () {
        var originalCanvasWidth = canvas.width;
        canvas.width = 0;
        canvas.width = originalCanvasWidth;
    };

    var render = function () {
        clearCanvas();

        performanceCounter.render();
        grid.render();
        cursor.render();
    };

    var update = function (ticks) {
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

    document.oncontextmenu = function () {
        return false;
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