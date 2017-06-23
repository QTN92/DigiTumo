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
				var vorname = this.getView().byId("vorname").getValue();
				var nachname = this.getView().byId("nachname").getValue();
				var titel = this.getView().byId("titel").getValue();
				var jahr = this.getView().byId("jahr").getValue();
				var medium = this.getView().byId("medium").getValue();
				var abstract = this.getView().byId("abstract").getValue();
				var verweis = this.getView().byId("verweis").getValue();
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