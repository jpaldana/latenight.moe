<?php
$page->block("header");
$page->show("navbar");

echo "
<div class='container'>
<h4>Latest</h4>
<br />
<script>var pageTitle = \"Latest\";</script>
";

$listingJson = retrieve(LATENIGHT_API_EPISODES_JSON . "&latest&limit=50");
$dataCache = array();

foreach ($listingJson as $entry) {
	if (!isset($dataCache[$entry["series_id"]])) {
		$dataCache[$entry["series_id"]] = retrieve(LATENIGHT_API_LISTING_JSON . "&id={$entry['series_id']}")[0];
	}
	$data = $dataCache[$entry["series_id"]];
	$infoName = strtr($data["name"], array(" " => "-", "'" => ""));
	
	printf("<span class='label label-default'>%s &mdash; s%de%d</span> <a href='/info/%d/%s#s%de%d'>%s</a><br/>", $data["name"], $entry["season_num"], $entry["episode_num"], $entry["series_id"], $infoName, $entry["season_num"], $entry["episode_num"], $entry["filename"]);
}

echo "
</div>
";

$page->block("footer");
?>