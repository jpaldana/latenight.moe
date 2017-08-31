<?php
$page->show("header");
$page->show("navbar");

$i

echo "
<div class='container'>
<h4 id='title'>Please wait...</h4>
<script>var pageTitle = \"Loading...\";</script>
<p class='notice'>This shouldn't take too long. <img src='/assets/images/ripple.svg' style='width: 32px;' /></p>
<div id='progress' class='progress'>
	<div id='progressbar' class='progress-bar' role='progressbar' aria-valuenow='0' aria-valuemin='0' aria-valuemax='100' style='width: 100%;'>Loading...
	</div>
</div>
<div id='mirror_log'>
</div>
<div style='display: none;' id='interstate'>
	<form action='' id='mirror-form' method='post'>
		<input type='hidden' name='displayname' value='' id='displayname' />
		<input type='submit' class='btn btn-primary btn-lg' value='Continue' />
	</form>
</div>
<small>Please note that not all files are streamable via the web player.</small>
<hr />
<a href='' id='directlink' class='btn btn-default btn-xs' disabled>Direct Link (main)</a>
<small>(for downloading/streaming on a different player)</small>
<br />
<br />
<a href='' id='directlink2' class='btn btn-default btn-xs' disabled>Direct Link (alt)</a> 
<small>(slow &mdash; use this if main link isn't working)</small>
<br /><br /><br />
<p><h6>Why am I seeing this page? I want to watch it right now!</h6><small>Hold on! Unfortunately, the server host isn't rich enough to afford super fast redundant SSDs or hard drives in RAID to deliver videos instantly. Not to mention, the server's bandwidth is pretty limited. All of the files are spread out throughout old hard drives and have to be copied on-demand before it can be streamed. Streaming the files directly off some of the hard drives cause extreme lag and thus is not an option.<br/><br/>Besides, this service is provided for free. Stop complaining, please! <i class='fa fa-heart'></i></small></p>
</div>
<script>
var mirror_id = '{$_GET['id']}';
var username = '{$_COOKIE['user']}';
</script>
";

$page->block("footer", array("js" => array("https://www.gstatic.com/firebasejs/3.7.5/firebase.js", "/assets/js/mirror.js")));
?>