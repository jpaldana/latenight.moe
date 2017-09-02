var dataCache;

function LoadEpisodeData(entryId) {
    $.post("/api/GetEpisodeData", {
        id: entryId,
        isMovie: movie
    })
    .done(function(data) {
        console.log("LoadEpisodeData() called");
        console.log(data);
        dataCache = data;
        if (movie) {
            $("#play-title").attr("value", data.title);
            $("#play-thm").attr("value", "https://media.latenight.moe:12901/api.php?req=Thumbnail&path=" + encodeURIComponent(data.path));
            $("#watch-btn-direct").attr("href", "https://media.latenight.moe:12901/api.php?req=Direct&path=" + encodeURIComponent(data.path));
        }
        else {
            $("#play-title").attr("value", data.series.title + " - " + data.seasonNumber + "x" + data.episodeNumber + ": " + data.title);
            $("#play-thm").attr("value", "https://media.latenight.moe:12901/api.php?req=Thumbnail&path=" + encodeURIComponent(data.episodeFile.path));
            $("#watch-btn-direct").attr("href", "https://media.latenight.moe:12901/api.php?req=Direct&path=" + encodeURIComponent(data.episodeFile.path));
        }
        if (window.location.host == "neko.latenight.moe:81") {
            if (movie) {
                $("#watch-btn-direct-local").attr("href", "https://local-media.latenight.moe" + data.path);
            }
            else {
                $("#watch-btn-direct-local").attr("href", "https://local-media.latenight.moe" + data.episodeFile.path);
            }
        }
        else {
            $("#watch-btn-direct-local").hide();
        }
    })
    .fail(function() {
        console.log("Failed to call API: LoadEpisodeData");
    })
    .always(function() {
        console.log("LoadEpisodeData() done");
    });
}
function StartProcessor(file, useSource = 0) {
    var path;
    if (movie) {
        path = dataCache.path;
    }
    else {
        path = dataCache.episodeFile.path;
    }
    $.post("/api/EpisodeParser", {
        file: path,
        source: useSource
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

$("#watch-btn-stream").on("click", function(e) {
    $("#optProc").hide();
    $("#preProc").show();
    EpisodeListener(dataCache.hash + "_src");
    StartProcessor(dataCache, 1);
});

$("#watch-btn-stream-downscaled").on("click", function(e) {
    $("#optProc").hide();
    $("#preProc").show();
    EpisodeListener(dataCache.hash);
    StartProcessor(dataCache, 0);
});

$(function() {
    LoadEpisodeData(entryId);
});