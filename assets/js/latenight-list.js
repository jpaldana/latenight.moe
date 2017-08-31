var pageMaxPerPage = 50;
var sortFilter = "title";
var sortDirection = "asc";
var dataCache;
var searchFilter = false;

function LoadResults() {
    loadAnimation("#latenight-list");
    $.post("/api/GetListing", {
        numResults: pageMaxPerPage,
        filter: sortFilter,
        direction: sortDirection
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

        ParseResults(data);
    })
    .fail(function() {
        console.log("Failed to call API: GetListing");
    })
    .always(function() {
        console.log("LoadResults() done");
    });
}

function ParseResults(data) {
    $("#latenight-list").empty();
    for (var id in data) {
        if (searchFilter !== false) {
            if (data[id].title.toLowerCase().indexOf(searchFilter) == -1) {
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

$(function() {
    LoadResults();
});