/*jslint browser: true, devel: true, debug: false, plusplus: true, unparam: true, vars: true */
var HYBRID = (function (hybrid, document) {
    "use strict";

    var graphicsManager = new hybrid.GraphicsManager();
    var audioManager = new hybrid.AudioManager();
    var inputManager = new hybrid.InputManager();
    var timer = new hybrid.Timer();
    var camera = new hybrid.Camera(graphicsManager, inputManager);
    var userInterface = new hybrid.UserInterface(graphicsManager);
    var grid = new hybrid.Grid(graphicsManager, camera);
    var ship = new hybrid.Ship(graphicsManager, inputManager);

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
        } 
        else {
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

    var onKeyUp = function (event) {
        console.log("keyup: " + event.keyCode);

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

    var onMouseDown = function (event) {
        console.log("mousedown");
        event.preventDefault();
    };

    var onMouseUp = function (event) {
        console.log("mouseup");
        event.preventDefault();
    };

    var onMouseWheel = function (event) {
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

    var initializeEventListeners = function () {
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

    var initializeGameLoop = function () {
        graphicsManager.initialize();
        audioManager.initialize();
        initializeEventListeners();

        camera.setActiveObject(ship);

        //audioManager.playMusic("screamandshout");
        //audioManager.playMusic("palace");
        //audioManager.playMusic("fortune");
        //audioManager.playMusic("monday");
        audioManager.playMusic("deadmau5");


        gameLoop(true);
    };

    initializeGameLoop();

    return hybrid;

}(HYBRID || {}, document));




/*function DeeJay() {
        // plays looping sets
        var setList = [];
    }

    function DeeJaySet() {
        // a set of songs
        var songList = [];
    }*/

    
