<?php
	include_once '../db.php';

	$patientenid = $_POST['patientenid'];
	$sql = "SELECT krankenakteId FROM krankenakte WHERE patient_patientId = '$patientenid'";
	$tmp = json_encode(sql($sql));
	$krankenaktenid = substr($tmp, 19, -3);
	if($krankenaktenid == "") {
		echo "fehler";
	}
	else {
		$vorgehen = $_POST['vorgehen'];
		$notiz = $_POST['notiz'];
		$sql = "SELECT MAX(datum) FROM hilfstabelle";
		$tmp = substr(json_encode(sql($sql)), 16, -3);
		$sql = "SELECT anwesendeAerzte FROM hilfstabelle WHERE datum = '$tmp'";
		$anwesendeAerzte = substr(json_encode(sql($sql)), 21, -3);
		sql($sql);
		$sql = "INSERT INTO vorgehenshistorie (krankenakte_krankenakteId, vorgehen, notiz, anwesendeExperten) VALUES ('$krankenaktenid', '$vorgehen', '$notiz', '$anwesendeAerzte')";
		sql($sql);
	};	
?>