/* eslint-disable no-undef */
'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');

/**
 * Expose
 */
var connections = [];

module.exports = function(app) {
  app.get('/stream', function(req, res) {
    res.sseSetup();
    connections.push(res);
    res.sseSend(connections.length);
  });

  app.get('/connect', function(req, res) {
    for (var i = 0; i < connections.length; i++) {
      connections[i].sseSend(connections.length);
    }
    res.sendStatus(200);
  });

  app.get('/disconnect', function(req, res) {
    for (var i = 0; i < connections.length; i++) {
      var target =
        connections[i].req.sessionID == req.sessionID ? connections[i] : null;
      if (target != null) {
        var index = connections.indexOf(target);
        connections.splice(index, 1);
      }
      target.sseSend(connections.length, 'disconnect');
    }
    res.sendStatus(204);
  });

  app.get('/', home.index);

  /**
   * Error handling
   */

  app.use(function(err, req, res, next) {
    // treat as 404
    if (
      err.message &&
      (~err.message.indexOf('not found') ||
        ~err.message.indexOf('Cast to ObjectId failed'))
    ) {
      return next();
    }
    console.error(err.stack);
    // error page
    res.status(500).render('500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function(req, res) {
    res.status(404).render('404', {
      url: req.originalUrl,
      error: 'Not found'
    });
  });
};
