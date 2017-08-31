var $mediaPlayer = $("#media");
var $mediaSrc = $("#media-src");
var videoObj = videojs("media", {
    html5: {
        nativeTextTracks: false
    },
    techOrder: ["html5", "youtube"],
    autoplay: false,
    controls: true,
    fluid: true,
    preload: 'metadata',
    loop: false
    /*
    youtube: {
        ytControls: 2
    }
    */
});
const AUTOPLAY_VIDEO = false;
const STATUS_INIT = -1;
const STATUS_OK = 0;
const STATUS_LOAD = 1;
const STATUS_STALL = 2;
const STATUS_IDLE = 3;
const STATUS_ERROR = 4;
const EVENT_INIT = -1;
const EVENT_ENDED = 10;
const EVENT_ERROR = 11;
const EVENT_LOADEDDATA = 12;
const EVENT_LOADEDMETADATA = 13;
const EVENT_TIMEUPDATE = 14;
const EVENT_USERACTIVE = 15;
const EVENT_USERINACTIVE = 16;
const EVENT_VOLUMECHANGE = 17;
const EVENT_PLAY = 18;
const EVENT_PAUSE = 19;
const EVENT_ABORT = 20;
const EVENT_CANPLAY = 21;
const EVENT_CANPLAYTHROUGH = 22;
const EVENT_LOADSTART = 23;
const EVENT_PLAYING = 24;
const EVENT_PROGRESS = 25;
const EVENT_SEEKED = 26;
const EVENT_SEEKING = 27;
const EVENT_STALLED = 28;
const EVENT_WAITING = 29;

// these values get updated by event listeners
var playerStatus = STATUS_INIT;
var previousPlayerStatus;
var playerEvent = EVENT_INIT;

/*
function videoLoad(video) {
    videoObj.reset();
    videoObj.src({
        "type": "video/mp4",
        "src": video
    });
    // videoObj.poster(poster);
    if (AUTOPLAY_VIDEO) {
        videoObj.play();
    }
}
*/
function videoLoad(ob) {
    console.log("videoLoad() called");

    // sanity check
    if (ob.video == videoObj.src() && videoObj.textTracks().length > 0) {
        // video already set and subtitles exist, suppress videoLoad();
        console.log("Suppressed additional videoLoad()");
        return;
    }

    videoObj.reset();
    // remove any existing text tracks
    while (videoObj.textTracks().length > 0) {
        console.log("Remove text track", videoObj.textTracks()[0]);
        videoObj.removeRemoteTextTrack(videoObj.textTracks()[0]);
    }
    if (ob.video.lastIndexOf("youtube.com") > 0) {
        console.log("Loading YouTube video", ob.video);
        videoObj.src({
            "type": "video/youtube",
            "src": ob.video
        });
    }
    else {
        console.log("Loading regular video", ob.video);
        videoObj.src({
            "type": "video/mp4",
            "src": ob.video
        });
    }
    if (ob.poster) {
        console.log("Loading poster", ob.poster);
        videoObj.poster(ob.poster);
    }
    if (ob.subtitle) {
        console.log("Loading subtitles", ob.subtitle);
        videoObj.addRemoteTextTrack({
            "src": ob.subtitle,
            "kind": "captions",
            "srclang": "en",
            "label": "English",
            "default": true
        });
        videoObj.textTracks()[0].mode = 'showing';
        console.log("Subtitle textTrack", videoObj.textTracks()[0]);
    }
    if (AUTOPLAY_VIDEO) {
        videoObj.play();
    }
}
function videoLoad2(ob) {
    videoLoad(ob);
}
function videoPlay() {
    videoObj.play();
}
function videoPause() {
    videoObj.pause();
}
function videoResyncIfNeeded(position) {
    if (Math.abs(videoObj.currentTime() - position) > 5) {
        videoObj.currentTime(position);
    }
}
/*
function videoReadBuffers() {
    evBufferStatus(videoObj.bufferedEnd(), videoObj.bufferedPercent());
}
function videoReadStatuses() {
    evStatus(
        videoObj.currentTime(),
        videoObj.networkState(),
        videoObj.paused(),
        videoObj.readyState());
}
*/

