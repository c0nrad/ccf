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

    .when('/event/:_id/admin', {
      templateUrl : 'partials/eventAdmin.html', 
      controller  : 'EventAdminController'
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
  return $resource( '/api/events/:_id', {_id: "@_id", sort:"-timestamp"}, {'update': { method: 'PUT' } });
})

app.factory('Me', function($resource) {
  return $resource( '/api/users/537cfe3f8f8b54ebcff18dc8');
})

app.factory('Entry', function($resource) {
  return $resource('/api/entries/:_id', {_id: "@_id"}, {'update': {method: 'PUT'}})
})

app.factory('Company', function($resource) {
  return $resource('/api/companies/:_id', {_id: "@_id"}, {'update': {method: 'PUT'}})
})

app.controller('HeaderController', function(Me, $scope) {
  $scope.me = Me.get()
})

app.controller('EventsController', function(Event, $scope, $location) {
  $scope.events = Event.query()

  $scope.newEvent = function() {
    event = new Event({})
    event.$save(function(e) {
      console.log(e)
      $location.url('/event/' + e._id + '/admin')
    })
  }
})

app.controller('EventController', function(Event, $routeParams, $scope) {
  $scope.event = Event.get({_id:$routeParams._id})
})

app.controller('EventRegisterController', function(Event, Me, Entry, $routeParams, $scope) {
  $scope.entry = new Entry()

  $scope.event = Event.get({_id:$routeParams._id}, function(e, b) {
    $scope.entry.event = e
  })

  $scope.me = Me.get(function(me, b) {
    $scope.entry.user = me
  })

  $scope.companyClick = function(id) {
    if (id[0] == '!') {
      $scope.entry.companies.splice(id)
    } else {
      if ($scope.entry.companies == undefined) {
        $scope.entry.companies = [id]
      } else {
        $scope.entry.companies.push(id)
      }
    }
  }

  $scope.save = function() {
    $scope.entry.event = $scope.event._id 
    $scope.entry.user = $scope.me._id
    $scope.entry.$save()
  }
})

app.controller('EventAdminController', function(Event, Me, Company, $routeParams, $scope) {
  $scope.event = Event.get({_id:$routeParams._id}, function(e) {
    $scope.companies = Company.query({conditions: { event: e._id}})
  })

  $scope.newCompany = new Company()

  $scope.deleteCompany = function(company) {
    company.$delete()
    $scope.companies = Company.query({conditions: { event: event._id}})
  }

  $scope.addCompany = function() {
    $scope.newCompany.event = $scope.event._id;
    $scope.newCompany.$save()
    $scope.newCompany = new Company()
    $scope.newLogo = ""

    $scope.companies = Company.query({conditions: { event: event._id}})
  }
})

app.controller('ProfileController', function(Me, $scope) {
  $scope.me = Me.get()
})