<?php
	include_once '../db.php';

	$sql = "SELECT * FROM news2";
	echo json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
?>