var baucis = require('baucis')

exports.init = function(app) {

  var Company = require('../models/company')
  var Entry = require('../models/entry')
  var Event = require('../models/event')
  var User = require('../models/user')

  var EntryController = baucis.rest('Entry');
  var EventController = baucis.rest('Event');
  var UserController = baucis.rest('User');
  var CompanyController = baucis.rest('Company')

  app.use('/api', baucis());

  UserController.query(function(request, response, next) {
    if (!request.isAuthenticated())
      return response.send(401)
  })

  /***
   * User
   * 
   * User GET is from /me in routes/user.js. There will be no getting of the
   * user through the API.
   *
   * The only person allowed to modify the user profile is the logged in user.
   *
   * No one can delete a user. Mwahahaha.
   *
   * XXX: Maybe add a way to delete users?
   ***/
  UserController.request('delete get', function(req, res, next) { return res.send(403) })
  UserController.request('put post', function (req, res, next) {
    if (!req.isAuthenticated())
      return req.send(401);
    
    if (req.user.id != req.params.id)
      return req.send(401)

    next()
  });

  /*** 
  * Event
  *   
  * Even the public can see events!
  *   
  * Only authenticated users can create
  *
  * But only the event admin can modify/delete?
  */
  EventController.request('get', function(req, res, next) { next() })
  EventController.request('post', function(req, res, next) {
    if (!req.isAuthenticated())
      return res.send(401)

    next()
  })
  EventController.request('delete put', function(req, res, next) {
    if (!req.isAuthenticated())
      return res.send(401)

    Event.findById(req.params.id, function(err, model) {
      if (err) 
        return res.send(err, 500)

      if (model.admin != req.user.id)
        return res.send(403)

      next()
    })
  })

  /***
  * Entry
  *
  * Who can see an entry? If you own it, or you an event admin, or you have a company token
  * 
  * POST - Anyone logged in
  * PUT - The owner
  * DELETE - No one, MWAHAHAHAH
  * GET - The Owner, The event Admin, Company with Token
  */
  EntryController.request("delete put", function(req, res, next) {
    if (!req.isAuthenticated())
          return res.send(401)

    Entry.findById(req.params.id).exec(function(err, entry) {
      if (req.user.id == entry.user)
        return next()

      return res.send(401)
    })
  })
  EntryController.request("post", function(req, res, next) {
    if (!req.isAuthenticated())
      return res.send(401)

    next()  
  })
  EntryController.request('instance', 'get', function(req, res, next) {
    var token = req.query.token

    Entry.findById(req.params.id).populate('user event companies').exec(function(err, entry) {
      if (token) {
        var count = 0;
        for (var c = 0; c < entry.companies.length; ++c) {
          if (entry.companies[c].token == token)
            count += 1
        }
        if (count != 0) {
          return next()
        }
      }

      if (req.isAuthenticated() && entry.event.admin.id == req.user.id) {
        return next()
      }

      if (req.isAuthenticated() && req.user.id == entry.user.id) {
        return next()
      }

      return res.send(403)    
    })
  })
  EntryController.request('collection', 'get', function(req, res, next) {
    var token = req.query.token
    Entry.find(req.baucis.conditions).populate('user event companies').exec(function(err, entries) {
      for (var i = 0; i < entries.length; ++i) {
        if (token) {
          var count = 0;
          for (var c = 0; c < entries[i].companies.length; ++c) {
            if (entries[i].companies[c].token == token)
              count += 1
          }
          if (count != 0) {
            continue
          }
        }

        if (req.isAuthenticated() && entries[i].event.admin == req.user.id) {
          continue
        }

        if (req.isAuthenticated() && req.user.id == entries[i].user.id) {
          continue
        }

        return res.send(403)
      }
      next()
    })
  })

  /***
   * Company
   *
   * Anyone can see a company.
   * 
   * Only authenticated people can create a company
   * Only the event admin can modify a company
   * Only the event admin can delete a company
   */
  CompanyController.request('get', function(req, res, next) { next() })
  CompanyController.request('post', function(req, res, next) { 
    if (!req.isAuthenticated())
      return res.send(401)

    next()  
  })
  CompanyController.request('put delete', function(req, res, next) {
    if (!req.isAuthenticated())
      return res.send(401)
  
    Company.findById(req.params.id).populate('event').exec(function(err, company) {
      if (company.event.admin == req.user.id)
        return next()

      return res.send(403)
    })
  })
}