<?php
	include_once '../db2.php';

	$post_user = $_POST['user'];
	$sql = "SELECT rolle FROM user WHERE userid = '$post_user'";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	echo $result[11];
?>