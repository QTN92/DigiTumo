sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageToast, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Patienten", {

			onInit: function() {
				$.ajax({
					url: "php/patienten.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
////						var oModel = new sap.ui.model.json.JSONModel();
////						oModel.setData(response);
//						var oModel = new JSONModel(jQuery.sap.getModulePath("DigiTumo.model", "/patienten.json"));
						var oModel = new JSONModel(response);
						this.getView().setModel(oModel);
					},
					error: function handleError() {
						sap.m.MessageToast.show("Die Verbindung ist fehlgeschlagen.");
					}
				})
			},
			
			onListItemPress: function (evt) {
				MessageToast.show("Pressed : " + evt.getSource().getTitle());
				this.getOwnerComponent().getTargets().display("dashboard");
			},
			
			onBack: function() {
				
			}
		});
	});