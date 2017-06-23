<?php
	include_once '../db.php';

	$sql = "
		SELECT 
			bezeichnung 
		FROM 
			krankheiten 
		WHERE 
			tumor = '0' 
		GROUP BY 
			bezeichnung
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = '{"filter": ' . $sqlResult . '}';
	echo $result;
?>