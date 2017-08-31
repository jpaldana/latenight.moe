<nav class="navbar navbar-toggleable-md navbar-inverse bg-primary unrounded">
	<button class="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
		<span class="navbar-toggler-icon"></span>
	</button>
	<a class="navbar-brand" href="/"><i class="fa fa-moon-o"></i> latenight<span class="navbar-brand-suffix">.moe <?php echo VERSION; ?></span></a>

	<div class="collapse navbar-collapse" id="navbarColor01">
		<ul class="navbar-nav mr-auto">
			<li class="nav-item active">
				<a class="nav-link" href="/"><i class="fa fa-home"></i> <span class="sr-only">(current)</span></a>
			</li>
			<li class="nav-item dropdown">
				<a class="nav-link dropdown-toggle" data-toggle="dropdown" href="#" id="navigation" aria-expanded="false">Navigation</a>
				<div class="dropdown-menu" aria-labelledby="navigation">
					<a class="dropdown-item" href="/list">Full List</a>
				</div>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/list">List</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/genres">Genres</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/calendar">Calendar</a>
			</li>
			<li class="nav-item">
				<a class="nav-link" href="/about">About</a>
			</li>
		</ul>
		<form class="form-inline" action="/list" method="get">
			<input class="form-control mr-sm-2" type="text" placeholder="Search" name="q" id="navbar-search">
			<button class="btn btn-secondary my-2 my-sm-0" type="submit"><i class="fa fa-search"></i></button>
		</form>
	</div>
</nav>

<?php
	if (file_exists("motd.txt")) {
		$motd = file_get_contents("motd.txt");
		echo "
			<div class='container'>
				<div class='alert alert-dismissible alert-warning'>
					<button type='button' class='close' data-dismiss='alert'>&times;</button>
					<h4>Notice:</h4>
					<p>{$motd}</p>
				</div>
			</div>
		";
	}
?>