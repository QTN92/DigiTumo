sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageToast, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Patienten", {

			onInit: function() {
				var oModel = new JSONModel(jQuery.sap.getModulePath("DigiTumo.model","/patienten.json"));
				this.getView().setModel(oModel);
			}
		});
	});