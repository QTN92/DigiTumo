<?php
	include_once '../db.php';

	$anwesendeAerzte = $_POST['anwesendeAerzte'];
	$datum = date('Y-m-d');
	$sql = "INSERT INTO hilfstabelle (anwesendeAerzte, datum) VALUES ('$anwesendeAerzte', 
	'$datum')";
	sql($sql);
?>