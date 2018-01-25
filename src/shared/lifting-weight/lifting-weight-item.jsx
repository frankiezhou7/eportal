const React = require('react');
const _ = require('eplodash');
const DropDownCargoTypes = require('../dropdown-cargo-types');
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const TextField = Validatable(RawTextField);
const PropTypes = React.PropTypes;

const LiftingWeightItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/LiftingWeight/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.object,
    onAdd: PropTypes.func,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {
      value:{

      }
    };
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let maximumLoad = this.refs.liftingWeight.getValue();
    let amount = this.refs.quantity.getValue();

    return {
      maximumLoad,
      amount,
    };
  },

  isValid(){
    let promises = [this.refs.liftingWeight.isValid(),this.refs.quantity.isValid()];
    return new Promise((res, rej) => {
      Promise.all(promises).then((vals) => {
        let valid = _.reduce(vals,(val,init)=>{return val && init ; },true);
        res(valid);
      }).catch(rej);
    })
  },

  handleLiftingWeightChange() {
    let { onAdd } = this.props;
    if (_.isFunction(onAdd)) {
      onAdd();
    }
  },

  handleQuantityChange() {
    let { onAdd } = this.props;
    if (_.isFunction(onAdd)) {
      onAdd();
    }
  },

  getStyles() {
    let styles = {
      root: {},
      textField:{
        marginRight: 10,
        verticalAlign: 'middle'
      }
    };

    return styles;
  },

  render() {
    let { style , value } = this.props;
    let styles = this.getStyles();

    return (
      <div style={Object.assign(styles.root, style)}>
        <TextField
          key="liftingWeight"
          ref="liftingWeight"
          floatingLabelText = {this.t('nTextLiftingWeight')}
          onChange={this.handleLiftingWeightChange}
          style={this.style('textField')}
          validType='number'
          checkOnBlur={true}
          defaultValue = {value.maximumLoad}
        />
        <TextField
          key="quantity"
          ref="quantity"
          floatingLabelText = {this.t('nTextQuantity')}
          onChange={this.handleQuantityChange}
          style={this.style('textField')}
          validType='number'
          checkOnBlur={true}
          defaultValue = {value.amount}
        />
      </div>
    );
  },
});

module.exports = LiftingWeightItem;
