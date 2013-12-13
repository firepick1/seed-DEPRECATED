'use strict';
var bootstrap = angular.module('SEED_APP.bootstrap', ['ui.bootstrap']);

var controllers = angular.module('SEED_APP.controllers', []);

controllers.controller('HelloCtrl', ['$scope','$location',function(scope, location) {
    scope.view = "HELLO";
}]);

controllers.controller('MainCtrl', ['$scope','$location','$timeout','BackgroundThread', 
  function(scope, location, $timeout, BackgroundThread) {
    scope.view = "MAIN";

	scope.ticks = 0;
    scope.onStateReceived = function(remoteState) {
		scope.ticks++;
    };
    scope.postState = function() {
    };
    scope.updateStatus = function() {
      BackgroundThread.get(scope.onStateReceived);
    };

	BackgroundThread.onStateReceived = scope.onStateReceived;
    scope.updateStatus();

}]);
