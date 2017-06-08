<?php
	include_once '../db.php';

	$maxId = "SELECT MAX(newsid) AS maxId FROM news";
	$sql = "SELECT autor, titel, link FROM news WHERE newsid > ('$maxId'-5)";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$str = '{"news": ' . $result . '}';
	echo $str;
?>