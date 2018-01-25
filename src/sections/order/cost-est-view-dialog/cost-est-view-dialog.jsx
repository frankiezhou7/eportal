const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PriceTableView = require('../product-config-forms/components/price-table-view');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const ORDER_ENTRY_STATUS = require('~/src/shared/constants').ORDER_ENTRY_STATUS;
const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;

const CostEstViewDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/PriceConfig/${__LOCALE__}`),
    require(`epui-intl/dist/Order/${__LOCALE__}`)
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    allProducts: PropTypes.any,
    costTypes: PropTypes.any,
    close: PropTypes.func,
    isEstimated: PropTypes.bool,
    nLabelOrderActionAcceptNewOrderEntry: PropTypes.string,
    nLabelOrderActionQuotedAll: PropTypes.string,
    nLabelOrderActionQuotedNewOrderEntry: PropTypes.string,
    nLabelOrderActionRejectNewOrderEntry: PropTypes.string,
    nTextClose: PropTypes.string,
    nTitleConfirmCloseOrder: PropTypes.string,
    onRequestClose: PropTypes.func,
    order: PropTypes.object,
    renderActions: PropTypes.func,
    showRejctConfirm: PropTypes.func,
    segment: PropTypes.object,
    ship: PropTypes.object,
    mode: PropTypes.oneOf(_.values(ORDER_MODE)),
  },

  getDefaultProps() {
    return {
      order: null,
      ship: null,
      segment: null,
      costTypes: null,
      allProducts: null,
      isEstimated: true,
    };
  },

  componentDidMount() {
    let { order, mode } = this.props;
    let statuses = order.getOrderEntryStatuses();
    let lowest = _.head(statuses);
    if(lowest === ORDER_ENTRY_STATUS.INITIAL) { lowest = statuses[1]; }
    let more = statuses.length > 1;
    let more2 = _.filter(statuses, s => s !== ORDER_ENTRY_STATUS.INITIAL).length > 1;
    if (this.props.renderActions) {
      let actions = [];
      if(mode === ORDER_MODE.CONSIGNEE) {
        if (lowest === ORDER_ENTRY_STATUS.EXECUTED && ! this.props.isEstimated) {
          actions = [];
          actions.push({
            ref: 'cancel',
            text: this.t('nTextCancel'),
            primary: true,
            raised: false,
            onTouchTap: this._handleTouchTapCancel,
          });
          actions.push({
            ref: 'closeOrder',
            text: this.t('nTitleConfirmCloseOrder'),
            secondary: true,
            raised: false,
            onTouchTap: this._handleTouchTapCloseOrder.bind(this,'CloseOrder'),
          });
        }else if (lowest === ORDER_ENTRY_STATUS.REJECTED || lowest === ORDER_ENTRY_STATUS.QUOTING) {
          actions = [];
          actions.push({
            ref: 'cancel',
            text: this.t('nTextCancel'),
            primary: true,
            raised: false,
            onTouchTap: this._handleTouchTapCancel,
          });
          actions.push({
            ref: 'quotedOrder',
            text: !more2 ? this.t('nLabelOrderActionQuotedAll') : this.t('nLabelOrderActionQuotedNewOrderEntry'),
            secondary: true,
            raised: false,
            onTouchTap: this._handleTouchTapQuotedOrder.bind(this,!more2 ? 'QuotedAll' :'QuotedNewOrderEntry'),
          });
        } else {
          actions.push(
            {
              ref: 'close',
              text: this.t('nTextClose'),
              secondary: true,
              raised: false,
              onTouchTap: this._handleTouchTapClose,
            }
          );
        }
      }else {
        if(lowest!== ORDER_ENTRY_STATUS.EXECUTED || this.props.isEstimated) {
          actions.push(
            {
              ref: 'close',
              text: this.t('nTextClose'),
              secondary: true,
              raised: false,
              onTouchTap: this._handleTouchTapClose,
            }
          );
        }
        if(lowest === ORDER_ENTRY_STATUS.QUOTED){
          actions = [];
          actions.push({
            ref: 'acceptNewOrderEntry',
            text: !more2 ? this.t('nLabelOrderActionAcceptAll') : this.t('nLabelOrderActionAcceptNewOrderEntry'),
            primary: true,
            raised: false,
            onTouchTap: this._handleTouchTapAcceptNewOrderEntry.bind(this,!more2 ? 'AcceptAll' : 'AcceptNewOrderEntry'),
          });
          actions.push({
            ref: 'rejectNewOrderEntry',
            text: !more2 ? this.t('nLabelOrderActionRejectAll') : this.t('nLabelOrderActionRejectNewOrderEntry'),
            secondary: true,
            raised: false,
            onTouchTap: this._handleTouchTapRejectNewOrderEntry.bind(this,!more2 ? 'RejectAll' : 'RejectNewOrderEntry'),
          });
          actions.push({
            ref: 'close',
            text: this.t('nTextClose'),
            secondary: true,
            raised: false,
            onTouchTap: this._handleTouchTapClose,
          });
        }
      }

      this.props.renderActions(actions);
    }
    if (this.props.onRequestClose) { this.props.onRequestClose(this._handleRequestClose); }
  },

  getStyles() {
    return {
      content: {}
    };
  },

  render() {
    let {
      allProducts,
      costTypes,
      isEstimated,
      order,
      segment,
      ship,
    } =this.props;

    let statuses = order.getOrderEntryStatuses();
    let lowest = _.head(statuses);
    let footer = null;

    let priceTableView = (
      <PriceTableView
        costTypes={costTypes}
        isEstimated = {isEstimated}
        order={order}
        products={allProducts}
        segment={segment}
        ship={ship}
      />
    );

    if (lowest === ORDER_ENTRY_STATUS.EXECUTED && !isEstimated) {
      footer = (<div>
        {this.t('nButtonOkCloseOrder')}
      </div>)
    }

    return(
      <div style={this.style('block.base')}>
        {priceTableView}
        {footer}
      </div>
    );
  },

  _handleRequestClose() {
    return false;
  },

  _handleTouchTapAcceptCostEst() {
    this.props.close();
  },

  _handleTouchTapAcceptNewOrderEntry(state) {
    this.props.order.accept(null,state);
    this.props.close();
  },

  _handleTouchTapRejectNewOrderEntry(state) {
    this.props.close();
    const fn = this.props.showRejctConfirm;
    if(fn && _.isFunction(fn)){
      fn(state);
    }
  },

  _handleTouchTapClose() {
    this.props.close();
  },

  _handleTouchTapCancel() {
    this.props.close();
  },

  _handleTouchTapCloseOrder(state) {
    this.props.order.close(state);
    this.props.close();
  },

  _handleTouchTapQuotedOrder(state) {
    this.props.order.quote(null,state);
    this.props.close();
  },
});

module.exports = CostEstViewDialog;
