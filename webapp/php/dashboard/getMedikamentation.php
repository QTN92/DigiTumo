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
			datum AS datumZumOrdnen,
			DATE_FORMAT(datum, '%d.%m.%Y') AS datum,
			COUNT(*) AS anzahl
		FROM
			medikamentation
		WHERE
			krankenakte_krankenakteId = '$krankenakteId'
		GROUP BY
			datum
		ORDER BY
			datumZumOrdnen
	";
	$sqlResult = sql($sql);

	$result = array();
	for($i = 0; $i < count($sqlResult); $i++) {
		$tmp = json_encode($sqlResult[$i], JSON_UNESCAPED_UNICODE);
		$result[$i] = array();
		$result[$i][0] = substr($tmp, 40, 10);
		$result[$i][1] = substr($tmp, 62, -2);
		$i++;
	};
	echo $result;
?>