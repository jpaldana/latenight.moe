<?php
$page->show("header");
$page->show("navbar");

$id = $_GET["id"];

$listing = json_decode($latenightApi->GetListing(), true);
$info = $latenightApi->GetEntryWithId($listing, $id, isset($_GET["movie"]));

$poster = "/static/{$id}/poster.jpg";
$background = "/static/{$id}/background.jpg";
$sonarr = "true";

if (isset($info["tmdbId"])) {
	$poster = "/static/{$id}/movie-poster.jpg";
	$background = "/static/{$id}/movie-background.jpg";
	$sonarr = "false";
}

echo "
<div class='bg-overwrite' style='background-image: linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url({$background});'></div>
";

echo "
<div class='container info-container' id='info-main-details'>
	<h2>{$info["title"]}</h2>
	<br />
	<div class='row'>
		<div class='col-xs-12 col-md-4'>
			<div class='info-poster ar-2-3 bg-fill' style='background-image: url({$poster});'></div>
			<br />
			<div class='card card-outline-secondary text-xs-center'>
				<h4>Alternate Title(s)</h4>
				<ul class='no-ul-padding'>
";
if (isset($info["alternateTitles"])) foreach ($info["alternateTitles"] as $titleObject) {
	$title = trim($titleObject["title"]);
	echo "
					<li>{$title}</li>
	";
}
echo "
				</ul>
			</div>
		</div>
		<div class='col-xs-12 col-md-8'>
			<div class='card card-outline-secondary text-xs-center'>
				<h4>Overview</h4>
				<p>{$info['overview']}</p>
			</div>
			<br />
";
if ($sonarr == "true") {
echo "
			<div class='card card-outline-secondary text-xs-center'>
				<div class='row info-grid'>
					<div class='col-4'>
						<span class='info-grid-title'>Rating</span>
						<span class='info-grid-value'>{$info['certification']}</span>
					</div>
					<div class='col-4'>
						<span class='info-grid-title'>Episodes</span>
						<span class='info-grid-value'>{$info['totalEpisodeCount']}</span>
					</div>
					<div class='col-4'>
						<span class='info-grid-title'>Status</span>
						<span class='info-grid-value-sm'>{$info['status']}</span>
					</div>
				</div>
			</div>
";
}
echo "
		</div>
	</div>
</div>
";

// episodes

if ($sonarr == "true") {
	echo "
	<div class='container' id='info-episode-container'></div>
	";
}
else {
	// manually fill data, temp
	if ($info["hasFile"]) {
		echo "
		<br />
		<div class='container'>
			<a href='/watch/{$info['id']}?movie' class='btn btn-lg btn-primary'>Watch {$info['title']}</a>
		</div>
		";
	}
	else {
		echo "
		<br />
		<div class='container'>
			<p class='text-danger'>Movie is currently not available.</p>
		</div>
		";
	}
}

echo "
<script>
	var id = {$id};
	var targetSeason = 1;
	var hostBaseUrl = '" . LATENIGHT_HOST_URL . "';
</script>

<!-- modal for detail popup -->
<div class='modal fade' id='latenight-list-modal' tabindex='-1' role='dialog' aria-labelledby='latenight-list-modal-title' aria-hidden='true'>
	<div class='modal-dialog modal-lg' role='document'>
		<div class='modal-content'>
			<div class='modal-header'>
				<h5 class='modal-title' id='latenight-list-modal-title'>title</h5>
				<button type='button' class='close' data-dismiss='modal' aria-label='Close'>
					<span aria-hidden='true'>&times;</span>
				</button>
			</div>
			<div class='modal-body' id='latenight-list-modal-body'></div>
			<div class='modal-footer'>
				<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>
				<button type='button' class='btn btn-primary' id='latenight-list-modal-view'><i class='fa fa-play'></i> Watch</button>
			</div>
		</div>
	</div>
</div>
";

//$episodes = json_decode($latenightApi->GetEpisodes($id), true);

//var_dump($info);
//var_dump($episodes);

echo "
<script>
var sonarr = {$sonarr};
</script>
";

$page->block("footer", array("js" => array(
	"/assets/js/latenight-episodes.js")));
?>