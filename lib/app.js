const express = require('express');
const nunjucks = require('nunjucks');

const paths = require('./paths');
const website = require('./website');
const logger = require('./logger');
const filters = require('./filters');

exports.build = function(options) {
  options = options || {};

  const app = express();

  if (options.logLevel)
    logger.level(options.logLevel);

  app.use(logger.middleware());
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.static(paths.staticDir));

  var loader = new nunjucks.FileSystemLoader(paths.viewsDir);
  var env = new nunjucks.Environment(loader, {
    autoescape: true
  });
  env.express(app);
  Object.keys(filters).forEach(function(name) {
    env.addFilter(name, filters[name]);
  });
  app.nunjucksEnv = env;

  app.get('/', website.index);

  app.get('/bake', website.redirect('/'));
  app.post('/bake', website.bake);
  
  app.get('/unbake', website.redirect('/'));
  app.post('/unbake', website.unbake);

  return app;
};

