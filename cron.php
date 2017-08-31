<?php
// site cacher
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include "modules/config.php";
include "modules/core.php";
include "modules/cachedrequest.php";
include "modules/latenight.php";

$cachedRequest = new CachedRequest();
$latenightApi = new LatenightApi();

echo "Creating directories...\n";

// folders
$thumbPath = "cache/thumb/poster/";
$cachedRequest->MakeDirIfNotExists($thumbPath);
$thumbPath = "cache/thumb/background/";
$cachedRequest->MakeDirIfNotExists($thumbPath);
$thumbPath = "cache/thumb/preview/";
$cachedRequest->MakeDirIfNotExists($thumbPath);

echo "Caching listing...\n";

// cache listing
$listing = json_decode($latenightApi->GetListing(), true);
foreach ($listing as $id => $info) {
    // cache poster
    if (!file_exists("cache/thumb/poster/{$id}.jpg")) {
        echo "  Caching poster {$id}\n";
        $entry = json_decode($latenightApi->GetPoster($id));
        if (strlen($entry->file) == 0) {
            echo "      No file, skipping\n";
        }
        else {
            $original = $cachedRequest->CachedRequestPath($entry->file);
            iTF($original, "cache/thumb/poster/{$id}.jpg", 350, 91);
        }
    }

    // cache background
    if (!file_exists("cache/thumb/background/{$id}.jpg")) {
        echo "  Caching background {$id}\n";
        $entry = json_decode($latenightApi->GetBackground($id));
        if (strlen($entry->file) == 0) {
            echo "    No file, skipping\n";
        }
        else {
            $original = $cachedRequest->CachedRequestPath($entry->file);
            iTF($original, "cache/thumb/background/{$id}.jpg", 800, 91);
        }
    }

    // cache episodes
    $episodes = json_decode($latenightApi->GetEpisodes($id), true);
    foreach ($episodes as $episode) {
        $episodeId = $episode["tvdbEpisodeId"];
        if ($episode["seasonNum"] == 0) {
            echo "  Skipping season 0 episode {$episodeId}\n";
            continue;
        }
        if (!file_exists("cache/thumb/preview/{$episodeId}.jpg")) {
            echo "  Caching preview {$episodeId}\n";
            try {
                $thumbData = @$latenightApi->GetEpisodeThumb($episodeId);
                file_put_contents("cache/thumb/preview/{$episodeId}.jpg", $thumbData);
            }
            catch (Exception $e) {
                // do nothing (for now)
                echo "      Failed! (probably does not exist)\n";
            }
        }
    }
}
?>