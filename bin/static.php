<?php
$id = $_GET["id"];
$request = $_GET["request"];

$cachedRequest->MakeDirIfNotExists("cache/thumb/poster");
$cachedRequest->MakeDirIfNotExists("cache/thumb/background");
$cachedRequest->MakeDirIfNotExists("cache/thumb/preview");
$cachedRequest->MakeDirIfNotExists("cache/thumb/banner");
$cachedRequest->MakeDirIfNotExists("cache/thumb/movie-poster");
$cachedRequest->MakeDirIfNotExists("cache/thumb/movie-background");
$cachedRequest->MakeDirIfNotExists("cache/thumb/movie-preview");
$cachedRequest->MakeDirIfNotExists("cache/thumb/movie-banner");

switch ($request) {
    case "movie-poster.jpg":
        GetCachedMovieImage("cache/thumb/movie-poster/", $id, "poster.jpg");
    break;
    case "poster.jpg":
        GetCachedImage("cache/thumb/poster/", $id, "poster.jpg");
    break;
    // --
    case "movie-fanart.jpg":
    case "movie-background.jpg":
        GetCachedMovieImage("cache/thumb/movie-background/", $id, "banner.jpg"); // banner
    break;
    case "fanart.jpg":
    case "background.jpg":
        GetCachedImage("cache/thumb/background/", $id, "fanart.jpg");
    break;
    // --
    case "movie-preview.jpg":
        GetCachedMovieImage("cache/thumb/movie-preview/", $id, false);
    break;
    case "preview.jpg":
        GetCachedImage("cache/thumb/preview/", $id, false);
    break;
    // --
    case "movie-banner.jpg":
        GetCachedMovieImage("cache/thumb/movie-banner/", $id, "banner.jpg");
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
function GetCachedMovieImage($thumbPath, $id, $request) {
    if (!$request) return;
    if (!file_exists($thumbPath . "{$id}.jpg")) {
        file_put_contents($thumbPath . "{$id}.jpg",
            file_get_contents(LATENIGHT_RADARR_IMAGE_ROOT . "{$id}/{$request}"));
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