<?php
$page->show("header");
$page->show("navbar");

echo "
<div class='container'>
<h4>List</h4>
<br />
<div class='row'>
	<div class='col-10'>
		<form>
			<div class='form-group'>
				<input type='text' class='form-control' id='filter-query' placeholder='Enter a title, description or genre' />
			</div>
		</form>
	</div>
	<div class='col-2'>
		<div class='btn-group' role='group'>
			<button id='btnFilterDrop' type='button' class='btn btn-primary dropdown-toggle btn-fit' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='fa fa-filter'></i></button>
			<div class='dropdown-menu' aria-labelledby='btnFilterDrop'>
				<a class='dropdown-item' href='#' onclick=\"ReFilter('abc');\">Alphabetical</a>
				<a class='dropdown-item' href='#' onclick=\"ReFilter('age');\">Age</a>
				<a class='dropdown-item' href='#' onclick=\"ReFilter('added');\">Added</a>
			</div>
		</div>
	</div>
</div>
<br />
<h6>Genres</h6>
<div id='latenight-genres'></div>
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