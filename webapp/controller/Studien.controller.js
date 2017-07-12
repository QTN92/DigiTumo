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
					url: "php/studien/getStudien.php",
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
				}
				id = parseInt(id);
				var studien = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id]);
				var autorVorname = studien[0];
				var autorNachname = studien[1];
				var titel = studien[2];
				$.ajax({
					url: "php/studien/getVerweis.php",
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
				});
			},
			
			onLogout: function() {
				var pointer = this;
				MessageBox.confirm("Möchten Sie sich ausloggen?", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(sResult) {
						if(sResult == "YES") {
							$.ajax({
								url: "php/dashboard/clearHilfstabelle.php",
								context: this
							});
							pointer.getOwnerComponent().getTargets().display("login");
						}
					}
				});
			},
			
			onBack: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			}
		});
	});