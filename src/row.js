var React = require('react');
var ReactDOM = require('react-dom');

var Row = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  render: function() {

    var all_values = [];
    var className = this.props.rowType+"-cell";
    for(var i=0; i<this.props.values.length; i++){
      var val = this.props.values[i];
      if(val.text == ""){
        val.text = "NA";
      }
      if(val.url){
          all_values.push(<td className={className}><a href={val.url} target="_blank">{val.text}</a></td>);
      }
      else{
          all_values.push(<td className={className}>{val.text}</td>);
      }
    }

    return (
      <tr className={this.props.rowType}>
        {all_values}
      </tr>
    );
  }
});

module.exports = Row