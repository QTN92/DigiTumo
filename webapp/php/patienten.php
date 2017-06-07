<?php
	include_once 'db.php';
	
	// Abfrage der gewünschten Informationen zu allen Patienten
	$sql = "SELECT vorname, nachname, geburtsdatum, tumor, tumorstadium FROM patienten, krankenakte WHERE patienten.krankenakteId = krankenakte.id";
	// Rückgabe des Abfrageergebnisses
	$result = json_encode(sql($sql));
	$str = '{"patienten": ' . $result . '}';
	echo $str;
?>