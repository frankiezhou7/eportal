const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const postCode = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Address/${__LOCALE__}`),
  ],

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
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    required: PropTypes.bool,
    style: PropTypes.object,
    underlineDisabledStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    value: PropTypes.string,
    nTextPortName: PropTypes.string,
    validType: PropTypes.oneOf(['string', 'number', 'integer', 'email', 'url', 'match']),
    checkOnBlur: PropTypes.bool,
    validError: PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func,
    ]),
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    return this.name.getValue();
  },

  isChanged() {
    return this.name.getChanged();
  },

  isValid() {
    return this.name.isValid();
  },

  getStyles() {
    let styles = {
      root: {
        margin: '0 2px',
      },
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
      onBlur,
      onChange,
      onFocus,
      required,
      style,
      underlineDisabledStyle,
      underlineFocusStyle,
      underlineStyle,
      value,
      validType,
      checkOnBlur,
      validError,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    return (
      <TextField
        ref={(ref) => this.name = ref}
        defaultValue={defaultValue}
        disabled={disabled}
        errorStyle={errorStyle || {top:'72',position:'absolute'}}
        errorText={errorText}
        floatingLabelFixed={floatingLabelFixed}
        floatingLabelFocusStyle={floatingLabelFocusStyle}
        floatingLabelStyle={floatingLabelStyle}
        floatingLabelText={this.t('nTextPostCode') || floatingLabelText}
        fullWidth={fullWidth}
        hintStyle={hintStyle}
        hintText={hintText}
        id={id}
        inputStyle={inputStyle}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        required={required}
        style={Object.assign(styles.root, style)}
        underlineDisabledStyle={underlineDisabledStyle}
        underlineFocusStyle={underlineFocusStyle}
        underlineStyle={underlineStyle}
        value={value}
        validType={validType || 'number'}
        checkOnBlur={checkOnBlur || true}
        validError={validError || this.t('nTextPostCodeError')}
        maxLength={16}
      />
    );
  },
});

module.exports = postCode;
