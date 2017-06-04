sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast"
	],

	function(Controller, MessageToast) {
		"use strict";
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf digitumo.Login
		 */
		return Controller.extend("DigiTumo.controller.Login", {

			onInit: function() {
				//Boolean Werte für Änderungen in den Inputfeldern
				this.userChanged = false;
				this.pwChanged = false;
			},

			//Wenn Inputfelder befüllt werden wird der initiale boolean wert auf true gesetzt und der Loginbutton aktiviert
			onUserInputChange: function() {
				this.userChanged = true;
				if (this.pwChanged === true) {
					this.byId("__xmlview1--loginb").setEnabled(true);
				}
			},

			onPwInputChange: function() {
				this.pwChanged = true;
				if (this.userChanged === true) {
					this.byId("__xmlview1--loginb").setEnabled(true);
				}
			},

			onLogin: function() {
				//Werte aus den Inputfeldern auslesen
				var userInput = this.byId("__xmlview1--user").getValue();
				var pwInput = this.byId("__xmlview1--passwort").getValue();

				// Ajax call to call php to handle login
				$.ajax({

					url: "php/login.php",
					data: {
						"user": userInput,
						"password": pwInput
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {

						switch (response) {
							case '0':
								this.onPatienten();
								break;
							case '1':
								sap.m.MessageToast.show("Nutzer nicht vorhanden");
								break;
							case '2':
								sap.m.MessageToast.show("Falsches Passwort");
								break;
						}
					}
				});

				//Input aus Inputfeldern löschen und Login Button deaktivieren
				this.byId("__xmlview1--loginb").setEnabled(false);
				this.byId("__xmlview1--user").setValue("");
				this.byId("__xmlview1--passwort").setValue("");
				this.userChanged = false;
				this.pwChanged = false;
			},

			onPatienten: function() {
				this.getOwnerComponent().getTargets().display("patienten");
			}
		});
	});