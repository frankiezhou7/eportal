const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const TextFieldEmail = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    defaultValue: PropTypes.string,
    disabled: PropTypes.bool,
    errorStyle: PropTypes.object,
    errorText: PropTypes.string,
    floatingLabelFixed: PropTypes.bool,
    floatingLabelFocusStyle: PropTypes.object,
    floatingLabelStyle: PropTypes.object,
    floatingLabelText: PropTypes.string,
    fullWidth: PropTypes.bool,
    hintStyle: PropTypes.object,
    hintText: PropTypes.string,
    id: PropTypes.string,
    inputStyle: PropTypes.object,
    nTextEmail: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    required: PropTypes.bool,
    style: PropTypes.object,
    underlineDisabledStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    value: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    return this.email.getValue();
  },

  isChanged() {
    return this.email.isChanged();
  },

  isValid() {
    return this.email.isValid();
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
      errorStyle,
      errorText,
      floatingLabelFixed,
      floatingLabelFocusStyle,
      floatingLabelStyle,
      floatingLabelText,
      fullWidth,
      hintStyle,
      hintText,
      id,
      inputStyle,
      nTextEmail,
      onBlur,
      onChange,
      onFocus,
      required,
      style,
      underlineDisabledStyle,
      underlineFocusStyle,
      underlineStyle,
      value,
    } = this.props;

    let styles = this.getStyles();

    return (
      <TextField
        ref={(ref) => this.email = ref}
        defaultValue={defaultValue}
        disabled={disabled}
        errorStyle={errorStyle}
        errorText={errorText}
        floatingLabelFixed={floatingLabelFixed}
        floatingLabelFocusStyle={floatingLabelFocusStyle}
        floatingLabelText={floatingLabelText || this.t('nTextEmail')}
        fullWidth={fullWidth}
        hintStyle={hintStyle}
        hintText={hintText}
        id={id}
        inputStyle={inputStyle}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        required={required}
        style={style}
        underlineDisabledStyle={underlineDisabledStyle}
        underlineFocusStyle={underlineFocusStyle}
        underlineStyle={underlineStyle}
        validType='email'
        value={value}
      />
    );
  },
});

module.exports = TextFieldEmail;
