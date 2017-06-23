sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Patienten", {

			onInit: function() {
				// Binding der Patienten- und Krankenakteninformationen
				$.ajax({
					url: "php/patienten/getPatienten.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().setModel(oModel);
						this.onAnwesenheitVermerken();
					},
					error: function handleError() {
						sap.m.MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				$.ajax({
					url: "php/patienten/getFilter.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						this.getView().byId("__xmlview2--filter").setModel(oModel);
					}
				})
			},

			onAnwesenheitVermerken: function() {
				// Dialog für Vermerken der Anwesenheit
				var oDialog = this.getView().byId("anwesenheitsdialog");
				if (!oDialog) {
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.anwesenheit", this);
					this.getView().addDependent(oDialog);
				};
				$.ajax({
					url: "php/patienten/getExperten.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						sap.ui.getCore().byId("__xmlview2--anwesenheitsdialog").setModel(oModel);
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.oDialog.open();
			},

			// Methoden für das Vermerken der Anwesenheit
			onAnwesenheitSpeichern: function() {
				var alleAerzte = sap.ui.getCore().byId("__xmlview2--anwesenheitsdialog").getModel().getProperty("/anwesenheit");
				var anzahlAerzte = alleAerzte.length;
				var id = "__item2-__xmlview2--anwesenheitsliste-";
				var anwesendeAerzte = "";
				for (var i = 0; i < anzahlAerzte; i++) {
					id = id + i;
					if (sap.ui.getCore().byId(id).isSelected()) {
						var arzt = Object.values(alleAerzte[i]);
						var tmp = arzt[0] + " " + arzt[1];
						if (anwesendeAerzte != "") {
							anwesendeAerzte = anwesendeAerzte + ", ";
						};
						anwesendeAerzte = anwesendeAerzte + tmp;
					};
				};
				$.ajax({
					url: "php/patienten/setExperten.php",
					data: {
						"anwesendeAerzte": anwesendeAerzte
					},
					type: "POST",
					context: this,
					success: function handleSuccess() {
						MessageBox.success("Speichern erfolgreich.");
					},
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.oDialog.close();
				this.oDialog.destroy();
				this.getOwnerComponent().getTargets().display("patienten");
			},

			onAnwesenheitNichtSpeichern: function() {
				this.oDialog.close();
				this.oDialog.destroy();
			},

			onFilter: function() {
				var key = this.getView().byId("__xmlview2--filter").getSelectedKey();
				if (key != "") {
					$.ajax({
						url: "php/patienten/getFilterGesetzt.php",
						data: {
							"key": key
						},
						type: "POST",
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
				} else {
					$.ajax({
						url: "php/patienten/getPatienten.php",
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
				}
			},

			// Logik für den Patientenview
			onListItemPress: function(oEvent) {
				var evt = oEvent.getSource().getId().toString();
				var i = evt.length - 1;
				var id = "";
				while (!isNaN(parseInt(evt[i]))) {
					id = evt[i] + id;
					i--;
				};
				id = parseInt(id);
				var patientenid = Object.values(Object.values(Object.values(this.getView().getModel().getData())[0])[id])[0];
				this.getOwnerComponent().getTargets().display("dashboard");
				sap.ui.getCore().byId("__xmlview3").oController.onLoad(patientenid);
			},

			//Nur zum DashboardView testen
			onPress: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			},

			onLogout: function() {
				$.ajax({
					url: "php/clearHilfstabelle.php",
					context: this,
					error: function handleError() {
						MessageBox.error("Die Verbindung ist fehlgeschlagen.");
					}
				});
				this.getOwnerComponent().getTargets().display("login");
			},

			onDashboard: function() {
				this.getOwnerComponent().getTargets().display("dashboard");
			}
		});
	});