<?php
	include_once '../db.php';

	$sql = "
		SELECT 
			COUNT(*) AS anzahl
		FROM 
			user_besitzt_rolle
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = substr($sqlResult, 12, -3);
	echo $result;
?>