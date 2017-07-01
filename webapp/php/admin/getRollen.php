<?php
	include_once '../db.php';

	$sql = "
		SELECT
			bezeichnung
		FROM
			rolle
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = '{"rollen": ' . $sqlResult . '}';
	echo $result;
?>