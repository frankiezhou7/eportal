const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const RawTextFieldTugHp = require('~/src/shared/text-field-tug-hp');
const RawTextFieldTugAmount = require('~/src/shared/text-field-tug-amount');
const Validatable = require('epui-md/HOC/Validatable');
const TextFieldTugHp = Validatable(RawTextFieldTugHp);
const TextFieldTugAmount = Validatable(RawTextFieldTugAmount);
const Translatable = require('epui-intl').mixin;

const items = ['HP', 'amount'];

const TugsItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/PortParticulars/${__LOCALE__}`),
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
      },
    };

    return styles;
  },

  render() {
    let {
      style,
      value,
    } = this.props;

    let hp = value && value.HP;
    let amount = value && value.amount;
    let styles = this.getStyles();

    return (
      <div style={Object.assign(styles.root, style)}>
        <TextFieldTugAmount
          ref={(ref) => this.HP = ref}
          onChange={this.handleAdd}
          style={styles.item}
          defaultValue={hp}
        />
        <TextFieldTugHp
          ref={(ref) => this.amount = ref}
          onChange={this.handleAdd}
          style={styles.item}
          defaultValue={amount}
        />
      </div>
    );
  },
});

module.exports = TugsItem;
