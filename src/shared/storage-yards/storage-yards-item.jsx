const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownCargoTypes = require('../dropdown-cargo-types');
const PropTypes = React.PropTypes;
const TextFieldCargoVolume = require('../text-field-cargo-volume');
const Translatable = require('epui-intl').mixin;

const items = ['type', 'cargoVolume'];

const StorageYardsItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/StorageYard/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onAdd: PropTypes.func,
    style: PropTypes.object,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  isValid() {
    if(this.__promise) { return this.__promise; }

    let results = [];

    for (let item of items) {
      let el = this[item];
      if (el && _.isFunction(el.isValid)) {
        results.push(el.isValid());
      }
    }

    this.__promise = this.__promise = new Promise((res, rej) => {
      Promise.all(results).then(results => {
        this.__promise = null;
        return res(_.reduce(results, (b, r) => r && b, true));
      }).catch(err => {
        this.__promise = null;
        return rej(err);
      });
    });

    return this.__promise;
  },

  getValue() {
    let value = {};

    for (let item of items) {
      let el = this[item];
      value[item] = el.getValue();
    }

    return value;
  },

  handleAdd() {
    let { onAdd } = this.props;
    if (_.isFunction(onAdd)) {
      onAdd();
    }
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

    let cargoVolume = value && value.cargoVolume;
    let type = value && value.type;
    let styles = this.getStyles();

    return (
      <div style={Object.assign(styles.root, style)}>
        <DropDownCargoTypes
          key="type"
          ref={(ref) => this.type = ref}
          onChange={this.handleAdd}
          value={type}
        />
        <TextFieldCargoVolume
          key="cargoVolume"
          ref={(ref) => this.cargoVolume = ref}
          onChange={this.handleAdd}
          defaultValue={cargoVolume}
        />
      </div>
    );
  },
});

module.exports = StorageYardsItem;
