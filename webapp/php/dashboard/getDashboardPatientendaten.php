<?php
	include_once '../db.php';
	
	$patientenid = $_POST['patientenid'];
	$sql = "SELECT vorname, nachname, geburtsdatum, geschlecht, raucher, krankenkasse, tumor, tumorstadium, diagnosedatum, weitere_krankheiten FROM patienten, krankenakte WHERE patienten.krankenaktenid = krankenakte.krankenaktenid AND patientenid = '$patientenid'";
	// Rückgabe des Abfrageergebnisses
	$result = json_encode(sql($sql));
	$str = '{"datenblatt": ' . $result . '}';
	echo $str;
?>