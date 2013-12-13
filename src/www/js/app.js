'use strict';


// Declare app level module which depends on filters, and services
angular.module('SEED_APP', [
  'ngRoute',
  'SEED_APP.bootstrap',
  'SEED_APP.filters',
  'SEED_APP.services',
  'SEED_APP.directives',
  'SEED_APP.controllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/hello', {templateUrl: 'partials/hello.html', controller: 'HelloCtrl'});
  $routeProvider.otherwise({redirectTo: '/hello'});
}]);
