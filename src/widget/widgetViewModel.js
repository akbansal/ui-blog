/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
 /*
  "id": "GATEWAY_1",
        "name": "Database Status",
        "description": "This is a Database Status widget",
        "icon": "fa-database",
        "width": 2,
        "enableRefresh": true,
        "enableConfig": true,
        "templatePath": "DatabaseStatus-ScoreCard", 
        "viewModelPath": "DatabaseStatus-ScoreCardViewModal",
        "onInitCallback": "",
        "widgetConfig": {
            "templatePath": "DatabaseStatus-config",
            "viewModelPath": "",
            "onSaveCallback": "",
            "onCancelCallback": ""
        },
        "privilege": "User-View"
 */
define(['jquery', 'knockout', 'ko-binding-utils', 'text!./widgetTemplate.html', 'moment-timezone', 
    'ojs/ojcore', 'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojchart', 'ojs/ojtoolbar'], 
    function($, ko, kb, htmlString) {
        'use strict';
        function WidgetViewModel(params) {
            var self = this;
            var widget = params.data;
 
            self.data = ko.observable(widget);
            self.dashboardViewModel = params.parent;
            self.widgetViewModelLoded = ko.observable(false);
 
            // self.widgetTooltip = {
            //     template: window.__MODULE_PREFIX__('assets', 'js/lib/widget/widgetTooltipTemplate'), 
            //     viewModel: {
            //         data: self.widgetModel(),
            //         dashboardViewModel: self.dashboardViewModel
            //     },
            //     options: {
            //         "position": "top", 
            //         "contentAsHTML": true
            //     }
            // };
 
            widget.widgetTemplate((widget.templatePath && widget.templatePath !== "") ? widget.templatePath : null);
 
            if(widget.viewModelPath && widget.viewModelPath !== "") {
                require([widget.viewModelPath], function (WidgetVM) {
                    if(widget.onInitCallback && widget.onInitCallback !== null && widget.onInitCallback !== "") {
                        if(typeof(WidgetVM) === "object") {
                            widget.widgetViewModel(WidgetVM);
                        } else {
                            widget.widgetViewModel(new WidgetVM(widget.settings));
                        }
                        
                        widget.widgetViewModel()[widget.onInitCallback]();
                    }
                    self.data(widget); 
                    self.widgetViewModelLoded(true);
                });
            }
 
            self.afterWidgetTemplateRendered = function() {
       
            };
        }  
 
        return { viewModel: WidgetViewModel, template: htmlString };
    }
);
