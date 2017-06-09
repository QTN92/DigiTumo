<?php 
	include_once '../db.php';

	$autor = $_POST['autor'];
	$titel = $_POST['titel'];
	$sql = "SELECT link FROM news WHERE autor = '$autor' AND titel = '$titel'";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = stripslashes($result);
	$start = 10;
	$result = substr($result, 10, strlen($result)-13);
	echo $result;
?>