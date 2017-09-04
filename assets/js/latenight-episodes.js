var dataCache;

function LoadEpisodes(entryId) {
    $.post("/api/GetEpisodes", {
        id: entryId
    })
    .done(function(data) {
        console.log("LoadEpisodes() called");
        console.log(data);
        dataCache = data;
        ParseEpisodes(data);
    })
    .fail(function() {
        console.log("Failed to call API: LoadEpisodes");
    })
    .always(function() {
        console.log("LoadEpisodes() done");
    });
}

function ParseEpisodes(data) {
    $("#info-episode-container").empty();
    CreateStartingBlock();

    for (var id in data) {
        CreateEpisodeBlock(id, data[id]);
    }

    AddSeasonTabEventHandlers();
    responsiveUi();
}

function CreateStartingBlock() {
    $("#info-episode-container")
    .append(
        $("<ul>")
        .addClass("nav nav-tabs")
        .attr("id", "info-season-nav")
    )
    .append(
        $("<div>")
        .addClass("tab-content")
        .attr("id", "info-season-tabs")
    );
}

function CreateSeasonBlock(season) {
    var ariaExpanded = "false";
    var extraNavClasses = "";
    var extraTabClasses = "";
    if (season == targetSeason) {
        ariaExpanded = "true";
        extraNavClasses = " active";
        extraTabClasses = " in active show";
    }
    $("#info-season-nav")
    .append(
        $("<li>")
        .addClass("nav-item")
        .append(
            $("<a>")
            .addClass("nav-link tab-season-link" + extraNavClasses)
            .attr("data-toggle", "tab")
            .attr("data-season", season)
            .attr("href", "#info-season-tab-" + season)
            .attr("aria-expanded", ariaExpanded)
            .text("Season " + season)
        )
    );
    $("#info-season-tabs")
    .append(
        $("<div>")
        .addClass("tab-pane fade" + extraTabClasses)
        .attr("id", "info-season-tab-" + season)
        .attr("aria-expanded", ariaExpanded)
        .append(
            $("<div>")
            .addClass("row")
            .attr("id", "info-season-tab-row-" + season)
        )
    );
}

function CreateEpisodeBlock(id, result) {
    var season = result.seasonNumber;
    if (season == 0) return; // skip s0 (for now)
    if ($("#info-season-tab-" + season).length == 0) {
        CreateSeasonBlock(season);
    }

    var episodeName = typeof(result.title) == "string" ? result.title : "(untitled)";

    if (result.hasFile) {
        $("#info-season-tab-row-" + season)
        .append(
            $("<div>")
            .addClass("col-xs-6 col-md-4 col-lg-3 info-episode-thumb bg-fill ar-16-9 lazy")
            .attr("data-id", id)
            .css("background-image", "url(" + hostBaseUrl + "Thumbnail&path=" + encodeURIComponent(result.episodeFile.path).replace(/\(/g, "%28").replace(/\)/g, "%29") + ")")
            .append(
                $("<span>")
                .text(result.episodeNumber + ". " + episodeName)
            )
        );
    }
    else {
        $("#info-season-tab-row-" + season)
        .append(
            $("<div>")
            .addClass("col-xs-6 col-md-4 col-lg-3 info-episode-thumb bg-fill ar-16-9 lazy")
            .attr("data-id", id)
            .css("background-image", "url(/assets/images/blank_poster.jpg)")
            .append(
                $("<span>")
                .text(result.episodeNumber + ". " + episodeName)
            )
        );
    }

    //console.log(id, result);
}

function AddSeasonTabEventHandlers() {
    $(".tab-season-link").on("click", function(e) {
        console.log("AddSeasonTabEventHandlers event handler");
        var season = $(this).attr("data-season");
        if (season == 0) {
            // do nothing for s0
        }
        else if (targetSeason == season) {
            // do nothing, same tab
        }
        else {
            targetSeason = season;
            $.post("/api/GetOtherSeasonData", {
                current: id,
                targetSeason: season
            })
            .done(function(data) {
                if (data.success) {
                    $("#info-main-details").load(data.url + " #info-main-details");
                }
            })
            .fail(function() {
                console.log("Failed to call API: AddSeasonTabEventHandlers");
            })
            .always(function() {
                console.log("AddSeasonTabEventHandlers() done");
            });
        }
    });
    $(".info-episode-thumb").off("click").on("click", function(e) {
        DetailPopup($(this).attr("data-id"));
    });
}

function DetailPopup(id) {
    console.log("DetailPopup() called");
    var episodeName = typeof(dataCache[id].title) == "string" ? dataCache[id].title : "(untitled)";

    $("#latenight-list-modal-title").text(episodeName);
    $("#latenight-list-modal-body").empty();
    $("#latenight-list-modal-body")
    .append(
        $("<div>")
        .addClass("latenight-list-modal-spanner")
        .css("background-image", "url(" + hostBaseUrl + "Thumbnail&path=" + encodeURIComponent(dataCache[id].episodeFile.path) + ")")
    )
    .append(
        $("<p>")
        .addClass("latenight-list-modal-overview")
        .html(dataCache[id].overview)
    )
    .append(
        $("<p>")
        .addClass("text-primary")
        .text("Quality: " + dataCache[id].episodeFile.quality.quality.name)
    );
    $("#latenight-list-modal-view").off("click").on("click", function(e) {
        location.href = "/watch/" + dataCache[id].id;
    });
    $("#latenight-list-modal").modal("show");
}

function GetTitle(result) {
    if (result.title.length > 0) {
        return result.title;
    }
    return "(unknown)";
}

String.prototype.Urlify = function() {
    var target = this;
    var search = ' ';
    var replacement = '_';
    return encodeURIComponent(target.replace(new RegExp(search, 'g'), replacement));
};

// https://davidwalsh.name/query-string-javascript
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

$(function() {
    if (sonarr) {
        LoadEpisodes(id);
    }
});