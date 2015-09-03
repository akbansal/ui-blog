/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
define(['jquery', 'knockout', 'datatables-knockout'], function($, ko, dt) {
    'use strict';
    var AddWidgetViewModel;
    function WidgetToAdd(widgetObj) {
        var self = this;
        self.checkbox = ko.observable(false);
        self.widgetObj = widgetObj;
        self.actions = '';
    }
    
    AddWidgetViewModel = function(widgets) {
        var self = this,
            widgetArr;

        self.result = ko.observableArray();
        self.options = {
            "order": [[2, 'desc']],
            "searching": true,
            "inProgress": false
        };
        widgetArr = $.map(widgets, function(value, index) {
            return [value];
        });
        self.result(ko.utils.arrayMap(widgetArr, function(widget) {
            return new WidgetToAdd(widget); 
        }));
        self.addSelectedDataCollector = function(data, event) {
            console.log(data);
            console.log(event);
        };
    };

    AddWidgetViewModel.prototype.add = function () {
        var self = this,  
            widgets = [];
        ko.utils.arrayForEach(self.selectedRows(), function (row) {
            widgets.push(row.widgetObj);
            row.checkbox(false);
        });
        self.modal.close(widgets);
    };
    AddWidgetViewModel.prototype.cancel = function () {
        this.modal.close();
    }; 
    
    return AddWidgetViewModel;
});


