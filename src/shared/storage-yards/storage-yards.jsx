const React = require('react');
const _ = require('eplodash');
const AutoIncreaseList = require('epui-md/ep/AutoIncreaseList');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const StorageYardsItem = require('./storage-yards-item');
const Translatable = require('epui-intl').mixin;

const StorageYards = React.createClass({
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
    let el = this.cargoVolumes;
    let value = el.getValue();

    return _.filter(value, v => v.type || v.cargoVolume);
  },

  isValid() {
    return this.cargoVolumes.isValid();
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

    let item = <StorageYardsItem key="storageYardsItem" />;

    let styles = this.getStyles();

    return (
      <AutoIncreaseList
        key="cargoVolumes"
        ref={(ref) => this.cargoVolumes = ref}
        item={item}
        items={value || []}
        styles={Object.assign(styles.root, style)}
      />
    );
  },
});

module.exports = StorageYards;
