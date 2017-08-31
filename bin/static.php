<?php
$id = $_GET["id"];
$request = $_GET["request"];

/*
$cachedRequest->MakeDirIfNotExists("cache/thumb/poster");
$cachedRequest->MakeDirIfNotExists("cache/thumb/background");
$cachedRequest->MakeDirIfNotExists("cache/thumb/preview");
$cachedRequest->MakeDirIfNotExists("cache/thumb/banner");
*/

switch ($request) {
    case "poster.jpg":
        GetCachedImage("cache/thumb/poster/", $id, "poster.jpg");
    break;
    case "fanart.jpg":
    case "background.jpg":
        GetCachedImage("cache/thumb/background/", $id, "fanart.jpg");
    break;
    case "preview.jpg":
        GetCachedImage("cache/thumb/preview/", $id, false);
    break;
    case "banner.jpg":
        GetCachedImage("cache/thumb/banner/", $id, "banner.jpg");
    break;
}

function GetCachedImage($thumbPath, $id, $request) {
    if (!$request) return;
    if (!file_exists($thumbPath . "{$id}.jpg")) {
        file_put_contents($thumbPath . "{$id}.jpg",
            file_get_contents(LATENIGHT_SONARR_IMAGE_ROOT . "{$id}/{$request}"));
    }

    if (file_exists($thumbPath . "{$id}.jpg")) {
        header("Content-Type: image/jpg");
        readfile($thumbPath . "{$id}.jpg");
    }
    else {
        header("Content-Type: image/jpg");
        header("Location: /assets/images/blank_poster.jpg");
    }
}
?>