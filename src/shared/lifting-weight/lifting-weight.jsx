const React = require('react');
const _ = require('eplodash');
const AutoIncreaseList = require('epui-md/ep/AutoIncreaseList');
const LiftingWeightItem = require('./lifting-weight-item');

const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const LiftingWeight = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let el = this.refs.liftingWeight;
    return el.getValue();
  },

  isValid() {
    let el = this.refs.liftingWeight;
    return el.isValid();
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
      value,
      ...other,
    } = this.props;

    let item = <LiftingWeightItem key="liftingWeightItem" />;
    let items = _.map(this.props.value, val => {
      return (
        <LiftingWeightItem
          key={"shipManagementItem_" + (val.maximumLoad || '') + '-' + (val.amount || '')}
          value={val}
        />
      );
    });

    let styles = this.getStyles();

    return (
      <AutoIncreaseList
        key="liftingWeight"
        ref="liftingWeight"
        item={item}
        items={items}
        styles={Object.assign(styles.root, style)}
        value={value || {}}
      />
    );
  },
});

module.exports = LiftingWeight;
