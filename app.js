
define([
	    "dojo/_base/declare",
		"d3",
		"use!underscore",		
	    "dojo/json", 
		"dojo/store/Memory",
		"dojo/store/Observable",
		"dijit/form/ComboBox", 
		"dijit/form/Button",
		"dijit/form/DropDownButton",
		"dijit/form/ComboButton", 
		"dijit/DropDownMenu", 
		"dijit/MenuItem",
		"dijit/Menu",
		"dijit/layout/ContentPane",
		"dijit/layout/TabContainer",
		"dijit/Tooltip",
		"dijit/TooltipDialog",
		"dijit/Dialog",
		"dijit/popup",
		"dojo/on",
		"dojo/_base/array",
		"dojo/query",
		"dojo/_base/lang",
		"dojo/dom",
		"dojo/dom-class",
		"dojo/dom-style",
		"dojo/dom-attr",
		"dojo/_base/window",
		"dojo/dom-construct",
		"dojo/dom-geometry",
		"dojo/_base/fx",
		"dijit/form/RadioButton",
		"dojo/parser",
		"dijit/form/NumberTextBox",
		"dijit/form/NumberSpinner",
		"dijit/registry",
		"dijit/layout/BorderContainer",
		"dijit/layout/AccordionContainer",
		"dojox/layout/TableContainer",
		"dijit/TitlePane",
		"dijit/form/CheckBox",
		"dijit/form/HorizontalSlider",
		"dijit/form/HorizontalRuleLabels",
		"dojox/form/RangeSlider",
	   	"dojox/charting/Chart",
		"dojox/charting/axis2d/Default",
		"dojox/charting/plot2d/Lines",
		"dojox/charting/plot2d/Columns",
		"dojox/charting/plot2d/StackedLines",
		"dojox/charting/plot2d/StackedAreas",
		"dojox/charting/plot2d/Areas",
		"dojox/charting/widget/Legend",
	    "dojox/charting/themes/Claro",
		"dojox/charting/StoreSeries",
		"dojox/charting/plot2d/Grid",
		"dojo/fx/easing",
		"dojo/number",
		"dijit/ProgressBar",
		"dojox/gfx",
		"esri/request",
		"esri/layers/FeatureLayer",
		"esri/layers/ArcGISDynamicMapServiceLayer",
		"esri/geometry/Extent",
		"dojo/NodeList-traverse"
		], 


	function (declare,
			d3,
			_, 
			JSON,
			Memory, 
			Observable,
			ComboBox, 
			Button,
			DropDownButton,
			ComboButton,
			DropDownMenu, 
			MenuItem,
			Menu,
			ContentPane,
			TabContainer,
			Tooltip,
			TooltipDialog,
			Dialog,
			popup,
			on,
			array,
			query,
			lang,
			dom,
			domClass,
			domStyle,
			domAttr,
			win,
			domConstruct,
			domGeom,
			fx,
			RadioButton,
			parser,
			NumberTextBox,
			NumberSpinner,
			registry,
			BorderContainer,
			AccordionContainer,
			TableContainer,
			TitlePane,
			CheckBox,
			HorizontalSlider,
			HorizontalRuleLabels,
			RangeSlider,
			Chart,
			Default,
			Lines,
			Columns,
			StackedLines,
			StackedAreas,
			Areas,
			Legend,
			theme,
			StoreSeries,
			Grid,
			easing,
			number,
			ProgressBar,
			gfx,
			ESRIRequest,
			FeatureLayer,
			DynamicMapServiceLayer,
			Extent
		  ) 
		
		{

		var ecaTool = function(plugin, appData, ecaConfig, templates){
			this._map = plugin.map;
			this._app = plugin.app;
			this._container = plugin.container;
			this._$templates = $('<div>').append($($.trim(templates)))
			
			var self = this;
			this.parameters = {};
			this.pluginDirectory = plugin.pluginDirectory;
			this.utilities = {};
			
			this.initialize = function(){
				this._data = JSON.parse(appData);
				this._interface = JSON.parse(ecaConfig);
				this.parameters.layersLoaded = false;
				this.loadInterface(this);
			}
			
			this.showIntro = function(){
				var self = this;	
			}; //end showIntro

			this.showTool = function(){
				if (this._map.getLayer("ecaMapLayer") == undefined) {
					this.initializeMap();
				} else {
					this.mapLayer.show();
				}
			} //end this.showTool

			this.hideTool = function(){
				if (this.mapLayer && this.mapLayer.loaded) { 
					//this.mapLayer.hide();
				}
			} //end this.hideTool
			
			this.closeTool = function(){
				if (this.mapLayer && this.mapLayer.loaded) { 
					this._map.removeLayer(this.mapLayer);
				}
			} //end this.hideTool
			
			this.resetInterface = function(){
				if (this.mapLayer && this.mapLayer.loaded) {
					this.comboButtonExposureType.set("label", _.first(this._interface.exposure.controls.type.percent).name);
					this.comboButtonExposureType.set("value", _.first(this._interface.exposure.controls.type.percent).value);
					this.comboButtonElevation.set("label", _.first(this._interface.exposure.controls.elevation).name);
					this.comboButtonElevation.set("value", _.first(this._interface.exposure.controls.elevation).value);
					this.comboButtonGeography.set("label", _.first(this._interface.exposure.controls.geography).name);
					this.comboButtonGeography.set("value", _.first(this._interface.exposure.controls.geography).value);
					this.comboButtonType.set("label", _.first(this._interface.damages.controls.type).name);
					this.comboButtonEconomy.set("label", _.first(this._interface.damages.controls.growth).name);
					this.comboButtonDefense.set("label", _.first(this._interface.damages.controls.defense).name);
					this.comboButtonDefense.set("value", _.first(this._interface.damages.controls.defense).value);
					this.comboButtonGeographyDamages.set("label", _.first(this._interface.damages.controls.geography).name);
					this.comboButtonGeographyDamages.set("value", _.first(this._interface.damages.controls.geography).value);
					this.comboButtonTypeMeasures.set("label", _.first(this._interface.measures.controls.type).name);
					this.comboButtonTypeMeasures.set("value", _.first(this._interface.measures.controls.type).value);
					this.comboButtonEconomyMeasures.get("label", _.first(this._interface.measures.controls.growth).name);
					this.comboButtonDefenseMeasures.set("label", _.first(this._interface.measures.controls.defense).name);
					this.comboButtonDefenseMeasures.set("value", _.first(this._interface.measures.controls.defense).value);
					this.climateYearSliderDamages.set("value", 2030);
					this.returnPeriodSlider.set("value", 1);
					this.climateYearSliderMeasures.set("value", 2030);
					this.exposureTotalRb.set("checked", false);
					this.exposurePercentRb.set("disabled", false);
					this.exposurePercentRb.set("checked", true);
					this.damagesTotalRb.set("checked", false);
					this.damagesPercentRb.set("checked", true);
					this.measuresTotalRb.set("checked", false);
					this.measuresPercentRb.set("checked", true);

					var checkboxes = query("[name=measuresCheckbox-" + this._map.id + "]");
					array.forEach(checkboxes, function(checkbox) {
							registry.byId(checkbox.id).set("checked", false);
					});
					this.tc.selectChild(this.tabOverview);
				}
			} //end this.resetInterface

			this.initializeMap = function(){
				//initialize an empty dynamic map service layer
			    var mapUrl = this._interface.service;
	          	this.mapLayer = new DynamicMapServiceLayer(mapUrl, { id:"ecaMapLayer" });
	          	this._map.addLayer(this.mapLayer);
				this.mapLayer.hide();
				this.mapLayer.setVisibleLayers([-1]);
				
				var extent = new Extent({
					"ymax": this._interface.extents.initial.ymax,
					"xmax": this._interface.extents.initial.xmax,
					"ymin": this._interface.extents.initial.ymin,
					"xmin": this._interface.extents.initial.xmin,
					"spatialReference": {
						"wkid": 4326
					}
				});
				this._map.setExtent(extent, false);
				this.parameters.layersLoaded = true;
			}

			this.updateLayer = function(visibleLayers){
				this.mapLayer.setVisibleLayers(visibleLayers);
	            this.mapLayer.show();
			}
						
			this.loadInterface = function() {
				var self = this;
				domStyle.set(this._container, "overflow", "hidden");				
				this.tc = new TabContainer({
						isLayoutContainer: true,
						style: "height: 100%; width: 100%; overflow: hidden;",
						resize: function(){
					},
						useMenu: false,
						useSlider: false,
				    }, "tc1-prog");
				domClass.add(this.tc.domNode, "cr-dojo-dijits");
				this.tc.startup();
				this.tc.resize();

				this.tabOverview = new ContentPane({
			         id: "tabOverview-" + this._map.id,
					 title: "Overview",
					 style: "position:relative;width:100%;height:auto;overflow:hidden;",
					 isLayoutContainer: true,
					 onShow: function() {
						 window.setTimeout(function(){ domStyle.set(self.cpOverview.domNode, {"width":"100%", "height":"auto" }) }, 5);
						 if (self.mapLayer && self.mapLayer.loaded) { self.mapLayer.setVisibleLayers([-1]); }
					 }
			    });
				this.tabOverview.startup();
			    this.tc.addChild(this.tabOverview);
				
				this.cpOverview = new ContentPane({
					style: "position:relative; width:100%; height:100%;overflow:visible;",
					content: "",
					onDownloadEnd: function(){
						var methodsButtonDiv  = domConstruct.create("div", {
							id:"methodsButtonDiv-" + self._map.id,
							style:"width:100%; text-align:right;"
						});
						this.domNode.appendChild(methodsButtonDiv);			

						var methodsButton = new Button({
							label: "Methods",
							disabled: false,
							onClick: function(){
								window.open("http://www.researchgate.net/publication/267636488_COASTAL_RISKS_NATURE-BASED_DEFENSES_AND_THE_ECONOMICS_OF_ADAPTATION_AN_APPLICATION_IN_THE_GULF_OF_MEXICO_USA","_blank");
							}
						});
						methodsButtonDiv.appendChild(methodsButton.domNode);
					}
			    });
			    this.cpOverview.startup();
			    this.tabOverview.addChild(this.cpOverview);
				this.cpOverview.set("href", self.pluginDirectory + "/overview.html");

				//THE EXPOSURE PANEL
			    this.tabExposure = new ContentPane({
			         id: "tabExposure-" + this._map.id,
					 title: "Exposure",
					 style: "position:relative;width:100%;height:auto;overflow:hidden;padding:1px 0px 0px 0px;",
			         isLayoutContainer: true,
					 onShow: function() {
						window.setTimeout(function(){ domStyle.set(self.cpExposure.domNode, {"width":"100%", "height":"auto" }) }, 5);
						if (self.mapLayer && self.mapLayer.loaded) { self.getExposureInputValues(); }
					 }
			    });
			    this.tabExposure.startup();
				//add inputs tab to main tabContainer
			    this.tc.addChild(this.tabExposure);
				
				//THE DAMAGES PANEL
			    this.tabDamages = new ContentPane({
			         id: "tabDamages-" + this._map.id,
					 title: "Risk",
					 style: "position:relative;width:100%;height:auto;overflow:hidden;padding:1px 0px 0px 0px;",
					 isLayoutContainer: true,
					 onShow: function() {
						window.setTimeout(function(){ domStyle.set(self.cpDamages.domNode, {"width":"100%", "height":"auto" }) }, 5);
						if (self.mapLayer && self.mapLayer.loaded) { self.getDamageInputValues(); }
					 }
			    });
				this.tabDamages.startup();
				//append results tab to main tabContainer
			    this.tc.addChild(this.tabDamages);

			    //THE MEASURES PANEL
			    this.tabMeasures = new ContentPane({
			         id: "tabMeasures-" + this._map.id,
					 title: "Solutions",
					 style: "position:relative;width:100%;height:auto;overflow:hidden;padding:1px 0px 0px 0px;",
					 isLayoutContainer: true,
					 onShow: function() {
						window.setTimeout(function(){ domStyle.set(self.cpMeasures.domNode, {"width":"100%", "height":"auto" }) }, 10);
						if (self.mapLayer && self.mapLayer.loaded) { self.getMeasureInputValues(); }
					 }
			    });
				this.tabMeasures.startup();
				//append results tab to main tabContainer
			    this.tc.addChild(this.tabMeasures);
				
				//empty layout containers
			    this.cpExposure = new ContentPane({
					title: 'eca-top-pane',
					style: 'overflow: visible; width:100%;padding:0px;'
			    });
			    this.cpExposure.startup();
				
			    this.tabExposure.addChild(this.cpExposure);
				
			    //empty layout containers
			    this.cpDamages = new ContentPane({
					title: 'eca-top-pane',
					style: 'overflow: visible; width:100%;padding:0px;'
			    });
			    this.cpDamages.startup();
				
			    this.tabDamages.addChild(this.cpDamages);
				
				//empty layout containers
			    this.cpMeasures = new ContentPane({
					title: 'eca-top-pane',
					style: 'overflow: visible; width:100%;padding:0px;'
			    });
			    this.cpMeasures.startup();
				
			    this.tabMeasures.addChild(this.cpMeasures);

			    //add container to DOM
			    dom.byId(this._container).appendChild(this.tc.domNode);

			    this.createDamagesInputs();
			    this.createDamagesChart();
				
				this.createExposureInputs();
				this.createExposureChart();
				
				this.createMeasuresInputs();
				this.createMeasuresChart();

				this.createMessageDialog();
				
				domStyle.set(this.tc, "width", "100%");
				this.createTooltips();
				
				array.forEach(this.tc.getChildren(), function(tab) {
					query("#" + tab.containerNode.id + " .dijitTitlePaneContentOuter").style("border", "none");
				});
				
				on(this._map, "resize", function() {
					window.setTimeout(function(){ domStyle.set(_.first(self.tc.selectedChildWidget.getChildren()).domNode, {"width":"100%", "height":"auto" }) }, 10);
				});
			}
			
			this.createExposureInputs = function(){
				this.exposureInputsPane = new ContentPane({
			    	style: 'overflow:visible; margin-bottom: 10px; width: 100%; background: #edf2f2; padding-top: 15px;'
			    });
				this.cpExposure.domNode.appendChild(this.exposureInputsPane.domNode);
				
				var exposureTypeDiv = domConstruct.create("div", {
					style: 'width: 150px; display: inline-block; margin-left:35px;text-align:center;'
				});
				this.exposureInputsPane.containerNode.appendChild(exposureTypeDiv);
				
				var exposureTypeText = domConstruct.create("div", {
					style: 'text-align:center;',
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " exposure-typeInfo'></i>&nbsp;<b>Assets:</b>"});
				exposureTypeDiv.appendChild(exposureTypeText);

				var exposureDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;"});
				_.each(this._interface.exposure.controls.type.percent, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){
							self.comboButtonExposureType.set("label", this.label);
							self.comboButtonExposureType.set("value", this.value);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							self.adjustInterfaceControls("exposure");
							self.getExposureInputValues();
						}
					});
					exposureDropdown.addChild(menuItem);
				});

				this.comboButtonExposureType = new ComboButton({
					label: _.first(this._interface.exposure.controls.type.percent).name,
					value: _.first(this._interface.exposure.controls.type.percent).value,
					name: "type",
					style: "width: 150px;",
					dropDown: exposureDropdown
				});
				on(this.comboButtonExposureType.domNode, "click", function(evt) {
					var dropDown = self.comboButtonExposureType.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonExposureType.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonExposureType.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonExposureType, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				exposureTypeDiv.appendChild(this.comboButtonExposureType.domNode);

				//set display none because elevation is currently fixed to 10M (can be shown if we want to add elevation inputs back in)
				var elevationDiv = domConstruct.create("div", {
					style: 'width: 150px; display: none; margin-left:35px; text-align:center;'
				});
				this.exposureInputsPane.containerNode.appendChild(elevationDiv);
				
				var elevationText = domConstruct.create("div", {style: 'width: 25%; display: none; margin-left:20px;', innerHTML: "<b>Elevation:</b>"});
				elevationDiv.appendChild(elevationText);
				
				var elevationDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;"});
				_.each(this._interface.exposure.controls.elevation, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){
							self.comboButtonElevation.set("label", this.label);
							self.comboButtonElevation.set("value", this.value);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							self.getExposureInputValues();
							self.updateExposureChart();
						}
					});
					elevationDropdown.addChild(menuItem);
				});

				//set display none because elevation is currently fixed to 10M (can be shown if we want to add elevation inputs back in)
				this.comboButtonElevation = new ComboButton({
					label:_.first(this._interface.exposure.controls.elevation).name,
					value: _.first(this._interface.exposure.controls.elevation).value,
					name: "elevation",
					style: "width: 40%; display: none;",
					dropDown: elevationDropdown
				});
				on(this.comboButtonElevation.domNode, "click", function(evt) {
					var dropDown = self.comboButtonElevation.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonElevation.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonElevation.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonExposureType, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				elevationDiv.appendChild(this.comboButtonElevation.domNode);

				var geographyDiv = domConstruct.create("div", {
					style: 'width: 150px; display: inline-block; margin-left:45px; text-align:center;'
				});
				this.exposureInputsPane.containerNode.appendChild(geographyDiv);
				
				var geographyText = domConstruct.create("div", {
					style: 'text-align:center;',
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " exposure-geographyInfo'></i>&nbsp;<b>Geography:</b>"
				});
				geographyDiv.appendChild(geographyText);
				
				var geographyDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;"});
				_.each(this._interface.exposure.controls.geography, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){
							self.comboButtonGeography.set("label", this.label);
							self.comboButtonGeography.set("value", this.value);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							self.adjustInterfaceControls("exposure");
							if(this.value == "county"){
								self.exposurePercentRb.set("disabled", false);
							} else {
								self.exposurePercentRb.set("disabled", true);
								self.exposureTotalRb.set("checked", true);
							}
							self.getExposureInputValues();
							self.updateExposureChart();
							
						}
					});
					geographyDropdown.addChild(menuItem);
				});

				this.comboButtonGeography = new ComboButton({
					label: _.first(this._interface.exposure.controls.geography).name,
					value: _.first(this._interface.exposure.controls.geography).value,
					name: "geography",
					style: "width: 125px;",
					disabled: false,
					onMouseDown: function(evt) {
						var dropDown = this.dropDown.domNode.parentNode;
						window.setTimeout(function() {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}, 100);
					},
					dropDown: geographyDropdown
				});
				on(this.comboButtonGeography.domNode, "click", function(evt) {
					var dropDown = self.comboButtonGeography.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonGeography.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonGeography.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonGeography, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				geographyDiv.appendChild(this.comboButtonGeography.domNode);
				
				
				var dataTypeDiv = domConstruct.create("div", {
					style: 'width: 400px; display: inline-block; margin-left:15px; margin-top:25px;margin-bottom:15px;'
				});
				this.exposureInputsPane.containerNode.appendChild(dataTypeDiv);
				
				var dataTypeText = domConstruct.create("div", {
					style: 'width: 165px; display: inline-block;',
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " exposure-valuesInfo'></i>&nbsp;<b>Display map values by:</b>"
				});
				dataTypeDiv.appendChild(dataTypeText);

			    var radioButtonContainerPercent = domConstruct.create("div", {style: 'width: 125px; display: inline-block; position: relative; margin-left: 5px;'});
				dataTypeDiv.appendChild(radioButtonContainerPercent);

				var radioButtonContainerTotal = domConstruct.create("div", {style: 'width: 100px; display: inline-block; position: relative; margin-left: 5px;'});
				dataTypeDiv.appendChild(radioButtonContainerTotal);

			    var exposurePercentInput = domConstruct.create("input", { id:"exposurePercentRb-" + this._map.id, "type": "radio", "name": "exposureRb",  "value": "percent", "checked": true});
			    var exposurePercentLabel = domConstruct.create("label", {"for": "exposurePercentRb-" + this._map.id, innerHTML: "Percent Total", "class": "eca-labels", "style" : "display: inline-block; margin-right: 5px;"});
			    radioButtonContainerPercent.appendChild(exposurePercentLabel);
				radioButtonContainerPercent.appendChild(exposurePercentInput);

			    this.exposurePercentRb = new RadioButton({
			    	"name": "exposureRb",
			    	"value": "percent",
			    	"checked": true,
			    	onChange: function() {
			    		if (this.get('checked')){
							
							var currentTypeLabel = self.comboButtonExposureType.get("label");
							var currentTypeValue = self.comboButtonExposureType.get("value");
							
							_.each(self.comboButtonExposureType.dropDown.getChildren(), function(menuItem) {
								menuItem.destroyRecursive();
							})
							
							_.each(self._interface.exposure.controls.type.percent, function(value, key){
								var menuItem = new MenuItem({
									label: value.name,
									value: value.value,
									onClick: function(){
										self.comboButtonExposureType.set("label", this.label);
										self.comboButtonExposureType.set("value", this.value);
										domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
										
										self.adjustInterfaceControls("exposure");
										self.getExposureInputValues();
									}
								});
								self.comboButtonExposureType.dropDown.addChild(menuItem);
							})
							
							var newTypeLabel = ( currentTypeValue != "total" ) ? currentTypeLabel : _.first(self._interface.exposure.controls.type.percent).name;
							var newTypeValue = ( currentTypeValue != "total" ) ? currentTypeValue : _.first(self._interface.exposure.controls.type.percent).value;
							self.comboButtonExposureType.set("label", newTypeLabel);
							self.comboButtonExposureType.set("value", newTypeValue);
							self.adjustInterfaceControls("exposure");
							self.getExposureInputValues();
						};
			    	}
			    }, "exposurePercentRb-" + this._map.id);
			    this.exposurePercentRb.startup();

			    var exposureTotalInput = domConstruct.create("input", { id:"exposureTotalRb-" + this._map.id, "type": "radio", "name": "exposureRb",  "value": "total"});
			    var exposureTotalLabel = domConstruct.create("label", {"for": "exposureTotalRb-" + this._map.id, innerHTML: "Total Value", "class": "eca-labels", "style" : "display: inline-block; margin-right: 5px;"});
			    radioButtonContainerTotal.appendChild(exposureTotalLabel);
				radioButtonContainerTotal.appendChild(exposureTotalInput);

			    this.exposureTotalRb = new RadioButton({
			    	"name": "exposureRb",
			    	"value": "total",
			    	"checked": false,
			    	onChange: function() {
			    		if (this.get('checked')){
							var currentTypeLabel = self.comboButtonExposureType.get("label");
							var currentTypeValue = self.comboButtonExposureType.get("value");
							
							_.each(self.comboButtonExposureType.dropDown.getChildren(), function(menuItem) {
								menuItem.destroyRecursive();
							})
							
							_.each(self._interface.exposure.controls.type.total, function(value, key){
								var menuItem = new MenuItem({
									label: value.name,
									value: value.value,
									onClick: function(){
										self.comboButtonExposureType.set("label", this.label);
										self.comboButtonExposureType.set("value", this.value);
										domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
										
										self.adjustInterfaceControls("exposure");
										self.getExposureInputValues();
									}
								});
								self.comboButtonExposureType.dropDown.addChild(menuItem);
							})
							
							var newTypeLabel = ( currentTypeValue != "total" ) ? currentTypeLabel : _.first(self._interface.exposure.controls.type.total).name;
							var newTypeValue = ( currentTypeValue != "total" ) ? currentTypeValue : _.first(self._interface.exposure.controls.type.total).value;
							self.comboButtonExposureType.set("label", newTypeLabel);
							self.comboButtonExposureType.set("value", newTypeValue);
							self.adjustInterfaceControls("exposure");
							self.getExposureInputValues()
						};
			    	}
			    }, "exposureTotalRb-" + this._map.id);
			    this.exposureTotalRb.startup();
				
			}

			this.createDamagesInputs = function(){
				this.damageInputsPane = new ContentPane({
			    	style: 'overflow:visible; margin-bottom: 0px; width: 100%; background: #edf2f2; padding-top: 15px;'
			    });
			    this.cpDamages.domNode.appendChild(this.damageInputsPane.domNode);
				
				var damageTypeDiv = domConstruct.create("div", {
					style: 'width: 100px; display: inline-block; margin-left:20px; text-align:center;'
				});
				this.damageInputsPane.containerNode.appendChild(damageTypeDiv);
				
				var damageTypeContainer = domConstruct.create("div", {
					style: 'text-align:center;',
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " damages-typeInfo'></i>&nbsp;<b>Hazard:</b>"
				});
				damageTypeDiv.appendChild(damageTypeContainer);

				//damage type dropdown
				var typeDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;"});
				_.each(this._interface.damages.controls.type, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						onClick: function(){
							self.comboButtonType.set("label", this.label);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							self.getDamageInputValues();
						}
					});
					typeDropdown.addChild(menuItem);
				});

				this.comboButtonType = new ComboButton({
					label: _.first(this._interface.damages.controls.type).name,
					name: "type",
					style: "width: 75px;",
					dropDown: typeDropdown
				});
				on(this.comboButtonType.domNode, "click", function(evt) {
					var dropDown = self.comboButtonType.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonType.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonType.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonType, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				damageTypeDiv.appendChild(this.comboButtonType.domNode);				

				var growthDiv = domConstruct.create("div", {
					style: 'width: 100px; display: inline-block; margin-left:25px; text-align:center;'
				});
				this.damageInputsPane.containerNode.appendChild(growthDiv);
				
				var growthContainer = domConstruct.create("div", {
					style: 'text-align:center;',
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " damages-growthInfo'></i>&nbsp;<b>Economy:</b>"
				});
				growthDiv.appendChild(growthContainer);
				
				//growth scenario dropdown
				var growthDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;"});
				_.each(this._interface.damages.controls.growth, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						onClick: function(){
							self.comboButtonEconomy.set("label", this.label);
							self.comboButtonEconomyMeasures.set("label", this.label);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							self.getDamageInputValues();
						}
					});
					growthDropdown.addChild(menuItem);
				});

				this.comboButtonEconomy = new ComboButton({
					label: _.first(this._interface.damages.controls.growth).name,
					name: "growth",
					style: "width: 75px;",
					dropDown: growthDropdown
				});
				on(this.comboButtonEconomy.domNode, "click", function(evt) {
					var dropDown = self.comboButtonEconomy.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonEconomy.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonEconomy.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonEconomy, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				growthDiv.appendChild(this.comboButtonEconomy.domNode);

				//defense scenario dropdown
				var defenseDiv = domConstruct.create("div", {
					style: 'width: 100px; display: none; margin-left:25px; text-align:center;'
				});
				this.damageInputsPane.containerNode.appendChild(defenseDiv);
				
				var defenseContainer = domConstruct.create("div", {
					style: 'text-align:center;', 
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " damages-defenseInfo'></i>&nbsp;<b>Defense:</b>"
				});
				defenseDiv.appendChild(defenseContainer);
				
				var defenseDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;"});
				_.each(this._interface.damages.controls.defense, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){
							self.comboButtonDefense.set("label", this.label);
							self.comboButtonDefense.set("value", this.value);
							//self.comboButtonDefenseMeasures.set("label", this.label);
							//self.comboButtonDefenseMeasures.set("value", this.label);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							self.getDamageInputValues();
						}
					});
					defenseDropdown.addChild(menuItem);
				});
				
				//set display none because defense is currently fixed to low (can be shown if we want to add inputs back in)
				this.comboButtonDefense = new ComboButton({
					//label: _.first(this._interface.damages.controls.defense).name,
					//value: _.first(this._interface.damages.controls.defense).value,
					label: "Low",
					value: "low",
					name: "defense",
					style: "width: 65px;",
					dropDown: defenseDropdown
				});
				on(this.comboButtonDefense.domNode, "click", function(evt) {
					var dropDown = self.comboButtonDefense.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonDefense.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonDefense.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonDefense, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				defenseDiv.appendChild(this.comboButtonDefense.domNode);

				var geographyDiv = domConstruct.create("div", {
					style: 'width: 125px; display: inline-block; margin-left:25px; text-align:center;'
				});
				this.damageInputsPane.containerNode.appendChild(geographyDiv);
				
				var geographyContainer = domConstruct.create("div", {
					style: 'text-align:center;', 
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " damages-geographyInfo'></i>&nbsp;<b>Geography:</b>"
				});
				geographyDiv.appendChild(geographyContainer);

				var geographyDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;"});
				_.each(this._interface.damages.controls.geography, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){						
							self.comboButtonGeographyDamages.set("label", this.label);
							self.comboButtonGeographyDamages.set("value", this.value);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							self.adjustInterfaceControls("damages");
							self.getDamageInputValues();
						}
					});
					geographyDropdown.addChild(menuItem);
				});

				this.comboButtonGeographyDamages = new ComboButton({
					label: _.first(this._interface.damages.controls.geography).name,
					value: _.first(this._interface.damages.controls.geography).value,
					name: "geography",
					style: "width: 125px;",
					disabled: false,
					dropDown: geographyDropdown
				});
				on(this.comboButtonGeographyDamages.domNode, "click", function(evt) {
					var dropDown = self.comboButtonGeographyDamages.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonGeographyDamages.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonGeographyDamages.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonGeographyDamages, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				geographyDiv.appendChild(this.comboButtonGeographyDamages.domNode);

				//climate year slider
				var climateSliderDiv = domConstruct.create("div", {
					style: 'width: 400px; display: inline-block; margin-left:15px; margin-top:30px;'
				});
				this.damageInputsPane.containerNode.appendChild(climateSliderDiv);
				
			    var climateYearSliderLabel = domConstruct.create("div", {
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " damages-climateInfo'></i>&nbsp;<b>Reference Year: </b>",
					style:"position:relative; width: 120px; top:-7px; display: inline-block;"
				});
				climateSliderDiv.appendChild(climateYearSliderLabel);
				this.climateYearSliderDamages = new HorizontalSlider({
			        name: "climateYearSlider",
			        value: 2030,
			        minimum: 2030,
			        maximum: 2050,
			        discreteValues: 2,
			        showButtons: false,
			        style: "width: 275px; display: inline-block",
			        onChange: function(value){
			           self.climateYearSliderMeasures.set("value", value);
			           if(self.tc.selectedChildWidget.id == ("tabDamages-" + self._map.id)) {
			           		self.getDamageInputValues();
			           }
			        }
			    });
			    climateSliderDiv.appendChild(this.climateYearSliderDamages.domNode);

			    var climateYearSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 3,
			    	labels: ['2030', '2050'],
			    	style: "margin-top: 5px;"
			    });
			    this.climateYearSliderDamages.addChild(climateYearSliderLabels);
				
				var dataTypeDiv = domConstruct.create("div", {
					style: 'width: 400px; display: inline-block; margin-left:15px; margin-top:30px;margin-bottom:15px;'
				});
				this.damageInputsPane.containerNode.appendChild(dataTypeDiv);
				
				var dataTypeText = domConstruct.create("div", {
					style: 'width: 165px; display:inline-block;',
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " damages-valuesInfo'></i>&nbsp;<b>Display map values by:</b>"
				});
				dataTypeDiv.appendChild(dataTypeText);

			    var radioButtonContainerPercent = domConstruct.create("div", {
					style: 'width: 125px; display: inline-block; position: relative; margin-left: 5px;'
				});
				dataTypeDiv.appendChild(radioButtonContainerPercent);

				var radioButtonContainerTotal = domConstruct.create("div", {
					style: 'width: 100px; display: inline-block; position: relative; margin-left: 5px;'
				});
				dataTypeDiv.appendChild(radioButtonContainerTotal);

			    var damagesPercentLabel = domConstruct.create("label", {
					for: "damagesPercentRb-" + this._map.id, 
					innerHTML: "Percent Change", "class": "eca-labels", 
					style: "display:inline-block; margin-right: 5px;"
				});
				var damagesPercentInput = domConstruct.create("input", {
					id:"damagesPercentRb-" + this._map.id,
					"type": "radio",
					"name": "damagesRb", 
					"value": "percent",
					"checked": true
				});
			    radioButtonContainerPercent.appendChild(damagesPercentLabel);
				radioButtonContainerPercent.appendChild(damagesPercentInput);

			    this.damagesPercentRb = new RadioButton({
			    	"name": "damagesRb",
			    	"value": "percent",
			    	"checked": true,
			    	onChange: function() {
			    		if(this.get('checked')){self.getDamageInputValues()};
			    	}
			    }, "damagesPercentRb-" + this._map.id);
			    this.damagesPercentRb.startup();

			    var damagesTotalLabel = domConstruct.create("label", {"for": "damagesTotalRb-" + this._map.id, innerHTML: "Total Value", "class": "eca-labels", "style" : "display:inline-block; margin-right: 5px;"});
				var damagesTotalInput = domConstruct.create("input", { id:"damagesTotalRb-" + this._map.id, "type": "radio", "name": "damagesRb",  "value": "total"});
			    radioButtonContainerTotal.appendChild(damagesTotalLabel);
				radioButtonContainerTotal.appendChild(damagesTotalInput);

			    this.damagesTotalRb = new RadioButton({
			    	"name": "damagesRb",
			    	"value": "total",
			    	"checked": false,
			    	onChange: function() {
			    		if(this.get('checked')){self.getDamageInputValues()};
			    	}
			    }, "damagesTotalRb-" + this._map.id);
			    this.damagesTotalRb.startup();

				//chart data toggle

			}
			
			this.createMeasuresInputs = function(){
				this.measureInputsPane = new ContentPane({
			    	style: 'overflow:visible; margin-bottom: 10px; width: 100%; background: #edf2f2; padding-top: 15px;'
			    });
				this.cpMeasures.domNode.appendChild(this.measureInputsPane.domNode);

				//measure type dropdown
				var typeMeasuresDiv = domConstruct.create("div", {
					style: 'width: 170px; display: inline-block; margin-left:40px; text-align:center;'
				});
				this.measureInputsPane.containerNode.appendChild(typeMeasuresDiv);
				
				var measureTypeContainer = domConstruct.create("div", {
					id: "measureTypeContainer-" + this._map.id, 
					style: 'text-align:center;', 
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " measures-typeInfo'></i>&nbsp;<b>Restoration Success:</b>"
				});
				typeMeasuresDiv.appendChild(measureTypeContainer);
				
				var typeMeasuresDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;" });
				_.each(this._interface.measures.controls.type, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){
							self.comboButtonTypeMeasures.set("label", this.label);
							self.comboButtonTypeMeasures.set("value", this.value);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							self.adjustInterfaceControls("measures");
							self.getMeasureInputValues();
						}
					});
					typeMeasuresDropdown.addChild(menuItem);
				});

				this.comboButtonTypeMeasures = new ComboButton({
					label: _.first(this._interface.measures.controls.type).name,
					value: _.first(this._interface.measures.controls.type).value,
					name: "type",
					style: "width: 165px;",
					dropDown: typeMeasuresDropdown
				});
				on(this.comboButtonTypeMeasures.domNode, "click", function(evt) {
					var dropDown = self.comboButtonTypeMeasures.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonTypeMeasures.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonTypeMeasures.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonTypeMeasures, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				typeMeasuresDiv.appendChild(this.comboButtonTypeMeasures.domNode);
				
				//growth scenario dropdown
				var growthDiv = domConstruct.create("div", {
					style: 'width: 100px; display: inline-block; margin-left:60px; text-align:center;'
				});
				this.measureInputsPane.containerNode.appendChild(growthDiv);
				
				var growthContainer = domConstruct.create("div", {
					id: "growthContainer-" + this._map.id, 
					style: 'text-align:center;', 
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " measures-growthInfo'></i>&nbsp;<b>Economy:</b>"
				});
				growthDiv.appendChild(growthContainer);
				
				var growthDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;" });
				_.each(this._interface.measures.controls.growth, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						onClick: function(){
							self.comboButtonEconomyMeasures.set("label", this.label);
							self.comboButtonEconomy.set("label", this.label);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							self.getMeasureInputValues();
						}
					});
					growthDropdown.addChild(menuItem);
				});

				this.comboButtonEconomyMeasures = new ComboButton({
					label: _.first(this._interface.measures.controls.growth).name,
					name: "growth",
					style: "width: 75px;",
					dropDown: growthDropdown
				});
				on(this.comboButtonEconomyMeasures.domNode, "click", function(evt) {
					var dropDown = self.comboButtonEconomyMeasures.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonEconomyMeasures.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonEconomyMeasures.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonEconomyMeasures, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				growthDiv.appendChild(this.comboButtonEconomyMeasures.domNode);

				//defense scenario dropdown
				var defenseDiv = domConstruct.create("div", {
					style: 'width: 100px; display: none; margin-left:25px; text-align:center;'
				});
				this.measureInputsPane.containerNode.appendChild(defenseDiv);
				
				var defenseContainer = domConstruct.create("div", {style: 'text-align:center;', innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " measures-defenseInfo'></i>&nbsp;<b>Defense:</b>"});
				defenseDiv.appendChild(defenseContainer);
				
				var defenseDropdown = new DropDownMenu({ class:"cr-dojo-dijits", style: "display: none;"});
				_.each(this._interface.measures.controls.defense, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){
							self.comboButtonDefenseMeasures.set("label", this.label);
							self.comboButtonDefenseMeasures.set("value", this.value);
							domStyle.set(this.getParent().domNode.parentNode, { "display":"none" });
							
							//self.comboButtonDefense.set("label", this.label);
							//self.comboButtonDefense.set("value", this.value);
							self.getMeasureInputValues();
						}
					});
					defenseDropdown.addChild(menuItem);
				});

				this.comboButtonDefenseMeasures = new ComboButton({
					label: "Low",
					value:"low",
					name: "defense",
					style: "width: 75px;",
					dropDown: defenseDropdown
				});
				on(this.comboButtonDefenseMeasures.domNode, "click", function(evt) {
					var dropDown = self.comboButtonDefenseMeasures.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonDefenseMeasures.focusNode, "mousedown", function(evt) {
					var dropDown = self.comboButtonDefenseMeasures.dropDown.domNode.parentNode;
					window.setTimeout(function() {
						if(dropDown) {
							domStyle.set(dropDown, { "display":"block", "z-index": 10000 });
						}
					}, 100);
				});
				on(this.comboButtonDefenseMeasures, "blur", function(evt) {
					var dropDown = this.dropDown.domNode.parentNode;
					domStyle.set(dropDown, { "display":"none" });
				});
				defenseDiv.appendChild(this.comboButtonDefenseMeasures.domNode);
				
				
			    //climate year slider
			    var climateSliderDiv = domConstruct.create("div", {
					style: 'width: 400px; display: inline-block; margin-left:15px; margin-top:30px;'
				});
				this.measureInputsPane.containerNode.appendChild(climateSliderDiv);
				
				var climateYearSliderLabel = domConstruct.create("div", {innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " measures-climateInfo'></i>&nbsp;<b>Reference Year:</b>", style:"position:relative; width: 120px; top:-7px; display: inline-block"});
				climateSliderDiv.appendChild(climateYearSliderLabel);
				this.climateYearSliderMeasures = new HorizontalSlider({
			        name: "climateYearSlider",
			        value: 2030,
			        minimum: 2030,
			        maximum: 2050,
			        discreteValues: 2,
			        showButtons: false,
			        style: "width: 275px; display: inline-block",
			        onChange: function(value){
			           self.climateYearSliderDamages.set("value", value);
			           if(self.tc.selectedChildWidget.id == ("tabMeasures-" + self._map.id)) {
				           	self.getMeasureInputValues();
				       }
			        }
			    });
			    climateSliderDiv.appendChild(this.climateYearSliderMeasures.domNode);

			    var climateYearSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 3,
			    	labels: ['2030', '2050'],
			    	style: "margin-top: 5px;"
			    });
			    this.climateYearSliderMeasures.addChild(climateYearSliderLabels);

			    
				var dataTypeDiv = domConstruct.create("div", {
					style: 'width: 400px; display: inline-block; margin-left:15px; margin-top:30px;margin-bottom:15px;'
				});
				this.measureInputsPane.containerNode.appendChild(dataTypeDiv);
				
				var dataTypeText = domConstruct.create("div", {
					style: 'width: 165px; display:inline-block;',
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " measures-valuesInfo'></i>&nbsp;<b>Display map values by:</b>"
				});
				dataTypeDiv.appendChild(dataTypeText);

			    var radioButtonContainerPercent = domConstruct.create("div", {
					style: 'width: 125px; display: inline-block; position: relative; margin-left: 5px;'
				});
				dataTypeDiv.appendChild(radioButtonContainerPercent);

				var radioButtonContainerTotal = domConstruct.create("div", {
					style: 'width: 100px; display: inline-block; position: relative; margin-left: 5px;'
				});
				dataTypeDiv.appendChild(radioButtonContainerTotal);

			    var measuresPercentInput = domConstruct.create("input", { id:"measuresPercentRb-" + this._map.id, "type": "radio", "name": "damagesRb",  "value": "percent", "checked": true});
			    var measuresPercentLabel = domConstruct.create("label", {"for": "measuresPercentRb-" + this._map.id, innerHTML: "Percent Value", "class": "eca-labels", "style" : "display:inline-block; margin-right: 5px;"});
			    radioButtonContainerPercent.appendChild(measuresPercentLabel);
				radioButtonContainerPercent.appendChild(measuresPercentInput);

			    this.measuresPercentRb = new RadioButton({
			    	"name": "measuresRb",
			    	"value": "percent",
			    	"checked": true,
			    	onChange: function() {
			    		if(this.get('checked')){ self.getMeasureInputValues()};
			    	}
			    }, "measuresPercentRb-" + this._map.id);
			    this.measuresPercentRb.startup();

			    var measuresTotalInput = domConstruct.create("input", { id:"measuresTotalRb-" + this._map.id, "type": "radio", "name": "damagesRb",  "value": "total"});
			    var measuresTotalLabel = domConstruct.create("label", {"for": "measuresTotalRb-" + this._map.id, innerHTML: "Total Value", "class": "eca-labels", "style" : "display:inline-block; margin-right: 5px;"});
			    radioButtonContainerTotal.appendChild(measuresTotalLabel);
				radioButtonContainerTotal.appendChild(measuresTotalInput);
				
			    this.measuresTotalRb = new RadioButton({
			    	"name": "measuresRb",
			    	"value": "total",
			    	"checked": false,
			    	onChange: function() {
			    		if(this.get('checked')){self.getMeasureInputValues()};
			    	}
			    }, "measuresTotalRb-" + this._map.id);
			    this.measuresTotalRb.startup();

			}

			this.createExposureChart = function(){
				var margin = {top: 20, right: 0, bottom: 40, left: 50}
				var width = 350;
				var height = 275;
				var padding = 0.25;
				
				this.parameters.exposureChart = { height: height, width: width, margin: margin }
				
				this.exposureChartPane = new ContentPane({
			    	//title: "<i class='fa fa-question-circle eca-" + this._map.id + " exposure-graphInfo'></i>&nbsp;Distribution of Assets by Elevation",
			    	style: 'overflow:visible; position: relative;'
			    });

				this.cpExposure.domNode.appendChild(this.exposureChartPane.domNode);
				domStyle.set(this.exposureChartPane.containerNode, {"position": "relative", "padding-bottom": "10px", "padding-top": "20px"});
				this.exposureChartNode = domConstruct.create("div", { "style": "height:" + (height + 50) + "px;", "class": "exposureChartNode-" + this._map.id });
				this.exposureChartPane.containerNode.appendChild(this.exposureChartNode);

				this.exposureChartX = d3.scale.ordinal()
				    .rangeRoundBands([0, width], padding, 0);

				this.exposureChartY = d3.scale.linear()
				    .rangeRound([height, 0]);

				var color = d3.scale.ordinal()
				    .range(["#C2CFC0", "#EBE9D7", "#7991AB", "#412A22"]); //#8F9E8B
				
				this.exposureChartColors = color;

				var xAxis = d3.svg.axis()
				    .scale(this.exposureChartX)
				    .orient("bottom")
				    .tickFormat(function(d) { if(d%5 == 0) { return d; } });
				this.parameters.exposureChart.xAxis = xAxis;

				var yAxis = d3.svg.axis()
				    .scale(this.exposureChartY)
				    .orient("left")
				    .tickFormat(function(d) { return self.formatter(d, 1000000000);});
				this.parameters.exposureChart.yAxis = yAxis;

				this.exposureChart = d3.select(".exposureChartNode-" + this._map.id)
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				this.exposureChartData = [];
				
				d3.csv(this.pluginDirectory + "/data/data.csv", function(error, data){
					var data = data.filter(function(d) { return d['Category'] <= 10 });
					color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Category" && key !== "Total"; }));

					data.forEach(function(d) {
					    var y0 = 0;
					    d.categories = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
					    d.total = d.Total;
					  });
					
					self.exposureChartData = data;
					self.exposureChartX.domain(data.map(function(d) { return d.Category; }));
  					//self.exposureChartY.domain([0, d3.max(data, function(d) { return d.total; })]);
					self.exposureChartY.domain([0, 130000000000]);

  					 self.exposureChart.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(self.parameters.exposureChart.xAxis)
						
					self.exposureChart.append("text")
						.attr("class", "x-axis-title")
						.attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom -15)+ ")")
						.style("text-anchor", "middle")
						.text("Elevation");

					self.exposureChart.append("g")
						.attr("class", "y axis e")
						.call(yAxis)
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("x", 0 - (height/2))
						.attr("y", 0 - margin.left + 10)
						.attr("dy", ".7em")
						.style("text-anchor", "middle")
						.text("Asset Values ($US Billion)")
						.on("mouseover", function(d) {
							var parent = _.first(query(".y.axis.e").parents(".dijitContentPane")).id
							var message = self._interface["exposure"]["tooltips"]["y-axis"];
							self.showMessageDialog(parent, message.label, message.value);
						})
						.on("mouseout", function(d) {
							self.hideMessageDialog();
						});

					var categories = self.exposureChart.selectAll(".categories")
						.data(data)
						.enter().append("g")
						.attr("class", "categories")
						.attr("cursor", "pointer")
						.attr("transform", function(d) { return "translate(" + self.exposureChartX(d.Category) + ",0)"; });

					categories.selectAll("rect")
						.data(function(d) { return d.categories; })
						.enter().append("rect")
						.attr("width", self.exposureChartX.rangeBand())
						.attr("y", function(d) { return self.exposureChartY(d.y1); })
						.attr("height", function(d) { return self.exposureChartY(d.y0) - self.exposureChartY(d.y1); })
						.style("fill", function(d) { return color(d.name); })
						.on("click", function(d){
							var label = (d.name == "Other") ? "Essential Facilities" : d.name;
							self.comboButtonExposureType.set("label", label);
							self.comboButtonExposureType.set("value", d.name.toLowerCase());
							self.getExposureInputValues();
						});
						

					var legend = self.exposureChart.selectAll(".eca-legend")
						.data(color.domain().slice().reverse())
						.enter().append("g")
						.attr("class", function(d) { return "eca-legend " + d; })
						.attr("transform", function(d, i) { return "translate(0," + ((i * 20) - 20) + ")"; });

					legend.append("rect")
						.attr("x", width - 18)
						.attr("width", 18)
						.attr("height", 18)
						.style("fill", color)
						.style("stroke", "#bbbbbb")
						.attr("cursor", "pointer")
						.on("click", function(d) {
							var label = (d == "Other") ? "Essential Facilities" : d;
							self.comboButtonExposureType.set("label", label);
							self.comboButtonExposureType.set("value", d.toLowerCase());
							self.getExposureInputValues();						
						})
						.on("mouseover", function(d) {
							var parent = _.first(query(".eca-legend." + d).parents(".dijitContentPane")).id
							var message = self._interface["exposure"]["tooltips"][d];
							self.showMessageDialog(parent, message.label, message.value);
						})
						.on("mouseout", function(d) {
							self.hideMessageDialog();
						});

					legend.append("text")
						.attr("x", width - 24)
						.attr("y", 9)
						.attr("dy", ".35em")
						.style("text-anchor", "end")
						.text(function(d) { 
							if (d == "Other") {
								return "Essential Facilities";
							} else {
								return d;
							}
						});

				})

				/* this.exposureChartYaxisTitle = domConstruct.create("div", {innerHTML: "1e9(US$)", style:"width: 40px; font-size:10px; position: absolute; top: 15px; left:20px;"});
				this.exposureChartPane.containerNode.appendChild(this.exposureChartYaxisTitle); */
			}

			this.createDamagesChart = function(){
				var margin = {top: 15, right: 0, bottom: 30, left: 50}
				var width = 350;
				var height = 275;
				var padding = 0.45;
				
				this.parameters.damagesChart = { height: height, width: width, margin: margin }
				
				this.damagesChartPane = new ContentPane({
			    	id: "damagesChartPane-" + this._map.id,
					//title: "<i class='fa fa-question-circle eca-" + this._map.id + " damages-graphInfo'></i>&nbsp;Risk Profile",
			    	style: 'overflow:visible; position: relative;'
			    });

				this.cpDamages.domNode.appendChild(this.damagesChartPane.domNode);
				domStyle.set(this.damagesChartPane.containerNode, { "position": "relative","padding-bottom": "20px" });
				this.damagesChartNode = domConstruct.create("div", { "style": "height:" + (height + 40) + "px;", "class": "damagesChartNode-" + this._map.id });
				this.damagesChartPane.containerNode.appendChild(this.damagesChartNode);
				
				this.damagesChartNote = domConstruct.create("div", { 
					style: "position:absolute; text-align:center; font-size:12px; width:100%; top:15px; left:0px; color: #666666;", 
					innerHTML: "hover over any chart element for more Results"
				});
				this.damagesChartNode.appendChild(this.damagesChartNote);
				
				var maxY = 0;
				for (var i in this._data.damages.flood.chartData["Tr10"]) {
					var max = d3.max(this._data.damages.flood.chartData["Tr10"][i], function(d) { return d.value; });
					if (max > maxY) { maxY = max }
				}
				
				var data = this.processDamagesChartData(this._data.damages.flood.chartData["Tr10"]["low-none-2030-2030"]);
				var today = _.first(data).value;

				this.damagesChartX = d3.scale.ordinal()
					.rangeRoundBands([0, width], padding, 0.05);

				this.damagesChartY = d3.scale.linear()
					.range([height, 0]);

				var xAxis = d3.svg.axis()
					.scale(this.damagesChartX)
					.orient("bottom");
				this.parameters.damagesChart.xAxis = xAxis;

				var yAxis = d3.svg.axis()
					.scale(this.damagesChartY)
					.orient("left")
					.tickFormat(function(d) { return self.formatter(d, 1000000000); });
				this.parameters.damagesChart.yAxis = yAxis;

				this.damagesChart = d3.select(".damagesChartNode-" + this._map.id)
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
					
				this.damagesChart.append("defs").append("marker")
					.attr("id", "arrowhead")
					.attr("viewBox", "0 -5 10 10")
					.attr("refX", 10)
					.attr("refY", 0)
					.attr("markerWidth", 6)
					.attr("markerHeight", 6)
					.attr("orient", "auto")
					.append("path")
					.attr("d", "M0,-5L10,0L0,5");
					
				this.damagesChart.append("defs").append("marker")
					.attr("id", "arrowhead-total")
					.attr("viewBox", "0 -5 10 10")
					.attr("refX", 10)
					.attr("refY", 0)
					.attr("markerWidth", 6)
					.attr("markerHeight", 6)
					.attr("orient", "auto")
					.append("path")
					.attr("d", "M0,-5L10,0L0,5");

				this.damagesChartX.domain(data.map(function(d) { return d.name; }));
				//this.damagesChartY.domain([0, d3.max(data, function(d) { return d.value; })]);
				this.damagesChartY.domain([0, maxY]);

				this.damagesChart.append("g")
					.attr("class", "x axis d")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.selectAll(".tick text")
					.text( function (d, i) { 
						if (d == "Today") {
							return "2010"; 
						} else if (d == "Economic") {
							return "Economic Growth";
						} else if (d == "Climate") {
							return "Climate Change";
						} else {
							return "Future Total";
						}
					});

				this.damagesChart.append("g")
					.attr("class", "y axis d")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("x", 0 - (height/2))
					.attr("y", 0 - margin.left + 10)
					.attr("dy", ".7em")
					.style("text-anchor", "middle")
					.text("Damages ($US Billion)")
					.on("mouseover", function(d) {
						var parent = _.first(query(".y.axis.d").parents(".dijitContentPane")).id
						var message = self._interface["damages"]["tooltips"]["y-axis"];
						self.showMessageDialog(parent, message.label, message.value);
					})
					.on("mouseout", function(d) {
						self.hideMessageDialog();
					});

				var bar = this.damagesChart.selectAll(".bar")
					.data(data)
					.enter()
					.append("g")
					.attr("class", function(d) { return "bar " + d.class })
					.attr("transform", function(d) { return "translate(" + self.damagesChartX(d.name) + ",0)"; });

				bar.append("rect")
					.attr("width", self.damagesChartX.rangeBand())
					.attr("y", function (d, i) { return self.damagesChartY( Math.max(d.start, d.end) ); })
					.attr("height", function (d) { return Math.abs( self.damagesChartY(d.start) - self.damagesChartY(d.end) ); })
					.attr("cursor", "pointer")
					.on("mouseover", function(d) {
						var parent = _.first(query(".bar." + d.class).parents(".dijitContentPane")).id
						var message = self._interface["damages"]["messages"][d.name];
						
						var value = self.formatter(d.value, 1000000000) + " billion";
						var year = self.climateYearSliderDamages.get("value");
						
						self.showMessageDialog(parent, message.label.replace("FUTUREYEAR",year), message.value,  { "VALUE": value, "PERCENT": d.percent } );
					})
					.on("mouseout", function(d) {
						self.hideMessageDialog();
					});

				bar.append("text")
					.attr("class", "bar-text")
					.attr("x", self.damagesChartX.rangeBand() / 2)
					.attr("y", function(d) { return self.damagesChartY(d.end) - 5; })
					.attr("fill-opacity", function(d) { return (d.value > 0) ? 1 : 0; })
					.text(function(d) { return self.formatter(d.end - d.start, 1000000000);});

				bar.filter(function(d) { return d.class != "total" })
					.append("line")
					.attr("class", "connector")
					.attr("x1", self.damagesChartX.rangeBand() + 5 )
					.attr("y1", function(d) { return self.damagesChartY(d.end) } )
					.attr("x2", self.damagesChartX.rangeBand() / ( 1 - padding) - 5 )
					.attr("y2", function(d) { return self.damagesChartY(d.end) } );
					
				bar.filter(function(d) { return d.class == "economic" || d.class == "climate" })
					.append("line")
					.attr("class", "line-arrow")
					.attr("marker-end", "url(#arrowhead)")
					.attr("x1", self.damagesChartX.rangeBand() + 7 )
					.attr("y1", function(d) { return self.damagesChartY(d.start) } )
					.attr("x2", self.damagesChartX.rangeBand() + 7)
					.attr("y2", function(d) { return self.damagesChartY(d.end) } )
					.attr("opacity", function(d) { return (parseInt(d.percent.replace("%","")) > 50) ? 1 : 0; });
					
				bar.filter(function(d) { return d.class == "economic" || d.class == "climate" })
					.append("text")
					.attr("class", "line-arrow-text")
					.attr("x", self.damagesChartX.rangeBand() + 22)
					.attr("y", function(d) { return self.damagesChartY(d.start); })
					.attr("fill-opacity", function(d) { return (d.value > 0) ? 1 : 0; })
					.text(function(d) { return d.percent });
					
				bar.filter(function(d) { return d.class == "total" })
					.append("line")
					.attr("class", "connector-total")
					.attr("x1", 0 )
					.attr("y1", function(d) { return self.damagesChartY(today) } )
					.attr("x2", self.damagesChartX.rangeBand() )
					.attr("y2", function(d) { return self.damagesChartY(today) } );
					
				bar.filter(function(d) { return d.class == "total" })
					.append("line")
					.attr("class", "line-arrow-total")
					.attr("marker-end", "url(#arrowhead-total)")
					.attr("x1", self.damagesChartX.rangeBand() / 2 )
					.attr("y1", function(d) { return self.damagesChartY(today) } )
					.attr("x2", self.damagesChartX.rangeBand() / 2 )
					.attr("y2", function(d) { return self.damagesChartY(d.end) + 20 } )
					.attr("opacity", function(d) { return (d.value != today) ? 1 : 0; });
					
				bar.filter(function(d) { return d.class == "total" })
					.append("text")
					.attr("class", "line-arrow-text-total ")
					.attr("x", self.damagesChartX.rangeBand() / 2)
					.attr("y", function(d) { return self.damagesChartY(today) + 5; })
					.attr("dy", function(d) { return ".75em" })
					.attr("fill-opacity", function(d) { return (d.value != today) ? 1 : 0; })
					.text(function(d) { return d.percent;});
				
				var returnPeriodSliderDiv = domConstruct.create("div", {
					style: 'width: 400px; display: inline-block; margin-left:15px; margin-top:15px;'
				});
				this.damagesChartPane.containerNode.appendChild(returnPeriodSliderDiv);
				
				var returnPeriodSliderLabel = domConstruct.create("div", {
					innerHTML: "<i class='fa fa-question-circle eca-" + this._map.id + " damages-protectionInfo'></i>&nbsp;<b>Storm Return Period (yr):</b>", 
					style:"position:relative; width:175px; top:-7px; display:inline-block;"
				});
				returnPeriodSliderDiv.appendChild(returnPeriodSliderLabel);
				this.returnPeriodSlider = new HorizontalSlider({
			        name: "returnPeriodSlider",
			        value: 1,
			        minimum: 1,
			        maximum: this._interface.damages.controls.protection.discreteValues,
			        discreteValues: this._interface.damages.controls.protection.discreteValues,
			        showButtons: false,
			        style: "width:210px;display:inline-block;",
			        onChange: function(value){
					   self.getDamageInputValues();
			        }
			    });
			    returnPeriodSliderDiv.appendChild(this.returnPeriodSlider.domNode);

			    var returnPeriodSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 5,
			    	labels: ['10', '50', '100', '250', '500'],
			    	style: "margin-top: 5px;"
			    });
			    this.returnPeriodSlider.addChild(returnPeriodSliderLabels);
				
			}
		
			this.createMeasuresChart = function(){
				var margin = {top: 10, right: 20, bottom: 40, left: 50}
				var width = 350;
				var height = 275;
				var padding = 0.25;
				var tooltip = {width: 100, height: 50}
				
				this.parameters.measuresChart = { height: height, width: width, margin: margin }
				
				this.measuresChartPane = new ContentPane({
			    	//title: "<i class='fa fa-info-circle eca-" + this._map.id + " measures-graphInfo'></i>&nbsp;Cost : Benefit Curve",
			    	style: 'overflow:visible; position: relative;'
			    });
				
				this.cpMeasures.domNode.appendChild(this.measuresChartPane.domNode);
				domStyle.set(this.measuresChartPane.containerNode, {"position": "relative", "padding-bottom": "10px", "padding-top": "20px"});
				this.measuresChartNode = domConstruct.create("div", { "style": "height:" + (height + 45) + "px;", "id": "measuresChartNode-" + this._map.id, "class": "measuresChartNode-" + this._map.id });
				this.measuresChartPane.containerNode.appendChild(this.measuresChartNode);
				
				this.measuresChartTip = domConstruct.create("div", { "class": "measuresChartTooltip" });
				this.measuresChartNode.appendChild(this.measuresChartTip);
				
				this.measuresChartNote = domConstruct.create("div", { style: "position:absolute; text-align:center; font-size:12px; width:100%; top:5px; left:0px; color: #666666;", innerHTML: "hover over any chart element for more Results" });
				this.measuresChartNode.appendChild(this.measuresChartNote);
				
				var data = this.processMeasuresChartData(this._data.measures.chartData["default-low-low-2030"]);
				this.measuresChartData = data;

				this.measuresChartX = d3.scale.linear()
					.range([0, width]);

				this.measuresChartY = d3.scale.linear()
					.range([height, 0]);

				var xAxis = d3.svg.axis()
					.scale(this.measuresChartX)
					.orient("bottom")
					.tickFormat(function(d) { return self.formatter(d, 10000000000); });
				this.parameters.measuresChart.xAxis = xAxis;

				var yAxis = d3.svg.axis()
					.scale(this.measuresChartY)
					.orient("left")
					.tickFormat(function(d) { return d3.round(d,2); });
				this.parameters.measuresChart.yAxis = yAxis;

				this.measuresChart = d3.select(".measuresChartNode-" + this._map.id)
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				
				var x = data.map(function(d) { return parseInt(d.benefit) });
				var maxX = x.reduce(function(total, num) { return total + num; })				
				this.measuresChartX.domain([0, maxX]);
				
				var yMax = d3.max(data, function(d) { return d.costbenefit; });
				var yRoundMax = d3.round(yMax, -1);
				this.measuresChartY.domain([0, (yMax >= yRoundMax) ? yRoundMax + 5 : yRoundMax]);

				this.measuresChart.append("g")
					.attr("class", "x axis cb")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					
				this.measuresChart.append("text")
					.attr("class", "x-axis-title")
					.attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom -10)+ ")")
					.attr("cursor", "pointer")
					.style("text-anchor", "middle")
					.text("Averted Damages over 21 yrs ($US 10 Billion)")
					.on("mouseover", function(d) {
						var parent = _.first(query(".y.axis.cb").parents(".dijitContentPane")).id
						var message = self._interface["measures"]["tooltips"]["x-axis"];
						self.showMessageDialog(parent, message.label, message.value);
					})
					.on("mouseout", function(d) {
						self.hideMessageDialog();
					});
					
				this.measuresChart.append("g")
					.attr("class", "y axis cb")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("x", 0 - (height/2))
					.attr("y", 0 - margin.left + 10)
					.attr("dy", ".7em")
					.attr("cursor", "pointer")
					.style("text-anchor", "middle")
					.text("Benefit:Cost Ratio")
					.on("mouseover", function(d) {
						var parent = _.first(query(".y.axis.cb").parents(".dijitContentPane")).id
						var message = self._interface["measures"]["tooltips"]["y-axis"];
						self.showMessageDialog(parent, message.label, message.value);
					})
					.on("mouseout", function(d) {
						self.hideMessageDialog();
					});

				var bar = this.measuresChart.selectAll(".bar")
					.data(data)
					.enter()
					.append("g")
					.attr("class", function(d) { return "bar cb " + self._data['measures']['chartData']['config'][d.type]['class'] })
					.attr("transform", function(d) { return "translate(" + self.measuresChartX(d.xStart) + ",0)"; });

				bar.append("rect")
					.attr("name", function (d) { return d.type; })
					.attr("width", function (d) { return self.measuresChartX(d.benefit); })
					.attr("y", function (d) { return self.measuresChartY(d.costbenefit); })
					.attr("cursor", "pointer")
					.attr("height", function (d) { return height - self.measuresChartY(d.costbenefit); })
					.on("click", function(d,i) {
						var growth = self.comboButtonEconomyMeasures.get("label");
						var defense = self.comboButtonDefenseMeasures.get("value");
						var climate = self.climateYearSliderMeasures.get("value");
						var dataToggle = (self.measuresTotalRb.get("checked")) ? self.measuresTotalRb.get("value") : self.measuresPercentRb.get("value");
						
						var inputString = growth + "-" + defense + "-" + climate;
						inputString = inputString.toLowerCase();
						
						var visibleLayers = [self._data['measures']['layersData'][d.type][inputString][dataToggle]['layerIndex']];
						self.updateLayer(visibleLayers);
					})
					.on('mouseover',function(d,i) {
						/* self.measuresChartTip.innerHTML = "<span>" + d.type + "</span>";
						domStyle.set(self.measuresChartTip, { "display": "block" });
						
						var marginBox = domGeom.getMarginBox(self.measuresChartTip);
						var marginLeft = margin.left;
						var paddingLeft = domStyle.get(self.measuresChartPane.containerNode, "paddingLeft");
						var offset = (marginBox.h < 50) ? 6 : (marginBox.h > 50) ? -6 : -3;
						
						var top = self.measuresChartY(d.costbenefit) - marginBox.h/2 + offset;
						var left = self.measuresChartX(d.xStart) + marginLeft + paddingLeft + self.measuresChartX(d.benefit)/2 - marginBox.w/2;
						domStyle.set(self.measuresChartTip, {
							"left": left + "px",
							"top": top + "px"
						}); */
						
						var parent = _.first(query(".bar." + d.class).parents(".dijitContentPane")).id
						var message = self._interface["measures"]["messages"]["graph-bar"];
						
						var ratio = d3.round(d.costbenefit, 2);
						var damage = self.formatter(d.benefit, 1000000000) + " billion";
						var year = self.climateYearSliderDamages.get("value");
						var name = self._data['measures']['chartData']['config'][d.type]['display'];
						self.showMessageDialog(parent, name, message.value,  { "CBRATIO": ratio, "CBDAMAGE": damage, "FUTUREYEAR": year } );
						
						var growth = self.comboButtonEconomyMeasures.get("label");
						var defense = self.comboButtonDefenseMeasures.get("value");
						var climate = self.climateYearSliderMeasures.get("value");
						var dataToggle = (self.measuresTotalRb.get("checked")) ? self.measuresTotalRb.get("value") : self.measuresPercentRb.get("value");
						
						var inputString = growth + "-" + defense + "-" + climate;
						inputString = inputString.toLowerCase();
						
						var visibleLayers = [self._data['measures']['layersData'][d.type][inputString][dataToggle]['layerIndex']];
						self.updateLayer(visibleLayers);
					})
					.on('mouseout', function(d,i) {
						//domStyle.set(self.measuresChartTip, {"display": "none"});
						self.hideMessageDialog();
						
						var checkboxes = query("[name=measuresCheckbox-" + self._map.id + "]");
						var visibleLayers = [];
						
						var growth = self.comboButtonEconomyMeasures.get("label");
						var defense = self.comboButtonDefenseMeasures.get("value");
						var climate = self.climateYearSliderMeasures.get("value");
						var dataToggle = (self.measuresTotalRb.get("checked")) ? self.measuresTotalRb.get("value") : self.measuresPercentRb.get("value");
						var inputString = growth + "-" + defense + "-" + climate;
						inputString = inputString.toLowerCase();
						
						dojo.forEach(checkboxes, function(checkbox) {
							var widget = registry.byId(checkbox.id);
							if (widget.get("checked")) {
								dojo.forEach(self._data['measures']['layers'][widget.get("value")]['layers'], function(layer) {					
									var index = self._data['measures']['layersData'][layer][inputString][dataToggle]['layerIndex'];
									visibleLayers.push(index);
								})
							}
						});
						visibleLayers = (visibleLayers.length == 0) ? [-1] : visibleLayers;
						self.updateLayer(visibleLayers);
					});
				
				this.measuresChart.append("g")
					.attr("transform", "translate(0,0)")
					.attr("class", "line-cb")
					.append("line")
					.attr("x1", 0 )
					.attr("y1", self.measuresChartY(1) )
					.attr("x2", width)
					.attr("y2", self.measuresChartY(1) )
					.on("mouseover", function(d) {
						/* var parent = _.first(query(".line-cb").parents(".dijitTitlePane")).id
						var message = self._interface["measures"]["tooltips"]["line"];
						self.showMessageDialog(parent, message.label, message.value);
						window.setTimeout(function(){ self.hideMessageDialog(); }, 4000); */
					})
					.on("mouseout", function(d) {
						//self.hideMessageDialog();
					});
					
					var legendOffset = 5;
					var legendData = [];
					for (var layer in self._data["measures"]["layers"]) {
						var item = self._data["measures"]["layers"][layer];
						if (item.legendOrder >= 0) {
							legendData.push( { "name": item.name, "class": item.class, "order": item.legendOrder } );
						}
					}
					legendData.sort(function(a,b) { return a.order - b.order });
					var legend = self.measuresChart.selectAll(".eca-legend")
						.data(legendData)
						.enter().append("g")
						.attr("class", function(d) { return "eca-legend " + d.class; })
						.attr("transform", function(d, i) { 
							var y = i * 20 + legendOffset;
							
							var checkBoxDiv = domConstruct.create("div", {id: d.class + "Checkbox-" + self._map.id, style: 'position: absolute; right: 0px; top: 0px;'});
							self.measuresChartPane.containerNode.appendChild(checkBoxDiv);
							var checkBox = new RadioButton({
								name: "measuresCheckbox-" + self._map.id,
								value: d.class,
								checked: false,
								style: 'position: absolute; right: 25px; top: ' + (y + 31) + 'px;',
								onChange: function(b){
									var checkboxes = query("[name=measuresCheckbox-" + self._map.id + "]");
									var visibleLayers = [];
									
									var growth = self.comboButtonEconomyMeasures.get("label");
									var defense = self.comboButtonDefenseMeasures.get("value");
									var climate = self.climateYearSliderMeasures.get("value");
									var dataToggle = (self.measuresTotalRb.get("checked")) ? self.measuresTotalRb.get("value") : self.measuresPercentRb.get("value");
									var inputString = growth + "-" + defense + "-" + climate;
									inputString = inputString.toLowerCase();
											
									dojo.forEach(checkboxes, function(checkbox) {
										var widget = registry.byId(checkbox.id);
										if (widget.get("checked")) {
											dojo.forEach(self._data['measures']['layers'][widget.get("value")]['layers'], function(layer) {					
												var index = self._data['measures']['layersData'][layer][inputString][dataToggle]['layerIndex'];
												visibleLayers.push(index);
											});
										}
									});
									visibleLayers = (visibleLayers.length == 0) ? [-1] : visibleLayers;
									self.updateLayer(visibleLayers);
								}
							}, d.class + "Checkbox-" + self._map.id).startup();

							return "translate(0," + y + ")"; 
						});

					legend.append("rect")
						.attr("x", width - 24)
						.attr("width", 18)
						.attr("height", 18)
						.attr("cursor", "pointer")
						.on("click", function(d) {
							var id = d.class + "Checkbox-" + self._map.id;
							var widget = dijit.byId(id);
							if (widget.get("checked")) { 
								widget.set("checked", false);
							} else { 
								widget.set("checked", true);
							}
						})
						.on("mouseover", function(d) {
							var parent = _.first(query(".eca-legend." + d.class).parents(".dijitContentPane")).id
							var message = self._interface["measures"]["tooltips"][d.class];
							self.showMessageDialog(parent, message.label, message.value);
						})
						.on("mouseout", function(d) {
							self.hideMessageDialog();
						});

					legend.append("text")
						.attr("x", width - 30)
						.attr("y", 9)
						.attr("dy", ".35em")
						.attr("cursor", "pointer")
						.attr("text-decoration", "none")
						.style("text-anchor", "end")
						.text(function(d) { return d.name; })
						.on("click", function(d) {
							var id = d.class + "Checkbox-" + self._map.id;
							var widget = dijit.byId(id);
							if (widget.get("checked")) { 
								widget.set("checked", false);
							} else { 
								widget.set("checked", true);
							}
						})
						.on("mouseover", function(d) {
							var parent = _.first(query(".eca-legend." + d.class).parents(".dijitContentPane")).id
							var message = self._interface["measures"]["tooltips"][d.class];
							self.showMessageDialog(parent, message.label, message.value);
							d3.select(this).attr("text-decoration", "underline");
						})
						.on("mouseout", function(d) {
							self.hideMessageDialog();
							d3.select(this).attr("text-decoration", "none");
						});

						this.measuresChart.append("g")
							.attr("transform", "translate(0, " + (legendData.length*20 + legendOffset) + ")")
							.attr("class", "eca-legend cb-ratio")
							.on("mouseover", function(d) {
								var parent = _.first(query(".eca-legend.cb-ratio").parents(".dijitContentPane")).id
								var message = self._interface["measures"]["tooltips"]["cb-ratio"];
								self.showMessageDialog(parent, message.label, message.value);
							})
							.on("mouseout", function(d) {
								self.hideMessageDialog();
							})
							.append("line")
							.attr("x1", width - 24 )
							.attr("y1", 10 )
							.attr("x2", width - 4)
							.attr("y2", 10 )
							
						this.measuresChart.select(".cb-ratio")
							.append("text")
							.attr("x", width - 30)
							.attr("y", 10)
							.attr("dy", ".35em")
							.attr("text-decoration", "none")
							.attr("class", "eca-legend cb-ratio")
							.style("text-anchor", "end")
							.text("Benefit:Cost Line");
				
				var clearDiv = domConstruct.create("div", {style: 'height: 1px; position: relative; clear: both'});
				this.measuresChartPane.containerNode.appendChild(clearDiv);
			}

			this.getExposureInputValues = function(){
				var exposureType = this.comboButtonExposureType.get('value');
				var elevation = this.comboButtonElevation.get('value');
				var geography = this.comboButtonGeography.get('value');
				var dataToggle = (this.exposureTotalRb.get("checked")) ? this.exposureTotalRb.get("value") : this.exposurePercentRb.get("value");
				var inputString = exposureType + '-' + elevation;
				var visibleLayers = [];
				visibleLayers = [this._data['exposure'][geography][inputString][dataToggle]['layerIndex']];
				//this.updateExposureChart(chartDataShow);
				this.updateLayer(visibleLayers);
			}
			
			this.getDamageInputValues = function(){
				var type = this.comboButtonType.get("label").toLowerCase();
				var growth = this.comboButtonEconomy.get("label");
				var defense = this.comboButtonDefense.get("value");
				var geography = this.comboButtonGeographyDamages.get('value');
				
				//climate and asset are the same now
				var asset = this.climateYearSliderDamages.get("value");
				var climate = this.climateYearSliderDamages.get("value");
				var dataToggle = (this.damagesTotalRb.get("checked")) ? this.damagesTotalRb.get("value") : this.damagesPercentRb.get("value");
				var period = this._interface.damages.controls.protection.returnPeriod[this.returnPeriodSlider.get("value")];
				
				var visibleLayers = [];
				if(type == 'wind'){
					this.comboButtonDefense.set('label', 'None');
					this.comboButtonDefense.set('value', 'none');
					this.comboButtonDefense.set('disabled', true);
				} else {
					this.comboButtonDefense.set('disabled', false);
				}
				
				var inputString = growth + "-" + ((type == 'flood') ? defense + "-" : "") + asset + "-" + climate;
				inputString = inputString.toLowerCase();
				
				if (_.has(this._data['damages'][type][geography], inputString)) {
					visibleLayers = [this._data['damages'][type][geography][inputString][dataToggle]['layerIndex']];
					this.updateLayer(visibleLayers);
				}
				
				var chartData = this._data['damages'][type]['chartData'][period][inputString];
				this.updateDamagesChart(chartData);
			}

			this.getMeasureInputValues = function(){
				var type = this.comboButtonTypeMeasures.get("value").toLowerCase();
				var growth = this.comboButtonEconomyMeasures.get("label");
				var defense = this.comboButtonDefenseMeasures.get("value");
				var climate = this.climateYearSliderMeasures.get("value");
				
				var inputString = type + "-" + growth + "-" + defense + "-" + climate;
				inputString = inputString.toLowerCase();
					
				this.updateMeasuresChart(this._data.measures.chartData[inputString]);
				
				var checkboxes = query("[name=measuresCheckbox-" + this._map.id + "]");
				var visibleLayers = [];
				dojo.forEach(checkboxes, function(checkbox) {
					var widget = registry.byId(checkbox.id);
					if (widget.get("checked")) {
						var growth = self.comboButtonEconomyMeasures.get("label");
						var defense = self.comboButtonDefenseMeasures.get("value");
						var climate = self.climateYearSliderMeasures.get("value");
						var dataToggle = (self.measuresTotalRb.get("checked")) ? self.measuresTotalRb.get("value") : self.measuresPercentRb.get("value");
						var inputString = growth + "-" + defense + "-" + climate;
						inputString = inputString.toLowerCase();

						dojo.forEach(self._data['measures']['layers'][widget.get("value")]['layers'], function(layer) {					
							var index = self._data['measures']['layersData'][layer][inputString][dataToggle]['layerIndex'];
							visibleLayers.push(index);
						});
					}
				});
				visibleLayers = (visibleLayers.length == 0) ? [-1] : visibleLayers;
				this.updateLayer(visibleLayers);
			}
		
			this.updateExposureChart = function() {
				var elevation = (this.comboButtonElevation.get("value") == "under10") ? 10 : 20;
				var data = this.exposureChartData.filter(function(d) { return d['Category'] <= elevation });
				
				this.exposureChartX.domain(data.map(function(d) { return d.Category; }));
				
				var categories = this.exposureChart.selectAll(".categories")
					.data(data);
				categories
					.enter()
					.append("g")
					.attr("class", "categories")
					.attr("transform", function(d) { return "translate(" + (self.parameters.exposureChart.width + 50) + ",0)"; })
					.selectAll("rect")
					.data(function(d) { return d.categories; })
					.enter()
					.append("rect")
					.attr("width", function(d) { return self.exposureChartX.rangeBand(); })
					.attr("height", function(d) { return self.exposureChartY(d.y0) - self.exposureChartY(d.y1); })
					.style("fill", function(d) { return self.exposureChartColors(d.name); })
					.attr("y", function(d) { return self.exposureChartY(d.y1); });
					
				categories
					.transition()
					.duration(500)
					.attr("transform", function(d) { return "translate(" + self.exposureChartX(d.Category) + ",0)"; })
					.selectAll("rect")
					.attr("width", function(d) { return self.exposureChartX.rangeBand(); });
				
				if (elevation == 10) {
					categories
						.exit()
						.transition()
						.duration(500)
						.attr("transform", function(d) { return "translate(" + (self.parameters.exposureChart.width + 50) + ",0)"; });
					
					categories
						.exit()
						.transition()
						.delay(1000)
						.remove();
				}
				
				this.exposureChart.select(".x.axis")
					.transition()
					.duration(500)
					.call(this.parameters.exposureChart.xAxis);
				
			}

			this.updateDamagesChart = function(data){
				var data = this.processDamagesChartData(data);
				var type = this.comboButtonType.get("label").toLowerCase();
				var year = this.climateYearSliderDamages.get("value");
				var period = this._interface.damages.controls.protection.returnPeriod[this.returnPeriodSlider.get("value")];
				var today = _.first(data).value;
				
				this.damagesChart.selectAll(".x.axis")
					.selectAll(".tick text")
					.text( function (d, i) { 
						if (d == "Today") {
							return "2010"; 
						} else if (d == "Economic") {
							return "Economic Growth";
						} else if (d == "Climate") {
							return "Climate Change";
						} else {
							return "Future Total";
						}
					});
				
				var maxY = 0;
				for (var i in this._data.damages[type]['chartData'][period]) {
					var max = d3.max(this._data.damages[type]['chartData'][period][i], function(d) { return d.value; });
					if (max > maxY) { maxY = max }
				}
				this.damagesChartY.domain([0, maxY]);
				this.damagesChart.select(".y.axis")
					.transition()
					.duration(500)
					.call(this.parameters.damagesChart.yAxis);
				
				this.damagesChart.selectAll("rect")
					.data(data)
					.transition()
					.duration(500)
					.attr("y", function (d, i) { return self.damagesChartY( Math.max(d.start, d.end) ); })
					.attr("height", function (d) { return Math.abs( self.damagesChartY(d.start) - self.damagesChartY(d.end) ); });
				
				this.damagesChart.selectAll(".bar-text")
					.data(data)
					.transition()
					.duration(500)
					.attr("y", function(d) { return self.damagesChartY(d.end) - 5; })
					.attr("fill-opacity", function(d) { return (d.value > 0) ? 1 : 0; })
					.text(function(d) { return self.formatter(d.end - d.start, 1000000000);});

				this.damagesChart.selectAll(".connector")
					.data(data)
					.filter(function(d) { return d.class != "total" })
					.transition()
					.duration(500)
					.attr("y1", function(d) { return self.damagesChartY(d.end) } )
					.attr("y2", function(d) { return self.damagesChartY(d.end) } )
					
				this.damagesChart.selectAll(".line-arrow")
					.data(data.filter(function(d) { return d.class == "economic" || d.class == "climate"; }))
					.transition()
					.duration(500)
					.attr("y1", function(d) { return self.damagesChartY(d.start) } )
					.attr("y2", function(d) { return self.damagesChartY(d.end) } )
					.attr("opacity", function(d) { return (parseInt(d.percent.replace("%","")) > 50) ? 1 : 0; });
					
				this.damagesChart.selectAll(".line-arrow-text")
					.data(data.filter(function(d) { return d.class == "economic" || d.class == "climate"; }))
					.transition()
					.duration(500)
					.attr("y", function(d) { return self.damagesChartY(d.start); })
					.attr("fill-opacity", function(d) { return (d.value > 0) ? 1 : 0; })
					.text(function(d) { return d.percent });
					
				this.damagesChart.selectAll(".connector-total")
					.data(data.filter(function(d) { return d.class == "total"; }))
					.transition()
					.duration(500)
					.attr("y1", function(d) { return self.damagesChartY(today) } )
					.attr("y2", function(d) { return self.damagesChartY(today) } );
				
				this.damagesChart.selectAll(".line-arrow-total")
					.data(data.filter(function(d) { return d.class == "total"; }))
					.transition()
					.duration(500)
					.attr("y1", function(d) { return self.damagesChartY(today) } )
					.attr("y2", function(d) { return self.damagesChartY(d.end) } )
					.attr("opacity", function(d) { return (d.value != today) ? 1 : 0; });
					
				this.damagesChart.selectAll(".line-arrow-text-total")
					.data(data.filter(function(d) { return d.class == "total"; }))
					.transition()
					.duration(500)
					.attr("y", function(d) { return self.damagesChartY(today) + 5; })
					.attr("fill-opacity", function(d) { return (d.value != today) ? 1 : 0; })
					.text(function(d) { return d.percent });
			}
			
			this.updateMeasuresChart = function(data) {
				var data = this.processMeasuresChartData(data);
				
				var x = data.map(function(d) { return parseInt(d.benefit) });
				var maxX = x.reduce(function(total, num) { return total + num; });
				
				this.measuresChartX.domain([0, maxX]);
				this.measuresChart.select(".x.axis.cb")
					.transition()
					.duration(500)
					.call(this.parameters.measuresChart.xAxis);
				
				var yMax = d3.max(data, function(d) { return d.costbenefit; });
				var yRoundMax = d3.round(yMax, -1);
				this.measuresChartY.domain([0, (yMax >= yRoundMax) ? yRoundMax + 5 : yRoundMax]);
				this.measuresChart.select(".y.axis.cb")
					.transition()
					.duration(500)
					.call(this.parameters.measuresChart.yAxis);
				
				this.measuresChart.selectAll(".bar.cb")
					.data(data)
					.transition()
					.duration(500)
					.attr("class", function(d) { return "bar cb " + d.class })
					.attr("transform", function(d) { return "translate(" + self.measuresChartX(d.xStart) + ",0)"; })
				
				this.measuresChart.selectAll("rect")
					.data(data)
					.transition()
					.duration(500)
					.attr("name", function (d) { return d.type; })
					.attr("width", function (d) { return self.measuresChartX(d.benefit); })
					.attr("y", function (d) { return self.measuresChartY(d.costbenefit); })
					.attr("height", function (d) { return self.parameters.measuresChart.height - self.measuresChartY(d.costbenefit); });
					
				this.measuresChart.selectAll(".line-cb line")
					.transition()
					.duration(500)
					.attr("y1", self.measuresChartY(1) )
					.attr("y2", self.measuresChartY(1) );	
			}
								
			this.processDamagesChartData = function(data) {
				var updatedData = lang.clone(data);
				var cumulative = 0;
				var today = _.first(updatedData).value;
				array.forEach(updatedData, function(d) { 
					switch(d.name) {
						case "Today":
							var className = "today";
							var displayName = d.name;
							break;
						case "Economic":
							var className = "economic";
							var displayName = "Economic Growth";
							break;
						case "Climate":
							var className = "climate";
							var displayName = "Climate Change";
							break;
						case "Total":
							var className = "total";
							var displayName = "Future Total";
							break;
					}
					d.class = className;
					d.displayName = displayName;
					d.start = (d.class == 'total') ? 0 : cumulative;
					cumulative += (d.class == 'total') ? 0 : d.value;
					d.percent = (d.class == 'total') ? d3.format("%")( (d.value - today) / today) : d3.format("%")(d.value / today);
					d.end = cumulative;
				});
				return updatedData;
			}
			
			this.processMeasuresChartData = function(data) {
				var inData = lang.clone(data);
				var config = this._data.measures.chartData.config;
				var updatedData = [];
				array.forEach(inData, function(item){
					if(config[item.type] && config[item.type].show) {
						var obj = lang.clone(item);
						obj.class = config[item.type].class;
						updatedData.push(obj);
					}
				});
				updatedData.sort(function(a,b) { return parseFloat(a.costbenefit) - parseFloat(b.costbenefit); }).reverse();
				
				var cumulative = 0;
				array.forEach(updatedData, function(d) { 
					d.xStart = cumulative;
					cumulative += d.benefit;
				});
				return updatedData;
			}

			this.createTooltips = function() {
				query(".fa-question-circle.eca-" + this._map.id).style({
					"margin-right": "1px",
					"cursor":"pointer"
				});
				
				on(query("i.fa-question-circle.eca-" + this._map.id), "mouseover", function() {
					var cssClass = _.last(domAttr.get(this, "class").split(" "));
					var tab = _.first(cssClass.split("-"));
					var control = _.last(cssClass.split("-"));
					var message = self._interface[tab]['tooltips'][control];
					var parent = _.first(query("." + cssClass).parents(".dijitContentPane")).id;
					self.showMessageDialog(parent, message.label, message.value);
				});
				
				on(query("i.fa-question-circle.eca-" + this._map.id), "mouseout", function() {
					self.hideMessageDialog();
				});
				
				array.forEach(this.tc.tablist.getChildren(), function(node) {
					var keys = _.keys(self._interface);
					for (var i = 0; i < keys.length; i++) {
						var index = node.id.toLowerCase().indexOf(keys[i]);
						if (index >=0) {
							on(node.domNode, "mouseover", function() {
								var message = self._interface[keys[i]]['tooltips']['tab'];
								var parent = self.tc.tablist.id;
								self.showMessageDialog(parent, message.label, message.value);
							})
							on(node.domNode, "mouseout", function() {
								self.hideMessageDialog();;
							})
							break;
						}
					}
				});
			}
			
			this.formatter = function(value,n) {
				return Math.round(value/n);
			}
			
			this.getTemplate = function(name) {
                var template = _.template($.trim(this._$templates.find('#' + name).html()));
                return template;
            }
			
			this.createMessageDialog = function() {
                this.removeMessageDialog() // remove old dialog if present
                var template = this.getTemplate('template-eca-info-box');
                var position = { "left": 20, "top": 0 };
				
                this._$pluginDialog = $(template()).appendTo($('body')).offset(position);
				this._infoBox = _.first(this._$pluginDialog);
				this._infoBox.id = this._infoBox.id + "-" + this._map.id;
                this._$pluginDialog.find('.close').click(function () {
                    self.hideMessageDialog();
                });
				
            }

            this.removeMessageDialog = function() {
                if (this._$pluginDialog) {
                    this._$pluginDialog.remove();
                    this._$pluginDialog = null;
                }
            }

			this.showMessageDialog = function(parent, label, value, replaceObject) {
				if (this._$pluginDialog) {
                	this.updateMessageDialog(label, value, replaceObject);
                	var position = $(this._container).offset();
                    position.left += $(this._container).outerWidth() + 10;
					position.top = $("#" + parent).offset().top;
                    query("#" + this._infoBox.id).style( {
                    	"top": position.top + "px",
                    	"left": position.left + "px"
                    });
                    $("#" + this._infoBox.id).show();
                }
            }

            this.hideMessageDialog = function() {
        		if (this._$pluginDialog) {
            		$("#" + this._infoBox.id).hide();
            	}
            }

            this.updateMessageDialog = function(label, value, replaceObject) {
                if (this._$pluginDialog) {
                	if (replaceObject) {
						for(var text in replaceObject){
							value = value.replace(text, replaceObject[text]);
						}
					}
                	_.first(query("#" + this._infoBox.id + " > div.body > div.description > div.info-label")).innerHTML = label;
					_.first(query("#" + this._infoBox.id + " > div.body > div.description > div.info-value")).innerHTML = value;
					
                }
            }
			
			this.adjustInterfaceControls = function(tab) {	
				/* if (tab == "exposure") {
					var geography = this.comboButtonGeography.get("label");
					var exposure = this.comboButtonExposureType.get("label");
					var marginLeft = (exposure == "Essential Facilities") ?  5 : 22;
					dojo.style(self.comboButtonExposureType.domNode, { "marginLeft": marginLeft + "px" });
					var marginLeft = (geography == "County" && exposure == "Essential Facilities") ?  107 : (geography == "County" && exposure == "Total") ? 77 : (geography == "Census Tract" && exposure == "Total") ? 62 :((geography == "County" && exposure != "Essential Facilities") ? 90 : (geography == "Census Tract" && exposure == "Essential Facilities")) ? 92 : 75;
					dojo.style(self.comboButtonGeography.domNode, { "marginLeft": marginLeft + "px" });
				} else if (tab == "damages") {
					var geography =  this.comboButtonGeographyDamages.get("label");
					var marginLeft = (geography == "County") ?  75 : 65;
					dojo.style(self.comboButtonGeographyDamages.domNode, { "marginLeft": marginLeft + "px" });
				} else if (tab == "measures") {
					var type = this.comboButtonTypeMeasures.get("label");
					var typeMarginLeft = (type == "Best") ?  16 : 8;
					dojo.style(self.comboButtonTypeMeasures.domNode, { "marginLeft": typeMarginLeft + "%" });
					
					var economicMarginLeft = (type == "Best") ?  22 : 30;
					dojo.style(self.comboButtonEconomyMeasures.domNode, { "marginLeft": economicMarginLeft + "%" });
				} */
			}


		};// End ecaTool

		
		return ecaTool;	
		
	} //end anonymous function

); //End define
