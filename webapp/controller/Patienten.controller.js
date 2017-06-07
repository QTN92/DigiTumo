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
				var evtTitle = oEvent.getSource().getTitle();
				var id = "";
				var index = 0;
				while(evtTitle[index] != " ") {
					id = index+evtTitle[index];
					index++;
				};
				var patientenid = id;
				this.getOwnerComponent().getTargets().display("dashboard");
			},
			
			//Nur zum DashboardView testen
			onPress: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			},
			
			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			},
			
			onBack: function() {
				
			}
		});
	});