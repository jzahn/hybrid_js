/*jslint vars: true, browser: true, devel: true, plusplus: true*/

(function () {
    "use strict";

    function GraphicsManager() {
        var canvas = null;

        this.resizeCanvas = function () {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        this.clearCanvas = function () {
            var originalCanvasWidth = canvas.width;
            canvas.width = 0;
            canvas.width = originalCanvasWidth;
        };

        this.initialize = function () {
            canvas = document.createElement("canvas");
            canvas.className = "nopad nocursor";
            document.body.appendChild(canvas);

            this.resizeCanvas();
        };

        this.getCanvas = function () {
            return canvas;
        };

        this.getWorldRenderCoord = function (pCoord) {
            return Math.round(pCoord) + 0.5;
        };

        // TODO need to rethink this since X and Y are not done the same
        this.getUIRenderCoord = function (pCoord) {
            return Math.round(pCoord) + 0.5;
        };
    }

    var graphicsManager = new GraphicsManager();

    function AudioManager() {
        var audio = null;
        var mp3Source = null;
        var oggSource = null;

        this.initialize = function () {
            audio = document.createElement("audio");
            audio.setAttribute("loop", true);

            mp3Source = document.createElement("source");
            mp3Source.setAttribute("type", "audio/mp3");

            oggSource = document.createElement("source");
            oggSource.setAttribute("type", "audio/ogg");

            document.body.appendChild(audio);
            audio.appendChild(mp3Source);
            audio.appendChild(oggSource);
        };

        this.playMusic = function (pathMinusExtension) {
            mp3Source.setAttribute("src", pathMinusExtension + ".mp3");

            oggSource.setAttribute("src", pathMinusExtension + ".ogg");

            audio.play();
        };

        this.getAudio = function () {
            return audio;
        };
    }

    var audioManager = new AudioManager();

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
        var MAX_X = pMaxX;
        var MAX_Y = pMaxY;
        var x = 0, y = 0;

        var boundsCheck = function () {
            var diff = 0;

            if (x > MAX_X) {
                diff = x - MAX_X;
                x = -x + diff;
            } else if (x < -MAX_X) {
                diff = -x - MAX_X;
                x = -x - diff;
            }

            if (y > MAX_Y) {
                diff = y - MAX_Y;
                y = -y + diff;
            } else if (y < -MAX_Y) {
                diff = -y - MAX_Y;
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
            var context = graphicsManager.getCanvas().getContext('2d');
            context.fillStyle = '#FFFFFF';
            context.font = '10pt sans-serif';
            context.textBaseline = 'top';
            context.fillText("fps: " + fps, position.getX(), position.getY());
        };

        this.update = function (ticks) {
            tickSum += ticks;
            frames++;
            if (tickSum >= 1000) {
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
                var context = graphicsManager.getCanvas().getContext('2d');
                context.fillStyle = '#FFFFFF';
                context.strokeStyle = '#FFFFFF';
                context.globalAlpha = 0.75;

                context.fillRect(position.getX(), position.getY(), 1, 1);

                context.beginPath();
                context.moveTo(graphicsManager.getWorldRenderCoord(position.getX()),
                    graphicsManager.getWorldRenderCoord(position.getY() + 3));
                context.lineTo(graphicsManager.getWorldRenderCoord(position.getX()),
                    graphicsManager.getWorldRenderCoord(position.getY() + 7));
                context.stroke();

                context.beginPath();
                context.moveTo(graphicsManager.getWorldRenderCoord(position.getX()),
                    graphicsManager.getWorldRenderCoord(position.getY() - 3));
                context.lineTo(graphicsManager.getWorldRenderCoord(position.getX()),
                    graphicsManager.getWorldRenderCoord(position.getY() - 7));
                context.stroke();

                context.beginPath();
                context.moveTo(graphicsManager.getWorldRenderCoord(position.getX() + 3),
                    graphicsManager.getWorldRenderCoord(position.getY()));
                context.lineTo(graphicsManager.getWorldRenderCoord(position.getX() + 7),
                    graphicsManager.getWorldRenderCoord(position.getY()));
                context.stroke();

                context.beginPath();
                context.moveTo(graphicsManager.getWorldRenderCoord(position.getX() - 3),
                    graphicsManager.getWorldRenderCoord(position.getY()));
                context.lineTo(graphicsManager.getWorldRenderCoord(position.getX() - 7),
                    graphicsManager.getWorldRenderCoord(position.getY()));
                context.stroke();

                context.globalAlpha = 1;
            }
        };
    }

    var cursor = new Cursor();

    function Grid() {
        this.render = function () {
            var context = graphicsManager.getCanvas().getContext('2d');
            context.strokeStyle = '#00FF00';
            context.globalAlpha = 0.75;

            context.beginPath();
            context.moveTo(graphicsManager.getWorldRenderCoord(50),
                graphicsManager.getWorldRenderCoord(0));
            context.lineTo(graphicsManager.getWorldRenderCoord(50),
                graphicsManager.getWorldRenderCoord(graphicsManager.getCanvas().height));
            context.stroke();

            context.beginPath();
            context.moveTo(graphicsManager.getWorldRenderCoord(0),
                graphicsManager.getWorldRenderCoord(50));
            context.lineTo(graphicsManager.getWorldRenderCoord(graphicsManager.getCanvas().width),
                graphicsManager.getWorldRenderCoord(50));
            context.stroke();

            context.globalAlpha = 1;
        };
    }

    var grid = new Grid();

    function Ship() {
        var position = new Position(10000, 10000);
        position.setPosition(100, 100);

        this.render = function () {
            var context = graphicsManager.getCanvas().getContext('2d');
            context.fillStyle = '#FF0000';

            context.beginPath();
            context.moveTo(graphicsManager.getWorldRenderCoord(position.getX()),
                graphicsManager.getWorldRenderCoord(position.getY() - 10));
            context.lineTo(graphicsManager.getWorldRenderCoord(position.getX() + 5),
                graphicsManager.getWorldRenderCoord(position.getY() + 5));
            context.lineTo(graphicsManager.getWorldRenderCoord(position.getX() - 5),
                graphicsManager.getWorldRenderCoord(position.getY() + 5));
            context.fill();
        };
    }

    var ship = new Ship();

    var render = function () {
        graphicsManager.clearCanvas();

        performanceCounter.render();
        grid.render();
        ship.render();
        cursor.render();
    };

    var update = function (ticks) {
        performanceCounter.update(ticks);
    };

    var vSyncWait = (function (callback) {
        return  window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function (callback) {
                    window.setTimeout(callback, 1000/60);
                };
    }());

    var noVSyncWait = function (callback) {
        window.setTimeout(callback, 1);
    };

    var doWait = function (callback, vSync) {
        if (vSync) {
            vSyncWait(callback);
        } else {
            noVSyncWait(callback)
        }
    };

    var gameLoop = function (vSync) {
        doWait(gameLoop, vSync);
        update(timer.tick());
        render();
    };

    window.onresize = function () {
        graphicsManager.resizeCanvas();
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

    var onKeyDown = function (event) {
        console.log("keydown");
    };

    var onKeyUp = function (event) {
        console.log("keyup");
    };

    var onMouseDown = function (event) {
        console.log("mousedown");
    };

    var onMouseUp = function (event) {
        console.log("mouseup");
    };

    var onMouseWheel = function (event) {
        console.log("mousewheel");
    };

    var initializeEventListeners = function () {
        graphicsManager.getCanvas().addEventListener("mousemove", onMouseMove, false);
        graphicsManager.getCanvas().addEventListener("mouseout", onMouseOut, false);
        graphicsManager.getCanvas().addEventListener("mouseover", onMouseOver, false);
        graphicsManager.getCanvas().addEventListener("mousedown", onMouseDown, false);
        graphicsManager.getCanvas().addEventListener("mouseup", onMouseUp, false);
        graphicsManager.getCanvas().addEventListener("mousewheel", onMouseWheel, false);

        document.addEventListener("keydown", onKeyDown, false);
        document.addEventListener("keyup", onKeyUp, false);
    };

    var initializeGameLoop = function () {
        graphicsManager.initialize();
        audioManager.initialize();
        initializeEventListeners();

        audioManager.playMusic("screamandshout");

        gameLoop(true);
    };

    initializeGameLoop();

}());