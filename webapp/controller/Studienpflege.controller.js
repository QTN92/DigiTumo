sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Studienpflege", {
			
			// Auslagern des AJAX-Call als eigene Funktion, da diese mehrfach genutzt wird. Es werden
			loadData: function() {
				$.ajax({
					url: "php/studienpflege/getStudien.php",
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
			
			// Funktion wird beim ersten Aufruf des Views ausgeführt
			onInit: function() {
				this.loadData();
			},

			// Damit der View übersichtlich bleibt, öffnet sich beim Hinzufügen neuer Studien ein seperater Dialog
			onAddStudie: function() {
				var oDialog = this.getView().byId("studiendialog");
				if (!oDialog) {
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addStudie", this);
					this.getView().addDependent(oDialog);
				}
				this.oDialog.open();
			},
			
			onSaveNeueStudie: function() {
				var oVorname = this.getView().byId("vorname");
				var oVornameValue = oVorname.getValue();
				var validVorname = true;																					
				if(oVornameValue === "") {																					
					oVorname.setValueState(sap.ui.core.ValueState.Error);								
					oVorname.setValueStateText("Bitte geben Sie einen Vornamen ein.");														
					validVorname = false;
				}
				else {
					if(oVornameValue.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) {																
						oVorname.setValueState(sap.ui.core.ValueState.Error);					
						oVorname.setValueStateText("Der Vorname darf nur Buchstaben enthalten.");		
						oVorname.setValue("");													
						validVorname = false;
					}
					else {
						oVorname.setValueState(sap.ui.core.ValueState.None);							
						oVornameValue = oVornameValue.trim();
						oVornameValue = oVornameValue[0].toUpperCase() + oVornameValue.substring(1, oVornameValue.length);
					}
				}
				var oNachname = this.getView().byId("nachname");
				var oNachnameValue = oNachname.getValue();												
				var validNachname = true;																				
				if(oNachnameValue === "") {																					
					oNachname.setValueState(sap.ui.core.ValueState.Error);						
					oNachname.setValueStateText("Bitte geben Sie einen Nachnamen ein.");												
					validNachname = false;
				}
				else {
					if(oNachnameValue.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) {														
						oNachname.setValueState(sap.ui.core.ValueState.Error);					
						oNachname.setValueStateText("Der Nachname darf nur Buchstaben enthalten.");					
						validNachname = false;
					}
					else {
						oNachname.setValueState(sap.ui.core.ValueState.None);						
						oNachnameValue = oNachnameValue.trim();
						oNachnameValue = oNachnameValue[0].toUpperCase() + oNachnameValue.substring(1, oNachnameValue.length);
					}
				}
				
				var oTitel = this.getView().byId("titel");
				var oTitelValue = oTitel.getValue();
				var validTitel = true;
				if(oTitelValue === "") {
					oTitel.setValueState(sap.ui.core.ValueState.Error);					
					oTitel.setValueStateText("Bitte geben Sie einen Titel ein.");
					validTitel = false;
				}
				else {
					oTitel.setValueState(sap.ui.core.ValueState.None);
				}
				
				var oJahr = this.getView().byId("jahr");
				var oJahrValue = oJahr.getValue();
				var validJahr = true;
				if(oJahrValue === "") {
					oJahr.setValueState(sap.ui.core.ValueState.Error);					
					oJahr.setValueStateText("Bitte geben Sie ein Jahr ein.");
					validJahr = false;
				}
				else if(oJahrValue.search(/^[0-9]+$/) === -1) {
					oJahr.setValueState(sap.ui.core.ValueState.Error);					
					oJahr.setValueStateText("Bitte geben Sie ein gültiges Jahr ein.");
					validJahr = false;
				}
				else if(parseInt(oJahrValue) > new Date().getFullYear() || parseInt(oJahrValue) < (parseInt(new Date().getFullYear())-10)){
					oJahr.setValueState(sap.ui.core.ValueState.Error);					
					oJahr.setValueStateText("Bitte geben Sie ein gültiges Jahr ein.");
					validJahr = false;
				}
				else {
					oJahr.setValueState(sap.ui.core.ValueState.None);
				}
						
				var oMedium = this.getView().byId("medium");				
				var oMediumValue = oMedium.getValue();
				var validMedium = true;
				if(oMediumValue === "") {
					oMedium.setValueState(sap.ui.core.ValueState.Error);
					oMedium.setValueStateText("Bitte geben Sie ein Medium ein.");
					validMedium = false;
				}
				else {
					oMedium.setValueState(sap.ui.core.ValueState.None);
				}
				
				var oAbstract = this.getView().byId("abstract");
				var oAbstractValue = oAbstract.getValue();
				var validAbstract = true;
				if(oAbstractValue === "") {
					oAbstract.setValueState(sap.ui.core.ValueState.Error);
					oAbstract.setValueStateText("Bitte geben Sie einen Abstract ein.");
					validAbstract = false;
				}
				else {
					oAbstract.setValueState(sap.ui.core.ValueState.None);
				}
				
				var oVerweis = this.getView().byId("verweis");
				var oVerweisValue = oVerweis.getValue();
				var validVerweis = true;
				if(oVerweisValue === "") {
					oVerweis.setValueState(sap.ui.core.ValueState.Error);
					oVerweis.setValueStateText("Bitte geben Sie einen Verweis zum Original ein.");
					validVerweis = false;
				}
				else {
					oVerweis.setValueState(sap.ui.core.ValueState.None);
				}
				
				if(validVorname && validNachname && validTitel && validJahr && validMedium && validAbstract && validVerweis) {
					$.ajax({
						url: "php/studien/setNeueStudie.php",
						data: {
							"vorname": oVornameValue,
							"nachname": oNachnameValue,
							"titel": oTitelValue,
							"jahr": oJahrValue,
							"medium": oMediumValue,
							"abstract": oAbstractValue,
							"verweis": oVerweisValue
						},
						type: "POST",
						context: this,
						success: function handleSuccess() {
							this.loadData();
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");
						}
					});
					this.oDialog.destroy();
					this.oDialog.close();
				}
				else {
					MessageBox.error("Bitte überprüfen Sie Ihre Eingaben!");		
				}
			},
			
			onCancelNeueStudie: function() {
				var pointer = this;
				if(
					this.getView().byId("vorname").getValue() !== "" ||
					this.getView().byId("nachname").getValue() !== "" ||
					this.getView().byId("titel").getValue() !== "" ||
					this.getView().byId("jahr").getValue() !== "" ||
					this.getView().byId("medium").getValue() !== "" ||
					this.getView().byId("abstract").getValue() !== "" ||
					this.getView().byId("verweis").getValue() !== ""
				) {
					MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", {										
						actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],										
						onClose: function(sResult) {
							if(sResult === "YES") {																				
								pointer.oDialog.destroy();
								pointer.oDialog.close();
							}
						}
					});
				}
				else {
					this.oDialog.destroy();
					this.oDialog.close();
				}
			},
			
			onDeleteStudie: function(oEvent) {
				var pointer = this;
				var tmp = Object.values(oEvent.getParameters()).toString();
				var id = parseInt(tmp.substring(48, tmp.length));
				tmp = Object.values(Object.values(this.getView().getModel().getData())[0])[id];
				MessageBox.confirm("Möchten Sie diesen Artikel wirklich löschen?", {							
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],									
					onClose: function(sResult) {
						if(sResult === "YES") {		
							$.ajax({																					
								url: "php/studienpflege/deleteStudie.php",
								data: {
									"vorname": Object.values(tmp)[1],
									"nachname": Object.values(tmp)[0],
									"titel": Object.values(tmp)[2],
									"jahr": Object.values(tmp)[3]
								},
								type: "POST",
								context: this,
								success: function handleSuccess() {
									pointer.loadData();
								},
								error: function handleError() {
									MessageBox.error("Die Verbindung ist fehlgeschlagen.");								
								}
							});
						}
					}
				});
			},

			onSave: function() {
				var id = new Array(7);
				id[0] = "Vorname-" + this.getView().getId() + "--StudienTab-";
				id[1] = "Nachname-" + this.getView().getId() + "--StudienTab-";
				id[2] = "Titel-" + this.getView().getId() + "--StudienTab-";
				id[3] = "Jahr-" + this.getView().getId() + "--StudienTab-";
				id[4] = "Medium-" + this.getView().getId() + "--StudienTab-";
				id[5] = "Abstract-" + this.getView().getId() + "--StudienTab-";
				id[6] = "Verweis-" + this.getView().getId() + "--StudienTab-";
				var studienListe = new Array();
				var i = 0;
				while(this.getView().byId(id[0]+i) !== undefined) {
					studienListe[i] = new Array(id.length);
					for(var j = 0; j < studienListe[i].length; j++) {
						studienListe[i][j] = this.getView().byId(id[j]+i).getValue();
					}
					i++;
				}
				
				var validMedium = true;
				var validAbstract = true;
				var validVerweis = true;
				id = this.getView().getId() + "--StudienTab-";
				for(i = 0; i < studienListe.length; i++) {
					id = id.substring(0, 23) + i;
					if(studienListe[i][4] === "") {
						this.getView().byId("Medium-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Medium-"+id).setValueStateText("Bitte ein Medium eingeben.");
						validMedium = false;
					}
					else {
						this.getView().byId("Medium-"+id).setValueState(sap.ui.core.ValueState.None);
					}

					if(studienListe[i][5] === "") {
						this.getView().byId("Abstract-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Abstract-"+id).setValueStateText("Bitte einen Abstract eingeben.");
						validAbstract = false;
					}
					else {
						this.getView().byId("Abstract-"+id).setValueState(sap.ui.core.ValueState.None);
					}
					
					if(studienListe[i][6] === "") {
						this.getView().byId("Verweis-"+id).setValueState(sap.ui.core.ValueState.Error);
						this.getView().byId("Verweis-"+id).setValueStateText("Bitte einen Verweis zum Original eingeben.");
						validVerweis = false;
					}
					else {
						this.getView().byId("Verweis-"+id).setValueState(sap.ui.core.ValueState.None);
					}
				}

				if(validMedium && validAbstract && validVerweis) {
					$.ajax({
						url: "php/studienpflege/updateStudien.php",
						data: {
							"studienListe": studienListe
						},
						type: "POST",
						context: this,
						success: function handleSuccess() {
							MessageBox.success("Speichern erfolgreich.");
							this.loadData();
						},
						error: function handleError() {
							MessageBox.error("Die Verbindung ist fehlgeschlagen.");												
						}
					});
				}
				else {
					MessageBox.error("Bitte überprüfen Sie Ihre Eingaben!");
				}
			},
			
			onCancel: function() {
				var pointer = this;
				MessageBox.confirm("Möchten Sie wirklich alle Änderungen verwerfen?", {										
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],										
					onClose: function(sResult) {
						if(sResult === "YES") {																				
							pointer.loadData();																				
						}
					}
				});
			},			

			onLogout: function() {		
				var pointer = this;
				MessageBox.confirm("Möchten Sie sich wirklich abmelden? Nicht gespeicherte Änderungen gehen verloren.", {
					actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO],
					onClose: function(sResult) {
						if(sResult === "YES") {
							pointer.loadData();
							pointer.getOwnerComponent().getTargets().display("login");							
						}
					}
				});
			}
		});
	});