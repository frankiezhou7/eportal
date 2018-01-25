const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const ComponentArray = {
  'TextField': require('epui-md/TextField/TextField'),
  'TextFieldUnit': require('epui-md/TextField/TextFieldUnit'),
  'DropDownMenu': require('epui-md/ep/EPDropDownMenu')
};
const Dialog = require('epui-md/ep/Dialog');
const FlatButton = require('epui-md/FlatButton');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const VIO_CODE = 'PTVIO';

let PTVIOPriceConfigForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/PriceConfig/${__LOCALE__}`),
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    require(`epui-intl/dist/Address/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    isEditable: PropTypes.bool,
    orderEntry: PropTypes.object,
    subProducts: PropTypes.object,
    productConfig: PropTypes.object,
    order : PropTypes.object,
    ship : PropTypes.object.isRequired,
    style: PropTypes.object,
    nLabelChineseTonnage: PropTypes.string,
    nLabelShipNRT:PropTypes.string,
    nLabelMTUnit:PropTypes.string,
    nLabelShipNationality:PropTypes.string,
    nLabelDaysStay:PropTypes.string,
    nLabelDaysStayUnit:PropTypes.string,
    nLabelPilotage: PropTypes.string,
    nLabelTimeUnit: PropTypes.string,
    nLabelNormalSurcharge: PropTypes.string,
    nLabelHolidaySurcharge: PropTypes.string,
    nLabelShipBerth:PropTypes.string,
    nLabelPilotageOut:PropTypes.string,
    nLabelPilotageIn:PropTypes.string,
    nLabelTowage : PropTypes.string,
    nLabelTugIn:PropTypes.string,
    nLabelWorkHours:PropTypes.string,
    nLabelTugOut:PropTypes.string,
    nLabelNormalSurchargeTugIn:PropTypes.string,
    nLabelNormalSurchargeTugOut:PropTypes.string,
    nLabelHolidaySurchargeTugIn:PropTypes.string,
    nLabelHolidaySurchargeTugOut:PropTypes.string,
    nLabelShipLength:PropTypes.string,
    nLabelTowageForQuarantine:PropTypes.string,
    nLabelTugWorkHours:PropTypes.string,
    nLabelBerthage:PropTypes.string,
    nLabelBerthageDays:PropTypes.string,
    nLabelAnchorage:PropTypes.string,
    nLabelAnchorageDays:PropTypes.string,
    nLabelShipDisinfectionCharge:PropTypes.string,
    nLabelShipGRT:PropTypes.string,
  },

  getInitialState(){
    return{
      error: false,
      open: false,
    }
  },

  getDefaultProps() {
    return {
      orderEntry:null,
      subProducts:null,
      productConfig: null,
      ship: null,
      isEditable :true,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    let rootStyle = {};
    let dropDownMenuMarginTop =0;
    if(this.props.style){
      _.merge(rootStyle, this.props.style);
    }
    let styles = {
      root:rootStyle,
      navigation:{
        position: 'absolute',
        marginTop: -32,
        marginLeft: 90,
        cursor: 'pointer',
      },
      title:{
        marginTop: 25,
        fontSize: 14,
      },
      child:{
        marginRight: 20,
        display: 'inline-block',
        width: 185,
      },
      component:{
        margin: 5,
        marginLeft: 0,
        display: 'block',
        verticalAlign: 'top',
      },
      underlineStyle:{
        marginLeft: 0,
        marginRight: 0,
        marginTop:dropDownMenuMarginTop,
      },
      iconStyle:{
        top: 18+dropDownMenuMarginTop,
        right: -5
      },
      labelStyle:{
        marginLeft: 0,
        marginTop:dropDownMenuMarginTop,
      },
      dropDownMenuStyle:{
        verticalAlign: 'top',
      },
      input:{
        width: '100%',
      },
      hidden:{
        display: 'none',
      },
      tonnage:{
        marginBottom: 10,
      },
    };
    return styles;
  },

  getProductConfig(){
    let productConfig = this._getProductConfig();
    let products = _.map(productConfig.products,product=>{
      product.product = product.product._id;
      if(product.costTypes){
        delete product.costTypes;
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  render() {
    let productConfig = this.props.productConfig.toJS();
    let priceConfig = this._getPriceConfig(productConfig);
    let ship = this.props.ship.toJS();
    let order = this.props.order.toJS();
    let configs={
      "CTCNTGDUE":{
        "name":this.t('nLabelChineseTonnage'),
        "components":[{
          description:this.t('nLabelShipNRT'),
          floatingLabelFixed: true,
          variable: 'NRT',
          unit:this.t('nLabelMTUnit'),
          show: false,
          defaultValue: ship.nrt && ship.nrt.ictm69 ? ship.nrt.ictm69 === 0 ? '' : ship.nrt.ictm69 : '',
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelShipNationality'),
          floatingLabelFixed: true,
          variable: 'TONNAGE_DUE_FLAG',
          show: false,
          defaultValue: ship.nationality && ship.nationality.code ? ship.nationality.code === 0 ? '' : ship.nationality.code : '',
          component: 'TextField'
        },{
          description:this.t('nLabelDaysStay'),
          variable: 'TONNAGE_DUE_DAYS',
          unit:this.t('nLabelDaysStayUnit'),
          show: true,
          defaultValue: priceConfig['CTCNTGDUE|TONNAGE_DUE_DAYS|value']|| 0,
          menuItems: this._getTonnageMenuItems(priceConfig['CTCNTGDUE|TONNAGE_DUE_DAYS|value']).menuItems,
          selectedIndex:this._getTonnageMenuItems(priceConfig['CTCNTGDUE|TONNAGE_DUE_DAYS|value']).selectedIndex,
          component: 'DropDownMenu'
        }]
      },
      "CTPLTGE":{
        "name":this.t('nLabelPilotage'),
        "components":[{
          description:this.t('nLabelShipNRT'),
          floatingLabelFixed: true,
          variable: 'NRT',
          unit:this.t('nLabelMTUnit'),
          show: false,
          defaultValue: ship.nrt && ship.nrt.ictm69 ? ship.nrt.ictm69 === 0 ? '' : ship.nrt.ictm69 : '',
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelPilotage'),
          floatingLabelFixed: true,
          variable: 'PILOTAGE_TIMES',
          unit:this.t('nLabelTimeUnit'),
          show: true,
          defaultValue: priceConfig['CTPLTGE|PILOTAGE_TIMES|value'] === 0 ? '' : priceConfig['CTPLTGE|PILOTAGE_TIMES|value'],
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelNormalSurcharge'),
          floatingLabelFixed: true,
          variable: 'NORMAL_SURCHAGE_TIMES',
          unit:this.t('nLabelTimeUnit'),
          show: true,
          defaultValue:priceConfig['CTPLTGE|NORMAL_SURCHAGE_TIMES|value'] === 0 ? '' : priceConfig['CTPLTGE|NORMAL_SURCHAGE_TIMES|value'],
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelHolidaySurcharge'),
          floatingLabelFixed: true,
          variable: 'HOLIDAY_SURCHAGE_TIMES',
          unit:this.t('nLabelTimeUnit'),
          show: true,
          defaultValue: priceConfig['CTPLTGE|HOLIDAY_SURCHAGE_TIMES|value'] === 0 ? '' : priceConfig['CTPLTGE|HOLIDAY_SURCHAGE_TIMES|value'],
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelPilotageOut'),
          floatingLabelFixed: true,
          variable: 'PILOTAGE_OUT_TIME',
          show: false,
          defaultValue: '1000-01-01',
          component: 'TextField'
        },{
          description:this.t('nLabelPilotageIn'),
          floatingLabelFixed: true,
          variable: 'PILOTAGE_IN_TIME',
          unit:this.t('nLabelTimeUnit'),
          show: false,
          defaultValue: '1000-01-01',
          component: 'TextField'
        }]
      },
      "CTSFBCG":{
        "name":this.t('nLabelShipBerth'),
        "components":[{
            description:this.t('nLabelShipNRT'),
            floatingLabelFixed: true,
            variable: 'NRT',
            unit:this.t('nLabelMTUnit'),
            show: false,
            defaultValue: ship.nrt && ship.nrt.ictm69 ? ship.nrt.ictm69 === 0 ? '' : ship.nrt.ictm69 : '',
            component: 'TextFieldUnit'
          },{
            description:this.t('nLabelShipBerth'),
            floatingLabelFixed: true,
            variable: 'BERTH_TIMES',
            unit:this.t('nLabelTimeUnit'),
            show: true,
            defaultValue: priceConfig['CTSFBCG|BERTH_TIMES|value'] === 0 ? '' : priceConfig['CTSFBCG|BERTH_TIMES|value'],
            component: 'TextFieldUnit'
          },{
            description:this.t('nLabelNormalSurcharge'),
            floatingLabelFixed: true,
            variable: 'BERTH_NORMAL_SURCHAGE_TIMES',
            unit:this.t('nLabelTimeUnit'),
            show: true,
            defaultValue: priceConfig['CTSFBCG|BERTH_NORMAL_SURCHAGE_TIMES|value'] === 0 ? '' : priceConfig['CTSFBCG|BERTH_NORMAL_SURCHAGE_TIMES|value'],
            component: 'TextFieldUnit'
          },{
            description:this.t('nLabelHolidaySurcharge'),
            floatingLabelFixed: true,
            variable: 'BERTH_HOLIDAY_SURCHAGE_TIMES',
            unit:this.t('nLabelTimeUnit'),
            show: true,
            defaultValue: priceConfig['CTSFBCG|BERTH_HOLIDAY_SURCHAGE_TIMES|value'] === 0 ? '' : priceConfig['CTSFBCG|BERTH_HOLIDAY_SURCHAGE_TIMES|value'],
            component: 'TextFieldUnit'
          }]
      },
      "CTTWGE":{
        "name":this.t('nLabelTowage'),
        "components":[{
          description:this.t('nLabelTugIn'),
          floatingLabelFixed: true,
          variable: 'TUG_WORK_HOUR_IN',
          unit:this.t('nLabelWorkHours'),
          show: true,
          defaultValue: priceConfig['CTTWGE|TUG_WORK_HOUR_IN|value'] === 0 ? '' : priceConfig['CTTWGE|TUG_WORK_HOUR_IN|value'],
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelTugOut'),
          floatingLabelFixed: true,
          variable: 'TUG_WORK_HOUR_OUT',
          unit:this.t('nLabelWorkHours'),
          show: true,
          defaultValue: priceConfig['CTTWGE|TUG_WORK_HOUR_OUT|value'] === 0 ? '' : priceConfig['CTTWGE|TUG_WORK_HOUR_OUT|value'],
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelNormalSurchargeTugIn'),
          floatingLabelFixed: true,
          variable: 'TUG_NORMAL_SURCHARGE_WORK_HOUR_IN',
          unit:this.t('nLabelWorkHours'),
          show: true,
          defaultValue: priceConfig['CTTWGE|TUG_NORMAL_SURCHARGE_WORK_HOUR_IN|value'] === 0 ? '' : priceConfig['CTTWGE|TUG_NORMAL_SURCHARGE_WORK_HOUR_IN|value'],
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelNormalSurchargeTugOut'),
          floatingLabelFixed: true,
          variable: 'TUG_NORMAL_SURCHARGE_WORK_HOUR_OUT',
          unit:this.t('nLabelWorkHours'),
          show: true,
          defaultValue: priceConfig['CTTWGE|TUG_NORMAL_SURCHARGE_WORK_HOUR_OUT|value'] === 0 ? '' : priceConfig['CTTWGE|TUG_NORMAL_SURCHARGE_WORK_HOUR_OUT|value'],
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelHolidaySurchargeTugIn'),
          floatingLabelFixed: true,
          variable: 'TUG_HOLIDAY_SURCHARGE_WORK_HOUR_IN',
          unit:this.t('nLabelWorkHours'),
          show: true,
          defaultValue: priceConfig['CTTWGE|TUG_HOLIDAY_SURCHARGE_WORK_HOUR_IN|value'] === 0 ? '' : priceConfig['CTTWGE|TUG_HOLIDAY_SURCHARGE_WORK_HOUR_IN|value'],
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelHolidaySurchargeTugOut'),
          floatingLabelFixed: true,
          variable: 'TUG_HOLIDAY_SURCHARGE_WORK_HOUR_OUT',
          unit:this.t('nLabelWorkHours'),
          show: true,
          defaultValue: priceConfig['CTTWGE|TUG_HOLIDAY_SURCHARGE_WORK_HOUR_OUT|value'] === 0 ? '' : priceConfig['CTTWGE|TUG_HOLIDAY_SURCHARGE_WORK_HOUR_OUT|value'],
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelShipLength'),
          floatingLabelFixed: true,
          variable: 'SHIP_LENGTH',
          show: false,
          defaultValue: ship.length && ship.length.overall ? ship.length.overall === 0 ? '' : ship.length.overall : '',
          component: 'TextField'
        }]
      },
      "CTTGQUINITARGE":{
        "name":this.t('nLabelTowageForQuarantine'),
        "components":[{
          description:this.t('nLabelTugWorkHours'),
          floatingLabelFixed: true,
          variable: 'TOWAGE_ANCHORAGE_WORK_HOUR',
          unit:this.t('nLabelWorkHours'),
          show: true,
          defaultValue: priceConfig['CTTGQUINITARGE|TOWAGE_ANCHORAGE_WORK_HOUR|value'] === 0 ? '' : priceConfig['CTTGQUINITARGE|TOWAGE_ANCHORAGE_WORK_HOUR|value'],
          component: 'TextFieldUnit'
        }]
      },
      "CTBTHGE":{
        "name":this.t('nLabelBerthage'),
        "components":[{
          description:this.t('nLabelShipNRT'),
          floatingLabelFixed: true,
          variable: 'NRT',
          unit:this.t('nLabelMTUnit'),
          show: false,
          defaultValue: ship.nrt && ship.nrt.ictm69 ? ship.nrt.ictm69 === 0 ? '' : ship.nrt.ictm69 : '',
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelBerthageDays'),
          floatingLabelFixed: true,
          variable: 'BERTH_DAYS',
          unit:this.t('nLabelDaysStayUnit'),
          show: true,
          defaultValue: priceConfig['CTBTHGE|BERTH_DAYS|value'] === 0 ? '' : priceConfig['CTBTHGE|BERTH_DAYS|value'],
          component: 'TextFieldUnit'
        }]
      },
      "CTAHRGEDUE":{
        "name":this.t('nLabelAnchorage'),
        "components":[{
          description:this.t('nLabelShipNRT'),
          floatingLabelFixed: true,
          variable: 'NRT',
          unit:this.t('nLabelMTUnit'),
          show: false,
          defaultValue: ship.nrt && ship.nrt.ictm69 ? ship.nrt.ictm69 === 0 ? '' : ship.nrt.ictm69 : '',
          component: 'TextFieldUnit'
        },{
          description:this.t('nLabelAnchorageDays'),
          floatingLabelFixed: true,
          variable: 'ANCHORAGE_DAYS',
          unit:this.t('nLabelDaysStayUnit'),
          show: true,
          defaultValue: priceConfig['CTAHRGEDUE|ANCHORAGE_DAYS|value'] === 0 ? '' : priceConfig['CTAHRGEDUE|ANCHORAGE_DAYS|value'],
          component: 'TextFieldUnit'
        }]
      },
      "CTSPDFNCG":{
        "name":this.t('nLabelShipDisinfectionCharge'),
        "hiddenTitle": true,
        "components":[{
          description:this.t('nLabelShipGRT'),
          floatingLabelFixed: true,
          variable: 'GRT',
          unit:this.t('nLabelMTUnit'),
          show: false,
          defaultValue: ship.grt && ship.grt.ictm69 ? ship.grt.ictm69 === 0 ? '' : ship.grt.ictm69 : '',
          component: 'TextFieldUnit'
        }]
      }
    };
    let childElement =[];
    let costTypeCodes =_.keys(configs);
    _.forEach(costTypeCodes,(costTypeCode)=>{
      if(this._orderTypeContainsCostType(costTypeCode,order.type.code,productConfig)){
        let renderComponents=[];
        if(!configs[costTypeCode].hiddenTitle){
          renderComponents.push(
            <div
              key ={'title_'+configs[costTypeCode].name}
              style ={this.style('title')}>
              <span key ={'span_'+configs[costTypeCode].name} >
                {configs[costTypeCode].name+" : "}
              </span>
            </div>);
        }
        let components = configs[costTypeCode].components;
        _.forEach(components,(component)=>{
          let props ={
              ref: costTypeCode+'|'+component.variable+'|value',
              key: costTypeCode+'|'+component.variable+'|value',
              defaultValue: component.defaultValue !== undefined ? component.defaultValue :'',
              floatingLabelText: component.description,
              floatingLabelFixed: component.floatingLabelFixed,
              unitLabelText: component.unit,
              style: component.show ? this.style('child') : this.style('hidden'),
              disabled:!this.props.isEditable,
              onChange:this._handleChange.bind(this,costTypeCode+'|'+component.variable+'|value')
          };
          if(component.component === 'DropDownMenu'){
            _.merge(props,{
              menuItems:component.menuItems,
              underlineStyle: this.style('underlineStyle'),
              iconStyle: this.style('iconStyle'),
              labelStyle: this.style('labelStyle'),
              style: this.style('dropDownMenuStyle'),
              selectedIndex: component.selectedIndex,
              disabled:!this.props.isEditable,
              onChange:this._componentChange
            });
          }
          let renderItem = (component.component) ? React.createElement(ComponentArray[component.component],props) : null;
          renderComponents.push(renderItem);
      });
      childElement.push(<div key ={costTypeCode} style = {this.style('component')}>{renderComponents}</div>);
      }
  });

  const actions = [
    <FlatButton
      label={this.t('nLabelDialogConfirm')}
      primary={true}
      keyboardFocused={true}
      onTouchTap={this._handleDialogClose}
    />,
  ];
  return (
    <div style = {this.style('root')}>
      {childElement}
      <Dialog
        title={this.t('nTextTypeErrorTitle')}
        actions={actions}
        modal={false}
        open={this.state.open||this.state.error}
      >
        {this.rendeErrorNotification()}
      </Dialog>
    </div>
  );
  },

  _orderTypeContainsCostType(costTypeCode,orderTypeCode,productConfig){
    let contains = false;
    let tags = this._getCostTypeTags(costTypeCode,productConfig);
    _.forEach(tags,tag=>{
      if(tag.orderTypeCode === orderTypeCode) contains =true;
    });
    return contains;
  },

  _getTonnageMenuItems(payload){
    let menuItems=[
      { payload: 0, text: 'Choose a period to stay' },
      { payload: 30, text: '30 Days' },
      { payload: 90, text: '90 Days' },
      { payload: 365, text: '365 Days' }
    ];
    let selectedIndex = 1;
    _.forEach(menuItems, (item,index)=>{
      if(item.payload ===payload){
        selectedIndex= index;
      }
    });
    return {menuItems, selectedIndex};
  },

  _getCostTypeTags(costTypeCode,productConfig){
    let costTypes = [], tags =[];
    _.forEach(productConfig.products,product=>{
      let productCode = product.product.code;
      if(VIO_CODE===productCode){
        costTypes = product.product.costTypes;
      }
    });
    _.forEach(costTypes,costType=>{
      if(costType.costType.code ===costTypeCode && costType.tags){
        tags=costType.tags;
      }
    });
    return tags;
  },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      let productCode = product.product.code;
      if(VIO_CODE===productCode){
        let keys = _.keys(product.priceConfig);
        _.forEach(keys, key=>{
          if(this.refs[key]) product.priceConfig[key] = parseInt(this.refs[key].getValue());
        });
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  _getPriceConfig(productConfig){
    let priceConfig ={};
    _.forEach(productConfig.products,product=>{
      if(VIO_CODE===product.product.code){
        priceConfig = product.priceConfig;
      }
    });
    return priceConfig;
  },

  _handleBlur(){
    this.getProductConfig();
  },

  rendeErrorNotification() {
    if(this.state.open) {
      return this.t('nTextTypeError');
    }else if(this.state.error){
      return this.t('nTextPostCodeError');
    }
  },

  _handleDialogClose() {
    this.setState({
        open: false,
        error: false,
      });
  },

  _handleChange(name){
    if(!global.isOrderDetailsChanged()){
      global.notifyOrderDetailsChange(true);
    }
    let value = this.refs[name].getValue();
    if(!_.isInteger(Number(value))) {
      this.setState({error:true});
      this.refs[name].clearValue();
    }
  },

  _handleBlur(){
    this.getProductConfig();
  },

  _componentChange(){
    if(!global.isOrderDetailsChanged()){
      global.notifyOrderDetailsChange(true);
    }
  },

});

module.exports = PTVIOPriceConfigForm;
