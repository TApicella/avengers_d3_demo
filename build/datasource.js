var ds = require('../data/datasource_avengers.js');

/*The purpose of this file is to avoid  
  calling a specific datasource by name in the main app 

  This way, when new datasources are added, you only need to change this file
  rather than the main app file*/

var datasource = ds;
module.exports = datasource;