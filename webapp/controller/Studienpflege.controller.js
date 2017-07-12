sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
	],

	function(Controller, MessageBox, JSONModel) {
		"use strict";

		return Controller.extend("DigiTumo.controller.Studienpflege", {

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
			
			onInit: function() {
				this.loadData();
			},

			onAddStudie: function() {
				var oDialog = this.getView().byId("studiendialog");
				if (!oDialog) {
					this.oDialog = sap.ui.xmlfragment(this.getView().getId(), "DigiTumo.fragment.addStudie", this);
					this.getView().addDependent(oDialog);
				}
				this.oDialog.open();
			},
			
			onSaveNeueStudie: function() {
				var vorname = this.getView().byId("vorname").getValue();
				var validVorname = true;																					
				if(vorname === "") {																					
					this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.Error);								
					this.getView().byId("vorname").setValueStateText("Bitte einen Vornamen eingeben.");														
					validVorname = false;
				}
				else {
					if(vorname.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) {																
						this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.Error);					
						this.getView().byId("vorname").setValueStateText("Der Vorname darf nur Buchstaben enthalten.");		
						this.getView().byId("Vorname").setValue("");													
						validVorname = false;
					}
					else {
						this.getView().byId("vorname").setValueState(sap.ui.core.ValueState.None);							
						vorname = vorname.trim();
						vorname = vorname[0].toUpperCase() + vorname.substring(1, vorname.length);
					}
				}

				var nachname = this.getView().byId("nachname").getValue();												
				var validNachname = true;																				
				if(nachname === "") {																					
					this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.Error);						
					this.getView().byId("nachname").setValueStateText("Bitte einen Nachnamen eingeben.");												
					validNachname = false;
				}
				else {
					if(nachname.search(/^[a-zA-ZäÄöÖüÜ\- ]+$/) === -1) {														
						this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.Error);					
						this.getView().byId("nachname").setValueStateText("Der Nachname darf nur Buchstaben enthalten.");					
						validNachname = false;
					}
					else {
						this.getView().byId("nachname").setValueState(sap.ui.core.ValueState.None);						
						nachname = nachname.trim();
						nachname = nachname[0].toUpperCase() + nachname.substring(1, nachname.length);
					}
				}
				
				var titel = this.getView().byId("titel").getValue();
				var validTitel = true;
				if(titel === "") {
					this.getView().byId("titel").setValueState(sap.ui.core.ValueState.Error);					
					this.getView().byId("titel").setValueStateText("Bitte einen Titel eingeben.");
					validTitel = false;
				}
				else {
					this.getView().byId("titel").setValueState(sap.ui.core.ValueState.None);
				}

				var validJahr = true;
				var jahr = this.getView().byId("jahr").getValue();		
				if(jahr === "") {
					this.getView().byId("jahr").setValueState(sap.ui.core.ValueState.Error);					
					this.getView().byId("jahr").setValueStateText("Bitte ein Jahr eingeben.");
					validJahr = false;
				}
				else if(jahr.search(/^[0-9]+$/) === -1) {
					this.getView().byId("jahr").setValueState(sap.ui.core.ValueState.Error);					
					this.getView().byId("jahr").setValueStateText("Bitte ein gültiges Jahr eingeben.");
					validJahr = false;
				}
				else if(parseInt(jahr) > new Date().getFullYear() || parseInt(jahr) < (parseInt(new Date().getFullYear())-10)){
					this.getView().byId("jahr").setValueState(sap.ui.core.ValueState.Error);					
					this.getView().byId("jahr").setValueStateText("Bitte ein gültiges Jahr eingeben.");
					validJahr = false;
				}
				else {
					this.getView().byId("jahr").setValueState(sap.ui.core.ValueState.None);
				}
								
				var medium = this.getView().byId("medium").getValue();
				var validMedium = true;
				if(medium === "") {
					this.getView().byId("medium").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("medium").setValueStateText("Bitte ein Medium eingeben.");
					validMedium = false;
				}
				else {
					this.getView().byId("medium").setValueState(sap.ui.core.ValueState.None);
				}
				
				var abstract = this.getView().byId("abstract").getValue();
				var validAbstract = true;
				if(abstract === "") {
					this.getView().byId("abstract").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("abstract").setValueStateText("Bitte einen Abstract eingeben.");
					validAbstract = false;
				}
				else {
					this.getView().byId("abstract").setValueState(sap.ui.core.ValueState.None);
				}
				
				var verweis = this.getView().byId("verweis").getValue();
				var validVerweis = true;
				if(verweis === "") {
					this.getView().byId("verweis").setValueState(sap.ui.core.ValueState.Error);
					this.getView().byId("verweis").setValueStateText("Bitte einen Verweis zum Original eingeben.");
					validVerweis = false;
				}
				else {
					this.getView().byId("verweis").setValueState(sap.ui.core.ValueState.None);
				}
				
				if(validVorname && validNachname && validTitel && validMedium && validAbstract && validVerweis) {
					$.ajax({
						url: "php/studien/setNeueStudie.php",
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
					MessageBox.error("Bitte die Eingaben überprüfen!");		
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
					MessageBox.error("Bitte die Eingaben überprüfen!");
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