<?php
	include_once '../db.php';

	$sql = "
		SELECT 
			*
		FROM 
			studien
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = '{"studien": ' . $sqlResult . '}';
	echo $result;
?>