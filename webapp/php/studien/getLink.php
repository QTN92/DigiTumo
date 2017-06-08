<?php 
	include_once '../db.php';
	$autor = 'Peter Vajkoczy';
	$titel = 'Diskussion um potentielle Anti-Tumor-Wirkung von Methadon';
	//$autor = $_POST['autor'];
	//$titel = $_POST['titel'];
	$sql = "SELECT link FROM news WHERE autor = '$autor' AND titel = '$titel'";
	$result = json_encode(sql($sql), JSON_UNESCAPED_UNICODE);
	$result = stripslashes($result);
	$result = substr($result, strlen($result)*(-1)+10, strlen($result)-13);
	echo $result;
?>