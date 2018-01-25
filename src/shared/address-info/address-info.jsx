const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const AddressInfoList = require('./address-info-list');

const AddressInfo = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    country: PropTypes.string,
    state: PropTypes.object,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  getValue() {
    return this.refs.address.getValue();
  },

  isValid() {
    return this.refs.address.isValid();
  },

  render() {
    let styles = this.getStyles();
    const {
      country,
      state,
      value,
      ...other,
    } = this.props;
    return (
      <div style={this.style('root')}>
        <AddressInfoList
          key='address'
          ref='address'
          country={country}
          state={state}
          value={value}
          {...other}
        />
      </div>
    );
  },
});

module.exports = AddressInfo;
