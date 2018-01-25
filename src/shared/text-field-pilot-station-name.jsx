const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const TextFieldPolitStationName = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Port/${__LOCALE__}`),
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
    return this.pilotStation.getValue();
  },

  isChanged() {
    return this.pilotStations.isChanged();
  },

  isValid() {
    return this.pilotStation.isValid();
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
      <TextField
        ref={(ref) => this.pilotStation = ref}
        defaultValue={defaultValue}
        disabled={disabled}
        errorText={errorText}
        floatingLabelText={this.t('nLabelPilotStation')}
        hintText={hintText}
        onBlur={onBlur}
        onChange={onChange}
        onFocus={onFocus}
        onTouchTap={onTouchTap}
        style={Object.assign(styles.root, style)}
        required={required}
        value={value}
      />
    );
  },
});

module.exports = TextFieldPolitStationName;
