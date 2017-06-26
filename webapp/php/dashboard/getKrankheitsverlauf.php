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
			DATE_FORMAT(krankheitsverlauf.datum, '%d.%m.%Y') AS datum,
			gesundheitsscore,
			dosis
		FROM
			krankheitsverlauf
			JOIN
				medikamentation
			ON
				(krankheitsverlauf.datum = medikamentation.datum)
		WHERE
			krankheitsverlauf.krankenakte_krankenakteId = '$krankenakteId'
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = '{"krankheitsverlauf": ' . $sqlResult . '}';
	echo $result;
?>