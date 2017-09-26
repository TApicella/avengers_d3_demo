var React = require('react');
var ReactDOM = require('react-dom');
var d3Chart = require('./d3Chart');

/*The idea behind this component and d3Chart is to separate the React functionality from the D3 functionality
  This component handles the state and props, and passses data updates to d3Chart
  In turn, d3Chart is used purely for rendering data 
  This prevents issues where both frameworks try to interact with the DOM independently*/

var Chart = React.createClass({
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var node = ReactDOM.findDOMNode(this);
    var config = this.props.config ;
    var dispatcher = d3Chart.create(node, config, this.getChartState());

    dispatcher.on('bar:click', this.props.barClicked);
    this.dispatcher = dispatcher;
  },

  componentDidUpdate: function() {
    var node = ReactDOM.findDOMNode(this);
    var config = this.props.config;
    d3Chart.update(node, config, this.getChartState(), this.dispatcher);
  },

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  },

  componentWillUnmount: function() {
    var node = ReactDOM.findDOMNode(this);
    d3Chart.destroy(node);
  },

  render: function() {
    return (
      <div className="Chart"></div>
    );
  }
});

module.exports = Chart