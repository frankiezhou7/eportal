const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PTSPInnerForm = require('./ptsp-inner-form');
const AddButton = require('epui-md/svg-icons/content/add');
const Dialog = require('epui-md/ep/Dialog');
const FlatButton = require('epui-md/FlatButton');
const TextField = require('epui-md/TextField/TextField');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');

const PTSPInnerConnect = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    require(`epui-intl/dist/Address/${__LOCALE__}`),
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
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let {
      config: {
        orderFiftyLessKg,
        orderOneHundredKg,
        orderTwoHundredKg,
        orderFiveHundredKg,
        orderFiveHundredMoreKg
      },
    } = this.props;

    return {
      orders: [],
      orderFTId: orderFiftyLessKg ? orderFiftyLessKg : 0,
      orderOHId: orderOneHundredKg ? orderOneHundredKg : 0,
      orderTHId: orderTwoHundredKg ? orderTwoHundredKg : 0,
      orderFHId: orderFiveHundredKg ? orderFiveHundredKg : 0,
      orderOFId: orderFiveHundredMoreKg ? orderFiveHundredMoreKg : 0,
      error: false,
    };
  },

  isNotReadyToSave() {
    let saved = [];
    let types = ['FT','OH','TH','FH','OF']
    for(let type of types){
      saved.push(this.isSpecificNotReadyToSave(type));
    }

    if(_.indexOf(saved, true) !== -1){
      return true;
    }else{
      return false;
    }
  },

  isSpecificNotReadyToSave(type){
    let orderId = null;
    let { orderFTId, orderOHId, orderTHId, orderFHId, orderOFId } = this.state;
    switch (type) {
      case 'FT':
        orderId = orderFTId;
        break;
      case 'OH':
        orderId = orderOHId;
        break;
      case 'TH':
        orderId = orderTHId;
        break;
      case 'FH':
        orderId = orderFHId;
        break;
      case 'OF':
        orderId = orderOFId;
        break;
      default:
    }
    for(let idx = 0; idx < orderId; idx++){
      if(this.refs[`form${type}${idx}`].isNotReadyToSave()){
        return true;
      };
    }

    return false;
  },

  getDirtyFiles() {
    let dirtyFiles = [];
    let types = ['FT','OH','TH','FH','OF']
    for(let type of types){
      _.map(this.getSpecificDirtyFiles(type), function(name){
        return dirtyFiles.push(name);
      });
    }
    return _.uniq(dirtyFiles);
  },

  getSpecificDirtyFiles(type){
    let orderId = null, dirtyFiles = [];
    let { orderFTId, orderOHId, orderTHId, orderFHId, orderOFId } = this.state;
    switch (type) {
      case 'FT':
        orderId = orderFTId;
        break;
      case 'OH':
        orderId = orderOHId;
        break;
      case 'TH':
        orderId = orderTHId;
        break;
      case 'FH':
        orderId = orderFHId;
        break;
      case 'OF':
        orderId = orderOFId;
        break;
      default:
    }
    for(let idx = 0; idx < orderId; idx++){
      if(this.refs[`form${type}${idx}`].isNotReadyToSave()){
       _.map(this.refs[`form${type}${idx}`].getDirtyFiles(), function(name){
         return dirtyFiles.push(name);
       });
      }
    }
    return dirtyFiles;
  },

  getValue() {
    let { config } = this.props;

    return {
      orders: {
        ordersFT: this.getSpecificValue('FT'),
        ordersOH: this.getSpecificValue('OH'),
        ordersTH: this.getSpecificValue('TH'),
        ordersFH: this.getSpecificValue('FH'),
        ordersOF: this.getSpecificValue('OF'),
      },
      receiptAdddress: this.refs.receiptAdddress.getValue(),
      orderFiftyLessKg : this.orderFiftyLessKg.getValue(),
      orderOneHundredKg : this.orderOneHundredKg.getValue(),
      orderTwoHundredKg : this.orderTwoHundredKg.getValue(),
      orderFiveHundredKg : this.orderFiveHundredKg.getValue(),
      orderFiveHundredMoreKg : this.orderFiveHundredMoreKg.getValue(),
      feedbackFiles: config.feedbackFiles,
      note: config.note,
    };
  },

  getSpecificValue(type) {
    let orderId = null, value = [];
    let { orderFTId, orderOHId, orderTHId, orderFHId, orderOFId } = this.state;
    switch (type) {
      case 'FT':
        orderId = orderFTId;
        break;
      case 'OH':
        orderId = orderOHId;
        break;
      case 'TH':
        orderId = orderTHId;
        break;
      case 'FH':
        orderId = orderFHId;
        break;
      case 'OF':
        orderId = orderOFId;
        break;
      default:
    }
    for(let idx = 0; idx < orderId; idx++){
      let val = this.refs[`form${type}${idx}`].getValue();
      value.push(val);
    }

    return value;
  },

  getStyles() {
    let padding = 2;
    let rootStyle = {
      display: 'block',
    };
    if(this.props.style){
      _.merge(rootStyle,this.props.style);
    }
    return {
      root: rootStyle,
      addBtn:{
        width: 120,
        textAlign: 'center',
        margin: 'auto',
      },
      addBtnLabel:{
        display: 'block',
        marginTop: padding*2,
      },
      feedbackNote:{
        paddingLeft: padding*13,
        paddingRight: padding*12,
      },
      receiptAdddress:{
        marginBottom: 40,
      },
      receiptAdddressTitle:{
        marginTop: 30,
      },
      title: {
        display: 'block',
        fontSize: '15px',
        fontWeight: '500px',
      },
      orderQuantityDetail: {
        marginBottom: `${padding * 8}px`,
        padding: 20,
      },
      orderQuantity: {
        width: 200,
        display: 'inline-block',
        verticalAlign: 'bottom',
      },
      unit: {
        marginLeft: '5px',
        fontSize: '16px',
        verticalAlign: '10px',
      },
      quantityText: {
        marginRight: `${padding * 20}px`,
        display: 'inline-block',
      },
    };
  },

  renderOrderQuantity() {
    let { config } = this.props;
    const actions = [
      <FlatButton
        label={this.t('nLabelDialogConfirm')}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this._handleDialogClose}
      />,
    ];

    return (
      <div style={this.style('orderQuantityDetail')}>
        <span style={this.style('title')}>{this.t('nTextOrderQuantityDescription')}</span>
        <div style={this.style('quantityText')}>
          <TextField
            ref={(ref) => this.orderFiftyLessKg = ref}
            key='orderFiftyLessKg'
            defaultValue={config.orderFiftyLessKg}
            floatingLabelText={'< 50kg'}
            onChange={this._handleOrderQuantityChange.bind(this,'orderFiftyLessKg')}
            style={this.style('orderQuantity')}
            onBlur={this._handleOrdersGenerate}
          />
          <span style={this.style('unit')}>{this.t('nTextOrderUnit')}</span>
        </div>
        <div style={this.style('quantityText')}>
          <TextField
            ref={(ref) => this.orderOneHundredKg = ref}
            key='orderOneHundredKg'
            defaultValue={config.orderOneHundredKg}
            floatingLabelText={'51-100kg'}
            onChange={this._handleOrderQuantityChange.bind(this,'orderOneHundredKg')}
            style={this.style('orderQuantity')}
            onBlur={this._handleOrdersGenerate}
          />
          <span style={this.style('unit')}>{this.t('nTextOrderUnit')}</span>
        </div>
        <div style={this.style('quantityText')}>
          <TextField
            ref={(ref) => this.orderTwoHundredKg = ref}
            key='orderTwoHundredKg'
            defaultValue={config.orderTwoHundredKg}
            floatingLabelText={'101-200kg'}
            onChange={this._handleOrderQuantityChange.bind(this,'orderTwoHundredKg')}
            style={this.style('orderQuantity')}
            onBlur={this._handleOrdersGenerate}
          />
          <span style={this.style('unit')}>{this.t('nTextOrderUnit')}</span>
        </div>
        <div style={this.style('quantityText')}>
          <TextField
            ref={(ref) => this.orderFiveHundredKg = ref}
            key='orderFiveHundredKg'
            defaultValue={config.orderFiveHundredKg}
            floatingLabelText={'201-500kg'}
            onChange={this._handleOrderQuantityChange.bind(this,'orderFiveHundredKg')}
            style={this.style('orderQuantity')}
            onBlur={this._handleOrdersGenerate}
          />
          <span style={this.style('unit')}>{this.t('nTextOrderUnit')}</span>
        </div>
        <div style={this.style('quantityText')}>
          <TextField
            ref={(ref) => this.orderFiveHundredMoreKg = ref}
            key='orderFiveHundredMoreKg'
            defaultValue={config.orderFiveHundredMoreKg}
            floatingLabelText={'> 500kg'}
            onChange={this._handleOrderQuantityChange.bind(this,'orderFiveHundredMoreKg')}
            style={this.style('orderQuantity')}
            onBlur={this._handleOrdersGenerate}
          />
          <span style={this.style('unit')}>{this.t('nTextOrderUnit')}</span>
        </div>
        <Dialog
          title={this.t('nTextTypeErrorTitle')}
          actions={actions}
          modal={false}
          open={this.state.error}
        >
          {this.t('nTextPostCodeError')}
        </Dialog>
      </div>
    )
  },

  // renderAddBtn() {
  //   return (
  //     <div style = {this.style('addBtn')}>
  //       <FloatingActionButton
  //         onTouchTap={this._handleAddTouch}
  //         backgroundColor = {'#ccc'}
  //       >
  //         <AddButton />
  //       </FloatingActionButton>
  //       <span style = {this.style('addBtnLabel')}>{this.t('nTextAddOrder')}</span>
  //     </div>
  //   );
  // },

  renderForms(type) {
    let {
      config,
      mode,
      order,
      orderEntry,
      productConfig,
      ...others
    } = this.props;
    let formElems = [], orderId = null;
    let { orderFTId, orderOHId, orderTHId, orderFHId, orderOFId } = this.state;
    switch (type) {
      case 'FT':
        orderId = orderFTId;
        break;
      case 'OH':
        orderId = orderOHId;
        break;
      case 'TH':
        orderId = orderTHId;
        break;
      case 'FH':
        orderId = orderFHId;
        break;
      case 'OF':
        orderId = orderOFId;
        break;
      default:
    }

    for(let idx = 0; idx < orderId; idx++){
      formElems.push(
        <PTSPInnerForm
          ref={`form${type}${idx}`}
          mode={mode}
          order={order}
          orderEntry={orderEntry}
          productConfig={productConfig}
          orderId={idx}
          config={config}
          style={this.style('root')}
          type={type}
          deleteOrder={this._handleDeleteOrder}
          {...others}
        />
      );
    }

    return formElems;
  },

  renderReceiptAdddress(){
    const { config } = this.props;
    return(
      <div style ={this.style('feedbackNote')}>
        <TextField
          ref = 'receiptAdddress'
          key = 'receiptAdddress'
          floatingLabelText={this.t('nTextReceiptAdddress')}
          defaultValue = {config && config.receiptAdddress}
          fullWidth = {true}
          onChange = {this._handleChange}
        />
      </div>
    );
  },

  render() {
    let {
      config,
      mode,
      order,
      orderEntry,
      productConfig,
    } = this.props;

    return (
      <div>
        {this.renderOrderQuantity()}
        {this.renderForms('FT')}
        {this.renderForms('OH')}
        {this.renderForms('TH')}
        {this.renderForms('FH')}
        {this.renderForms('OF')}
        {this.renderReceiptAdddress()}
      </div>
    );
  },

  // _handleAddTouch() {
  //   global.notifyOrderDetailsChange(true);
  //   let orderId = this.state.orderId + 1;
  //   this.setState({
  //     orderId,
  //   });
  // },

  // _handleDeleteOrder(orderId) {
  //   global.notifyOrderDetailsChange(true);
  //   let orders = this.getValue().orders;
  //   orders = _.reject(orders, ['orderId', orderId]);
  //   this.setState({
  //     orders
  //   });
  // },

  _handleDialogClose() {
    this.setState({
        error: false,
      });
  },

  _handleOrderQuantityChange(name) {
    global.notifyOrderDetailsChange(true);
    let value = this[name].getValue();
    if(!_.isInteger(Number(value))) {
      this.setState({error:true});
      this[name].clearValue();
    }
  },

  _handleOrdersGenerate(){
    let fiftyLessKg = this.orderFiftyLessKg.getValue() ? parseInt(this.orderFiftyLessKg.getValue()) : 0;
    let oneHundredKg = this.orderOneHundredKg.getValue() ? parseInt(this.orderOneHundredKg.getValue()) : 0;
    let twoHundredKg = this.orderTwoHundredKg.getValue() ? parseInt(this.orderTwoHundredKg.getValue()) : 0;
    let fiveHundredKg = this.orderFiveHundredKg.getValue() ? parseInt(this.orderFiveHundredKg.getValue()) : 0;
    let fiveHundredMoreKg = this.orderFiveHundredMoreKg.getValue() ? parseInt(this.orderFiveHundredMoreKg.getValue()) : 0;
    let total = fiftyLessKg + oneHundredKg + twoHundredKg + fiveHundredKg + fiveHundredMoreKg;
    this.setState({
      orderFTId: fiftyLessKg,
      orderOHId: oneHundredKg,
      orderTHId: twoHundredKg,
      orderFHId: fiveHundredKg,
      orderOFId: fiveHundredMoreKg,
    });
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },
});

module.exports = connect(
  (state, props) => {
    return {
      ...props,
    };
  },
  null,
  null,
  {withRef: true}
)(PTSPInnerConnect);
