var React = require('react');
var ReactDOM = require('react-dom');

var Row = require('./row.js');

var Table = React.createClass({
  displayName: 'Table',

  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  render: function () {

    var all_rows = [];
    var highlight_keys = this.props.highlight_rows;

    for (var i = 0; i < this.props.data.length; i++) {
      var className = "row";
      var row = this.props.data[i];
      var values = [];

      for (var j = 0; j < this.props.headers.length; j++) {
        var header = this.props.headers[j];
        values.push(row[header]);
      }

      for (var k = 0; k < highlight_keys.length; k++) {
        var key = highlight_keys[k];
        if (row["highlight_key"] == key) {
          className = "highlight-row";
          break;
        }
      }
      all_rows.push(React.createElement(Row, { rowType: className, values: values }));
    }
    console.log(this.props.headers);
    var processed_headers = [];
    for (var m = 0; m < this.props.headers.length; m++) {
      var header_obj = { text: this.props.headers[m] };
      processed_headers.push(header_obj);
    }
    console.log(processed_headers);

    return React.createElement(
      'div',
      { className: 'Table' },
      React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(Row, { rowType: 'header', values: processed_headers })
        ),
        React.createElement(
          'tbody',
          null,
          all_rows
        )
      )
    );
  }
});

module.exports = Table;