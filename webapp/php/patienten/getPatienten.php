<?php
	include_once '../db.php';
	
	// Abfrage der gewünschten Informationen zu allen Patienten
	$sql = "SELECT patientenid, vorname, nachname, DATE_FORMAT(geburtsdatum, '%d.%m.%Y') AS geburtsdatum, tumor, tumorstadium FROM patienten, krankenakte WHERE patienten.krankenaktenid = krankenakte.krankenaktenid";
	// Rückgabe des Abfrageergebnisses
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$str = '{"patienten": ' . $result . '}';
	echo $str;
?>