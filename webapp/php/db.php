<?php
	function sql($sql) {
		// Call function to create connection
		$conn = connect();

		// Execute statement and save result
		$result = $conn->query($sql);

		// If stmt was not a select
		if (gettype($result) == 'boolean') {
			// Return wether the stmt was executed successfully or not
			return $result;
		}
		else {
			// Iterate over all rows to fetch the data
			$rows = array();
			while ($r = $result->fetch_assoc()) {
				$rows[] = $r;
			};
			// Return the result
			return $rows;
		};

		// Close result and connection
		$result->close();
		$conn->close();
	}

	function connect() {
		$servername = "localhost";
		$username = "admin";
		$password = "";
		$database = "test";

		// Create connection
		$conn = new mysqli($servername, $username, $password, $database);

		// Check connection
		if ($conn->connect_error) {
			die($conn->connect_error);
		};
		return $conn;
	}
?>