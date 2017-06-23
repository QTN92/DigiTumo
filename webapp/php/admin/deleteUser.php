<?php
	include_once '../db.php';

	$userId = $_POST['userId'];
	$sql = "DELETE FROM user WHERE userId = '$userId'";
	sql($sql);
	$sql = "DELETE FROM user_besitzt_rolle WHERE user_userId = '$userId'";
	sql($sql);
?>