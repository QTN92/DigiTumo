sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Studien", {

			onInit: function() {
				// Binding der Patienten- und Krankenakteninformationen
				$.ajax({
					url: "php/studien/getNews.php",
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
			
			onPress: function(oEvent) {
				var i = oEvent.getSource();
				alert(i);
			},
			
			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			},
			
			onBack: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			}
		});
	});