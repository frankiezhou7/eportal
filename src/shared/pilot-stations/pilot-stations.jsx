const React = require('react');
const _ = require('eplodash');
const AutoIncreaseList = require('epui-md/ep/AutoIncreaseList');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const PilotStationsItem = require('./pilot-stations-item');
const Translatable = require('epui-intl').mixin;

const PilotStations = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let value = this.pilotStations.getValue();

    return _.filter(value, v => v.name || v.region);
  },

  isValid() {
    return this.pilotStations.isValid();
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let {
      style,
      value,
      ...other,
    } = this.props;

    let item = <PilotStationsItem key="PilotStationsItem" />;

    let styles = this.getStyles();

    return (
      <AutoIncreaseList
        key="pilotStations"
        ref={(ref) => this.pilotStations = ref}
        item={item}
        items={value || []}
        styles={Object.assign(styles.root, style)}
      />
    );
  },
});

module.exports = PilotStations;
