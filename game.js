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

        this.fixPixelCoord = function (pCoord) {
            return Math.round(pCoord) + 0.5;
        };

        this.setGameTransform = function () {
            var context = canvas.getContext("2d");
            context.setTransform(1, 0, 0, -1, 0, 0);
        };

        this.setUiTransform = function () {
            var context = canvas.getContext("2d");
            context.setTransform(1, 0, 0, 1, 0, 0);
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
            mp3Source.setAttribute("src", "resources/music/" + pathMinusExtension + ".mp3");
            oggSource.setAttribute("src", "resources/music/" + pathMinusExtension + ".ogg");
            audio.play();
        };

        this.getAudio = function () {
            return audio;
        };
    }

    var audioManager = new AudioManager();

    function InputManager() {
        this.vk_w = false;
        this.vk_a = false;
        this.vk_s = false;
        this.vk_d = false;
        this.vk_space = false;
        this.vk_ctl = false;
        this.vk_tab = false;
        this.vk_shift = false;
        this.vk_tilde = false;

        this.vk_1 = false;
        this.vk_2 = false;
        this.vk_3 = false;
        this.vk_4 = false;
        this.vk_5 = false;
        this.vk_6 = false;
        this.vk_7 = false;
        this.vk_8 = false;
        this.vk_9 = false;
        this.vk_0 = false;

        this.mouse1 = false;
        this.mouse2 = false;
        this.mouse3 = false;
        this.mouseWheel = 0;

        this.reset = function () {
            this.mouseWheel = 0;
        };
    }

    var inputManager = new InputManager();

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

    function Heading() {
        var angle = 0;

        var boundsCheck = function () {
            if (angle < 0 || angle >= 360) {
                angle %= 360;
            }
        };

        this.getHeading = function () {
            return angle;
        };

        this.setHeading = function (pAngle) {
            angle = pAngle;
            boundsCheck();
        };

        this.getRadians = function () {

        };
    }

    function Camera() {
        var position = new Position(10000, 10000);
        var scale = 1;
        var activeObject = null;
        var MIN_SCALE = 0.3;
        var MAX_SCALE = 8;
        var SCALE_INCREMENT = 0.1;

        this.setPosition = function (pX, pY) {
            position.set(pX, pY);
        };

        this.getX = function () {
            return position.getX();
        };

        this.getY = function () {
            return position.getY();
        };

        this.getScale = function () {
            return scale;
        };

        var setScale = function (pScale) {
            if (pScale >= MIN_SCALE && pScale <= MAX_SCALE) {
                scale = pScale;
            }
        };

        this.update = function (ticks) {
            if (activeObject) {
                position.setPosition(activeObject.getPosition().getX(),
                    activeObject.getPosition().getY());
            }

            if (inputManager.mouseWheel > 0) {
                setScale(this.getScale() + SCALE_INCREMENT);
            } else if (inputManager.mouseWheel < 0) {
                setScale(this.getScale() - SCALE_INCREMENT);
            }
        };

        this.setActiveObject = function (pActiveObject) {
            activeObject = pActiveObject;
        };

        this.doTransform = function () {
            var context = graphicsManager.getCanvas().getContext("2d");
            var halfScreenWidth = graphicsManager.getCanvas().width / 2;
            var halfScreenHeight = graphicsManager.getCanvas().height / 2;
            context.translate(halfScreenWidth - position.getX() * scale,
                -halfScreenHeight - position.getY() * scale);
            context.scale(scale, scale);
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
            var context = graphicsManager.getCanvas().getContext("2d");
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
                var context = graphicsManager.getCanvas().getContext("2d");

                context.fillStyle = '#FFFFFF';
                context.strokeStyle = '#FFFFFF';
                context.globalAlpha = 0.75;

                context.fillRect(position.getX(), position.getY(), 1, 1);

                context.beginPath();
                context.moveTo(graphicsManager.fixPixelCoord(position.getX()),
                    graphicsManager.fixPixelCoord(position.getY() + 3));
                context.lineTo(graphicsManager.fixPixelCoord(position.getX()),
                    graphicsManager.fixPixelCoord(position.getY() + 7));
                context.stroke();

                context.beginPath();
                context.moveTo(graphicsManager.fixPixelCoord(position.getX()),
                    graphicsManager.fixPixelCoord(position.getY() - 3));
                context.lineTo(graphicsManager.fixPixelCoord(position.getX()),
                    graphicsManager.fixPixelCoord(position.getY() - 7));
                context.stroke();

                context.beginPath();
                context.moveTo(graphicsManager.fixPixelCoord(position.getX() + 3),
                    graphicsManager.fixPixelCoord(position.getY()));
                context.lineTo(graphicsManager.fixPixelCoord(position.getX() + 7),
                    graphicsManager.fixPixelCoord(position.getY()));
                context.stroke();

                context.beginPath();
                context.moveTo(graphicsManager.fixPixelCoord(position.getX() - 3),
                    graphicsManager.fixPixelCoord(position.getY()));
                context.lineTo(graphicsManager.fixPixelCoord(position.getX() - 7),
                    graphicsManager.fixPixelCoord(position.getY()));
                context.stroke();

                context.globalAlpha = 1;
            }
        };
    }

    function UserInterface() {
        var cursor = new Cursor();
        var performanceCounter = new PerformanceCounter();

        this.update = function (ticks) {
            performanceCounter.update(ticks);
        };

        this.render = function () {
            performanceCounter.render();
            cursor.render();
        };

        this.getCursor = function () {
            return cursor;
        };
    }

    var userInterface = new UserInterface();

    function Grid() {
        this.render = function () {
            var halfScreenWidth = (graphicsManager.getCanvas().width / 2) / camera.getScale();
            var halfScreenHeight = (graphicsManager.getCanvas().height / 2) / camera.getScale();
            var context = graphicsManager.getCanvas().getContext("2d");

            context.strokeStyle = '#00FF00';
            context.globalAlpha = 0.75;

            context.beginPath();
            context.moveTo(graphicsManager.fixPixelCoord(camera.getX() - halfScreenWidth),
                graphicsManager.fixPixelCoord(0));
            context.lineTo(graphicsManager.fixPixelCoord(camera.getX() + halfScreenWidth),
                graphicsManager.fixPixelCoord(0));
            context.stroke();

            context.beginPath();
            context.moveTo(graphicsManager.fixPixelCoord(0),
                graphicsManager.fixPixelCoord(camera.getY() + halfScreenHeight));
            context.lineTo(graphicsManager.fixPixelCoord(0),
                graphicsManager.fixPixelCoord(camera.getY() - halfScreenHeight));
            context.stroke();

            context.globalAlpha = 1;
        };
    }

    var grid = new Grid();

    function Ship() {
        var MAX_VELOCITY = 5000;
        var ACCELERATION = 5;

        var position = new Position(10000, 10000);
        position.setPosition(0, 0);

        var heading = new Heading();

        this.render = function () {
            var context = graphicsManager.getCanvas().getContext("2d");
            context.fillStyle = '#FF0000';

            context.beginPath();
            context.moveTo(graphicsManager.fixPixelCoord(position.getX()),
                graphicsManager.fixPixelCoord(position.getY() + 10));
            context.lineTo(graphicsManager.fixPixelCoord(position.getX() + 5),
                graphicsManager.fixPixelCoord(position.getY() - 5));
            context.lineTo(graphicsManager.fixPixelCoord(position.getX() - 5),
                graphicsManager.fixPixelCoord(position.getY() - 5));
            context.fill();
        };

        this.update = function (ticks) {
            if (inputManager.vk_w) {
                position.setPosition(position.getX(), position.getY() + 2 * (ticks / 16));
            }
            if (inputManager.vk_s) {
                position.setPosition(position.getX(), position.getY() - 2 * (ticks / 16));
            }
            if (inputManager.vk_d) {
                position.setPosition(position.getX() + 2 * (ticks / 16), position.getY());
            }
            if (inputManager.vk_a) {
                position.setPosition(position.getX() - 2 * (ticks / 16), position.getY());
            }
        };

        this.getPosition = function () {
            return position;
        };
    }

    var ship = new Ship();

    var render = function () {
        graphicsManager.clearCanvas();

        graphicsManager.setGameTransform();
        camera.doTransform();
        grid.render();
        ship.render();

        graphicsManager.setUiTransform();

        userInterface.render();
    };

    var update = function (ticks) {

        userInterface.update(ticks);

        ship.update(ticks);
        camera.update(ticks);

        inputManager.reset();
    };

    var vSyncWait = (function (callback) {
        return window.requestAnimationFrame        ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    }());

    var noVSyncWait = function (callback) {
        window.setTimeout(callback, 1);
    };

    var doWait = function (callback, vSync) {
        if (vSync) {
            vSyncWait(callback);
        } else {
            noVSyncWait(callback);
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
        userInterface.getCursor().setPosition(event.clientX, event.clientY);
    };

    var onMouseOut = function () {
        userInterface.getCursor().setVisible(false);
    };

    var onMouseOver = function () {
        userInterface.getCursor().setVisible(true);
    };

    var onKeyDown = function (event) {
        console.log("keydown: " + event.keyCode);
        if (event.keyCode === 87) {
            inputManager.vk_w = true;
        } else if (event.keyCode === 65) {
            inputManager.vk_a = true;
        } else if (event.keyCode === 68) {
            inputManager.vk_d = true;
        } else if (event.keyCode === 83) {
            inputManager.vk_s = true;
        }
    };

    var onKeyUp = function (event) {
        console.log("keyup: " + event.keyCode);

        if (event.keyCode === 87) {
            inputManager.vk_w = false;
        } else if (event.keyCode === 65) {
            inputManager.vk_a = false;
        } else if (event.keyCode === 68) {
            inputManager.vk_d = false;
        } else if (event.keyCode === 83) {
            inputManager.vk_s = false;
        }
    };

    var onMouseDown = function (event) {
        console.log("mousedown");
    };

    var onMouseUp = function (event) {
        console.log("mouseup");
    };

    var onMouseWheel = function (event) {
        if (event.wheelDelta) {
            if (event.wheelDelta > 0) {
                inputManager.mouseWheel = 1;
                //camera.setScale(camera.getScale() + 0.1);
            } else {
                inputManager.mouseWheel = -1;
                //camera.setScale(camera.getScale() - 0.1);
            }
        }

        // firefox impl
        /*if (event.detail) {
            if (event.detail > 0) {
                camera.setScale(camera.getScale + 0.1);

            } else {
                camera.setScale(camera.getScale - 0.1);
            }
        }*/
    };

    var initializeEventListeners = function () {
        graphicsManager.getCanvas().addEventListener("mousemove", onMouseMove, false);
        graphicsManager.getCanvas().addEventListener("mouseout", onMouseOut, false);
        graphicsManager.getCanvas().addEventListener("mouseover", onMouseOver, false);
        graphicsManager.getCanvas().addEventListener("mousedown", onMouseDown, false);
        graphicsManager.getCanvas().addEventListener("mouseup", onMouseUp, false);
        graphicsManager.getCanvas().addEventListener("mousewheel", onMouseWheel, false);
        graphicsManager.getCanvas().addEventListener("DOMMouseScroll", onMouseWheel, false);

        document.addEventListener("keydown", onKeyDown, false);
        document.addEventListener("keyup", onKeyUp, false);
    };

    var initializeGameLoop = function () {
        graphicsManager.initialize();
        audioManager.initialize();
        initializeEventListeners();

        camera.setActiveObject(ship);

        //audioManager.playMusic("screamandshout");
        audioManager.playMusic("palace");
        //audioManager.playMusic("fortune");
        //audioManager.playMusic("monday");


        gameLoop(true);
    };

    initializeGameLoop();

}());