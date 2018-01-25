const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const CostTree = require('./cost-list');
const FlatButton = require('epui-md/FlatButton');
const OrderEntryEventsView = require('./order-entry-events-view');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const OrderMixin = require('./mixins/order');
const PriceConfigForms = require('./product-config-forms/price');
const PriceTable = require('./product-config-forms/components/price-table');
const ProductConfigForms = require('./product-config-forms/config');
const FeedbackConfigForms = require('./product-config-forms/feedback');
const Loading = require('epui-md/ep/RefreshIndicator');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField');
const Translatable = require('epui-intl').mixin;
const metaHelper = require('~/src/store/models/mixins/metaHelper');
const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;
const NRT = 'NRT';
const GRT ='GRT';
const ORDER_TYPE = 'ORDER_TYPE';
const EVENT_PAGE = 'EVENT_PAGE';
const CONFIG_PAGE = 'CONFIG_PAGE';
const PRICE_PAGE = 'PRICE_PAGE';
const FILE_PAGE = 'FILE_PAGE';
const MESSAGE_PAGE = 'VIEW_MESSAGE';

const OrderEntryDetails = React.createClass({
  mixins: [AutoStyle, Translatable, OrderMixin, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/OrderEntryDetails/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    segment: PropTypes.object,
    ship: PropTypes.object,
    page: PropTypes.string,
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    products: PropTypes.object,
    subProducts: PropTypes.object,
    costTypes: PropTypes.object,
    params: PropTypes.object,
    changed: PropTypes.bool,
    nButtonAcceptCost: PropTypes.string,
    nButtonAcceptEstCost: PropTypes.string,
    nButtonBlameCost: PropTypes.string,
    nButtonFinishCost: PropTypes.string,
    nButtonFinishEstCost: PropTypes.string,
    nButtonRejectEstCost: PropTypes.string,
    nTextSaveProductConfig: PropTypes.string,
    nLabelExpenseTotal: PropTypes.string,
    nTextErrorOccurred: PropTypes.string,
    nTextIntroToAddCostItem: PropTypes.string,
    nTextOrderEntryCostIntroducation: PropTypes.string,
    nTextOrderEntryEsitmatedCostIntroducation: PropTypes.string,
    nTextSavingOrderEntry: PropTypes.string,
    nTextSavingProductConfig: PropTypes.string,
    nTextSavingActProductConfig: PropTypes.string,
    nTextSavingProductConfigDirty: PropTypes.string,
    nTitleEvents: PropTypes.string,
    nLabelCostAct: PropTypes.string,
    nTitleOrderEntryEstimatedCost: PropTypes.string,
    nTitleOrderEntryProductConfig: PropTypes.string,
    nTitleOrderEntryEventLog: PropTypes.string,
    nTitleOrderEntryIntro: PropTypes.string,
    nTitlePriceConfig: PropTypes.string,
    nTitlePriceEst: PropTypes.string,
    nTitlePriceTotal: PropTypes.string,
    nTitlePriceAct: PropTypes.string,
    nTextEmptyProductConfig: PropTypes.string,
    nTextEmptyProductPrice: PropTypes.string,
    onDirty: PropTypes.func,
    onOpenMessage: PropTypes.func,
    nTextOnQuotingProductPrice: PropTypes.string,
    nTextRefreshProductConfig: PropTypes.string,
    updateProductConfigForOrderAndCalculateOrderEntryFee: PropTypes.func,
    nTextTipsBeforeCost: PropTypes.string,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState: function() {
    return {
      summary: {},
      isDirty: false,
      taskInfo: null,
      refresh: false,
    };
  },

  componentWillMount() {

  },

  componentDidMount() {
    if(!this.props.orderEntry) { return; }
    let page = this.props.params.page;
    let orderId = this.props.params.orderId;
    let order = this.props.order;
    if(order && order._id == orderId && page === MESSAGE_PAGE && this.props.onOpenMessage){
      this.props.onOpenMessage();
    }
  },

  shouldComponentUpdate(nextProps){
    let entry = nextProps.orderEntry;
    let preEntry = this.props.orderEntry;
    let subProducts = nextProps.subProducts;
    let productConfig = entry.productConfig;
    let order = nextProps.order;
    if(metaHelper(order).isDoing('calculateOrderEntryFee')) return false;
    if(!subProducts || subProducts.getMeta('loading')) return false;
    //if(!productConfig || productConfig.getMeta('loading')) return false;
    if(preEntry && preEntry.get('_id')!==entry.get('_id')) return false;
    return true;
  },

  componentWillReceiveProps(nextProps) {
    let next = nextProps.orderEntry;
    let curr = this.props.orderEntry;
    let nextProductConfig = next.productConfig;
    let nextV = next.__v;
    let nextOrder = nextProps.order;
    let error = next.getError();
    if(error && error !== curr.getError()) {
      global.pushInfo(this.t('nTextErrorOccurred', { code: error.code }));
    }
    this.setState({
      summary: {
        cost: this._sumAmount(next.costItems),
        estCost: this._sumAmount(next.costItemsEstimated),
      }
    });

    if(nextOrder){
      if(metaHelper(nextOrder).isDoing('findOrderById')){
        if(!this.state.refresh) this.setState({refresh : true});
      }else{
        if(this.state.refresh) this.setState({refresh : false});
      }
    }
  },

  save() {
    if(!this.isDirty()) { return; }

    let order = this.props.order;
    let orderEntry = this.props.orderEntry;

    let obj = {};

    let tree = this.refs.costTree;
    if(tree && tree.isDirty()) {
      obj.costItems = tree.getValue();
      obj.amountConfirmed = tree.getTotal();
      tree.clearDirty();
    }

    tree = this.refs.estCostTree;
    if(tree && tree.isDirty()) {
      obj.costItemsEstimated = tree.getValue();
      obj.amountEstimated = tree.getTotal();
      tree.clearDirty();
    }

    let intro = this.refs.intro.getValue();
    if(intro !== (orderEntry.extra && orderEntry.extra.intro)) {
      obj.extra = _.merge({}, orderEntry.extra, {
        intro: intro
      });
    }

    if(_.keys(obj).length) {
      orderEntry.update(obj);
    }

    if(this.refs.events.isDirty()) {
      this.refs.events.save();
    }

    global.pushInfo(this.t('nTextSavingOrderEntry'));
  },

  isDirty() {
    return this.state.isDirty;
  },

  getStyles() {
    let palette = this.context.muiTheme.palette;
    let padding = 2;
    let styles = {
      title: {
        padding: '8px 12px',
        fontSize: 16
      },
      block: {
        base: {

        },
        brief: {
          position: 'relative',
          paddingTop: 10,
        },
        title: {
          display: 'inline-block',
          fontSize: 14,
          fontWeight: 'bold',
          padding: '10px 12px'
        },
        intro: {
          width: '100%',
          textAlign: 'center',
          color: palette.greyColor,
          fontSize: 12,
        },
        inner: {
          width: '100%',
          padding: '10px 12px',
        },
        right: {
          position: 'absolute',
          top: 0,
          right: 12,
        },
        buttons: {
          marginRight: 12,
          marginTop: 2,
          verticalAlign: 'top',
          display: 'inline-block',
        },
        button: {
          marginLeft: 12,
        }
      },
      summary: {
        base: {
          display: 'inline-block',
          textAlign: 'right',
        },
        label: {
          fontSize: 12,
        },
        amount: {
          display: 'block',
          fontSize: 16,
          fontWeight: 'bold',
          color: palette.accent1Color,
          textAlign: 'right',
        }
      },
      priceConfigContainer:{
        marginBottom: padding*11,
      },
      priceContainer:{
        padding: padding*7,
        margin: padding*5,
      },
      priceConfigTitle:{
        fontSize: 16,
        fontWeight: 500,
        marginBottom: 8,
      },
      priceEst:{
        fontSize: 16,
        fontWeight: 500,
        // float: 'left',
      },
      priceTotalContainer:{
        float: 'right',
        marginTop: 25,
      },
      priceTotal:{
        fontSize: 15,
        fontWeight: 300,
        display: 'block',
        verticalAlign: 'middle',
        textAlign: 'center',
      },
      priceNumber:{
        display: 'block',
        color: palette.accent1Color,
        marginTop: 7,
        fontSize : 20,
        fontWeight: 700,
        verticalAlign: 'middle',
        textAlign: 'right',
      },
      titleContainer:{
        marginBottom: padding*7,
      },
      emptyForm:{
        textAlign : 'center',
        paddingTop : padding*24,
        fontSize: 15,
        fontWeight: 300,
      },
      tipsBeforeCost:{
        textAlign: 'center',
        paddingTop: padding,
        marginBottom: 12,
        fontSize: 14,
        fontWeight: 300,
        color: '#9b9b9b'
      },
    };

    return styles;
  },

  validatePrice() {
    let validate = true;

    this.props.orderEntry.productConfig.products.forEach((product) => {
      if (product.get('select') && this.refs['priceTable_' + product.get('product').get('code')]) {
        validate = validate && this.refs['priceTable_' + product.get('product').get('code')].validatePrice();
      }
    });

    return validate;
  },

  saveProductConfig() {
    let {
      order,
      orderEntry,
      updateProductConfigForOrderAndCalculateOrderEntryFee,
    } = this.props;

    let productConfig = orderEntry.productConfig;
    let costItemsEstimated = [];
    let existTable = false;
    let costItems = [];
    let viewPriceEst = this._isViewPriceEst();

    switch (this.props.page) {
      case CONFIG_PAGE:
        if(this.refs.productConfigForm.getDirtyFiles && this.refs.productConfigForm.getDirtyFiles().length > 0) {
          global.pushInfo(this.t('nTextSavingProductConfigDirty',{names: this.refs.productConfigForm.getDirtyFiles().join(',')}));
          return;
        }
        productConfig = this.refs.productConfigForm.getProductConfig();
        break;
      case FILE_PAGE:
        if(this.refs.feedbackConfigForm.getDirtyFiles && this.refs.feedbackConfigForm.getDirtyFiles().length > 0) {
          global.pushInfo(this.t('nTextSavingProductConfigDirty',{names: this.refs.feedbackConfigForm.getDirtyFiles().join(',')}));
          return;
        }
        productConfig = this.refs.feedbackConfigForm.getProductConfig();
        break;
      case PRICE_PAGE :
        if (!this.validatePrice()) {
          return;
        }
        this.props.orderEntry.productConfig.products.forEach(product => {
          if (product.get('select') && this.refs['priceTable_' + product.get('product').get('code')]) {
            existTable = true;
            if (viewPriceEst) {
              let costItemsEstimatedAdded = this.refs['priceTable_' + product.get('product').get('code')].getCostItemAdded();
              _.forEach(costItemsEstimatedAdded, itemAdded => {
                costItemsEstimated.push(itemAdded);
              });
            } else {
              let costItemsAdded = this.refs['priceTable_' + product.get('product').get('code')].getCostItemAdded();
              _.forEach(costItemsAdded, itemAdded => {
                costItems.push(itemAdded);
              });
            }
          }
        });
        if (this.refs.priceConfigForm) {
          productConfig = this.refs.priceConfigForm.getProductConfig();
        }
        break;
      default :
    }
    if (!existTable) {
      if (viewPriceEst) {
        costItemsEstimated = this._populateCostItems(this.props.orderEntry.costItemsEstimated.toJS());
        costItemsEstimated = _.filter(costItemsEstimated, item => {
          let selected = true;
          _.forEach(productConfig.products, product => {
            let productId = _.isString(product.product)
              ? product.product
              : product.product._id;
            if (item.product._id === productId) {
              selected = product.select;
            }
          });
          return item.isAdd && selected;
        });
      } else {
        costItems = this._populateCostItems(this.props.orderEntry.costItems.toJS());
        costItems = _.filter(costItems, item => {
          let selected = true;
          _.forEach(productConfig.products, product => {
            let productId = _.isString(product.product)
              ? product.product
              : product.product._id;
            if (item.product._id === productId) {
              selected = product.select;
            }
          });
          return item.isAdd && selected;
        });
      }
    }
    if(viewPriceEst && !order.hasAnyExecuting() && !order.hasAllExecuted()) {
      global.pushInfo(this.t('nTextSavingProductConfig'));
    }else {
      global.pushInfo(this.t('nTextSavingActProductConfig'));
    }
    if (productConfig) {
      if (viewPriceEst && global.api.order.updateProductConfigForOrderAndCalculateOrderEntryFee) {
        global.api.order.updateProductConfigForOrderAndCalculateOrderEntryFee(
          this.props.order._id,
          this.props.orderEntry._id,
          this.props.segment.arrivalPort._id,
          this.props.order.__v,
          this.props.orderEntry.__v,
          this.props.order.type.code,
          productConfig,
          costItemsEstimated,
        );
      } else if(global.api.order.updateProductConfigForOrderAndUpdateOrderEntryCostItems){
        global.api.order.updateProductConfigForOrderAndUpdateOrderEntryCostItems(
          this.props.order._id,
          this.props.orderEntry._id,
          productConfig,
          costItems,
          this.props.order.__v,
          this.props.orderEntry.__v
        );
      }
    }
    global.notifyOrderDetailsChange(false);
  },

  renderGetConfigTips(){
    let proCodeArray=['PTCC','PTSPSLGA','PTRSCC','PTOMREQ','PTSV','PTISP','PTCLN','PTEC'];
    let {orderEntry} = this.props;
    if(proCodeArray.indexOf(orderEntry.product.code) !== -1){
      return (
        <div style={this.style('tipsBeforeCost')}>
          {this.t('nTextTipsBeforeCost')}
        </div>
      )
    }
  },

  renderFeedbackConfig() {
    let {
      mode,
      segment,
      order,
      orderEntry,
      subProducts
    } = this.props;
    let productConfig = orderEntry.productConfig;
    if (!productConfig) { return null; }
    let feedbackConfigFormsObj = FeedbackConfigForms[orderEntry.product.code];
    let FeedbackConfigForm = feedbackConfigFormsObj ? feedbackConfigFormsObj.form : undefined;
    let feedbackConfigFormEl = null;
    if (this.state.refresh) {
      feedbackConfigFormEl = (
        <div style={this.style('emptyForm')}>
          {this.t('nTextRefreshProductConfig')}
        </div>
      );
    } else {
      if (FeedbackConfigForm) {
        feedbackConfigFormEl = (
          <div>
            <FeedbackConfigForm
              {...this.props}
              ref='feedbackConfigForm'
              mode={mode}
              order={order}
              orderEntry={orderEntry}
              productConfig={productConfig}
              subProducts={subProducts}
            />
          </div>

        );
      }
    }
    return(
      <div style={this.style('block.base')}>
        <div style={this.style('block.brief')}>
          {feedbackConfigFormEl}
        </div>
      </div>
    );
  },

  renderProductConfig() {
    let {
      mode,
      segment,
      order,
      ship,
      orderEntry,
      costTypes,
      subProducts
    } = this.props;
    let viewPriceEst = this._isViewPriceEst();
    let productConfig = orderEntry.productConfig;
    if (!productConfig) { return null; }
    let ProductConfigFormObj = ProductConfigForms[orderEntry.product.code];
    let ProductConfigForm = ProductConfigFormObj ? ProductConfigFormObj.form : undefined;
    let productConfigFormEl = null;
    if (this.state.refresh) {
      productConfigFormEl = (
        <div style={this.style('emptyForm')}>
          {this.t('nTextRefreshProductConfig')}
        </div>
      );
    } else {
      if (ProductConfigForm) {
        productConfigFormEl = (
          <div>
            {this.renderGetConfigTips()}
            <ProductConfigForm
              {...this.props}
              ref='productConfigForm'
              costTypes={costTypes}
              mode={mode}
              order={order}
              orderEntry={orderEntry}
              productConfig={productConfig}
              segment={segment}
              ship={ship}
              subProducts={subProducts}
              viewPriceEst={viewPriceEst}
            />
          </div>

        );
      }
      // else {
      //   productConfigFormEl = (
      //     <div style={this.style('emptyForm')}>
      //       {this.t('nTextEmptyProductConfig')}
      //     </div>
      //   );
      // }
    }
    return(
      <div style={this.style('block.base')}>
        <div style={this.style('block.brief')}>
          {productConfigFormEl}
        </div>
      </div>
    );
  },

  renderProductPrice() {
    let {
      segment,
      changed,
      costTypes,
      mode,
      order,
      orderEntry,
      ship,
      subProducts,
    } = this.props;

    let productConfig = orderEntry.productConfig;
    if (!productConfig) { return null; }

    let viewPriceEst = this._isViewPriceEst();
    let editPrice = this._isPriceFormEditable();
    let costItems = this._populateCostItems(orderEntry.costItems.toJS());
    let costItemsEstimated = this._populateCostItems(orderEntry.costItemsEstimated.toJS());

    let PriceConfigFormObj = PriceConfigForms[orderEntry.product.code];
    let PriceConfigForm = PriceConfigFormObj ? PriceConfigFormObj.form : undefined;
    let productsSelected = subProducts && subProducts.size > 0 ? false : true;

    let priceConfigTitle = PriceConfigForm ? (
        <div key='priceConfigTitle' style={this.style('priceConfigTitle')}>
          {this.t('nTitlePriceConfig')}
        </div>
      ) : null;
    let priceTables = [];
    let priceItems = viewPriceEst ? costItemsEstimated : costItems;
    let currentExchange = order && order.currentExchange;

    productConfig.products.forEach((product, index) => {
      let hasLumpsum = product.getIn(['config','hasLumpsum']) || false;
      if(!viewPriceEst) hasLumpsum = false;
      if (product.get('select')) {
        productsSelected = true;
        priceTables.push(
          <PriceTable
            {...this.props}
            ref={'priceTable_' + product.get('product').get('code')}
            key={'priceTable_' + product.get('product').get('code')}
            changed={changed}
            costItems={this._getCostItemsByProductCode(priceItems, product.get('product').get('code'))}
            isEditable={!hasLumpsum && editPrice}
            hasLumpsum={product.getIn(['config','hasLumpsum'])}
            isEstimated={viewPriceEst}
            product={this._filterProductCostTypesByOrderType(product.get('product').toJS(), this.props.order.get('type').get('code'))}
            productConfig={productConfig}
            tableIndex={index + 1}
            exchange={currentExchange}
        />);
      }
    });
    let priceConfigFormElem = null;
    if (PriceConfigForm) {
      priceConfigFormElem = (
        <PriceConfigForm
          ref='priceConfigForm'
          key='priceConfigForm'
          costTypes={costTypes}
          isEditable={editPrice}
          order={order}
          orderEntry={orderEntry}
          productConfig={productConfig}
          segment={segment}
          ship={ship}
          style={this.style('priceConfigContainer')}
          subProducts={subProducts}
        />
      );
    }
    let priceConfigElem = null;
    if (mode === ORDER_MODE.CONSIGNEE && viewPriceEst) {
      priceConfigElem = [];
      priceConfigElem.push(priceConfigTitle);
      priceConfigElem.push(priceConfigFormElem);
    }
    let priceEstEmpty = (
      <div style={this.style('emptyForm')}>
        {this.t('nTextEmptyProductPrice')}
      </div>
    );
    let priceOnQuoting = (
      <div style={this.style('emptyForm')}>
        {this.t('nTextOnQuotingProductPrice')}
      </div>
    );
    let showPriceTable = this._showEstPrice();
    let priceEstTitle = (
      <div style={this.style('titleContainer')}>
        <span style={this.style('priceEst')}>{viewPriceEst ? this.t('nTitlePriceEst') : this.t('nTitlePriceAct')}</span>
        <div style={this.style('priceTotalContainer')}>
          <span style={this.style('priceTotal')}>{this.t('nTitlePriceTotal')}</span>
          <span style={this.style('priceNumber')}>${this._sumAmount(viewPriceEst ? costItemsEstimated : costItems)}</span>
        </div>
      </div>
    );
    return (
      <div style={this.style('block.base')}>
        <div style={this.style('priceContainer')}>
          {priceConfigElem}
          {productsSelected ? (showPriceTable ? priceEstTitle : null) : priceEstEmpty}
          {showPriceTable ? priceTables : (productsSelected ? priceOnQuoting : null)}
        </div>
      </div>
    );
  },

  renderOrderEvents(){
    let {
      mode,
      order,
      orderEntry,
      segment,
      ship,
    } = this.props;

    return (
      <OrderEntryEventsView
        {...this.props}
        ref='events'
        accountType={mode}
        ship={ship}
        segment={segment}
        order={order}
        orderEntry={orderEntry}
      />
    );
  },

  renderEventTree() {
    let {
      order,
      orderEntry,
      segment,
      ship,
    } = this.props;

    let product = orderEntry.product;

    return (
      <div style={this.style('block.base')}>
        <div style={this.style('block.brief')}>
          <span style={this.style('block.title')}>{this.t('nTitleOrderEntryEventLog')}</span>
        </div>
      </div>
    );
  },

  renderIntro() {
    let orderEntry = this.props.orderEntry;
    let extra = orderEntry.extra || {};

    return (
      <div style={this.style('block.base')}>
        <div style={this.style('block.brief')}>
          <span style={this.style('block.title')}>{this.t('nTitleOrderEntryIntro')}</span>
        </div>
        <div style={this.style('block.inner')}>
          <TextField
            ref='intro'
            key={orderEntry._id + 'intro'}
            defaultValue={extra.intro}
            fullWidth={true}
            multiLine={true}
            rowsMax={6}
          />
        </div>
      </div>
    );
  },

  renderLoadingPage() {
    return (
      <div style = {this.style('emptyForm')}>
        <Loading />
      </div>
    );
  },

  render() {
    let orderEntry = this.props.orderEntry;
    if(!this.props.orderEntry) { return null; }
    let styles = this.getStyles();
    let content = null;
    if(this.props.page === EVENT_PAGE) {
      content = this.renderOrderEvents();
    }
    if(this.props.page === CONFIG_PAGE) {
      content = this.renderProductConfig();
    }
    if(this.props.page === PRICE_PAGE) {
      content = this.renderProductPrice();
    }
    if(this.props.page === FILE_PAGE) {
      content = this.renderFeedbackConfig();
    }
    return (
      <div>{content}</div>
    );
  },

  _isViewPriceEst(){
    let mode = this.props.mode;
    let viewPriceEst =true;
    let orderEntry = this.props.orderEntry;
    // switch (mode) {
    //   case ORDER_MODE.CONSIGNER:
    //       viewPriceEst=orderEntry.withinExecuted();
    //     break;
    //   case ORDER_MODE.CONSIGNEE:
    //       viewPriceEst=orderEntry.withinExecuting();
    //     break;
    //   default:
    // }
    // return viewPriceEst;
    return orderEntry.withinExecuting();
  },

  _isPriceFormEditable(){
    let mode = this.props.mode;
    let editable = true;
    let orderEntry = this.props.orderEntry;
    switch (mode) {
      case ORDER_MODE.CONSIGNER:
        editable = false;
        break;
      case ORDER_MODE.CONSIGNEE:
        if(orderEntry.withinQuoted()){
          editable = true;
        }else if(orderEntry.beyondQuoted() && orderEntry.withinExecuting()){
          editable=false;
        }else if(orderEntry.isExecuting()){
          editable=true;
        }else{
          editable=false;
        }
        break;
      default:
    }
    return editable;
  },

  _populateCostItems(costItems){
    let types =  this.props.costTypes.toJS();
    let products = this.props.subProducts && this.props.subProducts.size >0 ?
                   this.props.subProducts.toJS(): (this.props.products ? this.props.products.toJS():null);
    if(!costItems || !types || !products) { return null; }
    let populateItems = _.map(costItems,costItem=>{
      let product =null;
      if(_.isString(costItem.costType)){
        costItem.costType =_.find(types,type => {
          return type._id == costItem.costType;
        });
      }
      _.forEach(products,pt=>{
        if(pt._id === costItem.product) costItem.product =pt;
      });
      return costItem;
    });
    return populateItems;
  },

  _getCostTypes() {
    let entry = this.props.orderEntry;
    let types =  this.props.costTypes;
    if(!entry || !types) { return null; }
    return entry.product.costTypes.map((id) => {
      if(!_.isString(id)) { return id; }
      return types.find((type) => {
        return type._id === id;
      });
    });
  },

  _handleEstCostTreeChange() {
    let summary = this.state.summary;
    summary.estCost = this.refs.estCostTree.getTotal();
    this.setState({
      summary: summary,
      isDirty: true,
    });
  },

  _handleCostTreeChange(val) {
    let summary = this.state.summary;
    summary.cost = this.refs.costTree.getTotal();
    this.setState({
      summary: summary,
      isDirty: true,
    });
  },

  _reject() {
    this.props.orderEntry.setQuoting();
    global.pushInfo(this.t('nTextSavingOrderEntry'));
  },

  _accept() {
    this.props.orderEntry.setAccepted();
    global.pushInfo(this.t('nTextSavingOrderEntry'));
  },

  _quoted() {
    let obj = {};
    let tree = this.refs.estCostTree;
    if(tree && tree.isDirty()) {
      obj.costItemsEstimated = tree.getValue();
      tree.clearDirty();
    }
    this.props.orderEntry.setQuoted(obj);
    global.pushInfo(this.t('nTextSavingOrderEntry'));
  },

  _finishCost() {
    let obj = {};

    let tree = this.refs.costTree;
    if(tree && tree.isDirty()) {
      obj.costItems = tree.getValue();
    }
    this.props.orderEntry.setExecuted(obj);
    global.pushInfo(this.t('nTextSavingOrderEntry'));
  },

  _sumAmount(items) {
    if(!items) return 0;
    let totalAmount = items.reduce((total,item) => {
      if(!_.isNumber(item.amount)) { return total; }
      return total + item.amount;
    }, 0);
    return totalAmount.toFixed(2);
  },

  _getCostItemsByProductCode(costItems, productCode) {
    return _.filter(costItems,costItem => {
      return costItem.product.code == productCode;
    });
  },

  _filterProductCostTypesByOrderType(product, orderTypeCode) {
    let costTypes = _.filter(product.costTypes, costType => {
      if(costType.tags) {
        let contains = false;
        _.forEach(costType.tags, tag => {
          if(tag.orderTypeCode === orderTypeCode ) {
            contains = true;
          }
        });
        return contains;
      }
      return true;
    });
    product.costTypes = costTypes;
    return product;
  },

  _showEstPrice() {
    let showPriceTable = true;
    if(this.props.mode === ORDER_MODE.CONSIGNER && this.props.orderEntry.withinQuoted()){
      showPriceTable = false;
    }
    return showPriceTable;
  },
});

module.exports = OrderEntryDetails;
