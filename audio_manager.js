var HYBRID = (function (hybrid) {
    "use strict";

	hybrid.AudioManager = function AudioManager() {
        var audio;
        var mp3Source;
        var oggSource;

        this.onended = function onended() {
            console.log("audioManager.onended");
        };

        this.initialize = function initialize() {
            audio = document.createElement("audio");
            audio.setAttribute("loop", true);

            mp3Source = document.createElement("source");
            mp3Source.setAttribute("type", "audio/mp3");

            oggSource = document.createElement("source");
            oggSource.setAttribute("type", "audio/ogg");
            document.body.appendChild(audio);
            audio.appendChild(mp3Source);
            audio.appendChild(oggSource);

            audio.addEventListener('ended', onended);
        };

        this.playMusic = function playMusic(pathMinusExtension) {
            mp3Source.setAttribute("src", "resources/music/" +
                pathMinusExtension + ".mp3");
            oggSource.setAttribute("src", "resources/music/" +
                pathMinusExtension + ".ogg");
            audio.play();
        };

        this.getAudio = function getAudio() {
            return audio;
        };
    }


	return hybrid;

}(HYBRID || {}));