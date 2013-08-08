module.exports = function(app) {
  // allow connections from different domains
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    next();
  });

  // indicate about yourself
  app.get('/', function(req, res) {
    res.send('Welcome to Porchetta!');
  });
};
