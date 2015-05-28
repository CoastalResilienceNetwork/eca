
// Plugins should load their own versions of any libraries used even if those libraries are also used 
// by the GeositeFramework, in case a future framework version uses a different library version. 

require({
    // Specify library locations.
    // The calls to location.pathname.replace() below prepend the app's root path to the specified library location. 
    // Otherwise, since Dojo is loaded from a CDN, it will prepend the CDN server path and fail, as described in
    // https://dojotoolkit.org/documentation/tutorials/1.7/cdn
    packages: [
        {
            name: "d3",
            location: "//d3js.org",
            main: "d3.v3.min"
        },
        {
            name: "underscore",
            location: "//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.4",
            main: "underscore-min"
        }
    ]
});

define([
		"dojo/_base/declare",
		"framework/PluginBase",
		"dojo/parser",
		"dijit/registry",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/_base/lang",
		"dojo/_base/array",
		"dojo/query",
		 "d3",
		"use!underscore",
		"./app",
		"dojo/text!plugins/eca/eca_data.json",
		"dojo/text!plugins/eca/eca_interface.json",
		"dojo/text!./templates.html"
       ],
       function (declare, PluginBase, parser, registry, domClass, domStyle, lang, array, query, d3, _, eca, appData, ecaConfig, templates) {
           return declare(PluginBase, {
               toolbarName: "Economics of Climate Adaptation",
               toolbarType: "sidebar",
               resizable: false,
               showServiceLayersInLegend: true,
               allowIdentifyWhenActive: true,
               infoGraphic: "",
               pluginDirectory: "plugins/eca",
               width: 425,
               height: 600,
			   _state: {},
               
               activate: function () {
					//process this._state if a populated object from setState exists
					if (!_.isEmpty(this._state)) {
						console.log(this._state);
						 for (var button in this._state.controls.buttons) {
							 for (property in this._state.controls.buttons[button]) {
								this.ecaTool[button].set(property, this._state.controls.buttons[button][property]);
							 }
						 }
						 
						 for (var slider in this._state.controls.sliders) {
							 for (property in this._state.controls.sliders[slider]) {
								this.ecaTool[slider].set(property, this._state.controls.sliders[slider][property]);
							 }
						 }
						 
						 for (var check in this._state.controls.radiocheck) {
							 for (property in this._state.controls.radiocheck[check]) {
								 registry.byId(check).set(property, this._state.controls.radiocheck[check][property]);
							 }
						 }
						 var tab = registry.byId(this._state.tab);
						 this.ecaTool.tc.selectChild(tab);
						
						this._state = {};
					}
					
					this.ecaTool.showTool();
               },
               
               deactivate: function () {
                   this.ecaTool.hideTool();
               },
               
               hibernate: function () {
				   this.ecaTool.closeTool();
				   this.ecaTool.resetInterface();			   
               },
               
               initialize: function (frameworkParameters) {
				   declare.safeMixin(this, frameworkParameters); 
                      var djConfig = {
                        parseOnLoad: true
                   };
                   domClass.add(this.container, "claro");
					this.ecaTool = new eca(this, appData, ecaConfig, templates);
					this.ecaTool.initialize(this.ecaTool);
               },
                   
               getState: function () {
                   var state = new Object();
				   state.tab = this.ecaTool.tc.selectedChildWidget.id;
				   
				   state.controls = {};
				   state.controls.buttons = {};
				   state.controls.sliders = {};
				   state.controls.radiocheck = {};
				   
                   state.controls.buttons.comboButtonExposureType = { 
						"label": this.ecaTool.comboButtonExposureType.get("label"),
						"value": this.ecaTool.comboButtonExposureType.get("value")
				   }
				   state.controls.buttons.comboButtonElevation = { 
						"label": this.ecaTool.comboButtonElevation.get("label"),
						"value": this.ecaTool.comboButtonElevation.get("value")
				   }
				   state.controls.buttons.comboButtonGeography = { 
						"label": this.ecaTool.comboButtonGeography.get("label"),
						"value": this.ecaTool.comboButtonGeography.get("value")
				   }
				   state.controls.buttons.comboButtonType = { 
						"label": this.ecaTool.comboButtonType.get("label")
				   }
				   state.controls.buttons.comboButtonEconomy = { 
						"label": this.ecaTool.comboButtonEconomy.get("label")
				   }
				   state.controls.buttons.comboButtonDefense = { 
						"label": this.ecaTool.comboButtonDefense.get("label")
				   }
				   state.controls.buttons.comboButtonTypeMeasures = { 
						"label": this.ecaTool.comboButtonTypeMeasures.get("label")
				   }
				   state.controls.buttons.comboButtonEconomyMeasures = { 
						"label": this.ecaTool.comboButtonEconomyMeasures.get("label")
				   }
				   state.controls.buttons.comboButtonDefenseMeasures = { 
						"label": this.ecaTool.comboButtonDefenseMeasures.get("label")
				   }
				   
				   state.controls.sliders.climateYearSliderDamages = { 
						"value": this.ecaTool.climateYearSliderDamages.get("value")
				   }
				   state.controls.sliders.returnPeriodSlider = { 
						"value": this.ecaTool.returnPeriodSlider.get("value")
				   }
				   state.controls.sliders.climateYearSliderMeasures = { 
						"value": this.ecaTool.climateYearSliderMeasures.get("value")
				   }
				   
				   state.controls.radiocheck["exposureTotalRb-" + this.map.id] = {
					   "checked": this.ecaTool.exposureTotalRb.get("checked")
				   }
				   state.controls.radiocheck["exposurePercentRb-" + this.map.id] = {
					   "checked": this.ecaTool.exposurePercentRb.get("checked")
				   }
				   state.controls.radiocheck["damagesTotalRb-" + this.map.id] = {
					   "checked": this.ecaTool.damagesTotalRb.get("checked")
				   }
				   state.controls.radiocheck["damagesPercentRb-" + this.map.id] = {
					   "checked": this.ecaTool.damagesPercentRb.get("checked")
				   }
				   var checkboxes = query("[name=measuresCheckbox-" + this.map.id + "]");
				   array.forEach(checkboxes, function(checkbox) {
					   state.controls.radiocheck[checkbox.id] = {
							"checked": registry.byId(checkbox.id).get("checked")
					   }
				   });
                   return state;
                   
                },
                
               setState: function (state) { 
				   this._state = state; 
               },
               
               identify: function(){
               
               }
           });
       });
