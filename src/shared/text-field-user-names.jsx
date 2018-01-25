const React = require('react');
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const TextFieldUserNames = React.createClass({
  mixins: [Translatable],

  translations: [
    require(`epui-intl/dist/User/${__LOCALE__}`),
  ],

  propTypes: {
    defaultValue: PropTypes.object,
    disabled: PropTypes.bool,
    errorStyle: PropTypes.object,
    errorText: PropTypes.string,
    floatingLabelFixed: PropTypes.bool,
    floatingLabelFocusStyle: PropTypes.object,
    floatingLabelStyle: PropTypes.object,
    floatingLabelText: PropTypes.string,
    fullWidth: PropTypes.bool,
    rootStyle: PropTypes.object,
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
    value: PropTypes.object,
  },

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  getValue() {
    return {
      givenName: this.refs.givenName.getValue(),
      surname: this.refs.surname.getValue(),
    };
  },

  isChanged() {
    return this.refs.givenName.isChanged() || this.refs.surname.isChanged();
  },

  isValid() {
    return Promise.all([
      this.refs.givenName.isValid(),
      this.refs.surname.isValid(),
    ]);
  },

  render() {
    let {
      defaultValue,
      disabled,
      errorStyle,
      floatingLabelFixed,
      floatingLabelFocusStyle,
      floatingLabelStyle,
      inputStyle,
      required,
      style,
      rootStyle,
      underlineDisabledStyle,
      underlineFocusStyle,
      underlineStyle,
      value,
      ...other,
    } = this.props;

    const base = {
      disabled,
      errorStyle,
      floatingLabelFixed,
      floatingLabelFocusStyle,
      floatingLabelStyle,
      inputStyle,
      maxLength: 64,
      onBlur: this._handleBlur,
      onChange: this._handleChange,
      onFocus: this._handleFocus,
      required,
      underlineDisabledStyle,
      underlineFocusStyle,
      underlineStyle,
    };

    const propsLeft = {
      ref: 'givenName',
      name: 'givenName',
      style: { verticalAlign: 'middle' },
      floatingLabelText: this.t('nLabelGivenName'),
    };
    const propsRight = {
      ref: 'surname',
      name: 'surname',
      style: { verticalAlign: 'middle', marginLeft: '16px' },
      floatingLabelText: this.t('nLabelSurname'),
    }

    if(rootStyle){
      Object.assign(propsRight.style,rootStyle);
      Object.assign(propsLeft.style,rootStyle);
    }

    if(defaultValue) {
      propsLeft.defaultValue = defaultValue.givenName;
      propsRight.defaultValue = defaultValue.surname;
    } else if(value) {
      propsLeft.value = value.givenName;
      propsRight.value = value.surname;
    }

    const left = React.createElement(TextField, _.assign(propsLeft, base));
    const right = React.createElement(TextField, _.assign(propsRight, base));

    return (
      <div style={style}>
        {left}
        {right}
      </div>
    );
  },

  _handleBlur() {
    if(this.props.onBlur) {
      this.props.onBlur(this);
    }
  },

  _handleChange() {
    if(this.props.onChange) {
      this.props.onChange(this, this.getValue());
    }
  },

  _handleFocus() {
    if(this.props.onFocus) {
      this.props.onFocus(this);
    }
  }
});

TextFieldUserNames.displayname = 'TextFieldUserNames';

module.exports = TextFieldUserNames;
