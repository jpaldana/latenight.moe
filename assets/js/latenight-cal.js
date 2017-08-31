var refToday = new Date();
var today = new Date();
var dayOfWeek = today.getDay();
var sundayStart = getSunday(today);
var startFilter = formatDate(sundayStart);
var saturdayStart = sundayStart;
saturdayStart.setHours(24 * 7);
var endFilter = formatDate(saturdayStart);

var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getSunday(date) {
    var day = date.getDay() || 7;
    if (day !== 0) {
        date.setHours(-24 * day);
    }
    return date;
}
function formatDate(date) {
    return date.getFullYear() + "-" + padNumber(date.getMonth() + 1) + "-" + padNumber(date.getDate());
}
function padNumber(number) {
    if (number < 10) {
        number = "0" + number;
    }
    return number;
}

function LoadResults() {
    $("#cal-sidebar").empty();
    $("#cal-week").text(startFilter + " to " + endFilter);
    console.log("start", startFilter, "end", endFilter);
    $.post("/api/GetCalendar", {
        start: startFilter,
        end: endFilter
    })
    .done(function(data) {
        console.log("LoadResults() called");
        console.log(data);
        dataCache = data;
        ParseResults(data);
    })
    .fail(function() {
        console.log("Failed to call API: GetCalendar");
    })
    .always(function() {
        console.log("LoadResults() done");
    });
}

function ParseResults(data) {
    for (var id in data) {
        AddSidebarEpisode(data[id]);
    }
}

function AddSidebarEpisode(entry) {
    console.log(entry);
    var date = new Date(entry.airDateUtc);
    var border;
    var textAdditionalClasses;
    if (date <= refToday) { // $today is modified on date change
        if (entry.hasFile) {
            border = "cal-episode-success";
        }
        else {
            border = "cal-episode-danger";
        }
    }
    else {
        border = "cal-episode-primary cal-future";
    }
    $("#cal-sidebar")
    .append(
        $("<div>")
        .addClass("row cal-episode")
        .append(
            $("<div>")
            .addClass("col-xs-4 cal-episode-date " + border)
            .append(
                $("<h5>")
                .text(date.getDate())
            )
            .append(
                $("<h6>")
                .text(dayNames[date.getDay()])
            )
        )
        .append(
            $("<div>")
            .addClass("col-xs-8 cal-episode-meta")
            .append(
                $("<h6>")
                .text(entry.series.title)
            )
            .append(
                $("<small>")
                .text(entry.series.airTime)
            )
            .append(
                $("<p>")
                .text(entry.seasonNumber + "x" + entry.episodeNumber + " " + entry.title)
            )
            .on("click", function(e) {
                location.href = "/info/" + entry.series.id + "/" + entry.series.titleSlug;
            })
        )
    );
}

$("#cal-nav-prev").on("click", function(e) {
    today = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7
    );
    sundayStart = getSunday(today);
    startFilter = formatDate(today);
    saturdayStart = sundayStart;
    saturdayStart.setHours(24 * 7);
    endFilter = formatDate(saturdayStart);
    LoadResults();
});
$("#cal-nav-next").on("click", function(e) {
    today = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 7
    );
    sundayStart = getSunday(today);
    startFilter = formatDate(today);
    saturdayStart = sundayStart;
    saturdayStart.setHours(24 * 7);
    endFilter = formatDate(saturdayStart);
    LoadResults();
});

$(function() {
    LoadResults();
});