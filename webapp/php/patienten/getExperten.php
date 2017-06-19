<?php
	include_once '../db.php';

	$sql = "SELECT vorname, nachname, fachgebiet, rang FROM experte";
	// Rückgabe des Abfrageergebnisses
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$str = '{"anwesenheit": ' . $result . '}';
	echo $str;
?>