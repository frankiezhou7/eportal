const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownCounteriesInner = require('./dropdown-countries-inner');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const DropDownCountries = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    menuStyle: PropTypes.object,
    keyLabel: PropTypes.string,
    keyLabelStyle: PropTypes.object,
    floatingLabelText: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
    onChange: PropTypes.func,
    required: PropTypes.bool,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      country: '',
    };
  },

  isValid() {
    let el = this._getRef();
    return el.isValid();
  },

  isChanged() {
    let el = this._getRef();
    return el.isChanged();
  },

  clearValue() {
    let el = this._getRef();
    el.clearValue();
  },

  getValue() {
    let el = this._getRef();
    return el.getValue();
  },

  getCountryValue() {
    return this.state.country;
  },

  setValue(value) {
    let el = this._getRef();
    el.setValue(value);
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let {
      value,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    value = value && _.isObject(value) ? value._id : value;

    return (
      <DropDownCounteriesInner
        {...other}
        ref="inner"
        value={value}
        onChange={this._handleCountryName}
      />
    );
  },

  _getRef() {
    return this.refs.inner.getWrappedInstance();
  },

  _handleCountryName(chosenRequest,index,value) {
    this.setState({country:chosenRequest.text})
    if(_.isFunction(this.props.onChange)){
      this.props.onChange();
    }
  },
});

module.exports = DropDownCountries;
