$(".lazy").Lazy();

// page-loader
/*
if (window.onbeforeunload == null) {
	window.onbeforeunload = function() {
		$("#page-loader").fadeIn(200);
	};
}
*/

// responsiveUi
$(window).ready(responsiveUi);
$(window).resize(responsiveUi);

function responsiveUi() {
	// list
	$(".ar-2-3").each(function(e) {
		var width = $(this).width();
		var height = width * 1.5;
		$(this).css("height", height);
	});
	// episodes
	$(".ar-16-9").each(function(e) {
		var width = $(this).width();
		var height = width * (9 / 16);
		$(this).css("height", height);
	});
	$(".lazy").Lazy();
}

$("#info-episode-container").on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
	// handle ui change for tabs
	responsiveUi();
});

function loadAnimation(id) {
	$(id).html("<div style='text-align:center; width: 100%;'><img src='/assets/images/ripple.svg' style='width: 32px;' /><br/><b>Please wait...</b></div>");
}

// title
if (typeof pageTitle == "undefined") {
	document.title = "latenight.moe | v3";
}
else {
	document.title = pageTitle + " - latenight.moe | v3";
}