const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Checkbox = require('epui-md/Checkbox');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const CheckboxIcePort = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Port/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    nLabelIcePort: PropTypes.string,
    style: PropTypes.object,
    value: PropTypes.oneOf([
      PropTypes.bool,
      PropTypes.string,
    ]),
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      value: !!this.props.value,
    };
  },

  componentWillReceiveProps(nextProps) {
    let { value } = nextProps;
    if (!!value !== this.state.value) {
      this.setState({
        value: !!value,
      });
    }
  },

  getValue() {
    return this.state.value;
  },

  getStyles() {
    let styles = {
      root: {
        minWidth: 120,
      },
    };

    return styles;
  },

  handleCheck(event, isInputvalue) {
    this.setState({
      value: isInputvalue,
    });
  },

  render() {
    let {
      disabled,
      style,
      ...other,
    } = this.props;

    let { value } = this.state;

    let styles = this.getStyles();

    return (
      <Checkbox
        ref="icePort"
        checked={value}
        disabled={disabled}
        label={this.t('nTextIcePort')}
        onCheck={this.handleCheck}
        style={Object.assign(styles.root, style)}
      />
    );
  },
});

module.exports = CheckboxIcePort;
