<?php
$file = basename($_GET["file"]);
//$vtt = sprintf("http://media.latenight.moe:12900/%s.vtt", $file);
$vtt = sprintf("https://api.latenight.moe:12900/api.php?do=subs&file=%s", $file);

$res = file_get_contents($vtt);

header("Content-Type: text/vtt");
echo $res;
?>