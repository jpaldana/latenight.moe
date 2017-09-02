var pageMaxPerPage = 50;
var sortDefaultFilter = "abc";
var dataCache;
var searchFilter = false;
var genres = [];

function PopulateGenres() {
    for (var id in dataCache) {
        for (var i in dataCache[id]["genres"]) {
            var genre = dataCache[id]["genres"][i];
            if (genres.indexOf(genre) == -1) {
                genres[genres.length] = genre;
            }
        }
    }
    genres.sort();
    //console.log(genres);
    
    for (var i in genres) {
        var genre = genres[i];
        $("#latenight-genres").append(
            $("<button>")
            .attr("type", "button")
            .attr("data-genre", genre)
            .addClass("btn btn-sm btn-secondary latenight-genre")
            .text(genre)
        );
    }
}

function ApplyTextFilter(query) {
    for (var id in dataCache) {
        var meta = dataCache[id];
        var blob = (meta["sortTitle"] + " " + meta["genres"].join(" ") + " " + meta["overview"] + " " + meta["title"]).toLowerCase();
        var relevance = 0;
        for (var q in query) {
            q = query[q].toLowerCase();
            var match = false;
            if (q.length > 0 && q.substring(0, 1) == '-') {
                if (blob.indexOf(q.substring(1)) == -1) {
                    match = true;
                }
            }
            else {
                if (blob.indexOf(q) >= 0) {
                    match = true;
                }
            }
            if (match) {
                relevance++;
                //console.log("found a match for", q, "in", meta["title"]);
            }
            else {
                relevance = 0;
                break; // trash result
            }
        }
        dataCache[id]["relevance"] = relevance;
    }
}

function ReFilter(sort, query = false) {
    if (query) {
        ApplyTextFilter(query);
        SortData(sort);
        ParseResults(dataCache, true);
    }
    else {
        SortData(sort);
        ParseResults(dataCache);
    }
}

// https://stackoverflow.com/questions/979256/sorting-an-array-of-javascript-objects/979325#979325
var sort_by = function(field, reverse, primer){
    var key = primer ? 
        function(x) {return primer(x[field])} : 
        function(x) {return x[field]};

    reverse = !reverse ? 1 : -1;

    return function (a, b) {
        return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
    } 
}

function SortData(sort, asc = false) {
    if (typeof dataCache == "undefined") return;

    switch (sort) {
        case 'abc':
            dataCache.sort(sort_by('sortTitle', asc, false));
        break;
        case 'age':
            dataCache.sort(sort_by('firstAired', asc, false));
        break;
        case 'added':
            dataCache.sort(sort_by('added', asc, false));
        break;
        case 'rel':
            dataCache.sort(sort_by('relevance', true, false));
        break;
    }
    //console.log(dataCache);
}

function LoadResults() {
    loadAnimation("#latenight-list");
    $.post("/api/GetListing", {
        numResults: pageMaxPerPage
    })
    .done(function(data) {
        console.log("LoadResults() called");
        console.log(data);
        dataCache = data;

        var getParams = new URLSearchParams(window.location.search);
        if (getParams.has("q")) {
            searchFilter = getParams.get("q");
            $("#navbar-search").val(searchFilter);
        }

        ReFilter(sortDefaultFilter);
        PopulateGenres();
    })
    .fail(function() {
        console.log("Failed to call API: GetListing");
    })
    .always(function() {
        console.log("LoadResults() done");
    });
}

function ParseResults(data, requireRelevant = false) {
    $("#latenight-list").empty();
    for (var id in data) {
        if (searchFilter !== false) {
            if (data[id].title.toLowerCase().indexOf(searchFilter) == -1) {
                continue;
            }
        }
        if (requireRelevant) {
            if (data[id]["relevance"] == 0) {
                continue;
            }
        }
        CreateResultPoster(id, data[id]);
    }
    responsiveUi();
}

function CreateResultPoster(id, result) {
    if ($("div[data-tvdb-id='" + result.tvdbId + "']").length > 0) return;
    $("#latenight-list").append(
        $("<div>")
        .addClass("col-4 col-sm-4 col-md-4 col-lg-3")
        .addClass("latenight-list-poster-container")
        .attr("data-tvdb-id", result.tvdbId)
        .attr("data-result-id", id)
        .append(
            $("<a>")
            .attr("href", "/info/" + result.id + "/" + GetTitle(result))
            .append(
                $("<div>")
                .addClass("latenight-list-poster ar-2-3")
                .css("background-image", "url(/static/" + result.id + "/poster.jpg)")
                .append(
                    $("<span>")
                    .addClass("latenight-list-poster-title")
                    .text(GetTitle(result))
                )
            )
            .attr("data-id", id)
            .on("click", function(e) {
                e.preventDefault();
                DetailPopup($(this).attr("data-id"));
            })
        )
    );
}

function DetailPopup(id) {
    console.log("DetailPopup() called");
    $("#latenight-list-modal-title").text(GetTitle(dataCache[id]));
    $("#latenight-list-modal-body").empty();
    $("#latenight-list-modal-body")
    .append(
        $("<div>")
        .addClass("latenight-list-modal-spanner")
        .css("background-image", "url(/static/" + dataCache[id].id + "/background.jpg)")
    )
    .append(
        $("<p>")
        .addClass("latenight-list-modal-overview")
        .html(dataCache[id].overview)
    );
    for (var i in dataCache[id]["genres"]) {
        $("#latenight-list-modal-body")
        .append(
            $("<span>")
            .addClass("badge badge-default latenight-list-modal-genre badge-md")
            .text(dataCache[id]["genres"][i])
        );
    }
    $("#latenight-list-modal-view").off("click").on("click", function(e) {
        location.href = "/info/" + dataCache[id].id + "/" + GetTitle(dataCache[id]).Urlify();
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

$("#filter-query").on("keyup", function(e) {
    var query = $(this).val().split(/,| /); // split by , or [space]
    //console.log(query);
    ReFilter('rel', query);
});
$("#latenight-genres").on("click", ".latenight-genre", function(e) {
    var query = $("#filter-query").val();
    var genre = $(this).attr("data-genre");
    if ($(this).hasClass("btn-secondary")) {
        // default->require
        $(this).removeClass("btn-secondary").addClass("btn-primary");
        query = query.replace("-" + genre, "").replace(genre, "") + " " + genre;
    }
    else if ($(this).hasClass("btn-primary")) {
        // require->omit
        $(this).removeClass("btn-primary").addClass("btn-danger");
        query = query.replace("-" + genre, "").replace(genre, "") + " -" + genre;
    }
    else {
        // omit->default
        $(this).removeClass("btn-danger").addClass("btn-secondary");
        query = query.replace("-" + genre, "").replace(genre, "");
    }
    query = query.trim();
    $("#filter-query").val(query).keyup();
});

$(window).keydown(function(e) {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 70) {
        $("#filter-query").focus();
        e.preventDefault();
    }
});

$(function() {
    LoadResults();
});