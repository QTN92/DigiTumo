<?php
	include_once '../db.php';
	
	// Abfrage der gewünschten Informationen zu allen Patienten
	$sql = "SELECT patientenid, vorname, nachname, geburtsdatum, tumor, tumorstadium FROM patienten, krankenakte WHERE patienten.krankenaktenid = krankenakte.krankenaktenid";
	// Rückgabe des Abfrageergebnisses
	$result = json_encode(sql($sql));
	$str = '{"patienten": ' . $result . '}';
	echo $str;
?>