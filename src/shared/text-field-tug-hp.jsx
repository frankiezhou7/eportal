const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const TextFieldTugHp = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/PortParticulars/${__LOCALE__}`),
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
    nTextTugsHp: PropTypes.string,
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

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  getStyles() {
    let styles = {};
    return styles;
  },

  getValue() {
    return this.hp.getValue();
  },

  isChanged() {
    return this.hp.isChanged();
  },

  isValid() {
    return this.hp.isValid();
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
      ...other,
    } = this.props;

    return (
      <TextField
        ref={(ref) => this.hp = ref}
        defaultValue={defaultValue}
        disabled={disabled}
        errorStyle={errorStyle}
        errorText={errorText}
        floatingLabelFixed={floatingLabelFixed}
        floatingLabelFocusStyle={floatingLabelFocusStyle}
        floatingLabelStyle={floatingLabelStyle}
        floatingLabelText={floatingLabelText || this.t('nTextTugsHp')}
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
        validType="number"
        value={value}
      />
    );
  },
});

module.exports = TextFieldTugHp;
