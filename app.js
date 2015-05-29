
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
					this.mapLayer.hide();
				}
			} //end this.hideTool
			
			this.closeTool = function(){
				if (this.mapLayer && this.mapLayer.loaded) { 
					this._map.removeLayer(this.mapLayer);
				}
			} //end this.hideTool
			
			this.resetInterface = function(){
				if (this.mapLayer && this.mapLayer.loaded) {
					this.comboButtonExposureType.set("label", _.first(this._interface.exposure.controls.type).name);
					this.comboButtonExposureType.set("value", _.first(this._interface.exposure.controls.type).value);
					this.comboButtonElevation.set("label", _.first(this._interface.exposure.controls.elevation).name);
					this.comboButtonElevation.set("value", _.first(this._interface.exposure.controls.elevation).value);
					this.comboButtonGeography.set("label", _.first(this._interface.exposure.controls.geography).name);
					this.comboButtonGeography.set("value", _.first(this._interface.exposure.controls.geography).value);
					this.comboButtonType.set("label", _.first(this._interface.damages.controls.type).name);
					this.comboButtonEconomy.set("label", _.first(this._interface.damages.controls.growth).name);
					this.comboButtonDefense.set("label", _.first(this._interface.damages.controls.defense).name);
					this.comboButtonTypeMeasures.set("label", _.first(this._interface.measures.controls.type).name);
					this.comboButtonEconomyMeasures.get("label", _.first(this._interface.measures.controls.growth).name);
					this.comboButtonDefenseMeasures.set("label", _.first(this._interface.measures.controls.defense).name);
					this.climateYearSliderDamages.set("value", 2030);
					this.returnPeriodSlider.set("value", 1);
					this.climateYearSliderMeasures.set("value", 2030);
					this.exposureTotalRb.set("checked", false);
					this.exposurePercentRb.set("disabled", false);
					this.exposurePercentRb.set("checked", true);
					this.damagesTotalRb.set("checked", false);
					this.damagesPercentRb.set("checked", true);

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
						style: "height: 100%; width: 100%; overflow: hidden",
						resize: function(){
					},
						useMenu: false,
						useSlider: false,
				    }, "tc1-prog");
				domClass.add(this.tc.domNode, "claro");
				this.tc.startup();
				this.tc.resize();

				this.tabOverview = new ContentPane({
			         id: "tabOverview-" + this._map.id,
					 title: "Overview",
					 style: "position:relative;width:100%;height:528px;overflow:hidden;",
					 isLayoutContainer: true,
					 onShow: function() {
						 window.setTimeout(function(){ domStyle.set(self.cpOverview.domNode, "width", "100%") }, 5);
						 if (self.mapLayer && self.mapLayer.loaded) { self.mapLayer.hide(); }
					 }
			    });
				this.tabOverview.startup();
			    this.tc.addChild(this.tabOverview);
				
				this.cpOverview = new ContentPane({
					style: "position:relative; width:100%; height:100%;overflow:hidden;",
					content: "",
					onDownloadEnd: function(){
						var methodsButtonDiv  = domConstruct.create("div", {
							id:"methodsButtonDiv-" + self._map.id,
							style:"width: 70px; position:absolute; right: 10px; bottom:10px"
						});
						this.domNode.appendChild(methodsButtonDiv);			

						var methodsButton = new Button({
							label: "Methods",
							disabled: false,
							onClick: function(){
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
					 style: "position:relative;width:100%;height:528px;overflow:hidden;",
			         isLayoutContainer: true,
					 onShow: function() {
						window.setTimeout(function(){ domStyle.set(self.cpExposure.domNode, "width", "100%") }, 5);
						if (self.mapLayer && self.mapLayer.loaded) { self.getExposureInputValues(); }
					 }
			    });
			    this.tabExposure.startup();
				//add inputs tab to main tabContainer
			    this.tc.addChild(this.tabExposure);
				
				//THE DAMAGES PANEL
			    this.tabDamages = new ContentPane({
			         id: "tabDamages-" + this._map.id,
					 title: "Damages",
					 style: "position:relative;width:100%;height:528px;overflow:hidden;",
					 isLayoutContainer: true,
					 onShow: function() {
						window.setTimeout(function(){ domStyle.set(self.cpDamages.domNode, "width", "100%") }, 5);
						if (self.mapLayer && self.mapLayer.loaded) { self.getDamageInputValues(); }
					 }
			    });
				this.tabDamages.startup();
				//append results tab to main tabContainer
			    this.tc.addChild(this.tabDamages);

			    //THE MEASURES PANEL
			    this.tabMeasures = new ContentPane({
			         id: "tabMeasures-" + this._map.id,
					 title: "Measures",
					 style: "position:relative;width:100%;height:528px;overflow:hidden;",
					 isLayoutContainer: true,
					 onShow: function() {
						window.setTimeout(function(){ domStyle.set(self.cpMeasures.domNode, "width", "100%") }, 10);
						if (self.mapLayer && self.mapLayer.loaded) { self.getMeasureInputValues(); }
					 }
			    });
				this.tabMeasures.startup();
				//append results tab to main tabContainer
			    this.tc.addChild(this.tabMeasures);
				
				//empty layout containers
			    this.cpExposure = new ContentPane({
					title: 'eca-top-pane',
					style: 'overflow: visible; width:100%;'
			    });
			    this.cpExposure.startup();
				
			    this.tabExposure.addChild(this.cpExposure);
				
			    //empty layout containers
			    this.cpDamages = new ContentPane({
					title: 'eca-top-pane',
					style: 'overflow: visible; width:100%;'
			    });
			    this.cpDamages.startup();
				
			    this.tabDamages.addChild(this.cpDamages);
				
				//empty layout containers
			    this.cpMeasures = new ContentPane({
					title: 'eca-top-pane',
					style: 'overflow: visible; width:100%;'
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
				
				//this.tc.selectChild(this.tabOverview);
				
				domStyle.set(this.tc, "width", "100%");
				this.createTooltips();
			}
			
			this.createExposureInputs = function(){
				this.exposureInputsPane = new TitlePane({
			    	title: 'Set Exposure Inputs',
			    	style: 'overflow:visible; margin-bottom: 10px; width: 100%;display:inline-block;',
			    	toggleable: false,
			    });
				this.cpExposure.domNode.appendChild(this.exposureInputsPane.domNode);
			    domStyle.set(this.exposureInputsPane.containerNode, {"border": "1px dotted #ccc" });

				var exposureTypeText = domConstruct.create("div", {style: 'width: 46%; display: inline-block; margin-left:35px;', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " exposure-typeInfo'></i>&nbsp;<b>Assets:</b>"});
				this.exposureInputsPane.containerNode.appendChild(exposureTypeText);

				//set display none because elevation is currently fixed to 10M (can be shown if we want to add elevation inputs back in)
				var elevationText = domConstruct.create("div", {style: 'width: 25%; display: none; margin-left:20px;', innerHTML: "<b>Elevation:</b>"});
				this.exposureInputsPane.containerNode.appendChild(elevationText);

				var geographyText = domConstruct.create("div", {style: 'width: 25%; display: inline-block; margin-left:20px;', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " exposure-geographyInfo'></i>&nbsp;<b>Geography:</b>"});
				this.exposureInputsPane.containerNode.appendChild(geographyText);

				var exposureDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(exposureDropdown.domNode, "claro");
				
				_.each(this._interface.exposure.controls.type, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){
							var exposure = this.label;
							var geography = self.comboButtonGeography.get("label");

							var marginLeft = (exposure != "Other") ?  25 : 35;
							var marginRight = (exposure != "Other" && geography == "County") ?  98 : (exposure != "Other" && geography == "Census Tract") ? 78 : (exposure == "Other" && geography == "County") ? 88 : 68;
							dojo.style(self.comboButtonExposureType.domNode, { "marginLeft": marginLeft + "px", "marginRight": marginRight + "px" });
							
							self.comboButtonExposureType.set("label", this.label);
							self.comboButtonExposureType.set("value", this.value);
							/*if (self.comboButtonElevation.get("value") == "under20") {
								self.comboButtonElevation.set("label","Under 10 (meters)");
								self.comboButtonElevation.set("value","under10");
								self.updateExposureChart();
							}
							self.comboButtonElevation.set("disabled", true);*/
							self.getExposureInputValues();
						}
					});
					exposureDropdown.addChild(menuItem);
				});

				this.comboButtonExposureType = new ComboButton({
					label: _.first(this._interface.exposure.controls.type).name,
					value: _.first(this._interface.exposure.controls.type).value,
					name: "type",
					style: "display: inline-block; margin-left: 25px; width: 100px; margin-right: 98px;",
					onChange: function(value) {
						console.log(value);
					},
					dropDown: exposureDropdown
				});

				this.exposureInputsPane.containerNode.appendChild(this.comboButtonExposureType.domNode);

				var elevationDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(elevationDropdown.domNode, "claro");
				
				_.each(this._interface.exposure.controls.elevation, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){
							self.comboButtonElevation.set("label", this.label);
							self.comboButtonElevation.set("value", this.value);
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

				this.exposureInputsPane.containerNode.appendChild(this.comboButtonElevation.domNode);

				var geographyDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(geographyDropdown.domNode, "claro");
				
				_.each(this._interface.exposure.controls.geography, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						value: value.value,
						onClick: function(){
							var exposure = self.comboButtonExposureType.get("label");
							var geography = this.label;
							var marginLeft = (exposure != "Other") ?  25 : 35;
							var marginRight = (exposure != "Other" && geography == "County") ?  98 : (exposure != "Other" && geography == "Census Tract") ? 78 : (exposure == "Other" && geography == "County") ? 88 : 68;
							dojo.style(self.comboButtonExposureType.domNode, { "marginLeft": marginLeft + "px", "marginRight": marginRight + "px" });
							
							self.comboButtonGeography.set("label", this.label);
							self.comboButtonGeography.set("value", this.value);
						
							if(geography == "County"){
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
					style: "display: inline-block; width: 110px;",
					disabled: false,
					dropDown: geographyDropdown
				});

				this.exposureInputsPane.containerNode.appendChild(this.comboButtonGeography.domNode);
				
				var clearDiv = domConstruct.create("div", {style: 'height: 15px; position: relative; clear: both'});
				this.exposureInputsPane.containerNode.appendChild(clearDiv);
				
				var dataTypeText = domConstruct.create("div", {style: 'width: 45%; display: inline-block; margin-left: 5px; float: left', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " exposure-valuesInfo'></i>&nbsp;<b>Display map values by:</b>"});
				this.exposureInputsPane.containerNode.appendChild(dataTypeText);

			    var radioButtonContainerPercent = domConstruct.create("div", {style: 'width: 27%; display: inline-block; position: relative; float: left'});
				this.exposureInputsPane.containerNode.appendChild(radioButtonContainerPercent);

				var radioButtonContainerTotal = domConstruct.create("div", {style: 'width: 24%; display: inline-block; position: relative; float: left'});
				this.exposureInputsPane.containerNode.appendChild(radioButtonContainerTotal);

			    var exposurePercentInput = domConstruct.create("input", { id:"exposurePercentRb-" + this._map.id, "type": "radio", "name": "exposureRb",  "value": "percent", "checked": true});
			    var exposurePercentLabel = domConstruct.create("label", {"for": "exposurePercentRb-" + this._map.id, innerHTML: "Percent Total", "class": "eca-labels", "style" : "float:left; margin: 1px 5px 0px 0px;"});
			    radioButtonContainerPercent.appendChild(exposurePercentInput);
			    radioButtonContainerPercent.appendChild(exposurePercentLabel);

			    this.exposurePercentRb = new RadioButton({
			    	"name": "exposureRb",
			    	"value": "percent",
			    	"checked": true,
			    	onChange: function() {
			    		if(this.get('checked')){self.getExposureInputValues()};
			    	}
			    }, "exposurePercentRb-" + this._map.id);
			    this.exposurePercentRb.startup();

			    var exposureTotalInput = domConstruct.create("input", { id:"exposureTotalRb-" + this._map.id, "type": "radio", "name": "exposureRb",  "value": "total"});
			    var exposureTotalLabel = domConstruct.create("label", {"for": "exposureTotalRb-" + this._map.id, innerHTML: "Total Value", "class": "eca-labels", "style" : "float:left; margin: 1px 5px 0px 0px;"});
			    radioButtonContainerTotal.appendChild(exposureTotalInput);
			    radioButtonContainerTotal.appendChild(exposureTotalLabel);

			    this.exposureTotalRb = new RadioButton({
			    	"name": "exposureRb",
			    	"value": "total",
			    	"checked": false,
			    	onChange: function() {
			    		if(this.get('checked')){self.getExposureInputValues()};
			    	}
			    }, "exposureTotalRb-" + this._map.id);
			    this.exposureTotalRb.startup();

			    var clearDiv = domConstruct.create("div", {style: 'height: 8px; position: relative; clear: both'});
				this.exposureInputsPane.containerNode.appendChild(clearDiv);
			}

			this.createDamagesInputs = function(){
				this.damageInputsPane = new TitlePane({
			    	title: 'Set Damages Inputs',
			    	style: 'overflow:visible; margin-bottom: 10px; width: 100%',
			    	toggleable: false,
			    });

			    this.cpDamages.domNode.appendChild(this.damageInputsPane.domNode);
			    domStyle.set(this.damageInputsPane.containerNode, {"border": "1px dotted #ccc" });

				//dropdown labels
				var damageTypeContainer = domConstruct.create("div", {style: 'width: 39%; display: inline-block; margin-left:0px;', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " damages-typeInfo'></i>&nbsp;<b>Hazard:</b>"});
				this.damageInputsPane.containerNode.appendChild(damageTypeContainer);

				var growthContainer = domConstruct.create("div", {style: 'width: 30%; display: inline-block;', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " damages-growthInfo'></i>&nbsp;<b>Economic:</b>"});
				this.damageInputsPane.containerNode.appendChild(growthContainer);

				var defenseContainer = domConstruct.create("div", {style: 'width: 23%; display: inline-block; float: right', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " damages-defenseInfo'></i>&nbsp;<b>Defense:</b>"});
				this.damageInputsPane.containerNode.appendChild(defenseContainer);

				//damage type dropdown
				var typeDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(typeDropdown.domNode, "claro");
				
				_.each(this._interface.damages.controls.type, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						onClick: function(){
							self.comboButtonType.set("label", this.label);
							self.getDamageInputValues();
						}
					});
					typeDropdown.addChild(menuItem);
				});

				this.comboButtonType = new ComboButton({
					label: _.first(this._interface.damages.controls.type).name,
					name: "type",
					style: "width: 68px; display: inline-block; margin-left: 5px;",
					dropDown: typeDropdown
				});
				this.damageInputsPane.containerNode.appendChild(this.comboButtonType.domNode);				

				
				//growth scenario dropdown
				var growthDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(growthDropdown.domNode, "claro");
				
				_.each(this._interface.damages.controls.growth, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						onClick: function(){
							self.comboButtonEconomy.set("label", this.label);
							self.comboButtonEconomyMeasures.set("label", this.label);
							self.getDamageInputValues();
						}
					});
					growthDropdown.addChild(menuItem);
				});

				this.comboButtonEconomy = new ComboButton({
					label: _.first(this._interface.damages.controls.growth).name,
					name: "growth",
					style: "width: 60px; display: inline-block; margin-left:78px;",
					dropDown: growthDropdown
				});
			
				this.damageInputsPane.containerNode.appendChild(this.comboButtonEconomy.domNode);


				//defense scenario dropdown
				var defenseDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(defenseDropdown.domNode, "claro");
				
				_.each(this._interface.damages.controls.defense, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						onClick: function(){
							self.comboButtonDefense.set("label", this.label);
							self.comboButtonDefenseMeasures.set("label", this.label);
							self.getDamageInputValues();
						}
					});
					defenseDropdown.addChild(menuItem);
				});

				this.comboButtonDefense = new ComboButton({
					label: _.first(this._interface.damages.controls.defense).name,
					name: "defense",
					style: "width: 65px; display: inline-block; margin-left: 65px;",
					dropDown: defenseDropdown
				});
			
				this.damageInputsPane.containerNode.appendChild(this.comboButtonDefense.domNode);

				//climate year slider
			    var climateYearSliderLabel = domConstruct.create("div", {innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " damages-climateInfo'></i>&nbsp;<b>Reference Year: </b>", style:"position:relative; width: 120px; top:-7px; margin-top:25px; display: inline-block"});
				this.damageInputsPane.containerNode.appendChild(climateYearSliderLabel);
				this.climateYearSliderDamages = new HorizontalSlider({
			        name: "climateYearSlider",
			        value: 2030,
			        minimum: 2030,
			        maximum: 2050,
			        discreteValues: 2,
			        showButtons: false,
			        style: "width: 230px; display: inline-block",
			        onChange: function(value){
			           self.climateYearSliderMeasures.set("value", value);
			           if(self.tc.selectedChildWidget.id == ("tabDamages-" + self._map.id)) {
			           		self.getDamageInputValues();
			           }
			        }
			    });
			    this.damageInputsPane.containerNode.appendChild(this.climateYearSliderDamages.domNode);

			    var climateYearSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 3,
			    	labels: ['2030', '2050'],
			    	style: "margin-top: 5px;"
			    });
			    this.climateYearSliderDamages.addChild(climateYearSliderLabels);


				var clearDiv = domConstruct.create("div", {style: 'height: 25px; position: relative; clear: both'});
				this.damageInputsPane.containerNode.appendChild(clearDiv);
				
				var dataTypeText = domConstruct.create("div", {style: 'width: 44%; display: inline-block; margin-left: 0px; float: left', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " damages-valuesInfo'></i>&nbsp;<b>Display map values by:</b>"});
				this.damageInputsPane.containerNode.appendChild(dataTypeText);

			    var radioButtonContainerPercent = domConstruct.create("div", {style: 'width: 32%; display: inline-block; position: relative; float: left'});
				this.damageInputsPane.containerNode.appendChild(radioButtonContainerPercent);

				var radioButtonContainerTotal = domConstruct.create("div", {style: 'width: 23%; display: inline-block; position: relative; float: left'});
				this.damageInputsPane.containerNode.appendChild(radioButtonContainerTotal);

			    var damagesPercentInput = domConstruct.create("input", { id:"damagesPercentRb-" + this._map.id, "type": "radio", "name": "damagesRb",  "value": "percent", "checked": true});
			    var damagesPercentLabel = domConstruct.create("label", {"for": "damagesPercentRb-" + this._map.id, innerHTML: "Percent Change", "class": "eca-labels", "style" : "float:left; margin: 1px 5px 0px 0px;"});
			    radioButtonContainerPercent.appendChild(damagesPercentInput);
			    radioButtonContainerPercent.appendChild(damagesPercentLabel);

			    this.damagesPercentRb = new RadioButton({
			    	"name": "damagesRb",
			    	"value": "percent",
			    	"checked": true,
			    	onChange: function() {
			    		if(this.get('checked')){self.getDamageInputValues()};
			    	}
			    }, "damagesPercentRb-" + this._map.id);
			    this.damagesPercentRb.startup();

			    var damagesTotalInput = domConstruct.create("input", { id:"damagesTotalRb-" + this._map.id, "type": "radio", "name": "damagesRb",  "value": "total"});
			    var damagesTotalLabel = domConstruct.create("label", {"for": "damagesTotalRb-" + this._map.id, innerHTML: "Total Value", "class": "eca-labels", "style" : "float:left; margin: 1px 5px 0px 0px;"});
			    radioButtonContainerTotal.appendChild(damagesTotalInput);
			    radioButtonContainerTotal.appendChild(damagesTotalLabel);

			    this.damagesTotalRb = new RadioButton({
			    	"name": "damagesRb",
			    	"value": "total",
			    	"checked": false,
			    	onChange: function() {
			    		if(this.get('checked')){self.getDamageInputValues()};
			    	}
			    }, "damagesTotalRb-" + this._map.id);
			    this.damagesTotalRb.startup();

			    var clearDiv = domConstruct.create("div", {style: 'height: 10px; position: relative; clear: both'});
				this.damageInputsPane.containerNode.appendChild(clearDiv);

				//chart data toggle

			}
			
			this.createMeasuresInputs = function(){
				this.measureInputsPane = new TitlePane({
			    	title: 'Set Measures',
			    	style: 'overflow:visible; margin-bottom: 10px; width: 100%;',
			    	toggleable: false,
			    });
				this.cpMeasures.domNode.appendChild(this.measureInputsPane.domNode);
			    domStyle.set(this.measureInputsPane.containerNode, {"border": "1px dotted #ccc" });

			    //dropdown labels
				var measureTypeContainer = domConstruct.create("div", {style: 'width: 38%; display: inline-block; margin-left:0px;', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " measures-typeInfo'></i>&nbsp;<b>Model Form:</b>"});
				this.measureInputsPane.containerNode.appendChild(measureTypeContainer);

				var growthContainer = domConstruct.create("div", {style: 'width: 34%; display: inline-block;', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " measures-growthInfo'></i>&nbsp;<b>Economic:</b>"});
				this.measureInputsPane.containerNode.appendChild(growthContainer);

				var defenseContainer = domConstruct.create("div", {style: 'width: 24%; display: inline-block; float: right', innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " measures-defenseInfo'></i>&nbsp;<b>Defense:</b>"});
				this.measureInputsPane.containerNode.appendChild(defenseContainer);

				//measure type dropdown
				var typeDropdown = new DropDownMenu({ style: "display: none;" });
				domClass.add(typeDropdown.domNode, "claro");
				
				_.each(this._interface.measures.controls.type, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						onClick: function(){
							self.comboButtonTypeMeasures.set("label", this.label);
							self.getMeasureInputValues();
						}
					});
					typeDropdown.addChild(menuItem);
				});

				this.comboButtonTypeMeasures = new ComboButton({
					label: _.first(this._interface.measures.controls.type).name,
					name: "type",
					style: "width: 75px; display: inline-block; margin-left: 15px;",
					dropDown: typeDropdown
				});

				this.measureInputsPane.containerNode.appendChild(this.comboButtonTypeMeasures.domNode);				

				
				//growth scenario dropdown
				var growthDropdown = new DropDownMenu({ style: "display: none;" });
				domClass.add(growthDropdown.domNode, "claro");
				
				_.each(this._interface.measures.controls.growth, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						onClick: function(){
							self.comboButtonEconomyMeasures.set("label", this.label);
							self.comboButtonEconomy.set("label", this.label);
							self.getMeasureInputValues();
						}
					});
					growthDropdown.addChild(menuItem);
				});

				this.comboButtonEconomyMeasures = new ComboButton({
					label: _.first(this._interface.measures.controls.growth).name,
					name: "growth",
					style: "width: 60px; display: inline-block; margin-left: 62px;",
					dropDown: growthDropdown
				});
			
				this.measureInputsPane.containerNode.appendChild(this.comboButtonEconomyMeasures.domNode);
				//this.cpMeasures.addChild(growthDropdown);


				//defense scenario dropdown
				var defenseDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(defenseDropdown.domNode, "claro");
				
				_.each(this._interface.measures.controls.defense, function(value, key){
					var menuItem = new MenuItem({
						label: value.name,
						onClick: function(){
							self.comboButtonDefenseMeasures.set("label", this.label);
							self.comboButtonDefense.set("label", this.label);
							self.getMeasureInputValues();
						}
					});
					defenseDropdown.addChild(menuItem);
				});

				this.comboButtonDefenseMeasures = new ComboButton({
					label: _.first(this._interface.measures.controls.defense).name,
					name: "defense",
					style: "width: 65px; display: inline-block; margin-left: 62px;",
					dropDown: defenseDropdown
				});
			
				this.measureInputsPane.containerNode.appendChild(this.comboButtonDefenseMeasures.domNode);
				//this.cpMeasures.addChild(defenseDropdown);

			    //climate year slider
			    var climateYearSliderLabel = domConstruct.create("div", {innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " measures-climateInfo'></i>&nbsp;<b>Reference Year:</b>", style:"position:relative; width: 120px; top:-7px; margin-top:25px; display: inline-block"});
				this.measureInputsPane.containerNode.appendChild(climateYearSliderLabel);
				this.climateYearSliderMeasures = new HorizontalSlider({
			        name: "climateYearSlider",
			        value: 2030,
			        minimum: 2030,
			        maximum: 2050,
			        discreteValues: 2,
			        showButtons: false,
			        style: "width: 230px; display: inline-block",
			        onChange: function(value){
			           self.climateYearSliderDamages.set("value", value);
			           if(self.tc.selectedChildWidget.id == ("tabMeasures-" + self._map.id)) {
				           	self.getMeasureInputValues();
				       }
			        }
			    });
			    this.measureInputsPane.containerNode.appendChild(this.climateYearSliderMeasures.domNode);

			    var climateYearSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 3,
			    	labels: ['2030', '2050'],
			    	style: "margin-top: 5px;"
			    });
			    this.climateYearSliderMeasures.addChild(climateYearSliderLabels);

			    var clearDiv = domConstruct.create("div", {style: 'height: 15px; position: relative; clear: both'});
				this.measureInputsPane.containerNode.appendChild(clearDiv);

			}

			this.createExposureChart = function(){
				var margin = {top: 20, right: 0, bottom: 40, left: 35}
				var width = 320;
				var height = 243;
				var padding = 0.25;
				
				this.parameters.exposureChart = { height: height, width: width, margin: margin }
				
				this.exposureChartPane = new TitlePane({
			    	title: 'Distribution of Assets by Elevation',
			    	style: 'overflow:visible; position: relative;',
			    	toggleable: false,
			    });

				this.cpExposure.domNode.appendChild(this.exposureChartPane.domNode);
				domStyle.set(this.exposureChartPane.containerNode, {"position": "relative", "border": "1px dotted #ccc", "padding-bottom": "10px", "padding-top": "20px"});
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
						.attr("y", 0 - margin.left)
						.attr("dy", ".7em")
						.style("text-anchor", "middle")
						.text("Asset Value (1e9 $US)")
						.on("mouseover", function(d) {
							var parent = _.last(query(".y.axis.e").parents(".dijitTitlePane")).id
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
							self.comboButtonExposureType.set("label", d.name);
							self.comboButtonExposureType.set("value", d.name.toLowerCase());
							self.getExposureInputValues();
						});
						

					var legend = self.exposureChart.selectAll(".legend")
						.data(color.domain().slice().reverse())
						.enter().append("g")
						.attr("class", "legend")
						.attr("transform", function(d, i) { return "translate(0," + ((i * 20) - 20) + ")"; });

					legend.append("rect")
						.attr("x", width - 18)
						.attr("width", 18)
						.attr("height", 18)
						.style("fill", color)
						.style("stroke", "#bbbbbb")
						.attr("cursor", "pointer")
						.on("click", function(d) {
							self.comboButtonExposureType.set("label", d);
							self.comboButtonExposureType.set("value", d.toLowerCase());
							self.getExposureInputValues();						
						});

					legend.append("text")
						.attr("x", width - 24)
						.attr("y", 9)
						.attr("dy", ".35em")
						.style("text-anchor", "end")
						.text(function(d) { return d; });

				})

				/* this.exposureChartYaxisTitle = domConstruct.create("div", {innerHTML: "1e9(US$)", style:"width: 40px; font-size:10px; position: absolute; top: 15px; left:20px;"});
				this.exposureChartPane.containerNode.appendChild(this.exposureChartYaxisTitle); */
			}

			this.createDamagesChart = function(){
				var margin = {top: 15, right: 0, bottom: 30, left: 40}
				var width = 310;
				var height = 160;
				var padding = 0.45;
				
				this.parameters.damagesChart = { height: height, width: width, margin: margin }
				
				this.damagesChartPane = new TitlePane({
			    	id: "damagesChartPane-" + this._map.id,
					title: 'Risk Profile',
			    	style: 'overflow:visible; position: relative;',
			    	toggleable: false,
			    });

				this.cpDamages.domNode.appendChild(this.damagesChartPane.domNode);
				domStyle.set(this.damagesChartPane.containerNode, {"position": "relative", "border": "1px dotted #ccc", "padding-bottom": "20px", "padding-top": "20px"});
				this.damagesChartNode = domConstruct.create("div", { "style": "height:" + (height + 40) + "px;", "class": "damagesChartNode-" + this._map.id });
				this.damagesChartPane.containerNode.appendChild(this.damagesChartNode);
				
				this.damagesChartNote = domConstruct.create("div", { style: "position:absolute; text-align:center; font-size:11px; width:100%; top:5px; left:0px; color: #666666;", innerHTML: "hover over any chart element for more information" });
				this.damagesChartNode.appendChild(this.damagesChartNote);
				
				var maxY = 0;
				for (var i in this._data.damages.flood.chartData["Tr10"]) {
					var max = d3.max(this._data.damages.flood.chartData["Tr10"][i], function(d) { return d.value; });
					if (max > maxY) { maxY = max }
				}
				
				var data = this.processDamagesChartData(this._data.damages.flood.chartData["Tr10"]["low-none-2010-2010"]);
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
						if (i == 0) {
							return "2010"; 
						} else if (i == 3) {
							return "2030";
						} else {
							return d;
						}
					});

				this.damagesChart.append("g")
					.attr("class", "y axis d")
					.call(yAxis)
					.append("text")
					.attr("transform", "rotate(-90)")
					.attr("x", 0 - (height/2))
					.attr("y", 0 - margin.left)
					.attr("dy", ".7em")
					.style("text-anchor", "middle")
					.text("Damage Amount (1e9 $US)")
					.on("mouseover", function(d) {
						var parent = _.last(query(".y.axis.d").parents(".dijitTitlePane")).id
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
					.on("mouseover", function(d) {
						var parent = _.last(query(".bar." + d.class).parents(".dijitTitlePane")).id
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

				/* this.damagesChartYaxisTitle = domConstruct.create("div", {innerHTML: "1e9(US$)", style:"width: 20px; font-size:10px; position: absolute; top: 10px; left:20px;"});
				this.damagesChartPane.containerNode.appendChild(this.damagesChartYaxisTitle); */
				
				
				var returnPeriodSliderLabel = domConstruct.create("div", {innerHTML: "<i class='fa fa-info-circle eca-" + this._map.id + " damages-protectionInfo'></i>&nbsp;<b>Standard of Protection (yr) :</b>", style:"position:relative; width:180px; top:-7px; margin-top:10px; margin-left:0px; display:inline-block;"});
				this.damagesChartPane.containerNode.appendChild(returnPeriodSliderLabel);
				this.returnPeriodSlider = new HorizontalSlider({
			        name: "returnPeriodSlider",
			        value: 1,
			        minimum: 1,
			        maximum: this._interface.damages.controls.protection.discreteValues,
			        discreteValues: this._interface.damages.controls.protection.discreteValues,
			        showButtons: false,
			        style: "width:175px;display: inline-block;",
			        onChange: function(value){
					   self.getDamageInputValues();
			        }
			    });
			    this.damagesChartPane.containerNode.appendChild(this.returnPeriodSlider.domNode);

			    var returnPeriodSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 5,
			    	labels: ['10', '50', '100', '250', '500'],
			    	style: "margin-top: 5px;"
			    });
			    this.returnPeriodSlider.addChild(returnPeriodSliderLabels);
				//query("#damagesChartPane-"  + this._map.id + " .dijitRuleLabel").style("fontSize", "12px");
				
				/* var spacerDiv = domConstruct.create("div", {style: 'height: 1px; position: relative;'});
				this.damagesChartPane.containerNode.appendChild(spacerDiv); */
				
			}
		
			this.createMeasuresChart = function(){
				var margin = {top: 10, right: 20, bottom: 40, left: 35}
				var width = 310;
				var height = 230;
				var padding = 0.25;
				var tooltip = {width: 100, height: 50}
				
				this.parameters.measuresChart = { height: height, width: width, margin: margin }
				
				this.measuresChartPane = new TitlePane({
			    	title: 'Cost Curve of Adapation Measures',
			    	style: 'overflow:visible; position: relative;',
			    	toggleable: false,
			    });
				
				this.cpMeasures.domNode.appendChild(this.measuresChartPane.domNode);
				domStyle.set(this.measuresChartPane.containerNode, {"position": "relative", "border": "1px dotted #ccc", "padding-bottom": "10px", "padding-top": "20px"});
				this.measuresChartNode = domConstruct.create("div", { "style": "height:" + (height + 35) + "px;", "id": "measuresChartNode-" + this._map.id, "class": "measuresChartNode-" + this._map.id });
				this.measuresChartPane.containerNode.appendChild(this.measuresChartNode);
				
				this.measuresChartTip = domConstruct.create("div", { "class": "measuresChartTooltip" });
				this.measuresChartNode.appendChild(this.measuresChartTip);
				
				this.measuresChartNote = domConstruct.create("div", { style: "position:absolute; text-align:center; font-size:11px; width:100%; top:5px; left:0px; color: #666666;", innerHTML: "hover over any chart element for more information" });
				this.measuresChartNode.appendChild(this.measuresChartNote);
				
				var data = this.processMeasuresChartData(this._data.measures.chartData["default-low-none-2030"]);
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
				this.measuresChartY.domain([0, (yMax >= yRoundMax) ? yRoundMax + 10 : yRoundMax]);

				this.measuresChart.append("g")
					.attr("class", "x axis cb")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					
				this.measuresChart.append("text")
					.attr("class", "x-axis-title")
					.attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom -10)+ ")")
					.attr("cursor", "pointer")
					.style("text-anchor", "middle")
					.text("Averted Damages over 21 yrs ($US 1e10)")
					.on("mouseover", function(d) {
						var parent = _.last(query(".y.axis.cb").parents(".dijitTitlePane")).id
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
					.attr("y", 0 - margin.left)
					.attr("dy", ".7em")
					.attr("cursor", "pointer")
					.style("text-anchor", "middle")
					.text("Benefit/Cost Ratio ($US/$US)")
					.on("mouseover", function(d) {
						var parent = _.last(query(".y.axis.cb").parents(".dijitTitlePane")).id
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
					.attr("class", function(d) { return "bar cb " + d.class })
					.attr("transform", function(d) { return "translate(" + self.measuresChartX(d.xStart) + ",0)"; });

				bar.append("rect")
					.attr("name", function (d) { return d.type; })
					.attr("width", function (d) { return self.measuresChartX(d.benefit); })
					.attr("y", function (d) { return self.measuresChartY(d.costbenefit); })
					.attr("height", function (d) { return height - self.measuresChartY(d.costbenefit); })
					.on("click", function(d,i) {
						//var visibleLayers = [self._data['measures']['layers'][d.class]['layerIndex'], self._data['measures']['layers']['counties']['layerIndex']];
						var visibleLayers = [self._data['measures']['layers'][d.class]['layerIndex']];
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
						
						var parent = _.last(query(".bar." + d.class).parents(".dijitTitlePane")).id
						var message = self._interface["measures"]["messages"]["graph-bar"];
						
						var ratio = d3.round(d.costbenefit, 2);
						var damage = self.formatter(d.benefit, 1000000000) + " billion";
						var year = self.climateYearSliderDamages.get("value");
						
						self.showMessageDialog(parent, d.type, message.value,  { "CBRATIO": ratio, "CBDAMAGE": damage, "FUTUREYEAR": year } );
						
						var visibleLayers = [self._data['measures']['layers'][d.class]['layerIndex']];
						self.updateLayer(visibleLayers);
					})
					.on('mouseout', function(d,i) {
						//domStyle.set(self.measuresChartTip, {"display": "none"});
						self.hideMessageDialog();
						
						var checkboxes = query("[name=measuresCheckbox-" + self._map.id + "]");
						var visibleLayers = [];
						dojo.forEach(checkboxes, function(checkbox) {
							var widget = registry.byId(checkbox.id);
							if (widget.get("checked")) {
								visibleLayers.push(self._data['measures']['layers'][widget.get("value")]['layerIndex']);
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
						var parent = _.last(query(".line-cb").parents(".dijitTitlePane")).id
						var message = self._interface["measures"]["tooltips"]["line"];
						self.showMessageDialog(parent, message.label, message.value);
						window.setTimeout(function(){ self.hideMessageDialog(); }, 4000);
					})
					.on("mouseout", function(d) {
						//self.hideMessageDialog();
					});
					
					var legendData = [];
					for (var layer in self._data["measures"]["layers"]) {
						var item = self._data["measures"]["layers"][layer];
						if (item.legendOrder >= 0) {
							legendData.push( { "name": item.name, "class": item.class, "order": item.legendOrder } );
						}
					}
					legendData.sort(function(a,b) { return a.legendOrder - b.legendOrder});
					var legend = self.measuresChart.selectAll(".legend")
						.data(legendData)
						.enter().append("g")
						.attr("class", function(d) { return "legend " + d.class; })
						.attr("transform", function(d, i) { 
							var y = 20 + ((i * 20) - 20);
							
							var checkBoxDiv = domConstruct.create("div", {id: d.class + "Checkbox-" + self._map.id, style: 'position: absolute; right: 0px; top: 0px;'});
							self.measuresChartPane.containerNode.appendChild(checkBoxDiv);
							var checkBox = new CheckBox({
								name: "measuresCheckbox-" + self._map.id,
								value: d.class,
								checked: false,
								style: 'position: absolute; right: 6px; top: ' + (y + 31) + 'px;',
								onChange: function(b){
									var checkboxes = query("[name=measuresCheckbox-" + self._map.id + "]");
									var visibleLayers = [];
									dojo.forEach(checkboxes, function(checkbox) {
										var widget = registry.byId(checkbox.id);
										if (widget.get("checked")) {
											visibleLayers.push(self._data['measures']['layers'][widget.get("value")]['layerIndex']);
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
						}).on("mouseover", function(d) {
							var parent = _.last(query(".legend." + d.class).parents(".dijitTitlePane")).id
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
						.style("text-anchor", "end")
						.text(function(d) { return d.name; }); 
				
				var clearDiv = domConstruct.create("div", {style: 'height: 10px; position: relative; clear: both'});
				this.measuresChartPane.containerNode.appendChild(clearDiv);
			}

			this.getExposureInputValues = function(){
				var exposureType = this.comboButtonExposureType.get('value');
				var elevation = this.comboButtonElevation.get('value');
				var geography = this.comboButtonGeography.get('value');
				var dataToggle = (this.exposureTotalRb.get("checked")) ? this.exposureTotalRb.get("value") : this.exposurePercentRb.get("value");
				var inputString = geography + '-' + exposureType + '-' + elevation;
				var visibleLayers = [];
				visibleLayers = [this._data['exposure'][inputString][dataToggle]['layerIndex']];
					
				//this.updateExposureChart(chartDataShow);
				this.updateLayer(visibleLayers);
			}
			
			this.getDamageInputValues = function(){
				var type = this.comboButtonType.get("label").toLowerCase();
				var growth = this.comboButtonEconomy.get("label");
				var defense = this.comboButtonDefense.get("label");
				
				//climate and asset are the same now
				var asset = this.climateYearSliderDamages.get("value");
				var climate = this.climateYearSliderDamages.get("value");
				var dataToggle = (this.damagesTotalRb.get("checked")) ? this.damagesTotalRb.get("value") : this.damagesPercentRb.get("value");
				var period = this._interface.damages.controls.protection.returnPeriod[this.returnPeriodSlider.get("value")];
				
				var visibleLayers = [];
				if(type == 'wind'){
					this.comboButtonDefense.set('label', 'None');
					this.comboButtonDefense.set('disabled', true);
				} else {
					this.comboButtonDefense.set('disabled', false);
				}
				
				var inputString = growth + "-" + ((type == 'flood') ? defense + "-" : "") + asset + "-" + climate;
				inputString = inputString.toLowerCase();
				
				if (_.has(this._data['damages'][type], inputString)) {
					visibleLayers = [this._data['damages'][type][inputString][dataToggle]['layerIndex']];
					this.updateLayer(visibleLayers);
				}
				
				var chartData = this._data['damages'][type]['chartData'][period][inputString];
				this.updateDamagesChart(chartData);
			}

			this.getMeasureInputValues = function(){
				var type = this.comboButtonTypeMeasures.get("label").toLowerCase();
				var growth = this.comboButtonEconomyMeasures.get("label");
				var defense = this.comboButtonDefenseMeasures.get("label");
				var climate = this.climateYearSliderMeasures.get("value");
				
				var inputString = type + "-" + growth + "-" + defense + "-" + climate;
				inputString = inputString.toLowerCase();
					
				this.updateMeasuresChart(this._data.measures.chartData[inputString]);
				
				var checkboxes = query("[name=measuresCheckbox-" + this._map.id + "]");
				var visibleLayers = [];
				dojo.forEach(checkboxes, function(checkbox) {
					var widget = registry.byId(checkbox.id);
					if (widget.get("checked")) {
						visibleLayers.push(self._data['measures']['layers'][widget.get("value")]['layerIndex']);
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
						if (i == 0) {
							return "2010"; 
						} else if (i == 3) {
							return year;
						} else {
							return d;
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
				this.measuresChartY.domain([0, (yMax >= yRoundMax) ? yRoundMax + 10 : yRoundMax]);
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
							break;
						case "Economic":
							var className = "economic";
							break;
						case "Climate":
							var className = "climate";
							break;
						case "Total":
							var className = "total";
							break;
					}
					d.class = className;
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
				query(".fa-info-circle.eca-" + this._map.id).style({
					"color":"#5C8BAA",
					"margin-right": "1px",
					"cursor":"pointer"
				});
				
				on(query("i.fa-info-circle.eca-" + this._map.id), "mouseover", function() {
					var cssClass = _.last(domAttr.get(this, "class").split(" "));
					var tab = _.first(cssClass.split("-"));
					var control = _.last(cssClass.split("-"));
					var message = self._interface[tab]['tooltips'][control];
					var parent = _.last(query("." + cssClass).parents(".dijitTitlePane")).id;
					self.showMessageDialog(parent, message.label, message.value);
				});
				
				on(query("i.fa-info-circle.eca-" + this._map.id), "mouseout", function() {
					self.hideMessageDialog();
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
                    query(".pluginEca-info-box").style( {
                    	"top": position.top + "px",
                    	"left": position.left + "px"
                    });
                    $(".pluginEca-info-box").show();
                }
            }

            this.hideMessageDialog = function() {
        		if (this._$pluginDialog) {
            		$(".pluginEca-info-box").hide();
            	}
            }

            this.updateMessageDialog = function(label, value, replaceObject) {
                if (this._$pluginDialog) {
                	if (replaceObject) {
						for(var text in replaceObject){
							value = value.replace(text, replaceObject[text]);
						}
					}
                	_.first(query(".pluginEca-info-box > div.body > div.description > div.info-label")).innerHTML = label;
					_.first(query(".pluginEca-info-box > div.body > div.description > div.info-value")).innerHTML = value;
					
                }
            }


		};// End ecaTool

		
		return ecaTool;	
		
	} //end anonymous function

); //End define