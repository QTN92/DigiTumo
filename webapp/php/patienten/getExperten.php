<?php
	include_once '../db.php';

	$sql = "
		SELECT 
			vorname, 
			nachname, 
			fachgebiet, 
			rang 
		FROM 
			experte
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = '{"experten": ' . $sqlResult . '}';
	echo $result;
?>