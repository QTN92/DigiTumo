<?php
	include_once '../db.php';

	$anwesendeAerzte = $_POST['anwesendeAerzte'];

	$sql = "
		INSERT 
		INTO 
			hilfstabelle (
				anwesendeAerzte
			) 
		VALUES (
			'$anwesendeAerzte'
		)
	";
	sql($sql);
?>