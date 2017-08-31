<?php
$page->show("header");
$page->show("navbar");

$query = $_GET["q"];

echo "
<div class='container'>
<h4>Search results for '{$query}'...</h4>
<script>var pageTitle = \"{$query}\";</script>
<br />
";
echo "<div class='row'>";
$listing = retrieve(LATENIGHT_API_LISTING_JSON . "&query={$query}");
foreach ($listing as $entry) {
	//$thumb = LATENIGHT_API_POSTER_THUMB . "&id={$entry['tvdb_id']}";
	$thumb = LATENIGHT_MAI_POSTER_THUMB . "/" . $entry["tvdb_id"] . ".jpg";
	$infoName = strtr($entry["name"], array(" " => "-", "'" => ""));
	echo "
		<div class='col-xs-6 col-sm-4 col-md-2'>
		<a href='/info/{$entry['id']}/{$infoName}' class='ajax-button' data-ajax='/info/{$entry['id']}/ajax .container'>
		<div class='poster' style='background-image: url({$thumb});'>
			<div class='poster-title'>
				<h1>{$entry['name']}</h1>
			</div>
		</div>
		</a>
		</div>
	";
}
echo "</div>";
/*
$listing = retrieveListing();
$results = array();
$resultsData = array();
$finalResults = array();

$labels = getAnimeLabels();
foreach ($listing as $file) {
	$filename = $file["filename"];
	$labelMatch = (stripos($file["filename"], " - ") > 0) ? substr($file["filename"], 0, stripos($file["filename"], " - ")) : substr($file["filename"], 0, stripos($file["filename"], "."));
	$fileLabels = isset($labels[$labelMatch]) ? implode(",", $labels[$labelMatch]) : "";
	$score = 0;
	foreach ($queryParts as $part) {
		if (strpos(strtolower($filename.$fileLabels), strtolower($part)) !== false) {
			$score++;
		}
	}
	if ($score > 0) {
		$results[$filename] = $score;
		$resultsData[$filename] = $file;
	}
}
//natsort($results);

foreach (array_keys($results) as $k) {
	$finalResults[] = $resultsData[$k];
}

printResults($finalResults);
*/

echo "
</div>
";

$page->show("footer");
?>