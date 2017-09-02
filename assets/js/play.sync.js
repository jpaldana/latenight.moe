// Initialize Firebase
var config = {
    apiKey: "AIzaSyDOyoqukrUMVXXC98pqt9RvXDgccHGcyFQ",
    authDomain: "aftermirror-gcp-fb.firebaseapp.com",
    databaseURL: "https://aftermirror-gcp-fb.firebaseio.com",
    projectId: "aftermirror-gcp-fb",
    storageBucket: "aftermirror-gcp-fb.appspot.com",
    messagingSenderId: "234692929777"
};
firebase.initializeApp(config);

var database = firebase.database();
var ignoreEvent = true;
var ignoredFirstMessage = false;
var syncPlayer = true;

// firebase handlers
var chatRef = database.ref('/chat/' + room);
chatRef.on('value', function(snapshot) {
    if (!ignoredFirstMessage) {
        // don't show message from (possibly) previous session
        ignoredFirstMessage = true;
        return;
    }
	procMessage(snapshot.val().user, snapshot.val().message)
});

var roomDataRef = database.ref('/room/' + room + '/master-source');
roomDataRef.on('value', function(snapshot) {
    if (!snapshot.val()) return;
    console.log(snapshot.val());
    videoUrl = snapshot.val().video;
    if (forcedBuffer) {
        completedForcedBuffer = false;
        startForcedBuffer();
    }
    else {
	    videoLoad(snapshot.val());
    }
});

var roomStatusRef = database.ref('/room/' + room + '/master-playing');
roomStatusRef.on('value', function(snapshot) {
    //if (!snapshot.val()) return; // @@ WOW BUG
	if (snapshot.val()) {
		videoPlay();
    }
    else {
        videoPause();
	}
});

var roomSeekRef = database.ref('/room/' + room + '/master-position');
roomSeekRef.on('value', function(snapshot) {
    if (!snapshot.val()) return;
    videoResyncIfNeeded(snapshot.val());
});

var roomTitleRef = database.ref('/room/' + room + '/title');
roomTitleRef.on('value', function(snapshot) {
    if (snapshot.length > 0) {
	    $("#title").text(snapshot.val());
    }
    else {
        // not set, use generic title
        $("#title").html("<i class='fa fa-play'></i> latenight.moe");
    }
});

var roomHeartbeatRef = database.ref('/room/' + room + '/user/');
roomHeartbeatRef.on('value', function(snapshot) {
    if (!snapshot.val()) return;
	var target = snapshot.val();
	for (var k in target) {
		if (target.hasOwnProperty(k)) {
			var user = $("#heartbeat-table div[data-user='" + k + "']");
			if (user.length == 0) {
				if (Math.abs(target[k].lastHeartbeat - microtime(true)) < 5) {
                    // last heartbeat was within 5 seconds, probably still active.
					$("#heartbeat-table").append(
                        $("<div>")
                            .attr("data-user", k)
                            .append($("<span>")
                                .addClass("label label-default heartbeat-name")
                                .css("width", "140px")
                                .css("display", "inline-block")
                                .text(k))
                            .append($("<span>")
                                .addClass("label label-primary heartbeat-time"))
                            .append($("<span>")
                                .addClass("label label-success heartbeat-buffered"))
                            .append($("<span>")
                                .addClass("label label-default heartbeat-status")));
				}
			}
            
            var $target = $("#heartbeat-table div[data-user='" + k + "']");
            $target.find("span.heartbeat-time").text(target[k].currentTime.toString().toHHMMSS());
            $target.find("span.heartbeat-buffered").text(target[k].buffered.toString().toHHMMSS());
            
            var outStatus = "OK";
            var outPlaying = "Playing";
            switch (target[k].status) {
                case 0:
                    $target.find("span.heartbeat-status").removeClass("label-warning label-danger");
                break;
                case -1:
                    outStatus = "Initializing...";
                    $target.find("span.heartbeat-status").removeClass("label-danger").addClass("label-warning");
                break;
                case 1:
                    outStatus = "Loading...";
                    $target.find("span.heartbeat-status").removeClass("label-danger").addClass("label-warning");
                break;
                case 2:
                    outStatus = "Stalled";
                    $target.find("span.heartbeat-status").removeClass("label-danger").addClass("label-warning");
                break;
                case 3:
                    outStatus = "Idle";
                    $target.find("span.heartbeat-status").removeClass("label-danger").addClass("label-warning");
                break;
                case 4:
                    outStatus = "Error";
                    $target.find("span.heartbeat-status").removeClass("label-warning").addClass("label-danger");
                break;
                default:
                    outStatus = "Unknown status (" + target[k].status + ")";
                    $target.find("span.heartbeat-status").removeClass("label-warning").addClass("label-danger");
                break;
            }
            if (target[k].playing == false) {
                outPlaying = "Paused";
            }
            
            $target.find("span.heartbeat-status").text(outStatus + " - " + outPlaying);
		}
	}
});

// helpers
function roomDataUpdate(key, val) {
    if (typeof key == "undefined" || typeof val == "undefined") return;
    if (key == "master-source" && typeof val.video == "undefined") {
        // for initial purge
    }
    else {
        if (key == "master-source" && val.video.substring(0, 5) == "blob:") return;
        if (key == "master-source" && val.video == videoUrl) return; // don't keep resyncing
    }

	var updates = {};
    updates["/room/" + room + "/" + key] = val;
	database.ref().update(updates);
}

// --
// overrides

evProcMessage = function(user, message) {
    if (typeof user == 'undefined' || typeof message == 'undefined') return;
    var updates = {};
    updates['/chat/' + room] = { 'user': user, 'message': message };
    database.ref().update(updates);
};
evHeartbeat = function(source, currentTime, bufferedEnd, playerStatus, playing) {
    // only sync room master's position as master position
    if (myName == room) {
        roomDataUpdate("master-source", source);
        roomDataUpdate("master-position", currentTime);
        roomDataUpdate("master-playing", playing);
    }
    roomDataUpdate("user/" + myName, {
        'currentTime': currentTime,
        'buffered': bufferedEnd - currentTime,
        'status': playerStatus,
        'lastHeartbeat': microtime(true),
        'playing': playing
    });
};
evPaused = function(paused) {
    // allow others to pause
    if (paused) {
        roomDataUpdate("master-playing", false);
    }
    else {
        roomDataUpdate("master-playing", true);
    }
};

$(function() {
    if (host) {
        // reset
        roomDataUpdate("master-source", {});
        roomDataUpdate("master-position", 0);
        roomDataUpdate("master-playing", false);

        videoLoad({
            video: src,
            subtitle: srt,
            poster: thumb
        });
    }
});