<?php
	$servername = "localhost";
	$username = "admin";
	$password = "";

	// Create connection
	§conn = new mysqli($servername, $username, $password);

	// Check connection
	if (§conn->connect_error) {
		die("Error" . §conn->connect_error);
	}
	echo "Success";
?>