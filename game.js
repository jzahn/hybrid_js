var HYBRID = (function (hybrid, window, document, console) {
    "use strict";

    var graphicsManager = new hybrid.GraphicsManager();
    var audioManager = new hybrid.AudioManager();
    var inputManager = new hybrid.InputManager();
    var timer = new hybrid.Timer();
    var camera = new hybrid.Camera(graphicsManager, inputManager);
    var userInterface = new hybrid.UserInterface(graphicsManager);
    var grid = new hybrid.Grid(graphicsManager, camera);
    var ship = new hybrid.Ship(graphicsManager, inputManager);

    var render = function render() {
        graphicsManager.clearCanvas();

        graphicsManager.setGameTransform();
        camera.doTransform();
        grid.render();
        ship.render();

        graphicsManager.setUiTransform();
        userInterface.render();
    };

    var update = function update(ticks) {

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

    var noVSyncWait = function noVSyncWait(callback) {
        window.setTimeout(callback, 1);
    };

    var doWait = function doWait(callback, vSync) {
        if (vSync) {
            vSyncWait(callback);
        } 
        else {
            noVSyncWait(callback);
        }
    };

    var gameLoop = function gameLoop(vSync) {
        doWait(gameLoop, vSync);
        update(timer.tick());
        render();
    };

    window.onresize = function onresize() {
        graphicsManager.resizeCanvas();
    };

    document.oncontextmenu = function oncontextmenu() {
        return false;
    };

    var onMouseMove = function onMouseMove(event) {
        userInterface.getCursor().setPosition(event.clientX, event.clientY);
    };

    var onMouseOut = function onMouseOut() {
        userInterface.getCursor().setVisible(false);
    };

    var onMouseOver = function onMouseOver() {
        userInterface.getCursor().setVisible(true);
    };

    var onKeyDown = function onKeyDown(event) {
        //console.log("keydown: " + event.keyCode);
        if (event.keyCode === 87) {
            inputManager.vk_w = true;
        } 
        else if (event.keyCode === 65) {
            inputManager.vk_a = true;
        } 
        else if (event.keyCode === 68) {
            inputManager.vk_d = true;
        } 
        else if (event.keyCode === 83) {
            inputManager.vk_s = true;
        }
    };

    var onKeyUp = function onKeyUp(event) {
        //console.log("keyup: " + event.keyCode);

        if (event.keyCode === 87) {
            inputManager.vk_w = false;
        } 
        else if (event.keyCode === 65) {
            inputManager.vk_a = false;
        } 
        else if (event.keyCode === 68) {
            inputManager.vk_d = false;
        } 
        else if (event.keyCode === 83) {
            inputManager.vk_s = false;
        }
    };

    var onMouseDown = function onMouseDown(event) {
        //console.log("mousedown");
        event.preventDefault();
        inputManager.mouse1 = true;
    };

    var onMouseUp = function onMouseUp(event) {
        //console.log("mouseup");
        event.preventDefault();
        inputManager.mouse1 = false;
    };

    var onMouseWheel = function onMouseWheel(event) {
        if (event.wheelDelta) {
            if (event.wheelDelta > 0) {
                inputManager.mouseWheel = 1;
            } 
            else {
                inputManager.mouseWheel = -1;
            }
        }

        // firefox/moz impl
        if (event.detail) {
            if (event.detail > 0) {
                inputManager.mouseWheel = -1;
            } 
            else {
                inputManager.mouseWheel = +1;
            }
        }
    };

    var initializeEventListeners = function initializeEventListeners() {
        graphicsManager.getCanvas().addEventListener("mousemove", onMouseMove, false);
        graphicsManager.getCanvas().addEventListener("mouseout", onMouseOut, false);
        graphicsManager.getCanvas().addEventListener("mouseover", onMouseOver, false);
        graphicsManager.getCanvas().addEventListener("mousedown", onMouseDown, false);
        graphicsManager.getCanvas().addEventListener("mouseup", onMouseUp, false);
        graphicsManager.getCanvas().addEventListener("mousewheel", onMouseWheel, false);

        window.addEventListener("DOMMouseScroll", onMouseWheel, false);

        document.addEventListener("keydown", onKeyDown, false);
        document.addEventListener("keyup", onKeyUp, false);
    };

    var initializeGameLoop = function initializeGameLoop() {
        graphicsManager.initialize();
        audioManager.initialize();
        initializeEventListeners();

        camera.setActiveObject(ship);

        //audioManager.playMusic("screamandshout");
        //audioManager.playMusic("palace");
        //audioManager.playMusic("fortune");
        //audioManager.playMusic("monday");
        //audioManager.playMusic("deadmau5");


        gameLoop(true);
    };

    initializeGameLoop();

    return hybrid;

}(HYBRID || {}, window, document, console));