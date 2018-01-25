const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const TextFieldContacts = React.createClass({
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
    nTextFax: PropTypes.string,
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
    contactType: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      ref: Math.random(),
    };
  },

  getValue() {
    return this[this.state.ref].getValue();
  },

  isChanged() {
    return !this[this.state.ref].isChanged();
  },

  isValid() {
    return this[this.state.ref].isValid();
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
      nTextFax,
      onBlur,
      onChange,
      onFocus,
      style,
      underlineDisabledStyle,
      underlineFocusStyle,
      underlineStyle,
      value,
      contactType,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    return contactType !== 'mobile' ? (
      <TextField
        ref={(ref) => this[this.state.ref] = ref}
        {...other}
        defaultValue={this.convertContactsToValue(defaultValue, contactType)}
        disabled={disabled}
        errorStyle={errorStyle}
        errorText={errorText}
        floatingLabelFixed={floatingLabelFixed}
        floatingLabelFocusStyle={floatingLabelFocusStyle}
        floatingLabelText={floatingLabelText}
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
        value={this.convertContactsToValue(value, contactType)}
        validType={this.getValidType(contactType)}
      />
    ) : ( <TextField
            ref={(ref) => this[this.state.ref] = ref}
            {...other}
            defaultValue={this.convertContactsToValue(defaultValue, contactType)}
            disabled={disabled}
            errorStyle={errorStyle}
            errorText={errorText}
            floatingLabelFixed={floatingLabelFixed}
            floatingLabelFocusStyle={floatingLabelFocusStyle}
            floatingLabelText={floatingLabelText}
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
            value={this.convertContactsToValue(value, contactType)}
            validType={this.getValidType(contactType)}
            match={/^\+?[0-9\-\s]*$/}
        />
    );
  },

  getValidType(contactType){
    if(contactType === 'mobile') { return 'match'; }
    if(contactType === 'email') { return 'email'; }
    return null;
  },

  convertContactsToValue(methods,contactType){
    if(!methods || !contactType) return;
    let typeCode = '';
    switch (contactType) {
      case 'mobile':
        typeCode = 'CMM';
        break;
      case 'email':
        typeCode = 'CME';
        break;
      case 'fax':
        typeCode = 'CMF';
        break;
      case 'phone':
        typeCode = 'CMP';
        break;
      case 'web':
        typeCode = 'CMW';
        break;
      default:

    }
    let obj = _.find(methods, {type: typeCode});
    let value = _.get(obj, 'value', '');
    return value;
  },
});

module.exports = TextFieldContacts;
