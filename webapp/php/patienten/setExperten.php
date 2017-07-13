<?php
	include_once '../db.php';

	$anwesendeAerzte = $_POST['anwesendeAerzte'];

	$sql = "
		INSERT 
		INTO 
			tmp (
				anwesendeAerzte
			)
		VALUES (
			'$anwesendeAerzte'
		)
	";
	sql($sql);
?>