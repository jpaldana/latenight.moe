<?php
$page->show("header");
$page->show("navbar");

echo "
<div class='container' id='optProc'>
	<h3>Select an option</h3>
	<br />
	<div class='card card-outline-primary text-xs-center'>
		<div class='card-block'>
			<blockquote class='card-blockquote'>
				<h5>Stream</h5>
				<p><span class='text-primary'>Use this link to stream with your browser or watch with others.</span> This uses the source media as-is. Some source media files are not compatible with all browsers. 
				<br />If this option fails, try the alternate stream method.</p>
				<footer><a href='#' class='btn btn-primary' id='watch-btn-stream'>Stream</a></footer>
			</blockquote>
		</div>
	</div>
	<br />
	<div class='card card-outline-primary text-xs-center'>
		<div class='card-block'>
			<blockquote class='card-blockquote'>
				<h5>Stream (Downscaled)</h5>
				<p><span class='text-primary'>Use this link to stream with your browser or watch with others.</span> This downscales the source media to 480p encoded at about 825 kbps, 
				and will work with any browser that supports *.mp4 streams. TV and anime episodes will take about five (5) minutes to process, and movies 
				will take about twenty (20) minutes to process.</p>
				<footer><a href='#' class='btn btn-primary' id='watch-btn-stream-downscaled'>Stream (Downscaled)</a></footer>
			</blockquote>
		</div>
	</div>
	<br />
	<div class='card card-outline-primary text-xs-center'>
		<div class='card-block'>
			<blockquote class='card-blockquote'>
				<h5>Direct Link</h5>
				<p>Copy this link into a compatible media player that supports network streams. This link is not recommended for browser streaming.</p>
				<footer><a href='#' class='btn btn-primary' id='watch-btn-direct'>Direct Link</a></footer>
			</blockquote>
		</div>
	</div>
</div>

<div class='container' id='preProc' style='display: none;'>
	<h3>Please wait</h3>
	<p id='watch-msg'></p>
	<div class='progress'>
		<div id='watch-progress' class='progress-bar progress-bar-striped progress-bar-animated' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 0%;'></div>
	</div>
</div>

<div class='container' id='postProc' style='display: none;'>
	<h3>Ready!</h3>
	<form action='/play' method='post'>
		<div class='form-group'>
			<input type='text' class='form-control' name='name' placeholder='Name (leave blank for a boring name)' />
		</div>
		<div class='form-group'>
			<input type='submit' class='form-control' class='btn btn-xl btn-primary' value='Play!' />
		</div>
		<input type='hidden' name='source' id='play-src' />
		<input type='hidden' name='subtitle' id='play-srt' />
		<input type='hidden' name='title' id='play-title' />
		<input type='hidden' name='thumb' id='play-thm' />
	</form>
</div>

<script>
var entryId = {$_GET['file']};
</script>
";

$page->block("footer", array("js" => array("/assets/js/latenight-watch.js")));
?>