var forcedBufferXhr;
var lastBufferTick = 0;
var lastBufferBuffered = 0;
var lastBufferTextHelper = "";

function startForcedBuffer() {
    if (!videoUrl) return;
    logMessage("[system]", "Starting forced buffer...");
    console.log("[exp] - starting forced buffer...");
    forcedBufferXhr = new XMLHttpRequest();
    forcedBufferXhr.open("GET", videoUrl, true);
    forcedBufferXhr.responseType = "blob";
    forcedBufferXhr.onload = function(e) {
        var myBlob = this.response;
        var localUrl = (window.webkitURL ? webkitURL : URL).createObjectURL(myBlob);
        evForcedBufferCompleted(localUrl);
    };
    forcedBufferXhr.onprogress = function(e) {
        evForcedBufferProgress(e.loaded, e.total);
    };
    forcedBufferXhr.onerror = function(e) {
        evForcedBufferFailure();
    };
    forcedBufferXhr.ontimeout = function(e) {
        evForcedBufferFailure();
    }
    forcedBufferXhr.send();
}

function evForcedBufferCompleted(url) {
    logMessage("[system]", "Video has been completely buffered.");
    console.log("[exp] - completed forced buffer");
    completedForcedBuffer = true;
    videoLoad(url);
}
function evForcedBufferProgress(buffered, total) {
    // be sure to cancel default update percentage handler in evTimeUpdate
    var currentTime = 0;
    var currentPercent = 0;
    var currentPercentBuffered = buffered / total * 100;
    var currentBytes = getReadableFileSizeString(buffered);
    var totalBytes = getReadableFileSizeString(total);

    var bufferText = "Buffering... ";
    // basic speed calculation
    var currentTick = microtime(true);
    if (lastBufferTick > 0) {
        // don't count first tick
        var diffTime = currentTick - lastBufferTick;
        // don't update until 1000ms elapses
        if (diffTime > 1) {
            var diffBuffered = buffered - lastBufferBuffered;
            // normalize to unit/sec
            var diffRatio = 1 / diffTime;
            var speed = getReadableFileSizeString(diffBuffered * diffRatio);
            var remaining = total - buffered;
            var etaRemaining = (remaining / (diffBuffered * diffRatio)).toString().toHHMMSS();
            lastBufferTextHelper = speed + "/s - " + etaRemaining + " remaining";
            lastBufferTick = currentTick;
            lastBufferBuffered = buffered;
        }
    }
    else {
        lastBufferTick = currentTick;
        lastBufferBuffered = buffered;
    }

    $("#progress-current").css("width", currentPercent + "%");
    $("#progress-buffered").css("width", currentPercentBuffered + "%");
    $("#progress-current-label").text(bufferText + lastBufferTextHelper);
    $("#progress-buffered-label").text(currentBytes);
    $("#progress-total-label").text(totalBytes);
}
function evForcedBufferFailure() {
    logMessage("[system]", "Failed to buffer video.");
}

function getReadableFileSizeString(fileSizeInBytes) {
    var i = -1;
    var byteUnits = [' kB', ' MB', ' GB', ' TB', 'PB', 'EB', 'ZB', 'YB'];
    do {
        fileSizeInBytes = fileSizeInBytes / 1024;
        i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
};

// http://jeffrey-kohn.com/code/
// Javascript equivalent for PHP's microtime
function microtime(get_as_float) {
    var unixtime_ms = (new Date).getTime();
    var sec = Math.floor(unixtime_ms/1000);
    return get_as_float ? (unixtime_ms/1000) : (unixtime_ms - (sec * 1000))/1000 + ' ' + sec;
}