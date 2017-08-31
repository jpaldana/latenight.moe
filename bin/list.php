<?php
$page->show("header");
$page->show("navbar");

echo "
<div class='container'>
<h4>List</h4>
<br />
<div id='latenight-list' class='row'>Please wait...</div>
</div>

<script>var pageTitle = 'List';</script>

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
				<button type='button' class='btn btn-primary' id='latenight-list-modal-view'>View</button>
			</div>
		</div>
	</div>
</div>
";

$page->block("footer", array("js" => array("/assets/js/latenight-list.js")));
?>