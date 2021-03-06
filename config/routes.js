/* eslint-disable no-undef */
'use strict';

/**
 * Module dependencies.
 */

const home = require('../app/controllers/home');
const api = require('../app/controllers/api');

/**
 * Expose
 */

module.exports = function(app) {
  app.get('/api/start', api.start);
  app.get('/api/move', api.move);

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
