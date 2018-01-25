const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PTOLFVSLInnerForm = require('./ptolfvsl-inner-form');
const AddButton = require('epui-md/svg-icons/content/add');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const TextField = require('epui-md/TextField');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');

const PTOLFVSLInnerConnect = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    config: PropTypes.object,
    style: PropTypes.object,
    getOffLandingArticleTypes: PropTypes.func,
    offLandingArticleTypes: PropTypes.object,
    nLabelOffLandOrdersCount: PropTypes.object,
    nTextHandlingChargeUnit: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let { config } = this.props;
    return {
      orders: [],
      orderId: config.orders && config.orders.length > 0  ? config.orders.length - 1 : 0,
      ordersLength: config.orders ? config.orders.length : 1,
      removedIds: [],
    };
  },

  getValue() {
    let value = [];
    let { orderId, ordersLength, removedIds } = this.state;
    if(ordersLength === 1) ordersLength = 0;
    let length = orderId ? orderId : ordersLength;

    for(let idx = 0; idx <= length; idx++){
      if(_.indexOf(removedIds, idx) !== -1) continue;
      let val = this.refs[`form${idx}`].getValue().orders[0];
      value.push(val);
    }

    return {
      orders: value,
      ordersCount: ordersLength,
    };
  },

  componentDidMount() {
    let {
      getOffLandingArticleTypes,
      offLandingArticleTypes,
    } = this.props;

    if(!offLandingArticleTypes || offLandingArticleTypes.size === 0) {
      if (_.isFunction(getOffLandingArticleTypes)) {
        getOffLandingArticleTypes();
      }
    }
  },

  getStyles() {
    let padding = 2;
    let rootStyle = {
      display: 'block',
      marginBottom: 15,
    };
    if(this.props.style){
      _.merge(rootStyle,this.props.style);
    }
    return {
      root: rootStyle,
      addBtn:{
        width: 120,
        textAlign: 'center',
        margin: '0 auto 20px',
      },
      addBtnLabel:{
        display: 'block',
        marginTop: padding*2,
      },
      initOrder:{
        marginBottom: 20,
      },
      orderCount:{
        marginLeft: 12,
      },
      title: {
        marginBottom: `${padding * 3}px`,
        fontSize: '15px',
        fontWeight: '500px',
      },
    };
  },

  renderInitOrders(){
    let { config } = this.props;
    return (
      <div style={this.style('initOrder')}>
        <TextField
          ref='initOrders'
          key='initOrders'
          style={this.style('orderCount')}
          value={this.state.ordersLength}
          floatingLabelText={this.t('nLabelOffLandOrdersCount')}
          onBlur={this._handleBlur}
          onChange={this._handleInitOrders}
        />
        <span style={this.style('title')}>{this.t('nTextHandlingChargeUnit')}</span>
      </div>
    );
  },

  renderAddBtn() {
    return(
      <div style = {this.style('addBtn')}>
        <FloatingActionButton
          onTouchTap={this._handleAddTouch}
          backgroundColor = {'#f5a623'}
        >
          <AddButton />
        </FloatingActionButton>
        <span style = {this.style('addBtnLabel')}>{this.t('nTextOffLandAddOrder')}</span>
      </div>
    );
  },

  renderMoreForms() {
    let {
      config,
      mode,
      order,
      orderEntry,
      productConfig,
      ...others
    } = this.props;
    let formElems = [];
    let { orderId, ordersLength } = this.state;
    let length = orderId ? orderId : ordersLength;

    if( orderId === 0 ) return;

    for(let idx = 1; idx <= length; idx++){
      formElems.push(
        <PTOLFVSLInnerForm
          ref={`form${idx}`}
          mode={mode}
          order={order}
          orderEntry={orderEntry}
          productConfig={productConfig}
          shipments={config.shipments}
          orderId={idx}
          config={config}
          style={this.style('root')}
          deleteOrder={this._handleDeleteOrder}
          {...others}
        />
      );
    }

    return formElems;
  },

  render() {
    let {
      config,
      mode,
      order,
      orderEntry,
      productConfig,
      ...others
    } = this.props;

    return (
      <div>
        {this.renderInitOrders()}
        {this.renderAddBtn()}
        <PTOLFVSLInnerForm
          {...others}
          style={this.style('root')}
          ref='form0'
          shipments={config.shipments}
          mode={mode}
          order={order}
          orderEntry={orderEntry}
          config={config}
          orderId={0}
          productConfig={productConfig}
        />
        {this.renderMoreForms()}
      </div>
    );
  },

  _handleAddTouch() {
    global.notifyOrderDetailsChange(true);
    let orderId = this.state.orderId + 1;
    this.setState({
      orderId,
      ordersLength: parseInt(this.state.ordersLength) + 1,
    });
  },

  _handleDeleteOrder(orderId) {
    global.notifyOrderDetailsChange(true);
    let { removedIds } = this.state;
    removedIds.push(orderId);

    this.setState({
      removedIds,
      ordersLength: parseInt(this.state.ordersLength) - 1,
    });
  },

  _handleBlur(){
    global.notifyOrderDetailsChange(true);
    let { ordersLength } = this.state;
    this.setState({
      orderId:parseInt(ordersLength) - 1,
      ordersLength:parseInt(ordersLength),
    });
  },

  _handleInitOrders(event){
    const value = event.target.value;
    if(parseInt(value) < 1 || !_.isInteger(Number(value))) {
      alert(this.t('nTextTypeNumError'));
      return;
    }
    this.setState({ordersLength: value});
  },
});

let { getOffLandingArticleTypes } = global.api.order;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      offLandingArticleTypes: state.getIn(['articleType', 'offLandingArticleType']),
      getOffLandingArticleTypes,
    };
  },
  null,
  null,
  {withRef: true}
)(PTOLFVSLInnerConnect);
