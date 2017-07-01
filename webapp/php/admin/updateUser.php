<?php
	include_once '../db.php';

	$userListe = $_POST['userListe'];
	$letzterAdmin = 1;
	
	for ($i = 0; $i < count($userListe); $i++) {
		$user = $userListe[$i][2];
		$vorname = $userListe[$i][0];
		$nachname = $userListe[$i][1];
		$passwort = $userListe[$i][3];
		$rolle = $userListe[$i][4];
		
		$sql = "
			SELECT
				rolle_bezeichnung
			FROM
				user_besitzt_rolle
			WHERE
				user_userId = '$user'
		";
		$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
		$aktuelleRolle = substr($sqlResult, 23, -3);
 
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

		if($aktuelleRolle == 'Administrator' AND $rolle != 'Administrator' AND $anzahlAdmins == '1') {
			// Rückgabe eines Fehlercodes, sofern die Rolle des letzten Administrators geändert werden würde
			$letzterAdmin = 0; 
		}
		else {
			$sql = "
				UPDATE 
					user 
				SET 
					vorname = '$vorname', 
					nachname = '$nachname', 
					passwort = '$passwort' 
				WHERE 
					userId = '$user'
			";
			sql($sql);
			$sql = "
				UPDATE 
					user_besitzt_rolle 
				SET 
					rolle_bezeichnung = '$rolle' 
				WHERE 
					user_userId = '$user'
			";
			sql($sql);
		};
	};

	echo $letzterAdmin;
?>