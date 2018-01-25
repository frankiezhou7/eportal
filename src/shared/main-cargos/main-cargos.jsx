const React = require('react');
const _ = require('eplodash');
const AutoIncreaseList = require('epui-md/ep/AutoIncreaseList');
const AutoStyle = require('epui-auto-style').mixin;
const MainCargosItem = require('./main-cargos-item');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const MainCargos = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.array,
    ]),
    disabled: PropTypes.bool,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let value = this.payloadTypes.getValue();

    return _.filter(value, v => v.payloadType || v.dischargeRate || v.loadingRate || v.maxCargoQuantityRestriction);
  },

  isValid() {
    return this.payloadTypes.isValid();
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
      disabled
    } = this.props;

    let item = <MainCargosItem key="mainCargosItem" disabled={disabled}/>;

    let styles = this.getStyles();

    return (
      <AutoIncreaseList
        key="payloadTypes"
        ref={(ref) => this.payloadTypes = ref}
        item={item}
        items={value || []}
        styles={Object.assign(styles.root, style)}
      />
    );
  },
});

module.exports = MainCargos;
