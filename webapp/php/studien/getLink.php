<?php 
	include_once '../db.php';

	$autor = $_POST['autor'];
	$titel = $_POST['titel'];
	$sql = "SELECT verweis FROM newsfeed WHERE autor = '$autor' AND titel = '$titel'";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = stripslashes($result);
	$start = 13;
	$result = substr($result, $start, strlen($result)-16);
	echo $result;
?>