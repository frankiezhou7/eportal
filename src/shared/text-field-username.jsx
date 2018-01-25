const React = require('react');
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const TextFieldUsername = React.createClass({
  mixins: [Translatable],

  translations: [
    require(`epui-intl/dist/User/${__LOCALE__}`),
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

  getValue() {
    return this.refs.tf.getValue();
  },

  isChanged() {
    return this.refs.tf.isChanged();
  },

  isValid() {
    return this.refs.tf.isValid();
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

    style = _.assign({
      verticalAlign: 'middle'
    }, style);

    return (
      <TextField
        ref='tf'
        defaultValue={defaultValue}
        disabled={disabled}
        errorStyle={errorStyle}
        errorText={errorText}
        floatingLabelFixed={floatingLabelFixed}
        floatingLabelFocusStyle={floatingLabelFocusStyle}
        floatingLabelStyle={floatingLabelStyle}
        floatingLabelText={this.t('nLabelUsername') || 'Username'}
        fullWidth={fullWidth}
        hintStyle={hintStyle}
        hintText={hintText}
        id={id}
        inputStyle={inputStyle}
        maxLength={64}
        minLength={6}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        match={/^[A-Za-z0-9@\_\-\.]*$/}
        required={required}
        style={style}
        underlineDisabledStyle={underlineDisabledStyle}
        underlineFocusStyle={underlineFocusStyle}
        underlineStyle={underlineStyle}
        value={value}
      />
    );
  },
});

TextFieldUsername.displayname = 'TextFieldUsername';

module.exports = TextFieldUsername;
