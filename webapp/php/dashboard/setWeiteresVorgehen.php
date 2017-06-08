<?php
	include_once '../db.php';

	$krankenakteId = $_POST['krankenakteId'];
	$datum = $_POST['datum'];
	$vorgehen = $_POST['vorgehen'];
	$anmerkungen = $_POST['anmerkungen'];

	$sql = "INSERT INTO weiteresVorgehen (krankenakteid, datum, vorgehen, anmerkungen) VALUES ('$krankenakteId', '$datum', '$vorgehen', '$anmerkungen')";
	sql($sql);
?>