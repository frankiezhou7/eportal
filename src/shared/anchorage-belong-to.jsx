const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const ToggleButtonGroup = require('epui-md/ep/ToggleButtonGroup');
const Translatable = require('epui-intl').mixin;

const AnchorageBelongTo = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.array,
    terminals: PropTypes.array,
    value: PropTypes.oneOf([
      PropTypes.array,
      PropTypes.string,
    ]),
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    return this.belongTo.getValue();
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let {
      style,
      terminals,
      value,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    return (
      <ToggleButtonGroup
        ref={(ref) => this.belongTo = ref}
        dataField="_id"
        displayField="name"
        items={terminals}
        style={Object.assign(styles.root, style)}
        value={value}
      />
    );
  },
});

module.exports = AnchorageBelongTo;
