<?php
	include_once '../db.php';

	$patientId = $_POST['patientId'];

	$sql = "
		SELECT 
			krankenakteId 
		FROM 
			krankenakte 
		WHERE 
			patient_patientId = '$patientId'
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$krankenakteid = substr($sqlResult, 19, -3);

	$sql = "
		SELECT 
			MAX(datum) AS datum 
		FROM 
			krankheitsverlauf 
		WHERE 
			krankenakte_krankenakteId = '$krankenakteid' 
		GROUP BY 
			krankenakte_krankenakteId
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$maxdatum = substr($sqlResult, 11, -3);

	$sql = "
		SELECT 
			gesundheitsscore 
		FROM 
			krankheitsverlauf 
		WHERE 
			krankenakte_krankenakteId = '$krankenakteid' 
			AND 
				datum = '$maxdatum'
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	
	if(strlen($sqlResult) == 26) {
		$gesundheitsscore = substr($sqlResult, 22, -3);
	}
	else {
		$gesundheitsscore = 10;
	};
	echo $gesundheitsscore;
?>