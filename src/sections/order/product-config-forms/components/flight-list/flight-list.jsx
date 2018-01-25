const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const FlightItem = require('./flight-item');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const FlightleList = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    flightsInfos: PropTypes.array,
    nLabelFlightsInfo: PropTypes.string,
    onAddFlight: PropTypes.func,
    onChoosePerson:PropTypes.func,
    onRemoveFlight: PropTypes.func,
    onRemoveFlightInfo: PropTypes.func,
    onRemovePerson:PropTypes.func,
    personsToChoose:PropTypes.array,
  },

  getDefaultProps() {
    return {
      flightsInfos: [],
      personsToChoose: [],
    };
  },

  getInitialState() {
    return {};
  },

  getFlightsInfos() {
    let flightsInfos = this.props.flightsInfos;
    _.forEach(flightsInfos, flightInfo => {
      if (this.refs[flightInfo.id]) {
        let newFlightInfo = this.refs[flightInfo.id].getFlightInfo();
        flightInfo = newFlightInfo;
      }
    });

    return flightsInfos;
  },

  getStyles() {
    let styles = {
      flightList: {
        marginTop: 10,
        marginBottom: 10,
      },
      title: {
        fontSize: 16,
        fontWeight: 300,
        display: 'block',
        padding: '10px 0px 10px 10px',
        backgroundColor: '#edf5fe',
      },
    };

    return styles;
  },

  renderTitle() {
    return (
      <span style={this.style('title')}>{this.t('nLabelFlightsInfo')}</span>
    );
  },

  render() {
    let styles = this.getStyles();
    let flightElems = [];
    let flightsInfos = this.props.flightsInfos;

    _.forEach(flightsInfos, (flightInfo, index) => {
      let flightChild = null;
      flightElems.push(
        <FlightItem
          key={flightInfo.id}
          ref={flightInfo.id}
          flightInfo={flightInfo}
          onAddFlight={this.props.onAddFlight}
          onChoosePerson={this.props.onChoosePerson}
          onRemoveFlight={this.props.onRemoveFlight}
          onRemoveFlightInfo={this.props.onRemoveFlightInfo}
          onRemovePerson={this.props.onRemovePerson}
          personsToChoose={this.props.personsToChoose}
        />
      );
    });

    return (
      <Paper zDepth={1} style={this.style('flightList')}>
        {flightElems}
      </Paper>
    );
  },
});

module.exports = FlightleList;
