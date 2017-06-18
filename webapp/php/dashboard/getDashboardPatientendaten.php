<?php
	include_once '../db.php';
	//$patientenid = $_POST['patientenid'];
	$patientenid = '3';
	$tmp = json_encode(sql("SELECT krankenakteId FROM krankenakte WHERE patient_patientId = '$patientenid'"));
	$krankenakteid = substr($tmp, 19, -3);
	$sql = "SELECT 
		patientId, vorname, nachname, DATE_FORMAT(geburtsdatum, '%d.%m.%Y') AS geburtsdatum, geschlecht, raucher,
		name AS versicherung,
		bezeichnung AS tumor,
		DATE_FORMAT(diagnosedatum, '%d.%m.%Y') AS diagnosedatum,
		krankheiten_bezeichnung AS weitere_krankheiten
	FROM
		patient 
		JOIN versicherung ON (patient.patientId = versicherung.patient_patientId) 
		JOIN krankenakte ON (patient.patientId = krankenakte.patient_patientId) 
		JOIN krankheiten ON (krankenakte.krankenakteId = krankheiten.krankenakte_krankenakteId) 
		JOIN patient_hat_krankheit ON (patient.patientId = patient_hat_krankheit.patient_patientId)
	WHERE
		patientId = '$patientenid' AND tumor = '0'
	";
	// Rückgabe des Abfrageergebnisses
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$str = '{"datenblatt": ' . $result . '}';
	echo $str;
?>