sap.ui.controller("pages.Login", {
/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf digitumo.Login
*/
	onInit: function() {
		// Nachladen von SAPUI5-Elementen, die im Weiteren zur Anwendung kommen
		jQuery.sap.require("sap.m.MessageBox");
		
		// Initiale Verbindung zur Datenbank herstellen
		$.ajax({
			url: "php/connect.php",
			context: this,
			// Success behandelt in diesem Fall sowohl success als auch failure, da bei fehlgeschlagenem Verbindungsaufbau kein verwertbarer Fehler geworfen wird
			success: function handleSuccess(response) {
				if (response == "success") {
					sap.m.MessageToast.show("Verbindung zur Datenbank wurde erfolgreich hergestellt.", {});
				}
				else {
//					sap.m.MessageBox.error("Verbindung zur Datenbank ist fehlgeschlagen.", {});
					// TODO MessageToast endgültig durch MessageBox ersetzen. MessageToast nur zur Erleichterung der Entwicklung
					sap.m.MessageToast.show("Verbindung zur Datenbank ist fehlgeschlagen.", {});
				}
			}
		})
	},

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

});