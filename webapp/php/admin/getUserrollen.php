<?php
	include_once '../db.php';

	$sql = "
		SELECT
			user_userId,
			rolle_bezeichnung
		FROM
			user_besitzt_rolle
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	echo $sqlResult;
?>