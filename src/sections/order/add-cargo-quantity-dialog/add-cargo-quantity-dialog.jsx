const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Translatable = require('epui-intl').mixin;

const AddCargoQuantityDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Order/${__LOCALE__}`)
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    order: PropTypes.object,
    nButtonSave: PropTypes.string,
    nButtonCancel: PropTypes.string,
    nLabelCargoQuantity: PropTypes.string,
    nLabelCargoQuantityUnit: PropTypes.string,
    renderActions: PropTypes.func,
    onRequestClose: PropTypes.func,
    close: PropTypes.func,
  },

  getDefaultProps() {
    return {
      order: null,
    };
  },

  componentDidMount() {
    let order = this.props.order;
    if (this.props.renderActions) {
      let actions = [];
      // if(order._id){
      //   actions.push(
      //     {
      //       ref: 'cancel',
      //       text: this.t('nButtonCancel'),
      //       secondary: true,
      //       raised:false,
      //       onTouchTap: this._handleTouchTapCancel,
      //     }
      //   );
      // }
      actions.push(
        {
           ref: 'cancel',
           text: this.t('nButtonCancel'),
           secondary: true,
           raised:false,
           onTouchTap: this._handleTouchTapCancel,
         },
        {
          ref: 'confirm',
          text: this.t('nButtonSave'),
          primary: true,
          raised: false,
          onTouchTap: this._handleTouchTapConfirm,
        }
      );
      this.props.renderActions(actions);
    }
    if (this.props.onRequestClose) { this.props.onRequestClose(this._handleRequestClose); }
  },

  getStyles() {
    return {
      textFiled: {
        float: 'left',
        marginRight: 20,
      }
    };
  },

  render() {
    let order = this.props.order;
    return (
      <div>
        <TextFieldUnit
          ref='cargoQuantity'
          key='cargoQuantity'
          defaultValue={order.config && order.config.cargoQuantity ? order.config.cargoQuantity : ''}
          floatingLabelText={this.t('nLabelCargoQuantity')}
          style={this.style('textFiled')}
          unitLabelText={this.t('nLabelCargoQuantityUnit')}
        />
        <TextFieldUnit
          ref='cargoType'
          key='cargoType'
          defaultValue={order.config && order.config.cargoType ? order.config.cargoType : ''}
          floatingLabelText={this.t('nLabelCargoType')}
          style={this.style('textFiled')}
        />
      </div>
    );
  },

  _handleRequestClose() {
    return false;
  },

  _handleTouchTapConfirm() {
    let order = this.props.order;
    let cargoQuantity = this.refs.cargoQuantity.getValue();
    let cargoType = this.refs.cargoType.getValue();
    order.config = order.config || {};
    order.config.cargoQuantity = cargoQuantity;
    order.config.cargoType = cargoType;
    if (order._id) {
      global.api.order.updateOrderConfig(order._id, order.config);
    } else {
      global.api.order.createOrder(order);
    }
    this.props.close();
  },

  _handleTouchTapCancel() {
    this.props.close();
  },
});

module.exports = AddCargoQuantityDialog;
