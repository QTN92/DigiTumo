<?php
	include_once '../db.php';

	$vorname = $_POST['vorname'];
	$nachname = $_POST['nachname'];
	$titel = $_POST['titel'];
	$jahr = $_POST['jahr'];
	$medium = $_POST['medium'];
	$abstract = $_POST['abstract'];
	$verweis = $_POST['verweis'];

	$sql = "
		INSERT 
		INTO
			newsfeed (
				autorVorname,
				autorNachname,
				titel,
				jahr,
				medium,
				abstract,
				verweis
			)
		VALUES
			(
				'$vorname',
				'$nachname',
				'$titel',
				'$jahr',
				'$medium',
				'$abstract',
				'$verweis'
			)
	";
	sql($sql);
?>