sap.ui.define(['sap/ui/core/UIComponent'],
	function(UIComponent) {
		"use strict";

		return UIComponent.extend("DigiTumo.Component", {

			metadata: {
				config: {
					sample: {
						stretch: true,
						files: [
							"Login.view.xml",
							"Login.controller.js"
						]
					}
				},
				init: function (){
					UIComponent.prototype.init.apply(this, arguments);
				}
			}
		});

	});