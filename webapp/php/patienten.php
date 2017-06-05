<?php
	include_once 'db.php';
	
	// Name Geburtsdatum Tumorart aller aktuellen Patienten laden
	$sql = "SELECT name geburtsdatum tumorart FROM test_patienten";
	// Rückgabe des Ergebnisses als JSON-File
	echo json_encode(sql($sql));
?>