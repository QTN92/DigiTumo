<?php
	include_once '../db.php';

	$userListe = $_POST['userListe'];
	for ($i = 0; $i < count($userListe); $i++) {
		$aktuellerUser = $userListe[$i][3];
		$vorname = $userListe[$i][0];
		$nachname = $userListe[$i][1];
		$passwort = $userListe[$i][4];
		$rolle = $userListe[$i][5];
		$sql = "UPDATE user 
		SET
			vorname = '$vorname',
			nachname = '$nachname',
			passwort = '$passwort'
		WHERE 
			userId = '$aktuellerUser'
		";
		sql($sql);
		$sql = "UPDATE user_besitzt_rolle
		SET
			rolle_bezeichnung = '$rolle'
		WHERE 
			user_userId = '$aktuellerUser'
		";
		sql($sql);
	};
?>