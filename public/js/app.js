var app = angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap'])

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/home.html',
    })

    .when('/events', {
      templateUrl : 'partials/events.html',
      controller  : 'EventsController'
    })

    .when('/event/:_id/register', {
      templateUrl : 'partials/eventRegister.html',
      controller  : 'EventRegisterController'
    })

    .when('/event/:_id', {
      templateUrl: 'partials/event.html',
      controller : 'EventController'
    })


    .when('/profile', {
      templateUrl : 'partials/profile.html',
      controller  : 'ProfileController'
    })

});

app.factory('Event', function($resource) {
  return $resource( '/api/events/:_id?sort=-timestamp&populate=companies', {_id: "@_id"}, {'update': { method:'PUT' } });
})

app.factory('Me', function($resource) {
  return $resource( '/api/users/537bc06d16fbcf6653627f8f');
})

app.controller('HeaderController', function(Me, $scope) {
  $scope.me = Me.get()
})

app.controller('EventsController', function(Event, $scope) {
  $scope.events = Event.query()
})

app.controller('EventController', function(Event, $routeParams, $scope) {
  $scope.event = Event.get({_id:$routeParams._id})
})

app.controller('EventRegisterController', function(Event, $routeParams, $scope) {
  $scope.event = Event.get({_id:$routeParams._id})
})

app.controller('ProfileController', function(Me, $scope) {
  $scope.me = Me.get()
})