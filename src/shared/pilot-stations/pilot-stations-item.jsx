const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextFieldLocation = require('~/src/shared/text-field-location');
const RawTextFieldPilotStationName = require('~/src/shared/text-field-pilot-station-name');
const Validatable = require('epui-md/HOC/Validatable');
const TextFieldLocation = Validatable(RawTextFieldLocation);
const TextFieldPilotStationName = Validatable(RawTextFieldPilotStationName);
const Translatable = require('epui-intl').mixin;

const items = ['name', 'region'];

const MainCargosItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Port/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onAdd: PropTypes.func,
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
    let value = {};

    for (let item of items) {
      let el = this[item];
      value[item] = el.getValue();
    }

    return value;
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

  handleAdd() {
    let { onAdd } = this.props;
    if (_.isFunction(onAdd)) {
      onAdd();
    }
  },

  getStyles() {
    let styles = {
      root: {},
      item: {
        marginRight: '10px',
        display: 'inline-block',
        verticalAlign: 'middle',
      },
    };

    return styles;
  },

  render() {
    let {
      style,
      value,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    return (
      <div style={Object.assign(styles.root, style)}>
        <TextFieldPilotStationName
          ref={(ref) => this.name = ref}
          defaultValue={value && value.name}
          onChange={this.handleAdd}
          style={styles.item}
        />
        <TextFieldLocation
          ref={(ref) => this.region = ref}
          defaultValue={value && value.region}
          onChange={this.handleAdd}
          style={styles.item}
        />
      </div>
    );
  },
});

module.exports = MainCargosItem;
