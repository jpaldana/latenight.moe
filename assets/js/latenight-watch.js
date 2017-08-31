var dataCache;

function LoadEpisodeData(entryId) {
    $.post("/api/GetEpisodeData", {
        id: entryId
    })
    .done(function(data) {
        console.log("LoadEpisodeData() called");
        console.log(data);
        dataCache = data;
        $("#play-title").attr("value", data.series.title + " - " + data.seasonNumber + "x" + data.episodeNumber + ": " + data.title);
        $("#play-thm").attr("value", "https://media.latenight.moe:12901/api.php?req=Thumbnail&path=" + encodeURIComponent(data.episodeFile.path));
        EpisodeListener(data.hash);
        StartProcessor(data);
    })
    .fail(function() {
        console.log("Failed to call API: LoadEpisodeData");
    })
    .always(function() {
        console.log("LoadEpisodeData() done");
    });
}
function StartProcessor(file) {
    $.post("/api/EpisodeParser", {
        file: dataCache.episodeFile.path
    })
    .done(function(data) {
        console.log("EpisodeParser() called");
        console.log(data);
        dataCache = data;
    })
    .fail(function() {
        console.log("Failed to call API: EpisodeParser");
    })
    .always(function() {
        console.log("EpisodeParser() done");
    });
}

function EpisodeListener(hash) {
    var eventRef = firebase.database().ref('api/process/status/' + hash);
    eventRef.on('value', function(snapshot) {
        var res = snapshot.val();
        console.log(res);
        $("#watch-msg").text(res.message + " - " + res.percentage + "%");
        $("#watch-progress").css("width", res.percentage + "%");

        if (res.status == 1 && res.percentage == 100) {
            $("#postProc").fadeIn();
            $("#preProc").fadeOut();
            $("#play-src").attr("value", res.source);
            $("#play-srt").attr("value", res.subtitleFile);
        }
    });
}

$(function() {
    LoadEpisodeData(entryId);
});