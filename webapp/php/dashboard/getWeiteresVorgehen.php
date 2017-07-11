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
	$krankenakteId = substr($sqlResult, 19, -3);

	$sql = "
		SELECT 
			datum AS ordnungsdatum,
			DATE_FORMAT(datum, '%d.%m.%y') AS datum, 
			vorgehen, 
			notiz, 
			anwesendeExperten 
		FROM 
			vorgehenshistorie 
		WHERE 
			krankenakte_krankenakteId = '$krankenakteId'
		ORDER BY
			ordnungsdatum DESC
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = '{"vorgehenshistorie": ' . $sqlResult . '}';
	echo $result;
?>