/**
 * The starter file
 */

// Declare app level module which depends on views, and components
var app = angular.module('XmlTemplater', [ 'xml-templater' ]);

/**
 * A helpful directive to include external template
 */
app.directive('xmlTemplate', function() {
    return {
        restrict : 'A',
        scope : false,
        replace : true,
        templateUrl : 'xmltemplate.html',
        link : function(scope, element, attributes) {
        }
    }
});

app.controller('myController', [ '$scope', 'xml-helper', function($scope, xmlHelper) {
    $scope.exampleAttribute = "ExAttr";
    $scope.rows = [];
    $scope.rows.push({
        name : 'Name 1',
        value : 'Value 1'
    });
    $scope.rows.push({
        name : 'Name 2',
        value : 'Value 2'
    });
    $scope.rows.push({
        name : 'Name 3',
        value : 'Value 3'
    });
    $scope.show = function() {
        var xml = xmlHelper.getXML("xmldocument");
        if (xml) {
            if (typeof xml == "string") {
                alert(xml);
            } else {
                for (var i = 0; i < xml.length; i++) {
                    alert(xml[i]);
                }
            }
        }
    };
    $scope.show2 = function() {
        var xml = xmlHelper.getRawXML("xmldocument");
        if (xml) {
            if (typeof xml == "string") {
                alert(xml);
            } else {
                for (var i = 0; i < xml.length; i++) {
                    alert(xml[i]);
                }
            }
        }
    }
} ]);
