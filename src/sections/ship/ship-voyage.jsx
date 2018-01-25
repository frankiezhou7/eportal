const React = require('react');
const VoyageViewer = require('./voyage-viewer');
const SegmentDetails = require('./segment-details');

let PropTypes = React.PropTypes;

let ShipVoyages = React.createClass({
  contextTypes: {
    muiTheme: PropTypes.object
  },

  render() {
    return (
      <VoyageViewer
        {...this.props}
        details={ <SegmentDetails {...this.props}/> }
      />
    );
  }
});

module.exports = ShipVoyages;
