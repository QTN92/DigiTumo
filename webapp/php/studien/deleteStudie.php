<?php
	include_once '../db.php';

	$vorname = $_POST['vorname'];
	$nachname = $_POST['nachname'];
	$titel = $_POST['titel'];
	$jahr = $_POST['jahr'];

	$sql = "
		DELETE
		FROM
			newsfeed
		WHERE
			autorVorname = '$vorname'
			AND
				autorNachname = '$nachname'
			AND
				titel = '$titel'
			AND
				jahr = '$jahr'
	";
	sql($sql);
?>