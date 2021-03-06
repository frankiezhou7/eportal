const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Validatable = require('epui-md/HOC/Validatable');
const TextFieldUnit = Validatable(RawTextFieldUnit);
const Translatable = require('epui-intl').mixin;

const TextFieldLoadingRate = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Berth/${__LOCALE__}`),
  ],

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
    required: PropTypes.bool,
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
    return this.loadingRate.getValue();
  },

  isChanged() {
    return this.loadingRate.isChanged();
  },

  isValid() {
    return this.loadingRate.isValid();
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
      required,
      style,
      value,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    return (
      <TextFieldUnit
        ref={(ref) => this.loadingRate = ref}
        defaultValue={defaultValue}
        disabled={disabled}
        errorText={errorText}
        floatingLabelText={this.t('nTextLoadingRate')}
        hintText={hintText}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onTouchTap={onTouchTap}
        required={required}
        style={Object.assign(styles.root, style)}
        unitLabelText={this.t('nUnitTextLoadingRate')}
        validType="number"
        value={value}
      />
    );
  },
});

module.exports = TextFieldLoadingRate;
