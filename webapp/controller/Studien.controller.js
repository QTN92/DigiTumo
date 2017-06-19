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
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
			},
			
			onPress: function(oEvent) {
				var evt = oEvent.getSource().getId().toString();
				var i = evt.length-1;
				var id = "";
				while(!isNaN(parseInt(evt[i]))) {
					id = evt[i] + id;
					i--;
				};
				id = parseInt(id);
				var news = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id]);
				var autorVorname = news[0];
				var autorNachname = news[1];
				var titel = news[2];
				$.ajax({
					url: 'php/studien/getLink.php',
					data: {
						"autorVorname": autorVorname,
						"autorNachname": autorNachname,
						"titel": titel
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						window.open(response, '_blank');
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				})
			},
			
			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			},
			
			onBack: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			}
		});
	});