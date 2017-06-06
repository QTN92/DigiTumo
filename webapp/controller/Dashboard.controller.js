sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageToast, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Dashboard", {

			onInit: function() {
				var oModel = new JSONModel(jQuery.sap.getModulePath("DigiTumo.model", "/dashboard.json"));
				this.getView().setModel(oModel);

//				var oModel = new JSONModel();
//				oModel.setJSON(jQuery.sap.getModulePath("DigiTumo.model", "/dashboard.json"));
//				this.getView().setModel(oModel);
			},

			onBack: function() {
				this.getOwnerComponent().getTargets().display("patienten");
			},

			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			}
			
		});
	});