<?php
	include_once '../db.php';

	$sql = "SELECT autor, titel, abstract FROM newsfeed";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$str = '{"news": ' . $result . '}';
	echo $str;
?>