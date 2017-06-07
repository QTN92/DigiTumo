<?php
	include_once '../db.php';
	
	//$patientenid = $_POST['patientenid'];
	$patientenid = "1";
	$sql = "SELECT vorname, nachname, DATE_FORMAT(geburtsdatum, '%d.%m.%Y') AS geburtsdatum, geschlecht, raucher, krankenkasse, tumor, tumorstadium, DATE_FORMAT(diagnosedatum, '%d.%m.%Y') AS diagnosedatum, weitere_krankheiten FROM patienten, krankenakte WHERE patienten.krankenaktenid = krankenakte.krankenaktenid AND patientenid = '$patientenid'";
	// Rückgabe des Abfrageergebnisses
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$str = '{"datenblatt": ' . $result . '}';
	echo $str;
?>