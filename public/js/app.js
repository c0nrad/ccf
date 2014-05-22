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

    .when('/registered', {
      templateUrl : 'partials/registered.html'
    })

});

app.factory('Event', function($resource) {
  return $resource( '/api/events/:_id', {_id: "@_id", sort:"-timestamp"}, {'update': { method: 'PUT' } });
})

app.factory('Me', function($resource) {
  return $resource( '/api/users/537d4f59fb194f2ae738a66a');
})

app.factory('Entry', function($resource) {
  return $resource('/api/entries/:_id', {_id: "@_id", populate: 'user companies event'}, {'update': {method: 'PUT'}})
})

app.factory('Company', function($resource) {
  return $resource('/api/companies/:_id', {_id: "@_id"}, {'update': {method: 'PUT'}})
})

app.controller('HeaderController', function(Me, $scope) {
  $scope.me = Me.get()
})

app.controller('EventsController', function(Event, Me, $scope, $location) {
  $scope.me = Me.get()
  $scope.events = Event.query()

  $scope.newEvent = function() {
    event = new Event({admin: $scope.me._id})
    event.$save(function(e) {
      console.log(e)
      $location.url('/event/' + e._id + '/admin')
    })
  }
})

app.controller('EventController', function(Event, Company, $routeParams, $scope) {
  $scope.event = Event.get({_id:$routeParams._id}, function(e) {
    $scope.companies = Company.query({conditions: { event: e._id}})
  })  
})

app.controller('EventRegisterController', function(Event, Me, Entry, Company, $routeParams, $location, $scope) {
  $scope.entry = new Entry()

  $scope.event = Event.get({_id:$routeParams._id}, function(e, b) {
    $scope.companies = Company.query({conditions: { event: e._id}})
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

    $location.url('/registered')
  }
})

app.controller('EventAdminController', function(Event, Me, Company, Entry, $routeParams, $scope) {
  $scope.event = Event.get({_id:$routeParams._id}, function(e) {
    $scope.companies = Company.query({conditions: { event: e._id}})
    $scope.event.startTime = new Date()
    $scope.entries = Entry.query({conditions: {event: e._id}})
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

app.controller('ProfileController', function(Me, Event, Entry, $scope) {
  $scope.me = Me.get( function(me) {
    $scope.events = Event.query({conditions: {admin: me._id}}, function() {}, function() { $scope.events = [] })
    $scope.entries = Entry.query({conditions: {user: me._id}}, function() {}, function() { $scope.entries = [] })
  })
})