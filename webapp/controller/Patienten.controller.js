sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Patienten", {

			onInit: function() {
				// Binding der Patienten- und Krankenakteninformationen
				$.ajax({
					url: "php/patienten/getPatienten.php",
					type: "GET",
					context: this, 
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().setModel(oModel);	
					},
					error: function handleError() {
						sap.m.MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
			},
			
			onListItemPress: function (oEvent) {
				var evt = oEvent.getSource().getId().toString();
				var i = evt.length-1;
				var id = "";
				while(!isNaN(parseInt(evt[i]))) {
					id = evt[i] + id;
					i--;
				};
				id = parseInt(id);
				var patientenid = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id])[0];
				this.getOwnerComponent().getTargets().display("dashboard");
				sap.ui.getCore().byId("__xmlview3").oController.onLoad(patientenid);
			},
			
			on
			
			//Nur zum DashboardView testen
			onPress: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			},
			
			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			},
			
			onDashboard: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			}
		});
	});