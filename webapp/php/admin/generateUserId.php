<?php
	include_once '../db.php';

	$vorname = $_POST['vorname'];
	$nachname = $_POST['nachname'];

	$vorname = str_replace("Ä", "a", $vorname);
	$vorname = str_replace("Ö", "o", $vorname);
	$vorname = str_replace("Ü", "u", $vorname);
	$vorname = str_replace("ä", "a", $vorname);
	$vorname = str_replace("ö", "o", $vorname);
	$vorname = str_replace("ü", "u", $vorname);
	$vorname = str_replace("ß", "s", $vorname);
	$vorname = strtolower($vorname);
	$vorname = $vorname[0];

	$nachname = str_replace("Ä", "a", $nachname);
	$nachname = str_replace("Ö", "o", $nachname);
	$nachname = str_replace("Ü", "u", $nachname);
	$nachname = str_replace("ä", "a", $nachname);
	$nachname = str_replace("ö", "o", $nachname);
	$nachname = str_replace("ü", "u", $nachname);
	$nachname = str_replace("ß", "s", $nachname);
	$nachname = strtolower($nachname);
	$nachname = strtoupper($nachname[0]) . substr($nachname, 1, strlen($nachname)-1);

	$userId = $vorname . $nachname;

	$ok = 1;
	$marker = 1;
	$i = 0;
	while ($ok == 1) {
		if(strlen($userId) > 10 AND $marker = 0) {
			$userId = substr($userId, 0, strlen($userId)-2);
			$marker = 1;
		};
		$sql = "
			SELECT 
				COUNT(*) 
			FROM 
				user 
			WHERE 
				userId = '$userId'
		";
		$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
		$result = substr($sqlResult, 14, -3)
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