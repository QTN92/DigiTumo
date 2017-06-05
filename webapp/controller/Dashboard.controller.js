sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageToast, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Dashboard", {

			onInit: function() {
			},
			
			onBack: function() {
				this.getOwnerComponent().getTargets().display("patienten");
			}
		});
	});