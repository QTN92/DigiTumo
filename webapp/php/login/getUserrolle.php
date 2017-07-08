<?php
	include_once '../db.php';

	$userId = $_POST['userId'];
	$sql = "
		SELECT 
			rolle_bezeichnung 
		FROM 
			user_besitzt_rolle 
		WHERE 
			user_userId = '$userId'
	";
	$sqlResult = sql($sql);
	$anzahlRollen = count($sqlResult);
	$rollen = "";
	for($i = 0; $i < $anzahlRollen; $i++) {
		$result = json_encode($sqlResult[$i], JSON_UNESCAPED_UNICODE);
		$aktuelleRolle = substr($result, 22, -2);
		switch($aktuelleRolle) {
			case 'Administrator':
				$rollen = $rollen . '0';
				break;
			case 'Studienpflege':
				$rollen = $rollen . '1';
				break;
			case 'Arzt':
				$rollen = $rollen . '2';
				break;
		};
	};
	echo $rollen;
?>