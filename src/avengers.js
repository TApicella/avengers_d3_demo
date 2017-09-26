var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');

var master_config = require('../config.js');
var datasource = master_config.datasource;
var chart_config = master_config.chart_config;
var table_config = master_config.table_config;

var Chart = require('./chart.js');
var Table = require('./table.js')


var Avengers = React.createClass({

	getInitialState: function() {
    	return {
      		data: null,   //Used in establishing datasource
      		headers: null,
      		domain: null,
      		chart_data: null,
      		highlight_rows: [], //Rows in table that need to be highlighted
      		chart_config: chart_config	 //One way to do reactive design may be to change these params
      	};
  	},

	componentDidMount: function() {
		//Callback to actually set the state once the data is loaded
		var cb = function(data, headers, domains, chart_data, caller){
			caller.setState({
				data: data,
				headers: headers,
				domain: domains,
				chart_data: chart_data
			});
		};

		//Call to load the csv data
		this.getData = datasource.getData(cb, this);
    },

    componentWillUnmount: function() {
    	this.getData.abort();
  	},

  	barClicked: function(d) {
      //When a bar is clicked, highlight the associated rows
  		var new_rows = "";
  		var keys = this.state.domain.chart_to_table;

  		for(var i=0; i<keys.length; i++){
  			new_rows = new_rows+d[keys[i]];
  			if(i < keys.length-1){
  				new_rows = new_rows+"_"
  			}
  		}
  		var removeRows = false;
  		var rows = this.state.highlight_rows;
  		for(var j=0; j<rows.length; j++){
  			if(rows[j] == new_rows){
  				removeRows = true;
  				rows.splice(j, 1); //Removes the duplicate object
  				break;
  			}
  		}

  		if(!removeRows){
  			rows.push(new_rows); //Adds the new object
  		}
  		this.setState({highlight_rows: rows});
	},

	render: function() {
		        
		if(this.state.chart_data && this.state.data){
			return(
	        	<div className="avengers">
					<Chart data={this.state.chart_data}
					       domain={this.state.domain}
					       config={this.state.chart_config}
					       barClicked={this.barClicked}/>
					<br/>
					<br/>
					<Table data={this.state.data} 
					       headers={this.state.headers}
					       highlight_rows={this.state.highlight_rows}/>
         		</div>
        	);
        }
		else{
			 return(
	        	<div>
	        		Loading...
	        	</div>
	        );
	    }
	}
});

ReactDOM.render(<Avengers/>, document.getElementById('avengers'));
