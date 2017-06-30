<?php 
	include_once '../db.php';

	$autorVorname = $_POST['autorVorname'];
	$autorNachname = $_POST['autorNachname'];
	$titel = $_POST['titel'];

	$sql = "
		SELECT 
			verweis 
		FROM 
			studien 
		WHERE 
			autorVorname = '$autorVorname' 
			AND 
				autorNachname = '$autorNachname' 
			AND 	titel = '$titel'
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = stripslashes($sqlResult);
	$result = substr($result, 13, strlen($result)-16);
	echo $result;
?>