<?php
	include_once '../db.php';

	$sql = "
		SELECT 
			autorVorname, 
			autorNachname, 
			titel, 
			abstract 
		FROM 
			newsfeed
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = '{"news": ' . $sqlResult . '}';
	echo $result;
?>