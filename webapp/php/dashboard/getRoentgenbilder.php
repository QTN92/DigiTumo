<?php
	include_once '../db.php';

	$patientId = $_POST['patientId'];
	
	$sql = "
		SELECT
			verzeichnisRöntgenbilder
		FROM
			krankenakte
		WHERE
			patient_patientId = '$patientId'
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = stripslashes($sqlResult);
	$result = substr($result, 31, -3);
	echo $result;
?>