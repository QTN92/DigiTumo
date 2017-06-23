<?php
	include_once '../db.php';

	$post_user = $_POST['userId'];
	$post_user = strtolower($post_user);
	$post_passwort = $_POST['passwort'];
	
	// Prüfung ob Username und Passwort nicht leer sind
	if($post_user != "" AND $post_passwort != "") {
		// Auslesen des Nutzernamens aus der DB
		$sql = "
			SELECT 
				userId 
			FROM 
				user 
			WHERE 
				userId = '$post_user'
		";
		$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
		// Extrahieren des Nutzernamens aus dem Ergebnisstring
		$get_user = substr($sqlResult, 12, -3);
		$get_user = strtolower($get_user);

		// Auslesen des Passworts aus der DB
		$sql = "
			SELECT 
				passwort 
			FROM 
				user 
			WHERE 
				userId = '$post_user'
		";
		$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
		// Extrahieren des Passworts aus dem Ergebnisstring
		$get_passwort = substr($sqlResult, 14, -3);

		// Prüfung der Login-Daten
		// Jeweiliges Ergebnis: 0: Gleichheit, != 0: Ungleichheit
		$is_user = strcmp($post_user, $get_user);
		$is_passwort = strcmp($post_passwort, $get_passwort);
		if ($is_user == 0 AND $is_passwort == 0) {
			// Rückgabewert 0: Login-Daten sind korrekt
			echo 0;
		}
		else if ($is_user != 0) {
			// Rückgabewert 1: Username ist falsch/ nicht vorhanden
			echo 1;
		}
		else {
			// Rückgabewert 2: Passwort ist falsch
			echo 2;
		}
	}
	// Rückgabewert 3: Username und/ oder Passwort sind leer
	else {
		echo 3;
	}
?>