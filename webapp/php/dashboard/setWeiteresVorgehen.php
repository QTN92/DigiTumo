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
		$tmp = $_POST['datum'];
		$jahr = substr($tmp, 6);
		$monat = substr($tmp, 3, 2);
		$tag = substr($tmp, 0, 2);
		$tmp = $jahr . "-" . $monat . "-" . $tag;
		$tmp = strtotime($tmp);
		$datum = date('Y-m-d', $tmp);
		$vorgehen = $_POST['vorgehen'];
		$anmerkungen = $_POST['anmerkungen'];
		$notiz = $vorgehen . ": " . $anmerkungen;
		$anwesendeExperten = $_POST['anwesendeExperten'];
		$sql = "INSERT INTO vorgehenshistorie (krankenakte_krankenakteId, datum, notiz, anwesendeExperten) VALUES ('$krankenaktenid', '$datum', '$notiz', '$anwesendeExperten')";
		sql($sql);
	};	
?>