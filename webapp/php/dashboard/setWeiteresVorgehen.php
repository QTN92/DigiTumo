<?php
	include_once '../db.php';

	$patientenid = $_POST['patientenid'];
	$sql = "SELECT krankenaktenid FROM patienten WHERE patientenid = '$patientenid'";
	$tmp = json_encode(sql($sql));
	$krankenaktenid = substr($tmp, strlen($tmp)*(-1)+20, strlen($tmp)-23);
	$tmp = $_POST['datum'];
	$datum = substr($tmp, 4) + "-" + substr($tmp, 7, 2) + "-" + substr($tmp, 10, 2);
	$vorgehen = $_POST['vorgehen'];
	$anmerkungen = $_POST['anmerkungen'];

	$sql = "INSERT INTO weiteresVorgehen (krankenaktenid, datum, vorgehen, anmerkungen) VALUES ('$krankenaktenid', '$datum', '$vorgehen', '$anmerkungen')";
	$result = sql($sql);
?>