// --
// listen to events

var statusError = function(e) {
    playerStatus = STATUS_ERROR;
    playerEvent = e;
    logMessage("[debug]", "error-event: " + e);
};
var statusIdle = function(e) {
    playerStatus = STATUS_IDLE;
    playerEvent = e;
    logMessage("[debug]", "idle-event: " + e);
};
var statusOk = function(e) {
    playerStatus = STATUS_OK;
    playerEvent = e;
    logMessage("[debug]", "ok-event: " + e);
};
var statusStall = function(e) {
    playerStatus = STATUS_STALL;
    playerEvent = e;
    logMessage("[debug]", "stall-event: " + e);
};
var statusNoChange = function(e) {
    //logMessage("[debug]", "noop-event: " + e);
};

var procAllStatus = function() {
    previousPlayerStatus = playerStatus;
    logMessage("[debug]", "playerStatus: " + playerStatus);
    procAnimations(); // for debug

    //console.log(videoObj.currentTime() + ", " + videoObj.bufferedEnd());
    evTimeUpdate(videoObj.currentTime(), videoObj.bufferedEnd(), videoObj.duration());
    evHeartbeat({
        video: (videoObj.src()) ? videoObj.src() : '',
        poster: (videoObj.poster().length > 0) ? videoObj.poster() : '',
        subtitle: (videoObj.textTracks().length > 0) ? videoObj.textTracks()[0].src : ''
    }, videoObj.currentTime(), videoObj.bufferedEnd(), playerStatus, !videoObj.paused());
};
var procAllStatusInterval = setInterval(procAllStatus, 1000);

videoObj.on("ended", function() { statusIdle(EVENT_ENDED) });
videoObj.on("error", function() { statusError(EVENT_ERROR) });
videoObj.on("loadeddata", function() { statusNoChange(EVENT_LOADEDDATA) });
videoObj.on("loadedmetadata", function() { statusNoChange(EVENT_LOADEDMETADATA) });
videoObj.on("timeupdate", function() { statusOk(EVENT_TIMEUPDATE) });
videoObj.on("useractive", function() { statusNoChange(EVENT_USERACTIVE) });
videoObj.on("userinactive", function() { statusNoChange(EVENT_USERINACTIVE) });
videoObj.on("volumechange", function() { statusNoChange(EVENT_VOLUMECHANGE) });

videoObj.on("play", function() { statusNoChange(EVENT_PLAY); evPaused(false); });
videoObj.on("pause", function() { statusNoChange(EVENT_PAUSE); evPaused(true); });
videoObj.on("abort", function() { statusError(EVENT_ABORT) });
videoObj.on("canplay", function() { statusNoChange(EVENT_CANPLAY) });
videoObj.on("canplaythrough", function() { statusNoChange(EVENT_CANPLAYTHROUGH) });
videoObj.on("loadstart", function() { statusOk(EVENT_LOADSTART) });
videoObj.on("playing", function() { statusNoChange(EVENT_PLAYING) });
videoObj.on("progress", function() { statusNoChange(EVENT_PROGRESS) });
videoObj.on("seeked", function() { statusNoChange(EVENT_SEEKED); });
videoObj.on("seeking", function() { statusNoChange(EVENT_SEEKING); });
videoObj.on("stalled", function() { statusStall(EVENT_STALLED) });
videoObj.on("waiting", function() { statusStall(EVENT_WAITING) });

// --
// debug
var debugFn = function(text) { console.log(text); }

// --
// override these functions in sync
var evBufferStatus = function(end, percent) {};
var evPaused = function(paused) {};
var evHeartbeat = function(source, currentTime, bufferedEnd, playerStatus, playing) {};
// override in ui
var evTimeUpdate = function(currentTime, buffered, total) {};


$(function() {
    // debug
    //setTimeout("videoLoad(videoUrl);", 1000);
});