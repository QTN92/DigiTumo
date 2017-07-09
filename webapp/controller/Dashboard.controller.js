sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Dashboard", {

/**	In dem Model sind keine Daten		
			onBeforeRendering: function() {
				// vor der Anzeige des Dashboard Views wird das Video abhängig von Geschlecht und Tumorart ausgewählt und dem HTML-Element als content zugewiesen.
				var oModel = this.getView().byId("patienteninformation").getModel().getData(); 
				var geschlecht = "männdlich";//Object.values(Object.values(Object.values(oModel)[0])[0])[4];
				var tumor = "Lungenkrebs"; //Object.values(Object.values(Object.values(oModel)[0])[0])[7];
				var htmlcontent= "";		
				
				// Die Videos für Kehlkopfkrebs und Gehirntumor sind vom Geschlecht unabhängig
				if (tumor=="Kehlkopfkrebs"){
				htmlcontent="<video width='100%' height='100%' autoplay='true' loop='true' <source src='https://v.ftcdn.net/01/52/36/00/700_F_152360086_VovWspCtqZ6efWfO8Fyr3lzScwGrGiIb.mp4' type='video/mp4'> Your browser does not support the video tag. </video>";
				}
				
				if (tumor=="Gehirntumor"){
				htmlcontent="<video width='100%' height='100%' autoplay='true' loop='true' <source src='https://v.ftcdn.net/01/52/35/91/700_F_152359191_OFHjf9RvfUFh8OuzGxuyfknyT5DJrEZ5.mp4' type='video/mp4'> Your browser does not support the video tag. </video>";
				}

				if ((geschlecht=="weiblich") && (tumor=="Rückenmarkkrebs" || tumor=="Halswirbelsäulenkrebs")){
				htmlcontent="<video width='100%' height='100%' autoplay='true' loop='true' <source src='https://v.ftcdn.net/01/04/16/19/700_F_104161925_4kI0gO9cKNCfvTNEY6NiBqty83zaUJCO.mp4' type='video/mp4'> Your browser does not support the video tag. </video>";
				} 
				
				if ((geschlecht=="männlich") && (tumor=="Nierenzellenkrebs" || tumor=="Blasenkrebs")){
				htmlcontent="<video width='100%' height='100%' autoplay='true' loop='true' <source src='https://v.ftcdn.net/01/56/16/98/700_F_156169863_M1s0SBEAlXNQxcxcfXB0f5AvQbbzccvo.mp4' type='video/mp4'> Your browser does not support the video tag. </video>";
				}
				
				if (geschlecht=="männlich" && tumor=="Lungenkrebs"){
				htmlcontent="<video width='100%' height='100%' autoplay='true' loop='true' <source src='https://v.ftcdn.net/01/56/17/10/700_F_156171003_BtpLMDGK2VYfvEcXpNRpuA11ixKOhAvi.mp4' type='video/mp4'> Your browser does not support the video tag. </video>";
				}
				
				if ((geschlecht=="männlich") && (tumor=="Dickdarmkrebs" || tumor=="Leberkrebs" || tumor=="Magenkrebs")){
				htmlcontent="<video width='100%' height='100%' autoplay='true' loop='true' <source src='https://v.ftcdn.net/01/56/16/95/700_F_156169546_FXapvdgLeAZBjmKYY6Zx6Bc4OARHj1dp.mp4' type='video/mp4'> Your browser does not support the video tag. </video>";
				}
				
				if (htmlcontent != "") {
				this.getView().byId("htmlvideo").setContent(htmlcontent);
				}
			}, */
			
			onSaveAction: function(oEvent) {
				var oView = this.getView();
				var oDialog = oView.byId("vorgehendialog");
				// Dialog laden
				if (!oDialog) {
					// Dialog über fragment factory erstellen
					oDialog = sap.ui.xmlfragment(oView.getId(), "DigiTumo.fragment.setVorgehen", this);
					oView.addDependent(oDialog);
				};
				var datum = new Date();
				var tag = datum.getDate().toString();
				var monat = (datum.getMonth() + 1).toString();
				var jahr = datum.getFullYear().toString();
				if (tag.length == 1) {
					tag = "0" + tag;
				};
				if (monat.length == 1) {
					monat = "0" + monat;
				};
				datum = tag + "." + monat + "." + jahr;
				var oModel = new JSONModel(jQuery.sap.getModulePath("DigiTumo.model", "/vorgehen.json"));
				this.getView().byId("vorgehen").setModel(oModel);
				this.getView().byId("datum").setText(datum);
				oDialog.open();
			},

			onSave: function() {
				var patientId = Object.values(Object.values(Object.values(this.getView().byId("patienteninformation").getModel().getData())[0])[0])[
					0];
				var vorgehen = this.getView().byId("vorgehen").getSelectedKey();
				var notiz = this.getView().byId("notiz").getValue();
				if (vorgehen == "") {
					MessageBox.error("Bitte eine Entscheidung über das weitere Vorgehen eingeben.");
				} else {
					$.ajax({
						url: "php/dashboard/setWeiteresVorgehen.php",
						data: {
							"patientId": patientId,
							"vorgehen": vorgehen,
							"notiz": notiz,
						},
						type: "POST",
						context: this,
						success: function handleSuccess(response) {
							if (response === "fehler") {
								MessageBox.error("Speichern fehlgeschlagen.");
							} else {
								MessageBox.success("Das weitere Vorgehen wurde gespeichert.");
								this.getView().byId("vorgehendialog").close();
								this.getView().byId("vorgehendialog").destroy();
								$.ajax({
									url: "php/dashboard/getWeiteresVorgehen.php",
									data: {
										"patientId": response
									},
									type: "POST",
									context: this,
									success: function handleSuccess(response) {
										var oModel = new JSONModel();
										oModel.setJSON(response);
										this.getView().byId("vorgehenshistorie").setModel(oModel);
									},
									error: function handleError() {
										MessageBox.error("Die Verbindung ist fehlgeschlagen.");
									}
								})
							};
						},
						error: function handleError() {
							MessageBox.error("Speichern fehlgeschlagen.");
						}
					});
				}
			},

			onClose: function() {
				this.getView().byId("vorgehendialog").close();
				this.getView().byId("vorgehendialog").destroy();
			},

			onStudien: function() {
				this.getOwnerComponent().getTargets().display("studien");
			},

			onBack: function() {
				this.getOwnerComponent().getTargets().display("patienten");
			},
			
			resetFilter: function() {
				sap.ui.getCore().byId("__xmlview2--filter").setSelectedKey("");
				$.ajax({
					url: "php/patienten/getPatienten.php",
					type: "GET",
					context: this,
					success: function handleSuccess(response) {
						var oModel = new JSONModel();
						oModel.setJSON(response);
						sap.ui.getCore().byId("__xmlview2").setModel(oModel);
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
							pointer.resetFilter();
							pointer.getOwnerComponent().getTargets().display("login");
						};
					}
				});
			},
			
		});
	});
