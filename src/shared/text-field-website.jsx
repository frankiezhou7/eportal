const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const TextFieldWebsite = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

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
    nTextWebSite: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    style: PropTypes.object,
    underlineDisabledStyle: PropTypes.object,
    underlineFocusStyle: PropTypes.object,
    underlineStyle: PropTypes.object,
    value: PropTypes.string,
    isUnderlineFocused: PropTypes.bool,
    keyLabel: PropTypes.string,
    keyLabelStyle: PropTypes.object,
  },

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  getStyles() {
    let styles = {};
    return styles;
  },

  getValue() {
    return this.website.getValue();
  },

  isChanged() {
    return !this.website.isChanged();
  },

  isValid() {
    return this.website.isValid();
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
      style,
      underlineDisabledStyle,
      underlineFocusStyle,
      underlineStyle,
      value,
      ...other,
    } = this.props;

    return (
      <TextField
        ref={(ref) => this.website = ref}
        {...other}
        defaultValue={defaultValue}
        disabled={disabled}
        errorStyle={errorStyle}
        errorText={errorText}
        floatingLabelFixed={floatingLabelFixed}
        floatingLabelFocusStyle={floatingLabelFocusStyle}
        floatingLabelStyle={floatingLabelStyle}
        floatingLabelText={floatingLabelText || this.t('nTextWebSite')}
        fullWidth={fullWidth}
        hintStyle={hintStyle}
        hintText={hintText}
        id={id}
        inputStyle={inputStyle}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        style={style}
        underlineDisabledStyle={underlineDisabledStyle}
        underlineFocusStyle={underlineFocusStyle}
        underlineStyle={underlineStyle}
        value={value}
      />
    );
  },
});

module.exports = TextFieldWebsite;
