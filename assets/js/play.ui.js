$("#btnClearLogs").on("click", function(e) {
    $("#log-chat li").each(function(e) {
        $(this).remove();
    });
});

$("#chkDarkRoom").on("change", function(e) {
    if ($(this).prop("checked")) {
        $("body").addClass("dark");
    }
    else {
        $("body").removeClass("dark");
    }
    if (cookies) Cookies.set("darkRoom", $(this).prop("checked") ? "true" : "false", { expires: 365 });
});

$("#chkForceBuffer").on("change", function(e) {
    if ($(this).prop("checked")) {
        forcedBuffer = true;
        startForcedBuffer();
    }
    else {
        forcedBuffer = false;
    }
    if (cookies) Cookies.set("forceBuffer", forcedBuffer ? "true" : "false", { expires: 365 });
});

$("#chkUnsync").on("change", function(e) {
    syncPlayer = !syncPlayer;
    if (cookies) Cookies.set("unsync", syncPlayer ? "true" : "false", { expires: 365 });
    logMessage("[system]", "Player sync is now " + (syncPlayer ? "enabled" : "disabled"));
});
$("#chkDebugLog").on("change", function(e) {
    cfgShowDebugLogs = !cfgShowDebugLogs;
    if (cookies) Cookies.set("debugMessages", cfgShowDebugLogs ? "true" : "false", { expires: 365 });
    logMessage("[system]", "Debug logs are now " + (cfgShowDebugLogs ? "enabled" : "disabled"));
});
$("#chkCookie").on("change", function(e) {
    cookies = !cookies;
    if (!cookies) {
        Cookies.set("disabledCookie", "true", { expires: 365 });
        // wipe out cookies
        Cookies.remove("darkRoom");
        Cookies.remove("forceBuffer");
        Cookies.remove("unsync");
        Cookies.remove("debugMessages");
        Cookies.remove("lowBandwidth");
    }
    else {
        Cookies.remove("disabledCookie");
    }
    logMessage("[system]", "Cookies are now " + (cookies ? "enabled" : "disabled"));
});
$("#chkLowBandwidth").on("change", function(e) {
    lowBandwidth = !lowBandwidth;
    if (cookies) Cookies.set("lowBandwidth", lowBandwidth ? "true" : "false", { expires: 365 });
    logMessage("[system]", "Low bandwidth mode is now " + (cookies ? "enabled" : "disabled"));
});

$("#btnLoadCustomURL").on("click", function(e) {
    var prompt = window.prompt("Enter URL...");
    if (prompt) {
        if (prompt.lastIndexOf('|') > 0) {
            var prompt2 = prompt.split('|');
            videoLoad({
                video: prompt2[0],
                subtitle: prompt2[1],
                poster: prompt2[2]
            });
        }
        else {
            videoLoad({
                video: prompt,
                subtitle: '',
                poster: ''
            });
        }
    }
});
$("#btnResetUsername").on("click", function(e) {
    var prompt = window.prompt("Enter your name");
    if (prompt) {
        myName = prompt;
    }
    else {
        myName = "guest" + Math.ceil(Math.random() * 10000);
    }
    Cookies.set("latenightMoeUsername", myName);
});

// progress
evTimeUpdate = function(currentTime, buffered, total) {
    var currentPercent = currentTime / total * 100;
    var currentPercentBuffered = (buffered - currentTime) / total * 100;

    if (forcedBuffer && !completedForcedBuffer) {
        // user opted to force buffer, allow evForcedBufferProgress to update instead
        return;
    }

    //console.log(currentPercent, currentPercentBuffered, currentTime, buffered, total);
    $("#progress-current").css("width", currentPercent + "%");
    $("#progress-buffered").css("width", currentPercentBuffered + "%");
    $("#progress-current-label").text(currentTime.toString().toHHMMSS());
    $("#progress-buffered-label").text((buffered - currentTime).toString().toHHMMSS());
    $("#progress-total-label").text(total.toString().toHHMMSS());
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}