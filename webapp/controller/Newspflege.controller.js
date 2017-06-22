sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Newspflege", {

			onInit: function() {
				$.ajax({
					url: "php/newspflege/getNews.php",
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

			onAddStudie: function() {
				var oDialog = this.getView().byId("studiendialog");
				if (!oDialog) {
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addStudie", this);
					this.getView().addDependent(oDialog);
				}
				this.oDialog.open();
			},
			
			onStudieSave: function() {
				var vorname = this.byId("__xmlview2--vorname").getValue();
				var nachname = this.getView().byId("__xmlview2--nachname").getValue();
				var titel = this.getView().byId("__xmlview2--titel").getValue();
				var jahr = this.getView().byId("__xmlview2--jahr").getValue();
				var medium = this.getView().byId("__xmlview2--medium").getValue();
				var abstract = this.getView().byId("__xmlview2--abstract").getValue();
				var verweis = this.getView().byId("__xmlview2--verweis").getValue();
				$.ajax({
					url: "",
					data: {
						"vorname": vorname,
						"nachname": nachname,
						"titel": titel,
						"jahr": jahr,
						"medium": medium,
						"abstract": abstract,
						"verweis": verweis
						},
					type: "POST",
					context: this,
					success: function handleSuccess() {

					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.oDialog.destroy();
				this.oDialog.close();
			},

			onClose: function() {
				this.oDialog.destroy();
				this.oDialog.close();
			},

			onLogout: function() {
				this.getOwnerComponent().getTargets().display("login");
			}
		});
	});