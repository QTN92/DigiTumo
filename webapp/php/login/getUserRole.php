<?php
	include_once '../db.php';

	$post_user = $_POST['user'];
	$sql = "SELECT rolle FROM user WHERE userid = '$post_user'";
	$result = json_encode(sql($sql));
	echo $result[11];
?>