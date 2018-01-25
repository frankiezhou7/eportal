const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownStatesInner = require('./dropdown-states-inner');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const DropDownStates = React.createClass({
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
    defaultValue: PropTypes.oneOfType([
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
      state: '',
      value: this.props.value && this.props.value._id,
    };
  },

  clearValue() {
    this.refs.inner.clearValue();
  },

  isChanged() {
    return this.refs.inner.isChanged();
  },

  isValid() {
    return this.refs.inner.isValid();
  },

  getValue() {
    let  { value } = this.state;
    if(_.isObject(value)) {
      value = value && value._id;
    }
    return value;
  },

  getStateValue() {
    return this.state.state;
  },

  setValue(value) {
    this.refs.inner.setValue(value);
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

    return (
      <DropDownStatesInner
        {...other}
        ref="inner"
        value={value}
        onChange={this._handleStateName}
      />
    );
  },

  _getRef() {
    return this.refs.inner;
  },

  _handleStateName(chosenRequest,index,value) {
    this.setState({state:chosenRequest.text, value});
    if(_.isFunction(this.props.onChange)){
      this.props.onChange();
    }
  },
});

module.exports = DropDownStates;
