<?php 
	include_once '../db.php';

	$autorVorname = $_POST['autorVorname'];
	$autorNachname = $_POST['autorNachname'];
	$titel = $_POST['titel'];
	$sql = "SELECT verweis FROM newsfeed WHERE autorVorname = '$autorVorname' AND autorNachname = '$autorNachname' AND titel = '$titel'";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = stripslashes($result);
	$start = 13;
	$result = substr($result, $start, strlen($result)-16);
	echo $result;
?>