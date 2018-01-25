const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const FlatButton = require('epui-md/FlatButton');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const CreateOrder = require('./create-order');
const SPECIAL_TYPE_CODE = 'OTOPA';
const PropTypes = React.PropTypes;

const CreateOrderForm = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ShipDialog/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    account: PropTypes.object,
    allProducts: PropTypes.object,
    costTypes: PropTypes.object,
    findOrdersByVoyageSegmentId: PropTypes.func,
    createOrder: PropTypes.func,
    getCostTypes: PropTypes.func,
    getProducts: PropTypes.func,
    nLabelAddCargoQuantityTitle: PropTypes.string,
    orders: PropTypes.object,
    segment: PropTypes.string,
    ship: PropTypes.object,
    user: PropTypes.object,
    voyageSegments: PropTypes.object,
    fromNewVoyage: PropTypes.bool,
    findShipById: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {

    };
  },

  componentWillMount() {
    this._getShipDetails();
  },

  getStyles() {
    let theme = this.context.muiTheme;
    return {
      root: {},
      tip: {
        margin: '20px 0',
        display: 'block',
        fontSize: 14,
      },
      title: {
        fontSize: 16,
        color: '#4a4a4a',
        display: 'block',
        margin: '20px 0 25px',
      },
    };
  },

  render() {
    let {
      account,
      orders,
      segment,
      ship,
      user,
      voyageSegments,
      fromNewVoyage,
      ...others
    } = this.props;

    return (
      <div>
        <span style={this.style('title')}>
          {this.t('nTextCreateOrder')}
        </span>
        <span style={this.style('tip')}>
          {this.t('nTextGuideToCreateOrder')}
        </span>
        <CreateOrder
          ref='form'
          ship={this.state.ship}
          segment={segment}
          orders={orders}
          user={user}
          account={account}
          createOrderFunc={this._createOrderFunc}
          voyageSegments={voyageSegments}
          fromNewVoyage={fromNewVoyage}
          {...others}/>
      </div>
    );
  },

  _getShipDetails() {
    let ship = this.props.ship;
    let id = ship && ship._id;
    let fn = this.props.findShipById;
    if (_.isFunction(fn)) {
      fn.promise(id)
      .then(res => {
        if(res.status === 'OK'){
          this.setState({ship:res.response});
        }
      });
    }
  },

  _createOrderFunc(order) {
    let { ship } = this.state;

    let rawShip = ship;

    if (!rawShip) { return; }

    let nrtIctm69 = rawShip.nrt && rawShip.nrt.ictm69;
    let grtIctm69 = rawShip.grt && rawShip.grt.ictm69;
    let nationality = rawShip.nationality && rawShip.nationality;
    let type = rawShip.type;
    let length = rawShip.length && rawShip.length.overall;
    let orderType = order.type;
    if ((nrtIctm69 && grtIctm69 && nationality && type && length && orderType !== SPECIAL_TYPE_CODE) ||
      (orderType === SPECIAL_TYPE_CODE && nationality && type)
    ) {
      let needCargoQuantityTypes = ['OTCL', 'OTCD', 'OTPCD', 'OTPCL'];
      let cargoQuantity = order.config && order.config.cargoQuantity ? order.config.cargoQuantity : undefined;
      if(_.includes(needCargoQuantityTypes, orderType) && !cargoQuantity) {
        let props = {
          title: this.t('nLabelAddCargoQuantityTitle'),
          open: true,
          modal: true,
        };
        let cargoQuantityEle = {
          name: 'CargoQuantityDialog',
          props: {
            order: order,
          },
        };
        let globalDialog = global.register.dialog;
        if (globalDialog) { globalDialog.generate(props, cargoQuantityEle); }

      }else {
        this.props.createOrder(order);
      }
    } else {
      let globalAlert = global.alert;
      let content = this.t('nTextImproveShipInfo');
      let title = this.t('nTitleImproveShipInfo');
      let onConfirm = this._handleConfirm;
      if (globalAlert) { globalAlert(content, title, onConfirm); }
    }
  },

  _handleConfirm() {
    let { ship } = this.props;
    let shipId = ship && ship._id;

    if (shipId) {
      let globalDialog = global.register.dialog;
      let props = {
        title: this.t('nTitleUpdateShipInfo'),
        open: true,
      };

      let component = {
        name: 'ShipFormConnect',
        props: {
          shipId: shipId,
        },
      };

      let alertProps = {
        open: false,
        modal: true,
      };

      let alertEle = {
        name: 'Alert',
      };

      if (global.register.dialog) {
        globalDialog.generate(alertProps,alertEle);
        globalDialog.generate(props, component);
      }
    }
  },
});

module.exports = CreateOrderForm;
