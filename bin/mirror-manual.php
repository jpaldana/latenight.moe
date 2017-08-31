<?php
$page->show("header");
$page->show("navbar");

echo "
<div class='container'>
	<h2>manual.mirror</h2>
	<form action='/mirror/mirrormanual000' method='post'>
		<input type='text' placeholder='URL of Video' name='src' class='form-control' />
		<input type='submit' value='Go' class='form-control' />
	</form>
</div>
";

$page->show("footer");
?>