<?php
	include_once '../db2.php';

	$patientenid = $_POST['patientenid'];
	$sql = "SELECT gesundheitsscore FROM patienten, krankenakte WHERE patienten.krankenaktenid = krankenakte.krankenaktenid AND patientenid = '$patientenid'";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	if(strlen($result) == 26) {
		$str = substr($result, 22, 1);
	}
	else {
		$str = 10;
	};
	echo $str;
?>