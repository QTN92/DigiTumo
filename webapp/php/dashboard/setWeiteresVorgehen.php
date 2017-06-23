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

	if($krankenakteId == "") {
		echo "fehler";
	}
	else {
		$vorgehen = $_POST['vorgehen'];
		$notiz = $_POST['notiz'];
		$sql = "
			SELECT 
				MAX(datum) 
			FROM 
				hilfstabelle
		";
		$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
		$datum = substr($sqlResult, 16, -3);

		$sql = "
			SELECT 
				anwesendeAerzte 
			FROM 
				hilfstabelle 
			WHERE 
				datum = '$datum'
		";
		$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
		$anwesendeAerzte = substr($sqlResult, 21, -3);

		$sql = "
			INSERT 
			INTO 
				vorgehenshistorie (
					krankenakte_krankenakteId, 
					vorgehen, 
					notiz, 
					anwesendeExperten
				) 
			VALUES (
				'$krankenakteId', 
				'$vorgehen', 
				'$notiz', 
				'$anwesendeAerzte'
			)
		";
		sql($sql);
	};	
?>