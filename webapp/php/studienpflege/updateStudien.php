<?php 
	include_once '../db.php';

	$studienListe = $_POST['studienListe'];

	for($i = 0; $i < count($studienListe); $i++) {
		$autorVorname = $studienListe[$i][0];
		$autorNachname = $studienListe[$i][1];
		$titel = $studienListe[$i][2];
		$jahr = $studienListe[$i][3];
		$medium = $studienListe[$i][4];
		$abstract = $studienListe[$i][5];
		$verweis = $studienListe[$i][6];

		$sql = "
			UPDATE
				studien
			SET
				medium = '$medium',
				abstract = '$abstract',
				verweis = '$verweis'
			WHERE 
				autorVorname = '$autorVorname'
				AND
					autorNachname = '$autorNachname'
				AND
					titel = '$titel'
				AND
					jahr = '$jahr'
		";
		sql($sql);
	};
?>