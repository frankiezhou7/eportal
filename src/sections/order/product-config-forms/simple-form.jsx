const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const ArrowDropDown = require('epui-md/svg-icons/navigation/arrow-drop-down');
const ArrowDropUp = require('epui-md/svg-icons/navigation/arrow-drop-up');
const RadioButtonGroup = require('epui-md/RadioButton/RadioButtonGroup');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const ComponentArray = {
  'TextField': require('epui-md/TextField'),
  'TextFieldUnit': require('epui-md/TextField/TextFieldUnit'),
  'DropDownMenu': require('epui-md/ep/EPDropDownMenu'),
  'RadioButton': require('epui-md/RadioButton')
};
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;

const SimpleConfigForm = React.createClass({

  mixins: [StylePropable, Translatable, OrderEntryMixin, PureRenderMixin],

  translations: require(`epui-intl/dist/ProductConfigs/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    orderEntry: PropTypes.object,
    segment: PropTypes.object,
    ship: PropTypes.object,
    configs: PropTypes.object.isRequired ,//product configs
    nTextSavingProductConfig: PropTypes.string,
  },

  getDefaultProps() {
    return {
      orderEntry:null,
      segment:null,
      configs :{},
    };
  },

  getInitialState: function() {
    let product = this.props.orderEntry? this.props.orderEntry.product: undefined;
    return {
      product : {
        _id: product ? product._id : undefined,
        code: product ? product.code : undefined,
        costTypes: this._getCostTypes()
      },
      open:false,
    };
  },

  componentWillMount() {
  },

  componentDidMount() {
    // if(_.isEmpty(this.props.configs)){
    //   this.props.orderEntry.calculateOrderEntryFee(
    //     this._getFormValue(),
    //     this.props.segment.arrivalPort._id
    //   );
    //   global.pushInfo(this.t('nTextSavingProductConfig'));
    // }
  },

  componentWillReceiveProps(nextProps){

  },


  componentDidUpdate(prevProps){
    let product = this.props.orderEntry.product;
    let prevProduct = prevProps.orderEntry.product;
    if(product.code == prevProduct.code && prevProps.orderEntry != this.props.orderEntry){
      let orderEntry = this._ensureCostTypeOfItemEstimatedPopulated();
      orderEntry.costItemsEstimated && orderEntry.costItemsEstimated.forEach((costItem)=>{
        _.forEach(this.props.configs,(config)=>{
          if(this.refs[costItem.costType.get('code')+'_'+config.variable])
            this.refs[costItem.costType.get('code')+'_'+config.variable].setValue(costItem.variables[config.variable]);
        });
      });

    }
  },

  componentWillUnmount() {

  },

  componentWillUpdate() {

  },

  getStyles() {
    let dropDownMenuMarginTop =0;
    return {
      root: {
        marginLeft: 10,
        maxHeight: this.state.open ? 'none': 300,
        overflowY:'scroll',
      },
      navigation:{
        position: 'absolute',
        marginTop: -32,
        marginLeft: 90,
        cursor: 'pointer',
      },
      title:{
        marginBottom:5,
      },
      child:{
        marginLeft: 8,
        marginRight: 8,
        display: 'inline-block',
        width: 256,
      },
      component:{
        margin: 5,
        display: 'inline-block',
        verticalAlign: 'top'
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
        marginTop:dropDownMenuMarginTop,
      },
      dropDownMenuStyle:{
        marginBottom: 10,
        verticalAlign: 'top',
      },
      input:{
        width: '100%',
      },
      radioButtonStyle:{

      },
    };
  },

  render() {
    let styles = this.getStyles();
    let configs = this.props.configs;
    let orderEntry = this._ensureCostTypeOfItemEstimatedPopulated();
    let costItemsEstimated = orderEntry.costItemsEstimated;
    let disabled = orderEntry.isAccepted();
    let childElement =[];
    let costTypeCodes =_.keys(configs);
    _.map(costTypeCodes,(costTypeCode)=>{
      let renderComponents=[];
      let radioButtons=[];
      let selectedRadio;
      if(!configs[costTypeCode].hiddenTitle){
        renderComponents.push(
          <div
            key ={'title_'+configs[costTypeCode].name}
            style ={styles.title}>
            <span key ={'span_'+configs[costTypeCode].name} >
              {configs[costTypeCode].name+" : "}
            </span>
          </div>);
      }
      let components = configs[costTypeCode].components;
      _.map(components,(component)=>{
        costItemsEstimated && costItemsEstimated.forEach(costItem =>{
          if(costItem.costType.get('code') !== costTypeCode || !costItem.variables) return;
          if(component.component === 'RadioButton'){
            if(costItem.variables.get(component.variable)===1)
              selectedRadio = component.variable;
            else if(component.isDefaultValue && !selectedRadio)
              selectedRadio = component.variable;
          }else if(!(component.selectedIndex && component.menuItems)){
            component.defaultValue=costItem.variables.get(component.variable);
          }else if(costItem.variables.get(component.variable)) {
            _.map(component.menuItems,(menuItem,index)=>{
              if(menuItem.payload === costItem.variables.get(component.variable)){
                component.selectedIndex = index;
              }
            });
          }
        });
        let props ={
            ref: costTypeCode+'_'+component.variable,
            key: costTypeCode+'_'+component.variable,
            defaultValue: component.defaultValue !== undefined ? component.defaultValue :'',
            floatingLabelText: component.description,
            unitLabelText: component.unit,
            style: this.mergeAndPrefix(styles.child,component.show? {}:{display:'none'}),
            disabled:disabled
        };
        if(component.component === 'DropDownMenu'){
          _.merge(props,{
            menuItems:component.menuItems,
            underlineStyle: styles.underlineStyle,
            iconStyle: styles.iconStyle,
            labelStyle: styles.labelStyle,
            style: styles.dropDownMenuStyle,
            selectedIndex: component.selectedIndex
          });
        }
        if(component.component === 'RadioButton'){
          _.merge(props,{
            value:component.variable,
            label:component.description,
            style: styles.radioButtonStyle,
            defaultChecked: component.defaultValue ? false : true
          });
        }
        let renderItem = (component.component) ? React.createElement(ComponentArray[component.component],props) : null;
        if(component.component === 'RadioButton'){
          radioButtons.push(renderItem);
        }else{
          renderComponents.push(renderItem);
        }
    });
    if(radioButtons.length>0)
      renderComponents.push(
        <RadioButtonGroup
          defaultSelected={selectedRadio}
          key ={'radioGroup_'+costTypeCode}
          ref ={'radioGroup_'+costTypeCode}
          name={'radioGroup_'+costTypeCode}>
          {radioButtons}
        </RadioButtonGroup>
      );
    childElement.push(<div key ={costTypeCode} style = {styles.component}>{renderComponents}</div>);
  });

  let navigationElement = _.isEmpty(this.props.configs)? null:
    (this.state.open ? (<ArrowDropUp onClick={this._handleArrowIcon} />):
    (<ArrowDropDown onClick={this._handleArrowIcon} />));
  return (
    <div style = {styles.root}>
      <div style = {styles.navigation}>
        {navigationElement}
      </div>
      {childElement}
    </div>
  );
 },

 _getFormValue(){
    let costTypes = this._getCostTypes();
    let costTypesWithVarialbes = _.map(costTypes,(costType)=>{
      if(!costType.variables) costType.variables={};
      let configs = this.props.configs;
      let components = configs[costType.code] && configs[costType.code].components? configs[costType.code].components : undefined;
      if(components){
        let selectRadioButtonValue;
        if(this.refs['radioGroup_'+costType.code]){
          selectRadioButtonValue = this.refs['radioGroup_'+costType.code].getSelectedValue() || '';
        }
        _.map(components,(component)=>{
          if(component.component === 'RadioButton' && selectRadioButtonValue!==undefined){
            costType.variables[component.variable] = (selectRadioButtonValue === component.variable) ? 1:0;
          }else if(this.refs[costType.code+'_'+component.variable]){
            costType.variables[component.variable] = this.refs[costType.code+'_'+component.variable].getValue();
          }else if(component.ref && this.refs[component.ref+'_'+component.variable]){
            costType.variables[component.variable] = this.refs[component.ref+'_'+component.variable].getValue();
          }
        });
      }
      return {
        _id: costType._id,
        code:costType.code,
        variables: costType.variables
      };
    });
    let calculateRequest = {
      _id: this.state.product._id,
      code : this.state.product.code,
      costTypes: costTypesWithVarialbes
    }
    return calculateRequest;
  },

  _handleArrowIcon(){
    this.setState({open:!this.state.open});
  },

  _getCostTypes() {
    let entry = this.props.orderEntry;
    let types =  this.props.costTypes;
    if(!entry || !types) { return null; }

    let costTypes = entry.product.costTypes.map((id) => {
      if(!_.isString(id)) { return id; }
      return types.find((type) => {
        return type._id === id;
      })
    });
    return costTypes.toArray();
  },

  _ensureCostTypeOfItemEstimatedPopulated(){
    let {
      orderEntry,
      costTypes
    } =this.props;

    if(orderEntry && orderEntry.costItemsEstimated){
      let itemCoverted =0;
      let costItemsEstimated = orderEntry.costItemsEstimated.map(item =>{
        if(typeof item.costType === 'string'){//if costype is _id, trannsfer it to model
          itemCoverted ++;
          let costType = costTypes.find(type =>{
            return type._id === item.costType
          });
          item = item.set('costType',costType);
        };
        return item;
      });
      if(itemCoverted>0){
        orderEntry = orderEntry.set('costItemsEstimated',costItemsEstimated);
      }
      return orderEntry;
    }

    return orderEntry;
  },

});

module.exports = SimpleConfigForm;
