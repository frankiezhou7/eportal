const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const TextFieldSeaMapCode = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Port/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    floatingLabelText:PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    return this.seaMapCode.getValue();
  },

  isChanged() {
    return this.seaMapCode.isChanged();
  },

  isValid() {
    return this.seaMapCode.isValid();
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    return (
      <TextField
        {...this.props}
        ref={(ref) => this.seaMapCode = ref}
        floatingLabelText={this.props.floatingLabelText ? this.props.floatingLabelText : this.t('nTextSeaMapCode')}
      />
    );
  },
});

module.exports = TextFieldSeaMapCode;
