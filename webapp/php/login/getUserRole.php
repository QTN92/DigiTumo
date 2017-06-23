<?php
	include_once '../db.php';

	$userId = $_POST['userId'];
	$sql = "
		SELECT 
			rolle_bezeichnung 
		FROM 
			user_besitzt_rolle 
		WHERE 
			user_userId = '$user'
	";
	$sqlResult = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$rolle = substr($sqlResult, 23, -3);
	
	switch($rolle) {
		case 'Administrator':
			echo '0';
			break;
		case 'Newspflege':
			echo '1';
			break;
		case 'Arzt':
			echo 2;
			break;
	}
?>