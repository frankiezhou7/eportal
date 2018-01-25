const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;
const TextField = Validatable(RawTextField);

const TextFieldShipName = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  translations: [
    require(`epui-intl/dist/ShipParticulars/${__LOCALE__}`),
  ],

  propTypes: {
    onChange: PropTypes.func,
    floatingLabelText: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      value: this.props.value,
    };
  },

  componentWillReceiveProps(nextProps) {
    let { value } = nextProps;
    if (value !== this.state.value) {
      this.setState({
        value: value,
      });
    }
  },

  getStyles() {
    let styles = {};
    return styles;
  },

  getValue() {
    return _.trim(this.state.value);
  },

  isValid() {
    return this.refs.name.isValid();
  },

  render() {
    return (
      <TextField
        {...this.props}
        ref='name'
        floatingLabelText={this.t('nTextShipName')}
        onChange={this._handleChange}
        value={this.state.value}
        required
      />
    );
  },

  _handleChange(e, value) {
    if(this.props.onChange) this.props.onChange(e,value);
    this.setState({
      value: value,
    });
  },

});

module.exports = TextFieldShipName;
