const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Validatable = require('epui-md/HOC/Validatable');
const TextFieldUnit = Validatable(RawTextFieldUnit);
const Translatable = require('epui-intl').mixin;

const TextFieldLOA = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    errorText: PropTypes.string,
    floatingLabelText: PropTypes.string,
    hintText: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onTouchTap: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    return this.loa.getValue();
  },

  isChanged() {
    return this.loa.isChanged();
  },

  isValid() {
    return this.loa.isValid();
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let {
      defaultValue,
      disabled,
      errorText,
      floatingLabelText,
      hintText,
      onBlur,
      onChange,
      onFocus,
      onTouchTap,
      style,
      value,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    return (
      <TextFieldUnit
        ref={(ref) => this.loa = ref}
        defaultValue={defaultValue}
        disabled={disabled}
        errorText={errorText}
        floatingLabelText={this.t('nTextMaxLOA')}
        hintText={hintText}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onTouchTap={onTouchTap}
        style={style}
        unitLabelText={this.t('nTextMeter')}
        validType="number"
        value={value}
      />
    );
  },
});

module.exports = TextFieldLOA;
