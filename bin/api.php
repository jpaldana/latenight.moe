<?php
header("Content-Type: application/json");

switch ($_GET["json"]) {
    case "GetListing":
        echo $latenightApi->GetListing();
    break;
    case "GetEpisodes":
        echo $latenightApi->GetEpisodes(isset($_POST["id"]) ? $_POST["id"] : $_GET["id"]);
    break;
    case "GetCalendar":
        echo $latenightApi->GetCalendar($_POST["start"], $_POST["end"]);
    break;
    case "GetEpisodeData":
        // inject hash
        $isMovie = isset($_POST["isMovie"]) ? true : (isset($_GET["isMovie"]) ? true : false);
        $data = json_decode($latenightApi->GetEpisodeData(isset($_POST["id"]) ? $_POST["id"] : $_GET["id"], $isMovie));
        if ($isMovie) {
            if (isset($data->movieFile->relativePath)) {
                $data->path = $data->path . '/' . $data->movieFile->relativePath; // fix
            }
            $data->hash = sha1($data->path);
            $data->isMovie = true;
        }
        else {
            $data->hash = sha1($data->episodeFile->path);
            $data->isMovie = false;
        }
        echo json_encode($data);
    break;
    case "EpisodeParser":
        ignore_user_abort(true);
        // poke host
        echo file_get_contents(LATENIGHT_HOST_URL . "Process&useSource={$_POST['source']}&path=" . base64_encode($_POST["file"]));
    break;
    case "GetOtherSeasonData":
        $return = array(
            "success" => false,
            "url" => ""
        );
        $result = json_decode($latenightApi->GetOtherSeasonData($_POST["current"], $_POST["targetSeason"]), true);
        if ($result["entryId"] !== -1) {
            $return["success"] = true;
            $return["url"] = "/info/{$result['entryId']}/post";
        }
        echo json_encode($return);
    break;
}
?>