<?php
	include_once '../db.php';

	$sql = "SELECT autor, titel, link FROM news";
	echo json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
?>