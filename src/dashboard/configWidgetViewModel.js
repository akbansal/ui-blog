/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['jquery', 'knockout'], function($, ko) {
    'use strict';

    var configWidgetViewModel = function(widget, dashboardVM) {
        var self = this;
 
        self.widgetModel = widget;
        self.dashboardViewModel = dashboardVM;

        self.headerTitle = widget.widgetConfig.headerTitle || "Configure " + widget.name() + " widget";
        self.headerSubTitle = widget.widgetConfig.headerSubTitle || null;
        self.closeIconEnabled = true;
        self.configModalTemplate = widget.widgetConfig.templatePath;
        self.configViewModelLoaded = ko.observable(false);        
 
        (function(WC) {
            if(WC.viewModelPath && WC.viewModelPath !== "") {
                require([WC.viewModelPath], function (WidgetVM) {
                    $.extend(self, new WidgetVM(widget.settings));
                    self.configViewModelLoaded(true);
                });
            }
        }(widget.widgetConfig));
 
    };
    configWidgetViewModel.prototype.modalClose = function() {
        var self = this;
        self.modal.close();
    };
    configWidgetViewModel.prototype.removeWidget = function() {
        var self = this;
        self.dashboardViewModel.showRemoveModal.call({ 
            'data': self.widgetModel,
            'dashboardViewModel': self.dashboardViewModel
        });
        self.modal.close();
    };
    configWidgetViewModel.prototype.modalSubmit = function() {
        var self = this, widget = self.widgetModel, newSettings = {};
 
        (function(WC) {
            if(WC.onSaveCallback && WC.onSaveCallback !== null && WC.onSaveCallback !== "") {
                newSettings = self[WC.onSaveCallback]();
            }
        }(widget.widgetConfig));
        newSettings['widgetObj'] = widget;
        self.modal.close(newSettings);
    };
 
    return configWidgetViewModel;
});
