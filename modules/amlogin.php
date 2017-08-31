<?php
/*
$domain = base64_encode("latenight.moe");
//$domain = base64_encode("localhost:81");
$request = base64_encode(isset($_SERVER["REQUEST_URI"]) ? $_SERVER["REQUEST_URI"] : "/");
define("AFTERMIRROR_AMLOGIN", "https://aftermirror.com/login.do?dm={$domain}&return={$request}");
if (!isset($_COOKIE["aftermirror"]) || !isset($_COOKIE["user"])) {
	if ($_GET["page"] == "auth") {
		setcookie("user", $_GET["_u"]);
		setcookie("aftermirror", $_GET["_s"], time() + (3600 * 24 * 30), ".latenight.moe");
		$return = isset($_GET["qs"]) ? base64_decode($_GET["qs"]) : "/";
		header("Location: {$return}");
	}
	else {
		header("Location: " . AFTERMIRROR_AMLOGIN);
	}
}
*/
setcookie("user", "DEV_TEST_USER");
setcookie("aftermirror", "TEST", time() + 9999999);
?>