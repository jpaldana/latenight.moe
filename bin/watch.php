<?php
$page->show("header");
$page->show("navbar");

echo "
<div class='container' id='preProc'>
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