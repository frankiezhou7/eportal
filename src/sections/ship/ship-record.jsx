const React = require('react');
const VoyageViewer = require('./voyage-viewer');
const RecordDetails = require('./record/record-details');

let PropTypes = React.PropTypes;

let ShipRecord = React.createClass({
  contextTypes: {
    muiTheme: PropTypes.object
  },

  render() {
    return (
      <VoyageViewer
        {...this.props}
        details={ <RecordDetails {...this.props}/> }
      />
    );
  }
});

module.exports = ShipRecord;
