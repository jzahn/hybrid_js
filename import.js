/*jslint vars: true, browser: true, devel: true */

var importJs = function (scriptPath) {
    "use strict";
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = scriptPath;
    head.appendChild(script);
};