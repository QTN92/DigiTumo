<?php
	include_once '../db.php';

	$krankenakteId = $_POST['krankenakteId'];
	$tmp = $_POST['datum'];
	$datum = substr($tmp, 4) + "-" + substr($tmp, 7, 2) + "-" + substr($tmp, 10, 2);
	$vorgehen = $_POST['vorgehen'];
	$anmerkungen = $_POST['anmerkungen'];

	$sql = "INSERT INTO weiteresVorgehen (krankenakteid, datum, vorgehen, anmerkungen) VALUES ('$krankenakteId', '$datum', '$vorgehen', '$anmerkungen')";
	//sql($sql);
	echo($tmp);
?>