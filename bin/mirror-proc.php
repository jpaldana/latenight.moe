<?php
function pushStatus($id, $data) {
	$firebase = "https://latenight-moe.firebaseio.com/";
	$target = $firebase . "mirror/{$id}.json";
	
	$curl = curl_init();
	$json2 = json_encode($data);
	curl_setopt($curl, CURLOPT_URL, $target);
	curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");
	curl_setopt($curl, CURLOPT_POSTFIELDS, $json2);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	$response = curl_exec($curl);
	curl_close($curl);
}

ignore_user_abort(true);
set_time_limit(900);
$user = $_COOKIE["user"];
$id = $_GET["id"];

if (isset($_GET["cdn"])) {
	echo file_get_contents(MIRROR_AUX_LOAD_URL . "?stat={$_GET['id']}");
}
else {
	$firebase = "https://latenight-moe.firebaseio.com/";
	$target = $firebase . "room/{$user}.json";

	//$json = json_decode(file_get_contents(MIRROR_LOAD_URL . "?req={$_GET['id']}"), true);
	if ($_GET["id"] == "mirrormanual000") {
		// no need to copy over, skip
		
		$curl = curl_init();
		$room_data = array(
			"active" => array(),
			"file" => $_POST["src"],
			"title" => "Unknown video",
			"status" => "pause",
			"position" => 0
		);
		
		$json2 = json_encode($room_data);
		curl_setopt($curl, CURLOPT_URL, $target);
		curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");
		curl_setopt($curl, CURLOPT_POSTFIELDS, $json2);
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
		$response = curl_exec($curl);
		curl_close($curl);
		
		pushStatus($id, array("file" => $_POST["src"], "title" => "Unknown video", "url" => $_POST["src"], "url2" => $_POST["src"]));
		
		// copy to aux server
		$aux = json_decode(file_get_contents(MIRROR_AUX_LOAD_URL . "?fetchDirect={$_POST['src']}&out={$_GET['id']}&fs={$json['filesize']}&z={$json['link']}"), true);
	}
	else {
		$json = json_decode(file_get_contents(MIRROR_LOAD_URL . "?req={$_GET['id']}"), true);
		
		if ($json["status"] == 1) {
			$curl = curl_init();
			$room_data = array(
				"active" => array(),
				"file" => $json["url"],
				"title" => $json["displayname"],
				"status" => "pause",
				"position" => 0
			);
			$json2 = json_encode($room_data);
			curl_setopt($curl, CURLOPT_URL, $target);
			curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PATCH");
			curl_setopt($curl, CURLOPT_POSTFIELDS, $json2);
			curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
			$response = curl_exec($curl);
			curl_close($curl);
			
			pushStatus($id, array("file" => $json["url"], "title" => $json["displayname"], "url" => $json["url"], "url2" => $json["url2"]));
			
			// copy to aux server
			$aux = json_decode(file_get_contents(MIRROR_AUX_LOAD_URL . "?fetch={$json['link']}&out={$_GET['id']}&fs={$json['filesize']}&z={$json['link']}"), true);
		}

		echo json_encode($json);
	}
}
?>