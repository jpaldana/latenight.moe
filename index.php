<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include "modules/config.php";
include "modules/core.php";
include "modules/cachedrequest.php";
include "modules/pageloader.php";
include "modules/latenight.php";
include "modules/amlogin.php";

$cachedRequest = new CachedRequest();
$latenightApi = new LatenightApi();

$page = new Page();

include $page->getFile();
?>