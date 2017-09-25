var ds = require('./data/datasource_avengers.js');

/*The purpose of this file is to avoid  
  calling a specific datasource by name in the main app 

  This way, when new datasources are added, you only need to change this file
  rather than the main app file*/

var config = {
	chart_config:{
		width: 1600, 
		height: 800,
		axis_margins: {left: 150, bottom: 150},
		x_label: "Year",
		y_label: "Count"
	},
	table_config:{},
	datasource: ds
}
module.exports = config;