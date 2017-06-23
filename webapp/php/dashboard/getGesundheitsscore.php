<?php
	include_once '../db.php';

	$patientenid = $_POST['patientenid'];

	$sql  = "SELECT krankenakteId FROM krankenakte WHERE patient_patientId = '$patientenid'";
	$krankenakteid = substr(json_encode(sql($sql)), 19, -3);

	$sql = "SELECT MAX(datum) AS datum FROM krankheitsverlauf WHERE krankenakte_krankenakteId = '$krankenakteid' GROUP BY krankenakte_krankenakteId";
	$maxdatum = substr(json_encode(sql($sql)), 11, -3);

	$sql = "SELECT gesundheitsscore FROM krankheitsverlauf WHERE krankenakte_krankenakteId = '$krankenakteid' AND datum = '$maxdatum'";
	$result = json_encode(sql($sql));
	if(strlen($result) == 26) {
		$gesundheitsscore = substr(json_encode(sql($sql)), 22, -3);
	}
	else {
		$gesundheitsscore = 10;
	}
	echo $gesundheitsscore;
?>