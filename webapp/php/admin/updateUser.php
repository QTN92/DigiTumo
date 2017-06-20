<?php
	include_once '../db.php';

	$userListe = $_POST['userListe'];
	for ($i = 0; $i < count($userListe); $i++) {
		$aktuellerUser = $userListe[$i][5];
		$sql = "SELECT count(*) FROM user WHERE userId = '$aktuellerUser'";
		$result = substr(json_encode(sql($sql)), 14, -3);
		if($result == 1) {
			$vorname = $userListe[$i][0];
			$nachname = $userListe[$i][1];
			$geburtsdatum = $userListe[$i][2];
			$fachgebiet = $userListe[$i][3];
			$rang = $userListe[$i][4];
			$passwort = $userListe[$i][6];
			$rolle = $userListe[$i][7];
			$sql = "UPDATE user 
			SET
				vorname = '$vorname',
				nachname = '$nachname',
				fachgebiet = '$fachgebiet',
				rang = '$rang',
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
	};
	








		/*	$sql = "UPDATE user 
		SET
				vorname = '$userListe[$i][0]',
				nachname = '$userListe[$i][1]',
				geburtsdatum = '$userListe[$i][2]',
				fachgebiet = '$userListe[$i][3]',
				rang = '$userListe[$i][4]',
				passwort = '$userListe[$i][6]'
			WHERE 
				userId = '$aktuellerUser'
			";*/
	//	};
	/*	$userVorhanden = 
		if (sql("SELECT count(*) FROM user WHERE userId = '$userListe[$i][5]") = 1) {
			$sql = "UPDATE user 
			SET
				vorname = '$userListe[$i][0]',
				nachname = '$userListe[$i][1]',
				geburtsdatum = '$userListe[$i][2]',
				fachgebiet = '$userListe[$i][3]',
				rang = '$userListe[$i][4]',
				passwort = '$userListe[$i][6]'
			WHERE 
				userId = '$userListe[$i][5]'
			";
		};*/
	//};


?>