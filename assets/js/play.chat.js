var lastUser;
const KEY_ENTER = 13;
const CHAT_TIMEOUT = 8;
var $chatCollection = $("#screen-chat");

var cfgShowDebugLogs = false;

$("#chatbox").on("keydown", function(e) {
    if (e.which == KEY_ENTER && $(this).val().length > 0) {
        //procMessage(myName, $(this).val());
        evProcMessage(myName, $(this).val());
        $(this).val("");
    }
});

function procMessage(user, message) {
    if (lastUser == user) {
        appendMessage(message);
    }
    else {
        newMessage(user, message);
    }
    lastUser = user;
    logMessage(user, message);
    procAnimations();
}
function appendMessage(message) {
    $("#screen-chat li:last-child > p").append(
        $("<span>")
            .addClass("message")
            .text(message)
            .attr("data-timeout", CHAT_TIMEOUT)
    );
}
function newMessage(user, message) {
    $chatCollection.append(
        $("<li>")
            .attr("data-name", user)
            .attr("data-timeout", CHAT_TIMEOUT)
            .html(
                $("<p>")
                    .append(
                        $("<span>")
                            .addClass("name")
                            .text(user)
                    )
                    .append(
                        $("<span>")
                            .addClass("message")
                            .text(message)
                            .attr("data-timeout", CHAT_TIMEOUT)
                    )
            )
    );
}
function logMessage(user, message) {
    if (user == '[debug]' && !cfgShowDebugLogs) return;
    $("#log-chat").append(
        $("<li>")
            .text(user + ": " + message)
    );
}

function procAnimations() {
    $(".scroll").each(function(e) {
        $(this).stop(true, true).animate({ scrollTop: $(this).prop("scrollHeight") }, 1000);
    });
}
var tickChatToggle = function() {
    $("#screen-chat li").each(function() {
        var messageActiveCount = 0;
        $(this).find("span.message").each(function() {
            if ($(this).attr("data-timeout") > 0) {
                $(this)
                    .attr("data-timeout", parseInt($(this).attr("data-timeout"), 10) - 1);
                    //.removeClass("message-hidden");
                messageActiveCount++;
            }
            else {
                $(this).remove();
                //$(this).addClass("message-hidden");
            }
        });
        if (messageActiveCount == 0) {
            $(this).fadeOut(200);
        }
        else if (!$(this).visible) {
            // new message by the same person
            $(this).fadeIn(200);
        }
    });
}

var tickChatToggleInterval = setInterval(tickChatToggle, 1000);

// --
// override these functions in sync
var evProcMessage = function(user, message) { };


//newMessage("test", "Hello, world.");
//appendMessage("hihi");