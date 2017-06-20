<?php
	include_once '../db.php';

	$vorname = $_POST['vorname'];
	$nachname = $_POST['nachname'];
	$userId = $vorname[0] . $nachname;
	$userId = strtolower($userId);
	$userId = str_replace("ä", "ae", $userId);
	$userId = str_replace("ö", "oe", $userId);
	$userId = str_replace("ü", "ue", $userId);
	$userId = str_replace("ß", "ss", $userId);
	$userId = $userId[0] . strtoupper($userId[1]) . substr($userId, 2);
	if(strlen($userId) > 10) {
		$userId = substr($userId, 0, 10);
	};

	$ok = 1;
	$marker = 1;
	$i = 0;
	while ($ok == 1) {
		if(strlen($userId) > 10 AND $marker = 0) {
			$userId = substr($userId, 0, strlen($userId)-2);
			$marker = 1;
		};
		$sql = "SELECT COUNT(*) FROM user WHERE userId = '$userId'";
		$result = substr(json_encode(sql($sql)), 14, -3);
		if($result == 0) {
			$ok = 0;	
		}
		else {
			if($marker == 0) {
				$userId = substr($userId, 0, strlen($userId)-1);
			};
			$i++;
			$userId = $userId . $i;
			$marker = 0;
		}		
	};
	echo $userId;
?>