sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Admin", {

			onInit: function() {
				$.ajax({
					url: "php/admin/getUser.php",
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
			
			onAddUser: function() {
				var vorname = "Valentin";
				var nachname = "Grafenstein";
				$.ajax({
					url: "php/admin/generateUserId.php",
					data: {
						"vorname": vorname,
						"nachname": nachname
					},
					type: "POST",
					context: this,
					success: function handleSuccess(response) {
						console.log(response);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				})
			},
			
			onSave: function() {
				var i = 0;
				var userListe = new Array();
				var tmpObject = Object.values(this.getView().getModel().getData())[0];
				while(Object.values(tmpObject)[i] != null) {
					userListe[i] = new Array(8);
					for(var j = 0; j < 8; j++) {
						userListe[i][j] = Object.values(Object.values(tmpObject)[i])[j];
					};
					i++;
				};
				$.ajax({
					url: "php/admin/updateUser.php",
					data: {
						"userListe": userListe
					},
					type: "POST",
					context: this,
					success: function handleSuccess() {
						MessageBox.success("Speichern erfolgreich.");
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				})
			},
			
			onCancel: function() {
				$.ajax({
					url: "php/admin/getUser.php",
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
			
			onDeleteUser: function() {
				
			},          
			
			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			}
		});
	});