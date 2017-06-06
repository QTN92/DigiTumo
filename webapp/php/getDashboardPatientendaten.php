<?php
	include_once 'db.php';
	$patient_vorname = $_POST['patient_vorname'];
	$patient_nachname = $_POST['patient_nachname'];
	$patient_geburtsdatum = $_POST['patient_geburtsdatum'];
	$sql = "SELECT vorname, nachname, geburtsdatum, geschlecht, raucher, krankenkasse, tumor, tumorstadium, diagnosedatum, weitere_krankheiten FROM patienten, krankenakte WHERE patienten.krankenakteId = krankenakte.id AND vorname = '$patient_vorname' AND nachname = '$patient_nachname' AND geburtsdatum = '$patient_geburtsdatum'";
	// Rückgabe des Abfrageergebnisses
	$result = json_encode(sql($sql));
	$str = '{"datenblatt": ' . $result . '}';
	echo $str;
?>