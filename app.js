//Module CoastalDefense.js

define([
	    "dojo/_base/declare",
		"d3",
		"use!underscore", 	
	    "dojo/json", 
		"use!tv4", 
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
		"dojo/_base/window",
		"dojo/dom-construct",
		"dojo/dom-geometry",
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
		"esri/layers/ArcGISDynamicMapServiceLayer"
		], 


	function (declare,
			d3,
			_, 
			//Ext,
			JSON, 
			tv4, 
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
			win,
			domConstruct,
			domGeom,
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
			DynamicMapServiceLayer
		  ) 
		
		{

		var ecaTool = function(plugin, appData){
			this._map = plugin.map;
			this._app = plugin.app;
			this._container = plugin.container;
			
			var self = this;
			this.parameters = {};
			this.pluginDirectory = plugin.pluginDirectory;
			this.utilities = {};
			this.parameters.windowOpen = false;
			
			this.initialize = function(){
				this._appData = JSON.parse(appData);
				this.parameters.layersLoaded = false;
				this.loadInterface(this);
				
			}

			this.showTool = function(){
				this.initializeMap();
				on(this.mapLayer, 'load', function(){ self.getDamageInputValues();});

			} //end this.showTool

			this.hideTool = function(){
				this._map.removeLayer(this.mapLayer);
			} //end this.hideTool
			
			this.showIntro = function(){
				var self = this; 
					
			}; //end showIntro

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

				/*
				this.tabHelp = new ContentPane({
			         title: "Overview",
					 style: "position:relative;width:100%;height:515px;overflow:hidden;",
					 isLayoutContainer: true,
					 onShow: function() {
						popup.close(self.chooseRegionButtonTooltip);
						popup.close(self.chooseProfileButtonTooltip);
						popup.close(self.chooseHabitatButtonTooltip);
					 }
			    });
				this.tabHelp.startup();
				//append help tab to main tabContainer
			    this.tc.addChild(this.tabHelp);
				
				this.cpOverview = new ContentPane({
					style: "position:relative; width:100%; height:100%;overflow:hidden;",
					content: ""
					//content: self._interface.overview
			    });
			    this.cpOverview.startup();
			    this.tabHelp.addChild(this.cpOverview);
				//request the overview.html template and populate the pane's content
				this.cpOverview.set("href", self.pluginDirectory + "/overview.html");
				 */
				
				//THE EXPOSURE PANEL
			    this.tabExposure = new ContentPane({
			         title: "Exposure",
					 style: "position:relative;width:100%;height:570px;overflow:hidden;",
			         isLayoutContainer: true,
					 onShow: function() {
						//self.resizeProfileChart();
						//placeholder function, performs a couple checks in CD
					 }
			    });
			    this.tabExposure.startup();
				//add inputs tab to main tabContainer
			    this.tc.addChild(this.tabExposure);
				
				//THE DAMAGES PANEL
			    this.tabDamages = new ContentPane({
			         title: "Damages",
					 style: "position:relative;width:100%;height:570px;overflow:auto;",
					 isLayoutContainer: true,
					 onShow: function() {
						window.setTimeout(function(){ domStyle.set(self.cpDamages.domNode, "width", "100%") }, 10);
					 }
			    });
				this.tabDamages.startup();
				//append results tab to main tabContainer
			    this.tc.addChild(this.tabDamages);

			    //THE MEASURES PANEL
			    this.tabMeasures = new ContentPane({
			         title: "Measures",
					 style: "position:relative;width:100%;height:570px;overflow:hidden;",
					 isLayoutContainer: true,
					 onShow: function() {
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
				
				this.tc.selectChild(this.tabDamages);
				
				domStyle.set(this.tc, "width", "100%");
			}
			
			this.createExposureInputs = function(){
				this.exposureInputsPane = new TitlePane({
			    	title: 'Set Exposure Inputs',
			    	style: 'overflow:visible; margin-bottom: 10px; width: 100%;display:inline-block;',
			    	toggleable: false,
			    });
				this.cpExposure.domNode.appendChild(this.exposureInputsPane.domNode);
			    domStyle.set(this.exposureInputsPane.containerNode, {"border": "1px dotted #ccc" });

			    var dataTypeText = domConstruct.create("div", {style: 'width: 35%; display: inline-block; margin-left:10px; float: left', innerHTML: "<b>Data to Display:</b>"});
				this.exposureInputsPane.containerNode.appendChild(dataTypeText);

			    var radioButtonContainerPercent = domConstruct.create("div", {style: 'width: 30%; display: inline-block; position: relative; float: left'});
				this.exposureInputsPane.containerNode.appendChild(radioButtonContainerPercent);

				var radioButtonContainerTotal = domConstruct.create("div", {style: 'width: 30%; display: inline-block; position: relative; float: left'});
				this.exposureInputsPane.containerNode.appendChild(radioButtonContainerTotal);

			    var exposurePercentInput = domConstruct.create("input", { id:"exposurePercentRb-" + this._map.id, "type": "radio", "name": "exposureRb",  "value": "percent", "checked": true});
			    var exposurePercentLabel = domConstruct.create("label", {"for": "exposurePercentRb-" + this._map.id, innerHTML: "Percent", "style" : "float:left; margin: 1px 5px 0px 0px;"});
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
			    var exposureTotalLabel = domConstruct.create("label", {"for": "exposureTotalRb-" + this._map.id, innerHTML: "Total", "style" : "float:left; margin: 1px 5px 0px 0px;"});
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

			    var clearDiv = domConstruct.create("div", {style: 'height: 15px; position: relative; clear: both'});
				this.exposureInputsPane.containerNode.appendChild(clearDiv);


				var exposureTypeText = domConstruct.create("div", {style: 'width: 55%; display: inline-block; margin-left:15px;', innerHTML: "<b>Exposure Type:</b>"});
				this.exposureInputsPane.containerNode.appendChild(exposureTypeText);

				var elevationText = domConstruct.create("div", {style: 'width: 25%; display: inline-block; margin-left:15px;', innerHTML: "<b>Elevation:</b>"});
				this.exposureInputsPane.containerNode.appendChild(elevationText);

				var exposureDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(exposureDropdown.domNode, "claro");
				
				var exposureDropdownItem1 = new MenuItem({
					label: 'Population',
					onClick: function(){
						self.comboButtonExposureType.set("label", this.label);
						self.getExposureInputValues();
						self.comboButtonElevation.set("disabled", false);
					}
				});

				var exposureDropdownItem2 = new MenuItem({
					label: 'Assets - Residential',
					onClick: function(){
						self.comboButtonExposureType.set("label", this.label);
						self.getExposureInputValues();
						self.comboButtonElevation.set("label","Under 10 (meters)");
						self.comboButtonElevation.set("value","under10");
						self.comboButtonElevation.set("disabled", true);
					}
				});

				var exposureDropdownItem3 = new MenuItem({
					label: 'Assets - Commercial',
					onClick: function(){
						self.comboButtonExposureType.set("label", this.label);
						self.getExposureInputValues();
						self.comboButtonElevation.set("label","Under 10 (meters)");
						self.comboButtonElevation.set("value","under10");
						self.comboButtonElevation.set("disabled", true);
					}
				});

				var exposureDropdownItem4 = new MenuItem({
					label: 'Assets - Industrial',
					onClick: function(){
						self.comboButtonExposureType.set("label", this.label);
						self.getExposureInputValues();
						self.comboButtonElevation.set("label","Under 10 (meters)");
						self.comboButtonElevation.set("value","under10");
						self.comboButtonElevation.set("disabled", true);
					}
				});

				var exposureDropdownItem5 = new MenuItem({
					label: 'Assets - Other',
					onClick: function(){
						self.comboButtonExposureType.set("label", this.label);
						self.getExposureInputValues();
						self.comboButtonElevation.set("label","Under 10 (meters)");
						self.comboButtonElevation.set("value","under10");
						self.comboButtonElevation.set("disabled", true);
					}
				});

				exposureDropdown.addChild(exposureDropdownItem1);
				exposureDropdown.addChild(exposureDropdownItem2);
				exposureDropdown.addChild(exposureDropdownItem3);
				exposureDropdown.addChild(exposureDropdownItem4);
				exposureDropdown.addChild(exposureDropdownItem5);

				this.comboButtonExposureType = new ComboButton({
					label: "Population",
					name: "growth",
					style: "width: 50%; display: inline-block; margin-left: 10px;",
					dropDown: exposureDropdown
				});

				this.exposureInputsPane.containerNode.appendChild(this.comboButtonExposureType.domNode);

				var elevationDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(elevationDropdown.domNode, "claro");
				
				var elevationDropdownItem1 = new MenuItem({
					label: 'Under 10 (meters)',
					value: 'under10',
					onClick: function(){
						self.comboButtonElevation.set("label", this.label);
						self.comboButtonElevation.set("value", this.value);
						self.getExposureInputValues();
					}
				});

				var elevationDropdownItem2 = new MenuItem({
					label: 'Under 20 (meters)',
					value: 'under20',
					onClick: function(){
						self.comboButtonElevation.set("label", this.label);
						self.comboButtonElevation.set("value", this.value);
						self.getExposureInputValues();
					}
				});

				elevationDropdown.addChild(elevationDropdownItem1);
				elevationDropdown.addChild(elevationDropdownItem2);

				this.comboButtonElevation = new ComboButton({
					label: "Under 10 (meters)",
					value: 'under10',
					name: "growth",
					style: "width: 40%; display: inline-block;",
					dropDown: elevationDropdown
				});

				this.exposureInputsPane.containerNode.appendChild(this.comboButtonElevation.domNode);


			}

			this.getExposureInputValues = function(){
				var exposureType = this.comboButtonExposureType.get("label").toLowerCase();
				exposureType = exposureType.replace('assets - ', '')
				var elevation = this.comboButtonElevation.get("value");
				var dataToggle = (this.exposureTotalRb.get("checked")) ? this.exposureTotalRb.get("value") : this.exposurePercentRb.get("value");
				var inputString = exposureType + '-' + elevation + '-' + dataToggle;
				console.log(inputString);
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
				var damageTypeContainer = domConstruct.create("div", {style: 'width: 35%; display: inline-block; margin-left:10px;', innerHTML: "<b>Damage:</b>"});
				this.damageInputsPane.containerNode.appendChild(damageTypeContainer);

				var growthContainer = domConstruct.create("div", {style: 'width: 34%; display: inline-block;', innerHTML: "<b>Economic Growth:</b>"});
				this.damageInputsPane.containerNode.appendChild(growthContainer);

				var defenseContainer = domConstruct.create("div", {style: 'width: 19%; display: inline-block; float: right', innerHTML: "<b>Defense:</b>"});
				this.damageInputsPane.containerNode.appendChild(defenseContainer);

				//damage type dropdown
				var typeDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(typeDropdown.domNode, "claro");
				
				var typeMenuItem1 = new MenuItem({
					label: 'Flood',
					onClick: function(){
						self.comboButtonType.set("label", this.label);
						self.getDamageInputValues();
					}
				});

				var typeMenuItem2 = new MenuItem({
					label: 'Wind',
					onClick: function(){
						self.comboButtonType.set("label", this.label);
						self.getDamageInputValues();
					}
				});

				typeDropdown.addChild(typeMenuItem1);
				typeDropdown.addChild(typeMenuItem2);

				this.comboButtonType = new ComboButton({
					label: "Flood",
					name: "growth",
					style: "width: 40%; display: inline-block;",
					dropDown: typeDropdown
				});

				this.damageInputsPane.containerNode.appendChild(this.comboButtonType.domNode);				

				
				//growth scenario dropdown
				var growthDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(growthDropdown.domNode, "claro");
				
				var menuItem2 = new MenuItem({
					label: 'Low',
					onClick: function(){
						self.comboButtonEconomy.set("label", this.label);
						self.getDamageInputValues();
					}
				});

				var menuItem1 = new MenuItem({
					label: 'High',
					onClick: function(){
						self.comboButtonEconomy.set("label", this.label);
						self.getDamageInputValues();
					}
				});

				growthDropdown.addChild(menuItem1);
				growthDropdown.addChild(menuItem2);

				this.comboButtonEconomy = new ComboButton({
					label: "Low",
					name: "growth",
					style: "width: 34%; display: inline-block;",
					dropDown: growthDropdown
				});
			
				this.damageInputsPane.containerNode.appendChild(this.comboButtonEconomy.domNode);
				//this.cpDamages.addChild(growthDropdown);


				//defense scenario dropdown
				var defenseDropdown = new DropDownMenu({ style: "display: none;"});
				domClass.add(defenseDropdown.domNode, "claro");
				
				var defenseMenuItem1 = new MenuItem({
					label: 'None',
					onClick: function(){
						self.comboButtonDefense.set("label", this.label);
						self.getDamageInputValues();
					}
				});

				var defenseMenuItem2 = new MenuItem({
					label: 'High',
					onClick: function(){
						self.comboButtonDefense.set("label", this.label);
						self.getDamageInputValues();
					}
				});

				var defenseMenuItem3 = new MenuItem({
					label: 'Low',
					onClick: function(){
						self.comboButtonDefense.set("label", this.label);
						self.getDamageInputValues();
					}
				});

				defenseDropdown.addChild(defenseMenuItem1);
				defenseDropdown.addChild(defenseMenuItem2);
    			defenseDropdown.addChild(defenseMenuItem3);

				this.comboButtonDefense = new ComboButton({
					label: "None",
					name: "defense",
					style: "width: 20%; display: inline-block;",
					dropDown: defenseDropdown
				});
			
				this.damageInputsPane.containerNode.appendChild(this.comboButtonDefense.domNode);
				//this.cpDamages.addChild(defenseDropdown);

				//asset year slider
				var assetYearSliderLabel = domConstruct.create("div", {innerHTML: "<br><b>Choose a year for asset values</b>", style:"margin-bottom:10px;"});
				this.damageInputsPane.containerNode.appendChild(assetYearSliderLabel);
				this.assetYearSlider = new HorizontalSlider({
			        name: "assetYearSlider",
			        value: 2010,
			        minimum: 2010,
			        maximum: 2050,
			        discreteValues: 3,
			        showButtons: false,
			        style: "width:100%;",
			        onChange: function(value){
			           //this.value = value;
			           self.getDamageInputValues();
			           
			           /*console.log(this.value);
			           var chartData = [];
			           var visibleLayers = [];

			       
			          //self.updateDamagesChart();
       				  console.log(self.damagesChart);
			          self.updateDamagesChart(chartData);*/

			          
			        }
			    });
			    this.damageInputsPane.containerNode.appendChild(this.assetYearSlider.domNode);

			    var assetYearSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 3,
			    	labels: ['2010', '2030', '2050'],
			    	style: "margin-top: 5px;"
			    });
			    this.assetYearSlider.addChild(assetYearSliderLabels);

			    //climate year slider
			    var climateYearSliderLabel = domConstruct.create("div", {innerHTML: "<br><br><b>Choose a year for climate data</b>", style:"margin-bottom:10px;"});
				this.damageInputsPane.containerNode.appendChild(climateYearSliderLabel);
				this.climateYearSlider = new HorizontalSlider({
			        name: "climateYearSlider",
			        value: 2010,
			        minimum: 2010,
			        maximum: 2050,
			        discreteValues: 3,
			        showButtons: false,
			        style: "width:100%;",
			        onChange: function(value){
			          /* this.value = value;
			           //log the value for debugging purposes
			           console.log(this.value);
			           var chartData = [];
			           var visibleLayers = [];
*/
			           //replace with api call
			           self.getDamageInputValues();
			        }
			    });
			    this.damageInputsPane.containerNode.appendChild(this.climateYearSlider.domNode);

			    var climateYearSliderLabels = new HorizontalRuleLabels({
			    	container: 'bottomDecoration',
			    	count: 3,
			    	labels: ['2010', '2030', '2050'],
			    	style: "margin-top: 5px;"
			    });
			    this.climateYearSlider.addChild(climateYearSliderLabels);

			    this.errorMessage = domConstruct.create("div", {innerHTML: "<br>No data to display for the  selected inputs", style:"width: 100%; margin-top:10px; visibility: hidden; text-align: center; font-style: italic; font-weight: bold;"});
				this.damageInputsPane.containerNode.appendChild(this.errorMessage);

			}
			
			this.createExposureChart = function(){
				var margin = {top: 20, right: 0, bottom: 30, left: 30}
				var width = 320;
				var height = 300;
				var padding = 0.25;
				
				this.exposureChartPane = new TitlePane({
			    	title: 'Stacked Chart',
			    	style: 'overflow:visible; position: relative;',
			    	toggleable: false,
			    });

				this.cpExposure.domNode.appendChild(this.exposureChartPane.domNode);
				domStyle.set(this.exposureChartPane.containerNode, {"position": "relative", "border": "1px dotted #ccc", "padding-bottom": "10px", "padding-top": "20px"});
				this.exposureChartNode = domConstruct.create("div", { "style": "height:" + (height + 40) + "px;", "class": "exposureChartNode-" + this._map.id });
				this.exposureChartPane.containerNode.appendChild(this.exposureChartNode);

				this.exposureChartX = d3.scale.ordinal()
				    .rangeRoundBands([0, width], padding, 0);

				this.exposureChartY = d3.scale.linear()
				    .rangeRound([height, 0]);

				var color = d3.scale.ordinal()
				    .range(["#F2C981", "#F2780C", "#797B9C", "#222426"]);

				var xAxis = d3.svg.axis()
				    .scale(this.exposureChartX)
				    .orient("bottom")
				    .tickFormat(function(d) { if(d%5 == 0) { return d; } });

				var yAxis = d3.svg.axis()
				    .scale(this.exposureChartY)
				    .orient("left")
				    .tickFormat(function(d) { return self.formatter(d, 1000000000);});

				this.exposureChart = d3.select(".exposureChartNode-" + this._map.id)
					.append("svg")
					.attr("width", width + margin.left + margin.right)
					.attr("height", height + margin.top + margin.bottom)
					.append("g")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				d3.csv(this.pluginDirectory + "/data/data.csv", function(error, data){
					console.log(data);
					color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Category" && key !== "Total"; }));

					data.forEach(function(d) {
					    var y0 = 0;
					    d.categories = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
					    d.total = d.Total;
					  });

					self.exposureChartX.domain(data.map(function(d) { return d.Category; }));
  					self.exposureChartY.domain([0, d3.max(data, function(d) { return d.total; })]);

  					 self.exposureChart.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					self.exposureChart.append("g")
						.attr("class", "y axis")
						.call(yAxis)
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("Asset Value ($)");

					var categories = self.exposureChart.selectAll(".categories")
						.data(data)
						.enter().append("g")
						.attr("class", "g")
						.attr("transform", function(d) { return "translate(" + self.exposureChartX(d.Category) + ",0)"; });

					categories.selectAll("rect")
						.data(function(d) { return d.categories; })
						.enter().append("rect")
						.attr("width", self.exposureChartX.rangeBand())
						.attr("y", function(d) { return self.exposureChartY(d.y1); })
						.attr("height", function(d) { return self.exposureChartY(d.y0) - self.exposureChartY(d.y1); })
						.style("fill", function(d) { return color(d.name); });

					var legend = self.exposureChart.selectAll(".legend")
						.data(color.domain().slice().reverse())
						.enter().append("g")
						.attr("class", "legend")
						.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

					legend.append("rect")
						.attr("x", width - 18)
						.attr("width", 18)
						.attr("height", 18)
						.style("fill", color);

					legend.append("text")
						.attr("x", width - 24)
						.attr("y", 9)
						.attr("dy", ".35em")
						.style("text-anchor", "end")
						.text(function(d) { return d; });

				})

				this.exposureChartYaxisTitle = domConstruct.create("div", {innerHTML: "1e09(US$)", style:"width: 20px; font-size:10px; position: absolute; top: 20px; left:15px;"});
				this.exposureChartPane.containerNode.appendChild(this.exposureChartYaxisTitle);
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

			this.createDamagesChart = function(){
				var margin = {top: 20, right: 0, bottom: 30, left: 30}
				var width = 320;
				var height = 150;
				var padding = 0.45;
				
				this.damagesChartPane = new TitlePane({
			    	title: 'Risk Waterfall Chart',
			    	style: 'overflow:visible; position: relative;',
			    	toggleable: false,
			    });

				this.cpDamages.domNode.appendChild(this.damagesChartPane.domNode);
				domStyle.set(this.damagesChartPane.containerNode, {"position": "relative", "border": "1px dotted #ccc", "padding-bottom": "10px", "padding-top": "20px"});
				this.damagesChartNode = domConstruct.create("div", { "style": "height:" + (height + 40) + "px;", "class": "damagesChartNode-" + this._map.id });
				this.damagesChartPane.containerNode.appendChild(this.damagesChartNode);
				
				this.chartData2010 = [{"name":"Today", "value":450000 },{"name":"Economic", "value":200000 },{"name":"Climate", "value":150000 },{"name":"Total", "value":800000 }];
			    this.chartData2030 = [{"name":"Today", "value":450000 },{"name":"Economic", "value":250000 },{"name":"Climate", "value":300000 },{"name":"Total", "value":1000000 }];
				this.chartData2050 = [{"name":"Today", "value":450000 },{"name":"Economic", "value":150000 },{"name":"Climate", "value":400000 },{"name":"Total", "value":1000000 }];
				
				var data = this.processDamagesChartData(this.chartData2010);
				var today = _.first(data).value;

				this.damagesChartX = d3.scale.ordinal()
					.rangeRoundBands([0, width], padding, 0.05);

				this.damagesChartY = d3.scale.linear()
					.range([height, 0]);

				var xAxis = d3.svg.axis()
					.scale(this.damagesChartX)
					.orient("bottom");

				var yAxis = d3.svg.axis()
					.scale(this.damagesChartY)
					.orient("left")
					.tickFormat(function(d) { return self.formatter(d, 1000); });

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
				this.damagesChartY.domain([0, 1000000]);

				this.damagesChart.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				this.damagesChart.append("g")
					.attr("class", "y axis")
					.call(yAxis);

				var bar = this.damagesChart.selectAll(".bar")
					.data(data)
					.enter()
					.append("g")
					.attr("class", function(d) { return "bar " + d.class })
					.attr("transform", function(d) { return "translate(" + self.damagesChartX(d.name) + ",0)"; });

				bar.append("rect")
					.attr("width", self.damagesChartX.rangeBand())
					.attr("y", function (d, i) { return self.damagesChartY( Math.max(d.start, d.end) ); })
					.attr("height", function (d) { return Math.abs( self.damagesChartY(d.start) - self.damagesChartY(d.end) ); });

				bar.append("text")
					.attr("class", "bar-text")
					.attr("x", self.damagesChartX.rangeBand() / 2)
					.attr("y", function(d) { return self.damagesChartY(d.end) + 5; })
					.attr("dy", function(d) { return ".75em" })
					.text(function(d) { return self.formatter(d.end - d.start, 1000);});

				bar.filter(function(d) { return d.class != "total" })
					.append("line")
					.attr("class", "connector")
					.attr("x1", self.damagesChartX.rangeBand() + 5 )
					.attr("y1", function(d) { console.log(self.damagesChartY(d.end)); return self.damagesChartY(d.end) } )
					.attr("x2", self.damagesChartX.rangeBand() / ( 1 - padding) - 5 )
					.attr("y2", function(d) { return self.damagesChartY(d.end) } );
					
				bar.filter(function(d) { return d.class == "economic" || d.class == "climate" })
					.append("line")
					.attr("class", "line-arrow")
					.attr("marker-end", "url(#arrowhead)")
					.attr("x1", self.damagesChartX.rangeBand() + 7 )
					.attr("y1", function(d) { return self.damagesChartY(d.start) } )
					.attr("x2", self.damagesChartX.rangeBand() + 7)
					.attr("y2", function(d) { return self.damagesChartY(d.end) } );
					
				bar.filter(function(d) { return d.class == "economic" || d.class == "climate" })
					.append("text")
					.attr("class", "line-arrow-text")
					.attr("x", self.damagesChartX.rangeBand() + 20)
					.attr("y", function(d) { return self.damagesChartY(d.start) - 10; })
					.attr("dy", function(d) { return ".75em" })
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
					.attr("y2", function(d) { return self.damagesChartY(d.end) + 20 } );
					
				bar.filter(function(d) { return d.class == "total" })
					.append("text")
					.attr("class", "line-arrow-text-total ")
					.attr("x", self.damagesChartX.rangeBand() / 2)
					.attr("y", function(d) { return self.damagesChartY(today) + 5; })
					.attr("dy", function(d) { return ".75em" })
					.text(function(d) { return d.percent;});

				this.damagesChartYaxisTitle = domConstruct.create("div", {innerHTML: "1e09(US$)", style:"width: 20px; font-size:10px; position: absolute; top: 15px; left:10px;"});
				this.damagesChartPane.containerNode.appendChild(this.damagesChartYaxisTitle);
			}

			this.initializeMap = function(){
				//initialize an empty dynamic map service layer
			    var mapUrl = 'http://dev.services2.coastalresilience.org:6080/arcgis/rest/services/Cost_Benefit/Cost_Benefit/MapServer';
	          	this.mapLayer = new DynamicMapServiceLayer(mapUrl);
	          	this._map.addLayer(this.mapLayer);
	          	this._map.setZoom(6);
	          	this.mapLayer.setVisibleLayers([-1]);
	          	this.mapLayer.hide();
			}

			this.updateDamagesChart = function(data){
				var data = this.processDamagesChartData(data)
				
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
					.attr("y", function(d) { return self.damagesChartY(d.end) + 5; })
					.text(function(d) { return self.formatter(d.end - d.start, 1000);});

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
					.attr("y2", function(d) { return self.damagesChartY(d.end) } );
					
				this.damagesChart.selectAll(".line-arrow-text")
					.data(data.filter(function(d) { return d.class == "economic" || d.class == "climate"; }))
					.transition()
					.duration(500)
					.attr("y", function(d) { return self.damagesChartY(d.start) - 10; })
					.text(function(d) { return d.percent });
					
				this.damagesChart.selectAll(".line-arrow-total")
					.data(data.filter(function(d) { return d.class == "total"; }))
					.transition()
					.duration(500)
					.attr("y2", function(d) { return self.damagesChartY(d.end) + 20 } );
					
				this.damagesChart.selectAll(".line-arrow-text-total")
					.data(data.filter(function(d) { return d.class == "total"; }))
					.transition()
					.duration(500)
					.text(function(d) { return d.percent });
			}

			this.getDamageInputValues = function(){
				var type = this.comboButtonType.get("label").toLowerCase();
				var growth = this.comboButtonEconomy.get("label");
				var defense = this.comboButtonDefense.get("label");
				var asset = this.assetYearSlider.get("value");
				var climate = this.climateYearSlider.get("value");
				
				var visibleLayers = [];
				if(type == 'wind'){
					this.comboButtonDefense.set('label', 'None');
					this.comboButtonDefense.set('disabled', true);
				} else {
					this.comboButtonDefense.set('disabled', false);
				}
				
				var inputString = growth + "-" + ((type == 'flood') ? defense + "-" : "") + asset + "-" + climate;
				inputString = inputString.toLowerCase();
				console.log(inputString);
				
				if (climate == '2010') {
					var chartDataShow = this.chartData2010;
				} else if (climate == '2030') {
					var chartDataShow = this.chartData2030;
				} else if (climate == '2050') {
					var chartDataShow = this.chartData2050;
				}
				
				//hide the error message if it's visible
				domStyle.set(this.errorMessage, {"visibility": "hidden"});
				
				console.log(this._appData);
				console.log( this._appData['damages'][type][inputString]['layerIndex']);
				visibleLayers = [this._appData['damages'][type][inputString]['layerIndex']];
					
				this.updateDamagesChart(chartDataShow);
				this.updateLayer(visibleLayers);

			}

			this.updateLayer = function(visibleLayers){
				this.mapLayer.setVisibleLayers(visibleLayers);
	            console.log(this.mapLayer);
	            this.mapLayer.show();
			}
			
			this.formatter = function(value,n) {
				return Math.round(value/n);
			}


		};// End cdTool

		
		return ecaTool;	
		
	} //end anonymous function

); //End define