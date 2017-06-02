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
				// Initiale Verbindung zur Datenbank herstellen
				$.ajax({
					url: "php/connect.php",
					context: this,
					// Success behandelt in diesem Fall sowohl success als auch failure, da bei fehlgeschlagenem Verbindungsaufbau kein verwertbarer Fehler geworfen wird
					success: function handleSuccess(response) {
						if (response === "success") {
							MessageToast.show("Verbindung zur Datenbank wurde erfolgreich hergestellt.", {});
						} else {
							//					sap.m.MessageBox.error("Verbindung zur Datenbank ist fehlgeschlagen.", {});
							// TODO MessageToast endgültig durch MessageBox ersetzen. MessageToast nur zur Erleichterung der Entwicklung
							MessageToast.show("Verbindung zur Datenbank ist fehlgeschlagen.", {});
						}
					}
				});
			},

			onLogin: function() {
				//check User und Passwort in DBTabelle
			}
		});
	});
/**
 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
 * (NOT before the first rendering! onInit() is used for that one!).
 * @memberOf digitumo.Login
 */
//	onBeforeRendering: function() {
//
//	},

/**
 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
 * This hook is the same one that SAPUI5 controls get after being rendered.
 * @memberOf digitumo.Login
 */
//	onAfterRendering: function() {
//
//	},

/**
 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
 * @memberOf digitumo.Login
 */
//	onExit: function() {
//
//	}