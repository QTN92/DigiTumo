<?php
	include_once 'db.php';

	$post_user = $_POST['user'];
	$post_password = $_POST['password'];
	//$post_user = '14';
	//$post_password = '11';

	// Get user name from database
	$sql = "SELECT user FROM test1 WHERE user = " . $post_user;
	$result = json_encode(sql($sql));
	// Extract user name from result to compare login data
	$start = strlen($result)*(-1)+10;
	$max_length = $start*(-1)-3;
	$get_user = substr($result, $start, $max_length);

	// Get password from database
	$sql = "SELECT pw FROM test1 WHERE user = " . $post_user;
	$result = json_encode(sql($sql));
	// Extract password from result to compare login data
	$start = strlen($result)*(-1)+8;
	$max_length = $start*(-1)-3;
	$get_password = substr($result, $start, $max_length);

	// Check login data
	$is_user = strcmp($post_user, $get_user);
	$is_password = strcmp($post_password, $get_password);
	if ($is_user == 0 AND $is_password == 0) {
		echo 0;
	}
	else if ($is_user != 0) {
		echo 1;
	}
	else {
		echo 2;
	}
?>