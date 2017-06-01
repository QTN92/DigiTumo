<?php
	$servername = "localhost";
	$username = "admin";
	$password = "";
		
	// Create connection
	$conn = new mysqli($servername, $username, $password);

	// Check connection
	if ($conn->connect_error) {
		die($conn->connect_error);
	}
	echo "success";
?>