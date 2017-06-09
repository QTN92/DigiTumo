<?php
	include_once '../db.php';

	$patientenid = $_POST['patientenid'];
	$sql = "SELECT krankenaktenid FROM patienten WHERE patientenid = '$patientenid'";
	$tmp = json_encode(sql($sql));
	$krankenaktenid = substr($tmp, 20, strlen($tmp)-23);
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
		$sql = "INSERT INTO weiteresVorgehen (krankenaktenid, datum, vorgehen, anmerkungen) VALUES ('$krankenaktenid', '$datum', '$vorgehen', '$anmerkungen')";
		sql($sql);
	};	
?>