<?php
$page->show("header");
$page->show("navbar");

echo "
<div class='container'>
	<h4>Calendar</h4>
	<div class='row'>
		<div class='col-4'>
			<a href='#' id='cal-nav-prev' class='btn btn-fit btn-primary'>Previous</a> 
		</div>
		<div class='col-4 center'>
			<p>Week of<br /><span id='cal-week'></span></p>
		</div>
		<div class='col-4'>
			<a href='#' id='cal-nav-next' class='btn btn-fit btn-primary'>Next</a> 
		</div>
	</div>
	<div id='cal-sidebar'></div>
</div>

<div class='container'>
	<h5>Legend</h5>
	<span class='text-danger'>Aired, but not yet available</span>
	<br />
	<span class='text-success'>Aired, episode available</span>
	<br />
	<span class='text-primary'>Not yet aired (future)</span>
</div>
";

$page->block("footer", array("js" => array("/assets/js/latenight-cal.js")));
?>