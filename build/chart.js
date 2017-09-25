var React = require('react');
var ReactDOM = require('react-dom');
var d3Chart = require('./d3Chart');

var Chart = React.createClass({
  displayName: 'Chart',

  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  componentDidMount: function () {
    var node = ReactDOM.findDOMNode(this);
    var config = this.props.config;
    var dispatcher = d3Chart.create(node, config, this.getChartState());

    dispatcher.on('bar:click', this.props.barClicked);
    this.dispatcher = dispatcher;
  },

  componentDidUpdate: function () {
    var node = ReactDOM.findDOMNode(this);
    var config = this.props.config;
    d3Chart.update(node, config, this.getChartState(), this.dispatcher);
  },

  getChartState: function () {
    return {
      data: this.props.data,
      domain: this.props.domain
    };
  },

  componentWillUnmount: function () {
    var node = ReactDOM.findDOMNode(this);
    d3Chart.destroy(node);
  },

  render: function () {
    return React.createElement('div', { className: 'Chart' });
  }
});

module.exports = Chart;