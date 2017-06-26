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
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$rolle = substr($sqlResult, 23, -3);

	$sql = "
		SELECT
			COUNT(*) AS anzahl
		FROM
			user_besitzt_rolle
		WHERE
			rolle_bezeichnung = 'Administrator'
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$anzahlAdmins = substr($sqlResult, 12, -3);

	if($rolle == 'Administrator' AND $anzahlAdmins == '1') {
		// Rückgabe eines Fehlercodes, sofern der letzte Administrator gelöscht werden würde
		echo 0;
	}
	else {
		$sql = "
			DELETE 
			FROM 
				user 
			WHERE 
				userId = '$userId'
		";
		sql($sql);
		
		$sql = "
			DELETE 
			FROM 
				user_besitzt_rolle 
			WHERE 
				user_userId = '$userId'
		";
		sql($sql);
		echo 1;
	};
?>