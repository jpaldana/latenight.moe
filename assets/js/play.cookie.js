$(function() {
    var optOutCookie = Cookies.get("disabledCookie");
    if (typeof optOutCookie !== "undefined" && optOutCookie == "true") {
        // user opted out of cookies.
        $("#chkCookie").click();
    }
    else {
        // attempt to recover settings if they exist
        var cookieDarkRoom = Cookies.get("darkRoom");
        var cookieForceBuffer = Cookies.get("forceBuffer");
        var cookieUnsync = Cookies.get("unsync");
        var cookieDebugMessages = Cookies.get("debugMessages");
        var cookieLowBandwidth = Cookies.get("lowBandwidth");

        // only trigger if not default
        if (typeof cookieDarkRoom !== "undefined") {
            if (cookieDarkRoom == "true") {
                $("#chkDarkRoom").click();
            }
        }
        if (typeof cookieForceBuffer !== "undefined") {
            if (cookieForceBuffer == "true") {
                $("#chkForceBuffer").click();
            }
        }
        if (typeof cookieUnsync !== "undefined") {
            if (cookieUnsync == "true") {
                $("#chkUnsync").click();
            }
        }
        if (typeof cookieDebugMessages !== "undefined") {
            if (cookieDebugMessages == "true") {
                $("#chkDebugLog").click();
            }
        }
        if (typeof cookieLowBandwidth !== "undefined") {
            if (cookieLowBandwidth == "true") {
                $("#chkLowBandwidth").click();
            }
        }
        // temp?
        var cookieUsername = Cookies.get("latenightMoeUsername");
        if (typeof cookieUsername !== "undefined") {
            myName = cookieUsername;
        }
        else if (typeof name !== "undefined") {
            myName = name;
            Cookies.set("latenightMoeUsername", myName);
        }
        else {
            var prompt = window.prompt("Enter your name");
            if (prompt) {
                myName = prompt;
            }
            else {
                myName = "guest" + Math.ceil(Math.random() * 10000);
            }
            Cookies.set("latenightMoeUsername", myName);
        }
        evProcMessage("[system]", myName + " has joined the room.");
    }
});