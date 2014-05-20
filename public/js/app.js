var app = angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap'])

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/home.html',
      //controller  : 'MainController'
    })

    .when('/events', {
      templateUrl : 'partials/events.html',
      controller  : 'EventsController'
    })

    .when('/event/:_id', {
      templateUrl: 'partials/event.html',
      controller : 'EventController'
    })

    .when('/profile', {
      templateUrl : 'partials/me.html',
      controller  : 'MeController'
    })
});


app.factory('Event', function($resource) {
  return $resource( '/api/events/:_id?sort=-timestamp', {_id: "@_id"}, {'update': { method:'PUT' } });
})

app.controller('EventsController', function(Event, $scope) {
  $scope.events = Event.query()
})

app.controller('EventController', function(Event, $routeParams, $scope) {
  $scope.event = Event.get({_id:$routeParams._id})
})