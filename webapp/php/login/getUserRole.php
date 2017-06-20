<?php
	include_once '../db.php';

	$user = $_POST['user'];
	$sql = "SELECT rolle_bezeichnung FROM user_besitzt_rolle WHERE user_userId = '$user'";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$start = 23;
	$str = substr($result, $start, -3);
	switch($str) {
		case 'admin':
			echo '0';
			break;
		case 'newspflege':
			echo '1';
			break;
		case 'arzt':
			echo 2;
			break;
	}
?>