<?php
	include_once '../db.php';

	$vorname = $_POST['vorname'];
	$nachname = $_POST['nachname'];
	$tmpGeburtsdatum = $_POST['geburtsdatum'];
	$geburtsdatum = substr($tmpGeburtsdatum, 6, 4) . "-" . substr($tmpGeburtsdatum, 3, 2) . "-" . substr($tmpGeburtsdatum, 0, 2);
	$passwort = $_POST['passwort'];
	$rolle = $_POST['berechtigungsstatus'];
	$userId = $_POST['userId'];

	$sql = "
		INSERT 
		INTO 
			user (
				userId, 
				vorname, 
				nachname, 
				geburtsdatum, 
				passwort
			) 
		VALUES (
			'$userId', 
			'$vorname', 
			'$nachname', 
			'$geburtsdatum', 
			'$passwort'
		)
	";
	sql($sql);
	$sql = "
		INSERT 
		INTO 
			user_besitzt_rolle (
				user_userId, 
				rolle_bezeichnung
			) 
		VALUES (
			'$userId', 
			'$rolle'
		)
	";
	sql($sql);
?>