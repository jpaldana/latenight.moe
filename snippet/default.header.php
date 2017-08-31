<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
		<meta name="description" content="">
		<meta name="author" content="">
		<link rel="icon" href="/assets/favicon.ico">

		<title>latenight.moe | v3</title>

		<!-- Bootstrap core CSS -->
		<link href="/assets/css/bootstrap-cyborg.min.css" rel="stylesheet">
			
		<!-- Font Awesome -->
		<link href="/assets/css/font-awesome.min.css" rel="stylesheet">
		
		<!-- Fonts -->
		<link href="https://fonts.googleapis.com/css?family=Open+Sans|Raleway" rel="stylesheet">
		
		<!-- Styles -->
		<link href="/assets/css/style.css<?php echo CSS_APPEND; ?>" rel="stylesheet">
		<link href="/assets/css/style-legacy.css" rel="stylesheet">
		
		<?php
		if (isset($data) && isset($data["css"])) {
			foreach ($data["css"] as $css) {
				echo "<link rel='stylesheet' href='{$css}" . CSS_APPEND . "' />";
			}
		}
		?>
	</head>
	<body>