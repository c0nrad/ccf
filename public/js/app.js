var app = angular.module('app', ['ngResource', 'ngRoute', 'ui.bootstrap', 'angularFileUpload', 'directive.g+signin'])

app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'partials/home.html',
      controller  : 'HomeController'
    })

    .when('/events', {
      templateUrl : 'partials/events.html',
      controller  : 'EventsController'
    })

    .when('/event/:_id/register/:_entry?', {
      templateUrl : 'partials/eventRegister.html',
      controller  : 'EventRegisterController'
    })

    .when('/event/:_id/admin', {
      templateUrl : 'partials/eventAdmin.html', 
      controller  : 'EventAdminController'
    })

    .when('/event/:_id/company/:token', {
      templateUrl : 'partials/companyAdmin.html',
      controller  : 'CompanyAdminController'
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
  return $resource( '/api/users/:_id', {_id: "@_id"}, {'update': { method: 'PUT' }, 'get': {method: 'GET', url: '/me'} });
})

app.factory('Entry', function($resource) {
  return $resource('/api/entries/:_id', {_id: "@_id", populate: 'user companies event'}, {'update': {method: 'PUT'}})
})

app.factory('Company', function($resource) {
  return $resource('/api/companies/:_id', {_id: "@_id"}, {'update': {method: 'PUT'}, 'get': {method: 'GET', isArray: true}})
})

app.controller('HeaderController', function(Me, $scope, $location) {
  $scope.me = Me.get()

  $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
  };

  $scope.$on('event:google-plus-signin-success', function (event,authResult) {
    if (authResult.code) {
      $.post('/auth/google/return', { code: authResult.code})
      .done(function(data) {
        $('#signinButton').hide();
        $scope.me = Me.get(function() {
          $location.url('/profile')
        })
      }); 
    } else if (authResult.error) {
      console.log('There was an error: ' + authResult.error);
    }
  });
})

app.controller('HomeController', function(Me, $scope) {
  $scope.me = Me.get()
})

app.controller('EventsController', function(Event, Me, Company, $scope, $location) {
  $scope.me = Me.get()

  $scope.events = Event.query(function(events) {
    $scope.futureEvents = []
    $scope.currentEvents = []
    $scope.pastEvents = []

    var curTime = new Date()
    for (var i = 0; i < events.length; ++i) {
      e = events[i]
      e.companies = Company.query({conditions: {event: e._id}}) 
      if (curTime > e.endTime) {
        $scope.pastEvents.push(e)
      } else if (curTime < e.startTime) {
        $scope.futureEvents.push(e)
      } else {
        $scope.currentEvents.push(e)
      }
    }
  })

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

app.controller('EventRegisterController', function(Event, Me, Entry, Company, $routeParams, $upload, $location, $scope) {
  
  if ($routeParams._entry) {
    $scope.entry = Entry.get({_id: $routeParams._entry, populate: ""})
    $scope.event = Event.get({_id:$routeParams._id}, function(e, b) {
      $scope.companies = Company.query({conditions: { event: e._id}})
    })
    $scope.me = Me.get()

    $scope.save = function() {
      $scope.entry.event = $scope.event._id 
      $scope.entry.user = $scope.me._id
      $scope.entry.$update()
      $location.url('/updated')
    }
  } else  {
    $scope.entry = new Entry()

    $scope.event = Event.get({_id:$routeParams._id}, function(e, b) {
      $scope.companies = Company.query({conditions: { event: e._id}})
      $scope.entry.event = e
    })

    $scope.me = Me.get(function(me, b) {
      $scope.entry.user = me
      $scope.entry.resume = me.resume
    })

    $scope.save = function() {
      $scope.entry.event = $scope.event._id 
      $scope.entry.user = $scope.me._id
      $scope.entry.$save()

      $location.url('/registered')
    }
  }

  $scope.companyClick = function(id) {
    if (id[0] == '!') {
      id = id.slice(1)
      index = $scope.entry.companies.indexOf(id)
      $scope.entry.companies.splice(index, 1)
    } else {
      if ($scope.entry.companies == undefined) {
        $scope.entry.companies = [id]
      } else {
        $scope.entry.companies.push(id)
      }
    }
  }

  $scope.isChecked = function(id) {
    console.log("WHATS my ID", id) 
    if ($scope.entry == undefined || $scope.entry.companies == undefined) {
      return false
    }
    for (var i = 0; i < $scope.entry.companies.length; ++i) {
      if (id == $scope.entry.companies[i])
        return true
    }
    return false
  }

  $scope.onFileSelect = function($files) {
    var file = $files[0];
    $scope.upload = $upload.upload({
      url: 'upload',
      method: 'POST',
      file: file, 
    }).success(function(data, status, headers, config) {
      $scope.entry.resume = data
    });
  }

})

app.controller('EventAdminController', function(Event, Me, Company, Entry, $routeParams, $scope) {
  $scope.event = Event.get({_id:$routeParams._id}, function(e) {
    $scope.companies = Company.query({conditions: { event: e._id}})
    $scope.entries = Entry.query({conditions: {event: e._id}})
  })

  $scope.newCompany = new Company()

  $scope.deleteCompany = function(company) {
    company.$delete()
    $scope.companies = Company.query({conditions: { event: $scope.event._id}})
  }

  $scope.addCompany = function() {
    $scope.newCompany.event = $scope.event._id;
    $scope.newCompany.$save()
    $scope.newCompany = new Company()

    $scope.companies = Company.query({conditions: { event: $scope.event._id}})
  }
})

app.controller('CompanyAdminController', function(Event, Company, Entry, $routeParams, $scope) {
  $scope.company = Company.get( {conditions: {token: $routeParams.token}}, function(company) {
    $scope.company = company = company[0]
    $scope.event = Event.get({_id: $routeParams._id})
    $scope.entries = Entry.query({conditions: {companies: company._id}, token: company.token})
  })
})

app.controller('ProfileController', function(Me, Event, Entry, $upload, $scope) {
  $scope.grades = ["Freshman", "Sophmore", "Junior", "Senior"]
  $scope.me = Me.get( function(me) {
    $scope.events = Event.query({conditions: {admin: me._id}}, function() {}, function() { $scope.events = [] })
    $scope.entries = Entry.query({conditions: {user: me._id}}, function() {}, function() { $scope.entries = [] })
  })

  $scope.onFileSelect = function($files) {
    var file = $files[0];
    $scope.upload = $upload.upload({
      url: 'upload',
      method: 'POST',
      file: file, 
    }).success(function(data, status, headers, config) {
      $scope.me.resume = data
      $scope.me.$update()
      console.log(data);
    });
  }
})
