const React = require('react');
const _ = require('eplodash');
const AutoIncreaseList = require('epui-md/ep/AutoIncreaseList');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const ShipManagementItem = require('./ship-management-item');
const Translatable = require('epui-intl').mixin;

const ShipManagements = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    value: PropTypes.array,
  },

  getDefaultProps() {
    return {
      value: [],
    };
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let el = this.refs.shipManagements;
    return el.getValue();
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let { style } = this.props;
    let item = <ShipManagementItem key="shipManagementItem" />;
    let items = _.map(this.props.value,val=>{
      return (
        <ShipManagementItem
          key={"shipManagementItem_"+(val.role||'')+'-'+(val.organization.text||'')+'-'+(val.organization.value||'')}
          value = {val}
        />);
    });
    let styles = this.getStyles();

    return (
      <AutoIncreaseList
        key="shipManagements"
        ref="shipManagements"
        item={item}
        items ={items}
        styles={Object.assign(styles.root, style)}
      />
    );
  },
});

module.exports = ShipManagements;
