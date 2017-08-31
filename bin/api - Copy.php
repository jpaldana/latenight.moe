<?php
header("Content-Type: application/json");

switch ($_GET["json"]) {
    case "GetListing":
        echo $latenightApi->GetListing();
    break;
    case "GetEpisodes":
        echo $latenightApi->GetEpisodes($_POST["id"]);
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