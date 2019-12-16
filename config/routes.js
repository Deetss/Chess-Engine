'use strict';

/**
 * Module dependencies.
 */


const home = require('../app/controllers/home');

/**
 * Expose
 */

module.exports = function(app) {
  app.get('/stream', function (req, res) {
    res.sseSetup()
    res.sseSend(JSON.stringify("test"))

    connections.push(res)
  })

  app.get("/test", function(req, res){
    for(var i = 0; i < connections.length; i++){
      connections[i].sseSend("test")
    }
    res.sendStatus(200)
  })

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
