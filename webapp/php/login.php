<?php
	include_once 'db.php';

	// Prüfung ob Username und Passwort übergeben wurden
	// Im Erfolgsfall lokale Speicherung 
	if(isset($_POST['user'])) { 
		$post_user = $_POST['user'];
	};
	if(isset($_POST['passwort'])) {
		$post_passwort = $_POST['passwort'];
	};

	// Prüfung ob Username und Passwort nicht leer sind
	if($post_user != "" AND $post_passwort != "") {
		// Auslesen des Nutzernamens aus der DB
		$sql = "SELECT user FROM test_login WHERE user = " . $post_user;
		$result = json_encode(sql($sql));
		// Extrahieren des Nutzernamens aus dem Ergebnisstring
		$start = strlen($result)*(-1)+10;
		$max_length = $start*(-1)-3;
		$get_user = substr($result, $start, $max_length);

		// Auslesen des Passworts aus der DB
		$sql = "SELECT pw FROM test_login WHERE user = " . $post_user;
		$result = json_encode(sql($sql));
		// Extrahieren des Passworts aus dem Ergebnisstring
		$start = strlen($result)*(-1)+8;
		$max_length = $start*(-1)-3;
		$get_passwort = substr($result, $start, $max_length);

		// Prüfung der Login-Daten
		// Jeweiliges Ergebnis: 0 = Gleichheit, 1 = Ungleichheit
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