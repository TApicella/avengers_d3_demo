var React = require('react');
var ReactDOM = require('react-dom');

var Row = React.createClass({
  displayName: 'Row',

  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  render: function () {

    var all_values = [];
    var className = this.props.rowType + "-cell";
    for (var i = 0; i < this.props.values.length; i++) {
      var val = this.props.values[i];
      if (val.text == "") {
        val.text = "NA";
      }
      if (val.url) {
        all_values.push(React.createElement(
          'td',
          { className: className },
          React.createElement(
            'a',
            { href: val.url, target: '_blank' },
            val.text
          )
        ));
      } else {
        all_values.push(React.createElement(
          'td',
          { className: className },
          val.text
        ));
      }
    }

    return React.createElement(
      'tr',
      { className: this.props.rowType },
      all_values
    );
  }
});

module.exports = Row;