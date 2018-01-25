const React = require('react');
const _ = require('eplodash');
const AutoIncreaseList = require('epui-md/ep/AutoIncreaseList');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const TugsItem = require('./tugs-item');
const Translatable = require('epui-intl').mixin;

const Tugs = React.createClass({
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
    let value = this.tugs.getValue();

    return _.filter(value, v => v.HP || v.amount);
  },

  isValid() {
    return this.tugs.isValid();
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
    } = this.props;

    let item = <TugsItem key="tugsItem" />;

    let styles = this.getStyles();

    return (
      <AutoIncreaseList
        key="tugs"
        ref={(ref) => this.tugs = ref}
        item={item}
        items={value || []}
        styles={Object.assign(styles.root, style)}
      />
    );
  },
});

module.exports = Tugs;
