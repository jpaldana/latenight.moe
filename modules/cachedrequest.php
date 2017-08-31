<?php
class CachedRequest {
    private $cachePath;

    function __construct() {
        $this->cachePath = "cache";
    }

    function CachedRequestPath($url, $maxAge = 3600) {
        $hash = sha1($url);
        $target = sprintf("%s/%s/%s/",
            $this->cachePath,
            $hash[0],
            $hash[1],
            $hash
        );
        $this->MakeDirIfNotExists($target);

        $goodCache = true;
        if (!file_exists($target . $hash)) {
            $goodCache = false;
        }
        if ($goodCache && (time() - filemtime($target . $hash) > $maxAge)) {
            $goodCache = false;
        }
        if ($goodCache && filesize($target . $hash) == 0) {
            $goodCache = false;
        }

        if (!$goodCache) {
            $data = file_get_contents($url);
            if (!$data || strlen($data) == 0) {
                throw new Exception("Invalid or empty response.");
            }
            file_put_contents($target . $hash, $data);
        }
        return $target . $hash;
    }

	function CachedRequest($url, $maxAge = 3600) {
        return file_get_contents($this->CachedRequestPath($url, $maxAge));
    }
    function MakeDirIfNotExists($path) {
        if (strlen($path) == 0) return;

        $startPath = "";
        if ($path[0] == '/') {
            $startPath = "/";
        }

        $paths = explode("/", $path);
        foreach ($paths as $pathPart) {
            if (strlen($pathPart) == 0) continue;
            $startPath .= "{$pathPart}/";
            if (!is_dir($startPath)) {
                mkdir($startPath);
            }
        }
    }
}
?>