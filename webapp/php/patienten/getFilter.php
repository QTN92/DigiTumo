<?php
	include_once '../db.php';

	$sql = "SELECT bezeichnung FROM krankheiten WHERE tumor = '0' GROUP BY bezeichnung";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$str = '{"filter": ' . $result . '}';
	echo $str;
?>