module.exports = function(req, res, next) {
  res.sseSetup = function() {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    });
  };

  res.sseSend = function(data, event = '') {
    if (event !== '') {
      res.write('event:' + JSON.stringify(event) + '\n');
    }
    res.write('data: ' + JSON.stringify(data) + '\n\n');
    res.flush();
  };

  res.sseEnd = function() {
    res.end();
  };

  next();
};
