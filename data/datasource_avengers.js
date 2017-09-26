var d3 = require("d3");


//Path and dataCleaner are unique to the specific dataset 
var path = "data/avengers-txt.csv";

//Some mappings to be used in transforming the data
var gendermap = {FEMALE: 0, MALE: 1};
var reverse_gendermap = {0: "FEMALE", 1: "MALE"};

var gendermap_for_legend = [{text: "FEMALE", value: 0},
						   {text: "MALE", value: 1}];

var headers = ["Name/Alias", "Gender", "Year", "Notes"];

var chart_to_table_keys = ["x", "z"];

var convertValue = function(key, val){
	if(key == "z"){
		if(val in gendermap){
			return gendermap[val];
		}
		else if(val in reverse_gendermap){
			return reverse_gendermap[val];
		}
		else{
			return val;
		}
	}
	else{
		return val;
	}
}

var dataCleaner = function(d){
	var avenger = {};
	//Concieveably, we'd want all of them to have links, such as providing citations
	//so there will be a check for url existence in table generation.
	avenger["Name/Alias"] = {text: d["Name/Alias"], url: d["URL"]}; 
	avenger["Gender"] = {text: d["Gender"]};
	avenger["Year"]= {text: d["Year"]};
	avenger["Notes"] = {text: d["Notes"]};
	avenger["highlight_key"] = d["Year"]+"_"+gendermap[d["Gender"]]; //Corresponds with chart bar
	return avenger;
}


var getChartData = function(o, xdomain){
	//Process data into the form the chart needs
    var processed = [];

    for(i = xdomain[0]; i <= xdomain[1]; i++){
    	var stringyear = i.toString();
		var gender = "FEMALE";
		var key = stringyear+"_"+gender;

		//Check if there is a value, if there is not add a value of zero
		if(key in o){
			processed.push({x: stringyear, y:o[key], z: gendermap[gender]});
		}
		else{
			processed.push({x: stringyear, y: 0, z: gendermap[gender]});
		}

		//Repeat for other gender
		var gender = "MALE";
		var key = stringyear+"_"+gender;

		if(key in o){
			processed.push({x: stringyear, y:o[key], z: gendermap[gender]});
		}
		else{
			processed.push({x: stringyear, y: 0, z: gendermap[gender]});
		}
	}
    return processed;
}


var updatePerYear = function(o, d){
	var per_year = o;
	
	//Find highest amount for a given gender/year combination
	var key = d["Year"]+"_"+d["Gender"];
	if(!(key in per_year)){ 
		per_year[key] = 1;
	}
	else{
		per_year[key] = per_year[key]+1;
	}
	return per_year;
}


var findMax = function(o){
	var array = Object.keys(o).map(function(key){ return o[key]; });
	var max = Math.max.apply(null, array);
	return max;
}

var datasource = {
	//getData is as generic as possible
	getData : function(callback, caller){  //Callback is a wrapped setState function
		d3.csv(path, function(data){
			var cleandata = [];
			var minyear = null;
			var maxyear = null;
			var per_year = {};
			var datacounter = 0;
			data.forEach(function(d){
				//Reformat the data for our table
				var cleaned = dataCleaner(d);
				cleandata.push(cleaned);
				
				//We are also going to calculate our domains here for the chart
				//I'd like to make these separate functions if able and make it more of a pipeline, but this is fine for now
				
				//X domain (years)
				var year = +d["Year"];
				if(minyear === null){ 
					minyear = year;
				}
				else if(year < minyear){ 
					minyear = year;
				}

				if(maxyear === null){ 
					maxyear = year;
				}
				else if(year > maxyear){ 
					maxyear = year;
				}
				//Y domain (count) 
				per_year = updatePerYear(per_year, d);
			});
			var maxcount = findMax(per_year);
			var domains = {xdomain: [minyear, maxyear],
						   ydomain: [0, Math.ceil(maxcount*1.1)],//Gives a little buffer space at top of chart
						   zdomain: [0, 1], //Manual based on our gender values. Must always be list of consecutive integers starting at 0
						   zmap : gendermap_for_legend,
						   rev_zmap : reverse_gendermap,
						   chart_to_table: chart_to_table_keys,
						   convertValue: convertValue};
			callback(cleandata, headers, domains, getChartData(per_year, domains.xdomain), caller); //Calls setState
			console.log("Finished loading data");
		}.bind(caller))
	}
}
module.exports = datasource;
