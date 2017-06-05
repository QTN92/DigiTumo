<?php
	include_once 'db.php';
	
	// Name Geburtsdatum Tumorart aller aktuellen Patienten laden
	$sql = "SELECT vorname, nachname, geburtsdatum, tumorart FROM test_patienten";
	// Rückgabe des Ergebnisses als JSON-File
	echo json_encode(sql($sql));
	//$result = '{ "Patienten": ' . sql($sql) + 
	//$array = array("Patienten:", sql($sql));
	//echo json_encode($array);
?>