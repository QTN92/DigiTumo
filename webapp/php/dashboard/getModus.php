<?php
	include_once '../db.php';

	$sql = "
		SELECT 
			COUNT(*)
		FROM
			tmp
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = substr($sqlResult, 14, -3);
	if($result == 0) {
		echo "r";
	}
	else {
		echo "rw";
	};
?>