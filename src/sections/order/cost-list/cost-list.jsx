const React = require('react');
const AddIcon = require('epui-md/svg-icons/content/add');
const AutoStyle = require('epui-auto-style').mixin;
const CostItem = require('./cost-item');
const IconLabelButton = require('epui-md/ep/IconLabelButton');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const { List } = require('epimmutable');

const TEMP_ID_PREFIX = 'temp_id_';

const CostList = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/CostItem/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    nTextAdd: PropTypes.string,
    onListChange: PropTypes.func,
    orderEntry:PropTypes.object,
    costItems: PropTypes.object,
    costTypes: PropTypes.object,
    disabled: PropTypes.bool,
    onCostListChange:PropTypes.func,
  },

  getDefaultProps() {
    return {
      orderEntry: null,
      costItems: null,
      costTypes: null,
      disabled: false,
    };
  },

  getInitialState() {
    return {
      costItems: this._ensureCostTypeOfItemEstimatedPopulated(this.props.costItems),
      isDirty: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if(this.props.orderEntry !== nextProps.orderEntry){
      this.setState({
        costItems: this._ensureCostTypeOfItemEstimatedPopulated(nextProps.costItems)
      });
    }
  },

  isDirty() {
    return this.state.isDirty;
  },

  clearDirty() {
    this.setState({
      isDirty: false
    });
  },

  getValue() {
    let costItems=[];
    this.state.costItems.forEach(costItem=>{
      let item = this.refs['item_'+costItem._id].getValue();
      if(item._id.indexOf(TEMP_ID_PREFIX)>-1){delete item._id;}
      costItems.push(item);
    });

    return costItems;
  },

  getTotal() {
    let costValue = 0;

    this.state.costItems.forEach(costItem => {
      let item = this.refs['item_' + costItem._id].getValue();
      let value = parseFloat(item.amount);
      if(!isNaN(value)) costValue += value;
    });

    return costValue;
  },

  getTheme() {
    return this.context.muiTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let styles = {
      root: {
        height: '100%',
        marginLeft: 10,
        textAlign: 'right',
      },
      addBtn:{
        marginBottom: 8,
        width: 90,
      },
      addButtonIconStyle: {
        fill: this.props.disabled ? theme.disabledColor:theme.accent1Color,
        marginRight: 8,
      },
      addButtonLabelStyle: {
        maxWidth: '100%',
        color: this.props.disabled ? theme.disabledColor:theme.accent1Color,
      },
    };
    return styles;
  },

  renderAddBtn() {
    return (
      <div style={this.style('addBtn')}>
        <IconLabelButton
          ref='addBtn'
          iconElement={<AddIcon />}
          iconStyle={this.style('addButtonIconStyle')}
          label= {this.t('nTextAdd')}
          labelStyle={this.style('addButtonLabelStyle')}
          disabled= {this.props.disabled}
          handleTouchTap={this._handleAddItem} />
      </div>
    );
  },

  renderCostItems() {
    let {
      costTypes,
      orderEntry,
    } = this.props;

    let costItemsElemes = [];

    this.state.costItems.forEach(costItem => {
      costItemsElemes.push(
        <CostItem
          ref={'item_' + costItem._id}
          key={costItem._id}
          item={costItem}
          disabled={this.props.disabled}
          onItemChange={this._handleItemChange}
          costTypes={costTypes}
          orderEntry={orderEntry}
          onTouchTapDeleteBtn={this._handleBtnDelete}
        />
      );
    });

    return costItemsElemes;
  },

  render() {
    return (
      <div style ={this.style('root')}>
        {this.renderCostItems()}
        {this.renderAddBtn()}
      </div>
    );
  },

  _generateTempId(){
    return TEMP_ID_PREFIX + Math.random() * 10001;
  },

  _handleAddItem() {
    if(!this.props.orderEntry) return;

    let newItem = this.props.orderEntry.convertCostItemJsToModel({
      _id: this._generateTempId(),
      costType : this._getCostTypes().get(0)
    });

    let costItems = this.state.costItems.push(newItem);

    this.setState({
      costItems: costItems,
      isDirty: true
    },() => {
      if(this.props.onListChange) this.props.onListChange();
    });
  },

  _handleBtnDelete(itemId) {
    let costItems = this.state.costItems.filter(newItem => {
      return itemId!==newItem._id;
    });
    this.setState({
      costItems: costItems,
      isDirty: true
    },() => {
      if(this.props.onListChange) this.props.onListChange();
    });
  },

  _handleItemChange() {
    if(this.props.onListChange) this.props.onListChange();
    if(!this.state.isDirty) {
      this.setState({
        isDirty : true
      });
    }
  },

  _ensureCostTypeOfItemEstimatedPopulated(costItems){
    let costTypes = this.props.costTypes;

    if(costItems) {
      let itemCoverted = 0;
      let costItemsEstimated = costItems.map(item => {
        if(_.isString(item.costType)){//if costype is _id, trannsfer it to model
          itemCoverted++;
          let costType = costTypes.find(type => {
            return type._id === item.costType
          });
          item = item.set('costType', costType);
        };

        return item;
      });

      if(itemCoverted > 0) {
        costItems = costItemsEstimated;
      }

      return costItems;
    }

    return List();
  },

  _getCostTypes() {
    let entry = this.props.orderEntry;
    let types =  this.props.costTypes;
    if(!entry || !types) { return null; }

    return entry.product.costTypes.map((id) => {
      if(!_.isString(id)) { return id; }
      return types.find((type) => {
        return type._id === id;
      })
    });
  },

});

module.exports = CostList;
