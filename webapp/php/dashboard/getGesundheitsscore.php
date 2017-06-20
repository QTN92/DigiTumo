<?php
	include_once '../db.php';

	$patientenid = $_POST['patientenid'];
	$sql = "SELECT gesundheitsscore FROM krankheitsverlauf WHERE (SELECT krankenakteId FROM krankenakte WHERE patienten_patientenId = '$patientenid') = krankenakte_krankenakteId";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	if(strlen($result) == 26) {
		$str = substr($result, 22, 1);
	}
	else {
		$str = 10;
	};
	echo $str;
?>