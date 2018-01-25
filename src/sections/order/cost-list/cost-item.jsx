const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const DeleteIcon = require('epui-md/svg-icons/action/delete');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const IconButton = require('epui-md/IconButton');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;

const Shipment = React.createClass({

  mixins: [AutoStyle, Translatable, PureRenderMixin],

  translations: require(`epui-intl/dist/CostItem/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    item: PropTypes.object,
    orderEntry: PropTypes.object,
    costTypes: PropTypes.object,
    nTextRemove: PropTypes.string,
    nLabelCostEstimated: PropTypes.string,
    nLabelDescription: PropTypes.string,
    disabled: PropTypes.bool,
    onTouchTapDeleteBtn: PropTypes.func,
    onItemChange: PropTypes.func,
  },

  getDefaultProps() {
    return {
      item: null,
      orderEntry: null,
      costTypes: null,
      disabled: false
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let dropDownMenuMarginTop = 0;
    let theme = this.getTheme();

    return {
      costType:{
        display: 'inline-block',
        width: 200,
        verticalAlign: 'middle',
        textAlign: 'left',
      },
      underlineStyle: {
        marginTop: -8,
        borderTop: this.props.disabled ? 'dotted 2px ' + theme.disabledColor : 'solid 1px '+theme.borderColor,
      },
      description:{
        marginRight: 10,
        display: 'inline-block',
        width: 455,
        verticalAlign: 'middle',
      },
      costEstimated:{
        marginRight: 10,
        display: 'inline-block',
        width: 120,
        verticalAlign: 'middle',
      },
      costInputStyle:{
        textAlign: 'right',
      },
      deleteIconStyle: {
        fill: theme.greyColor,
      },
      deleteIconButton:{
        verticalAlign: 'bottom',
      },
    };
  },

  getValue() {
    let item = this.props.item.toJS();
    let itemRef = this._generateItemRef();
    item.costType = this.refs['costType_' + itemRef].getValue();
    item.description = this.refs['description_' + itemRef].getValue();
    item.amount = this.refs['costEstimated_' + itemRef].getValue();

    return item;
  },

  render() {
    let menuItems = [];
    let selectedIndex = 0 ;
    let costTypes = this._getCostTypes();
    costTypes.forEach((costType,index) => {
      if(costType._id === this.props.item.costType.get('_id')) {
        selectedIndex= index;
      }
      menuItems.push({
        payload: costType._id,
        text: costType.name
      });
    });

    let itemRef = this._generateItemRef();

    return (
      <div key ={'root_'+itemRef}>
        <DropDownMenu
          ref ={'costType_'+itemRef}
          menuItems={menuItems}
          underlineStyle ={this.style('underlineStyle')}
          maxHeight = {300}
          style ={this.style('costType')}
          selectedIndex={selectedIndex}
          onChange = {this._handleItemChange}
          disabled ={this.props.disabled}
        />
        <TextField
          ref ={'description_'+itemRef}
          hintText={this.t('nLabelDescription')}
          defaultValue = {this.props.item.description}
          style= {this.style('description')}
          onChange = {this._handleItemChange}
          disabled={this.props.disabled}
        />
        <TextField
          ref ={'costEstimated_'+itemRef}
          hintText={this.t('nLabelCostEstimated')}
          defaultValue = {this.props.item.amount? this.props.item.amount.toFixed(2):'0.00'}
          style= {this.style('costEstimated')}
          inputStyle = {this.style('costInputStyle')}
          onChange = {this._handleItemChange}
          onBlur = {this._handleCostValueBlur}
          disabled={this.props.disabled}
        />
        <IconButton
          title = {this.t('nTextRemove')}
          disabled={this.props.disabled}
          style={this.style('deleteIconButton')}
          onTouchTap={this._handleTouchTapRemove}>
          >
          <DeleteIcon style={this.style('deleteIconStyle')}/>
        </IconButton>
      </div>
    );
  },

  _generateItemRef() {
    return this.props.item._id;
  },

  _handleTouchTapRemove() {
    if(this.props.onTouchTapDeleteBtn){
      this.props.onTouchTapDeleteBtn(this.props.item._id);
    }
  },

  _handleCostValueBlur(e) {
    let itemRef = this._generateItemRef();
    let value = parseFloat(e.target.value);
    if(!isNaN(value)) this.refs['costEstimated_' + itemRef].setValue(value.toFixed(2));
  },

  _handleItemChange() {
    if(this.props.onItemChange) this.props.onItemChange();
  },

  _getCostTypes() {
    let entry = this.props.orderEntry;
    let types = this.props.costTypes;
    if(!entry || !types) { return null; }
    return entry.product.costTypes.map((id) => {
      if(!_.isString(id)) { return id; }
      return types.find((type) => {
        return type._id === id;
      })
    });
  },

});

module.exports = Shipment;
