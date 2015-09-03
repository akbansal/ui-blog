/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['jquery', 'knockout', 'underscore', 'gridstack', './dashboard', './Widget', 'Modal', 
    'ko-binding-utils', 'text!./dashboardTemplate.html', 'dialog-utils', 'acs-resource', 'version', 
    'user-validation', 'alert-utils', './configWidgetViewModel'], 
    function($, ko, _, gs, Dashboard, Widget, Modal, kb, htmlString, 
        dialog, Resource, version, userValidation, alerts, ConfigWidgetViewModel) {
        'use strict';
        
        //TODO - later we will read all these globals from dashboard.config file.
        var globals = {
            "maxDashboardSize": 5,
            "WIDGET_JSON_URL": "js/lib/dashboard/WidgetsTestData.json",
            "GENERIC_ERROR_MSG": "There was an issue communicating with the server. Please try again later.",
            "CONFIG_WIDGET_TEMPLATE_URL": "js/lib/dashboard/ConfigWidgetTemplate",
            "DASHBOARD_CONTAINER_ID": "#ss-container-dashboard-",
            "RENAME_TITLE_TEMPLATE_URL": "js/lib/dashboard/RenameTitleModel",          
            "DASHBOARD_TAB_TOOLTIP_TEMPLATE_URL": "/js/lib/dashboard/dashboardTabTooltip",
            "ADD_DASHBOARD_TOOLTIP_TEMPLATE_URL": "/js/lib/dashboard/addDashboardTooltip",
            "ADD_WIDGET_TOOLTIP_TEMPLATE_URL": "/js/lib/dashboard/addWidgetTooltip",
            "DEFAULT_WIDGETS_JSON_URL": "js/lib/dashboard/DefaultWidgets.json",
            "GRID_STACK_OPTIONS": { 
                cell_height: 140,
                vertical_margin: 10, 
                animate: true, 
                width: 6,
                handle: '.sDashboardWidgetHeader'
            },
            "DASHBOARD_REST_API": "dashboards",
            "WIDGET_REST_API": "widgetMetaData"
        };
        var resource = new Resource({
            url: globals.DASHBOARD_REST_API
        }); 
        var widgetResource = new Resource({
            url: globals.WIDGET_REST_API
        }); 
        var guid = function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        };
        var registerEvent = function(dashboard) {

            var self = this, //this points to dashboardVM
                $container = $(globals.DASHBOARD_CONTAINER_ID + dashboard.id);

            //Event Occurs when adding/removing widgets or existing widgets change their position/size
            $container.on('change', function (e, items) {
                var dashboardObj = self.filterDashboard(dashboard.id, self.userDashboardData());
                
                $container.children().each(function() {
                    var element = $(this),
                        node = element.data('_gridstack_node'),
                        elementId = element.attr('id').split('WIDGET-')[1];

                    ko.utils.arrayForEach(dashboardObj.widgets, function (widget) {
                        if(widget.id === elementId) {
                            widget.xPos = node.x;
                            widget.yPos = node.y;
                        }
                    });
                });   
                console.log(JSON.stringify(dashboardObj.widgets));
                resource.update(dashboardObj).done(function() {}).fail(function(jqXHR, textStatus, errorThrown) {
                    alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                    console.log("Error occuured in REST service call while updating widget Order, Error - " 
                        + jqXHR.responseText);
                });
            });
 
            $container.on('removeWidget', function (e, widget) {
                var widgetId = '#WIDGET-' + widget.id;
                if (dashboard.grid === null) {
                    dashboard.grid = $container.gridstack(globals.GRID_STACK_OPTIONS).data('gridstack');                
                }
                dashboard.grid.remove_widget(widgetId);
            });
        };
        var gridStack = function (dashboard) {
            if(dashboard && dashboard.grid === null) { 
                dashboard.grid = $(globals.DASHBOARD_CONTAINER_ID + dashboard.id)
                                .gridstack(globals.GRID_STACK_OPTIONS)
                                .data('gridstack');
                dashboard.grid.remove_all();
            }
        };

        function DashboardViewModel(params) {
            var self = this;
            self.dashboardCounter = ko.observable(0);  //Initial Value
            self.maxDashboardSize = globals.maxDashboardSize;
            self.selectedDashboard = ko.observable();
            self.lastDashboardId = ko.observable(-1);
            self.dashboards = ko.observableArray();
            self.widgetsLoaded = ko.observable(false);
            self.loadWidgets(function() {
                self.getDashboard(params); //This function should be called once loadWidgets is completed.
            });
            self.dashboardVM = this;
            self.addWidgetTooltip = ko.observable();
            
            self.createTitle = ko.observable("");
            $('#addDashboardContainer').on('hide.bs.dropdown', function () {
                self.createTitle(""); //RESET The title Property for next Use
            });
        }
        DashboardViewModel.prototype.loadWidgets = function(cb) {
            var self = this;
            var url = window.__MODULE_PREFIX__('assets', globals.WIDGET_JSON_URL);
            //widgetResource.get().done(function(data) {
            $.getJSON(url, function(data) { 
                self.widgetsMetadata = {};
                self.filteredWidgets = [];

                $.each(data, function(idx, item) {
                    self.widgetsMetadata[item.id] = new Widget(item);
                });
                $.map(self.widgetsMetadata, function(widget) {
                    var allowedWidget = false;
                    if (!widget.service && !widget.category) {
                        allowedWidget = true;
                    }else {
                        if (widget.service && userValidation.hasService(widget.service)) {
                            allowedWidget = true;
                        }
                        if (!allowedWidget && widget.category) {
                            if(userValidation.hasServiceCategory(widget.category)) {
                                allowedWidget = true;
                            }
                        }
                    }
                    if(allowedWidget && (!widget.privilege || userValidation.hasPrivilege(widget.privilege))) {
                        self.filteredWidgets.push(widget);
                    }
                });
                self.addWidgetDataTable = {
                    data: ko.computed(function() {
                        var widgetArr = $.map(self.filteredWidgets, function(value, index) {
                            return [value];
                        });
                        var dataTableWidgetArr = ko.utils.arrayMap(widgetArr, function(widget) {
                            return {
                                checkbox: ko.observable(false),
                                widgetObj: widget,
                                actions: ''
                            };
                        });
                        return dataTableWidgetArr;
                    }),
                    options: {
                        "searching": true,
                        "inProgress": false,
                        "pageLength": 5,
                        "lengthMenu": [ 5, 10, 25, 50, 100 ]
                    }
                };
                self.addWidgetTooltip({
                    template: window.__MODULE_PREFIX__('assets', globals.ADD_WIDGET_TOOLTIP_TEMPLATE_URL),
                    options: {
                        'position': 'bottom-left',
                        'positionTracker': true
                    },
                    viewModel: self
                });
                self.widgetsLoaded(true);
                cb();
            }, 
            function(jqXHR, textStatus, errorThrown) {
                 alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                 console.log("Error Occuured while Loading the Widget Metadata, Error - " + jqXHR.responseText);

            });
            // .fail(function(jqXHR, textStatus, errorThrown){
            //     alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
            //     console.log("Error Occuured while Loading the Widget Metadata, Error - " + jqXHR.responseText);
            // });
        };
         
        DashboardViewModel.prototype.getDashboard = function(config) {
            var self = this;
            if(!$.isEmptyObject(self.widgetsMetadata)) { // This is just a defensive check.
                resource.get().done(function(dataFromServer) {
                    
                    if (dataFromServer && dataFromServer.length && dataFromServer.length > 0) {
                        self.initDashboard(dataFromServer);
                    }
                    else {
                        self.getDefaultDashboard(function(dataFromJSONFile) {
                            self.initDashboard(dataFromJSONFile);
                        });
                    }
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                    console.log("Error Occuured while Fetching the User Dashborad Data, Error - " + jqXHR.responseText);
                    self.getDefaultDashboard(function(dataFromJSONFile) {
                        self.initDashboard(dataFromJSONFile);
                    }); 
                }); 
            } 
        };
        DashboardViewModel.prototype.initDashboard = function(dashboardData) {
            var self = this;
            self.userDashboardData = ko.observableArray();
            ko.utils.arrayPushAll(self.userDashboardData, dashboardData);

            self.dashboards(ko.utils.arrayMap(dashboardData, function(dashboard, index) {
                var dashboardWidgets = [];
                dashboardWidgets = ko.utils.arrayMap(dashboard.widgets, function(widget) {
                    return new Widget($.extend( {}, self.widgetsMetadata[widget.refId], widget));
                }); 
                dashboardWidgets = gs.Utils.sort(dashboardWidgets);
                //By Default First Tab is selected for Dashboard v1.0
                return new Dashboard(dashboard, (index === 0), dashboardWidgets);  
            }));
            self.dashboardCounter(self.dashboards().length);
            self.selectedDashboard(self.dashboards()[0]); 
            if(self.dashboardCounter() > 0) {
                self.lastDashboardId(self.dashboards()[self.dashboardCounter() - 1].id);
            }
        };     
        DashboardViewModel.prototype.getDefaultDashboard = function(callback) {
            var self = this,
                url = window.__MODULE_PREFIX__('assets', globals.DEFAULT_WIDGETS_JSON_URL);
 
            $.getJSON(url, function(dataFromJSONFile) {
                callback(dataFromJSONFile);
            }, function(error) {
                alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                console.log("Error Occuured while Loading default widgets, Error - " + error);
            });
        };
        DashboardViewModel.prototype.afterAddWidget = function(element, widget) {
            var self = this, //This points to Dashboard Object
                widgetElement = _.find(element, function (i) { return i.nodeType === 1; });
                
            if (self.grid === null) {
                self.grid = $(widgetElement.parentElement).gridstack(globals.GRID_STACK_OPTIONS).data('gridstack');
                self.grid.remove_all();
            }
            if(widget.x === -1 || widget.yPos === -1) {
                self.grid.add_widget(widgetElement, widget.x, widget.y, widget.width, widget.height, true);
            }
            else {
                self.grid.add_widget(widgetElement, widget.x, widget.y, widget.width, widget.height, false);
            }
        };
        DashboardViewModel.prototype.myPostProcessingLogic = function (elements, data) {
            //gridStack(data);
            registerEvent.call(this, data);
        };    
        DashboardViewModel.prototype.selectDashboard = function(dashboardVM, dashboard, e) {
            var self = this, selectedDashboard = dashboardVM.selectedDashboard(), target;
            
            e = e || window.event;
            target = $( e.target || e.srcElement );
            if ( ! target.is( ".tabIcon" ) && ! target.is( ".fa-cog" )) {
                if(selectedDashboard.id !== self.id) {
                    selectedDashboard.selected(false);
                    self.selected(true);
                    dashboardVM.selectedDashboard(self);
                    if(!self.widgetsInitialized()) {
                        self.widgetsInitialized(true);
                    }
                }    
            }
            else{
                $('#dropdown_'+ self.id).dropdown('toggle');
            }
        };
        DashboardViewModel.prototype.filterDashboard = function(filter, array) {
            var self = this;
            return ko.utils.arrayFilter(array, function(arrayElement) {
                return arrayElement.id === filter;
            })[0];
        };
        DashboardViewModel.prototype.addDashboard = function(viewModel) {
            var self = this,
                title = self.createTitle(),
                dashboardInstance;
            
            //This is a defensive Check. Ideally the button would be disabled
            //if user reached to max Dashboard Tabs size.
            if(self.dashboardCounter() < self.maxDashboardSize && title && title !== "") {
                resource.add({
                    "name": title, 
                    'widgets': []
                }).done(function(dataFromServer) { 
                    if(dataFromServer) {
                        ko.utils.arrayPushAll(self.userDashboardData, [dataFromServer]);
                        self.lastDashboardId(dataFromServer.id);
                        if(self.selectedDashboard()) {
                            self.selectedDashboard().selected(false);
                        }
                        dashboardInstance = new Dashboard(dataFromServer, true, dataFromServer.widgets);
                        self.dashboards.push(dashboardInstance);
                        self.selectedDashboard(dashboardInstance);
                        self.dashboardCounter(self.dashboardCounter() + 1);    
                        gridStack(dashboardInstance);
                        self.createTitle(""); //RESET The title Property for next Use
                        $('#addDashboardBtn').dropdown('toggle');
                    }
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                    console.log("Error Occuured while Adding the dashboard Tab on the page, Error - " 
                                + jqXHR.responseText);
                });
            }
        };
        function removeDashboard() {
            var dashboardVM = this.dashboardViewModel,
                dashboard = this.data,
                index = this.index();

            resource.remove({'id': dashboard.id}).done(function() { 
                //Update userDashboardData
                 //$('#tabdropdown_'+ dashboard.id).dropdown('toggle');
                 ko.utils.arrayForEach(dashboardVM.userDashboardData, function (dashboardObj, dindex) {
                    if(dashboardObj.id === dashboard.id) {
                        dashboardVM.userDashboardData.splice(dindex, 1);
                    }
                });
                dashboardVM.dashboardCounter(dashboardVM.dashboardCounter() - 1); 
                //if the removed dashboard is also the previously selected dashboard    
                if(dashboardVM.selectedDashboard().id === dashboard.id) {
                    if(dashboardVM.dashboardCounter() === 1) {
                        dashboardVM.selectDashboard.call(dashboardVM.dashboards()[index - 1], 
                            dashboardVM);
                    }else if(dashboardVM.dashboardCounter() > 1) {
                        if(dashboard.id === dashboardVM.lastDashboardId()) {
                            dashboardVM.selectDashboard.call(dashboardVM.dashboards()[index - 1], 
                                dashboardVM);
                        }
                        else {
                            dashboardVM.selectDashboard.call(dashboardVM.dashboards()[index + 1], 
                                dashboardVM);
                        }
                    }                      
                }
                dashboardVM.dashboards.remove(dashboard);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                console.log("Error Occuured while removing the dashboard tab from the page, Error - " 
                    + jqXHR.responseText);
            });
        }
        function removeWidget() {
            var dashboardVM = this.dashboardViewModel,
                widget = this.data();

            var selectedDashboard = dashboardVM.selectedDashboard(),
                dashboard = dashboardVM.filterDashboard(selectedDashboard.id, 
                            dashboardVM.userDashboardData());

            ko.utils.arrayForEach(dashboard.widgets, function (widgetObj, windex) {
                if(widgetObj && widgetObj.id === widget.id) {
                    dashboard.widgets.splice(windex, 1);    
                }
            });
            resource.update(dashboard).done(function() { 
                ko.utils.arrayForEach(selectedDashboard.widgets(), function (widgetObj) {
                    if(widgetObj && widgetObj.id === widget.id) {
                        $(globals.DASHBOARD_CONTAINER_ID + selectedDashboard.id).trigger('removeWidget', widget);
                        selectedDashboard.widgets.remove(widget);
                    }
                });                
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                console.log("Error occuured while removing widget from selected dashboard, Error - "
                 + jqXHR.responseText);
            });
        }
        DashboardViewModel.prototype.showRemoveModal = function() {
            //This points to below object.
                // data: {
                //     'data': $data,
                //     'title': $data.name(),
                //     'dashboardViewModel': $parent,
                //     'index': $index
                // }
            var self = this,
                data = self.data();
            $('#dropdown_' + data.id).dropdown('toggle');
            dialog.showModalDialog("warning", "Are you sure you want to remove "
                + data.name() + 
                " from your " +
                (data instanceof Dashboard ? "dashboards?" : "widgets?"),
                "Cancel", "Continue",
                function() { //Continue callback
                    if(data instanceof Dashboard) {
                        removeDashboard.call(self);
                    }else {
                        removeWidget.call(self);
                    }
                },
                function() { // Cancel callback
                }, 
                "warning"
            );
        };
        
        DashboardViewModel.prototype.modalClose = function() {
            var self = this;
            self.modal.close();
        };
        DashboardViewModel.prototype.modalSubmit = function() {
            var self = this;
            self.modal.close(self);
        };
     
        DashboardViewModel.prototype.addSelectedWidget = function(selectedWidget) {
            
            var selectedWidget = this.widgetObj,
                dashboard, self, toolTipGuid, selectedDashboard,
                widgetArr1 = [], widgetArr2 = [], widgetInstance;

            if(selectedWidget) {
                self = this.$data; //points now to DashboardViewModel
                toolTipGuid = self.guid;      
                selectedDashboard = self.selectedDashboard();                
                
                    widgetInstance = {
                        "id": guid(),
                        "refId": selectedWidget.id,
                        "name": selectedWidget.name(),
                        "settings": {},
                        "xPos": -1,
                        "yPos": -1
                    };
                    widgetArr1.push(widgetInstance);
                    widgetInstance = $.extend(true, {}, selectedWidget, widgetInstance );
                    widgetArr2.push(new Widget(widgetInstance));
               
                
                dashboard = self.filterDashboard(selectedDashboard.id, self.userDashboardData());
                ko.utils.arrayForEach(widgetArr1, function (widget) {
                    dashboard.widgets.push(widget);
                });
                resource.update(dashboard).done(function() { 
                    ko.utils.arrayForEach(widgetArr2, function (widget) {
                        selectedDashboard.widgets.push(widget);
                    });
                    $('#' + toolTipGuid).parent().parent().remove();
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                    console.log("Error occuured while Adding the widgets to selected dashboard, Error - "
                     + jqXHR.responseText);
                });
            }
        };
      
        DashboardViewModel.prototype.renameTitle = function() {
            var self = this.dashboardViewModel,
                data = this.data,
                title = this.title,
                dashboardObj,
                isTitleChanged = false;
            
            // if(data instanceof Widget) {
            //     dashboardObj = self.filterDashboard(self.selectedDashboard().id, self.userDashboardData());
            //     ko.utils.arrayForEach(dashboardObj.widgets, function (widgetObj) {
            //         if(widgetObj.id === self.dashboard.id) {
            //             if(widgetObj.name !== viewModel.title) {
            //                 widgetObj.name = viewModel.title;
            //                 isTitleChanged = true;
            //             }
            //         }
            //     });
            // }else
            if(data instanceof Dashboard) {
                dashboardObj = self.filterDashboard(data.id, self.userDashboardData());
                if(title && title !== "" && dashboardObj.name !== title) {
                    dashboardObj.name = title;
                    isTitleChanged = true;
                }
            }
            if(isTitleChanged) {
                resource.update(dashboardObj).done(function() { 
                    $('#dropdown_'+ data.id).dropdown('toggle');
                    data.name(title);
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                    console.log("Error occuured in REST service call while renaming the title, Error - "
                         + jqXHR.responseText);
                });
            }
            else{
                $('#dropdown_'+ data.id).dropdown('toggle');
            }
        };
        DashboardViewModel.prototype.showConfigWidgetModal = function() {
            var self = this,
                dashboardVM = self.dashboardViewModel,
                widget = self.data();
            
            $('#dropdown_' + widget.id).dropdown('toggle');
            Modal.showModal({
                viewModel: new ConfigWidgetViewModel(widget, dashboardVM),
                context: dashboardVM,
                template: window.__MODULE_PREFIX__('assets', globals.CONFIG_WIDGET_TEMPLATE_URL)
            }).then(dashboardVM.configWidget);
        };
        DashboardViewModel.prototype.configWidget = function(settings) {
            var self = this;

            var dashboardObj = this.filterDashboard(this.selectedDashboard().id, this.userDashboardData());
            
            var widget  = settings['widgetObj'];
            delete settings['widgetObj'];

            ko.utils.arrayForEach(dashboardObj.widgets, function (widgetObj) {
                if(widgetObj.id === widget.id) {
                    widgetObj.settings = settings;
                }
            });
            resource.update(dashboardObj).done(function() { 
                widget.settings = settings;
                if(widget.viewModelPath && widget.viewModelPath !== "") {
                    require([widget.viewModelPath], function (WidgetVM) {
                        if(widget.onInitCallback && widget.onInitCallback !== null && widget.onInitCallback !== "") {
                            widget.widgetViewModel(new WidgetVM(widget.settings));
                            widget.widgetViewModel()[widget.onInitCallback]();
                        }
                    });
                }
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alerts.showErrorAlert(globals.GENERIC_ERROR_MSG);
                console.log("Error occuured while updating widget settings, Error - " + jqXHR.responseText);
            });
        };
        return { viewModel: DashboardViewModel, template: htmlString };
    }
);
