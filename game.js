/*jslint vars: true, browser: true, devel: true, plusplus: true*/

(function () {
    "use strict";

    // WHAT THE FUCK!!!
    //document.getElementById("music").play();

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

    var fixRenderCoord = function (pCoord) {
        return Math.round(pCoord) + 0.5;
    };

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

        this.getRenderX = function () {
            return fixRenderCoord(x);
        };

        this.getRenderY = function () {
            return fixRenderCoord(y);
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
                context.moveTo(position.getRenderX(), position.getRenderY() + 3);
                context.lineTo(position.getRenderX(), position.getRenderY() + 7);
                context.stroke();

                context.beginPath();
                context.moveTo(position.getRenderX(), position.getRenderY() - 3);
                context.lineTo(position.getRenderX(), position.getRenderY() - 7);
                context.stroke();

                context.beginPath();
                context.moveTo(position.getRenderX() + 3, position.getRenderY());
                context.lineTo(position.getRenderX() + 7, position.getRenderY());
                context.stroke();

                context.beginPath();
                context.moveTo(position.getRenderX() - 3, position.getRenderY());
                context.lineTo(position.getRenderX() - 7, position.getRenderY());
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
            context.moveTo(fixRenderCoord(50), fixRenderCoord(0));
            context.lineTo(fixRenderCoord(50), fixRenderCoord(canvas.height));
            context.stroke();

            context.beginPath();
            context.moveTo(fixRenderCoord(0), fixRenderCoord(50));
            context.lineTo(fixRenderCoord(canvas.width), fixRenderCoord(50));
            context.stroke();

            context.globalAlpha = 1;
        };
    }

    var grid = new Grid();

    function Ship() {
        var position = new Position(10000, 10000);
        this.render = function () {
            var context = canvas.getContext('2d');
            context.fillStyle = '#FF0000';

            context.beginPath();
            context.moveTo(fixRenderCoord(100), fixRenderCoord(100));
            context.lineTo(fixRenderCoord(105), fixRenderCoord(115));
            context.lineTo(fixRenderCoord(95), fixRenderCoord(115));
            context.fill();
        };
    }

    var ship = new Ship();

    var clearCanvas = function () {
        var originalCanvasWidth = canvas.width;
        canvas.width = 0;
        canvas.width = originalCanvasWidth;
    };

    var render = function () {
        clearCanvas();

        performanceCounter.render();
        grid.render();
        ship.render();
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

        setInterval(gameLoop, 1);
    };

    initialize();

}());