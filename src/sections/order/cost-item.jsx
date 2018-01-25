const React = require('react');
const _ = require('eplodash');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const IconButton = require('epui-md/IconButton');
const InsertDriveFileIcon = require('epui-md/svg-icons/editor/insert-drive-file');
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField');
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;
const COST_TYPE_MAX_HEIGHT = 300;


const CostItem = React.createClass({

  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/CostItem/${__LOCALE__}`),

  propTypes: {
    description: PropTypes.string,
    disabled: PropTypes.bool,
    fee: PropTypes.string,
    item: PropTypes.object,
    isEstimated: PropTypes.bool,
    menuItems: PropTypes.array.isRequired,
    nHintTextDescription: PropTypes.string,
    nLabelCostEst: PropTypes.string,
    nLabelCostAct: PropTypes.string,
    nLabelTextOnlyEstimated: PropTypes.string,
    selectedIndex: PropTypes.number,
    handleBlur: PropTypes.func,
    handleItemChange: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !!nextProps.item.shouldUpdate;
  },

  getStyles() {},

  _convertToFixed(value) {
    let tempValue = Number(value);

    if (!_.isNaN(tempValue)) {
      value = tempValue.toFixed(2);
    }

    return value;
  },

  _getCostTypeElement() {
    let {
      disabled,
      item,
      menuItems,
      selectedIndex,
      style,
    } = this.props;

    let costTypeElement = (
      <div style={style.costType}>
        <DropDownMenu
          key='menu'
          autoWidth={true}
          displayMember='name'
          disabled={disabled}
          maxHeight={COST_TYPE_MAX_HEIGHT}
          menuItems={menuItems}
          selectedIndex={selectedIndex}
          style={style.dropDownMenu}
          underlineStyle={style.underlineStyle}
          valueMember='_id'
          onChange={this._handleItemChange.bind(this, item)} />
      </div>
    );

    return costTypeElement;
  },

  _getDescriptionElement() {
    let {
      disabled,
      item,
      style
    } = this.props;

    let descriptionElement = (
      <div style={style.descriptionWrapper}>
        <div style={style.description}>
          <TextField
            key={item.__id}
            defaultValue={item.description}
            disabled={disabled}
            fullWidth={true}
            hintText={this.t('nHintTextDescription')}
            onBlur={this._handleBlur.bind(this, item, 'description')} />
        </div>
      </div>
    );

    return descriptionElement;
  },

  _getFeeElement() {
    let {
      disabled,
      isEstimated,
      item,
      style
    } = this.props;

    let estimatedFeeElement = (
      <div style={style.estimatedFee}>
        <TextField
          key={item.__id}
          ref='amount'
          defaultValue={this._convertToFixed(item.amount)}
          disabled={disabled}
          fullWidth={true}
          hintText={this.t('nLabelCostEst')}
          inputStyle={style.inputStyle}
          onBlur={this._handleBlur.bind(this, item, 'amount')}
          />
      </div>
    );

    let actualFeeAndInsertDriveFileElement = (
      <div style={style.actualFeeWrapper}>
        <div style={style.actualFee}>
          <TextField
            key="amount"
            ref="amount"
            defaultValue={this._convertToFixed(item.amount)}
            disabled={disabled}
            fullWidth={true}
            hintText={this.t('nLabelCostAct')}
            inputStyle={style.inputStyle}
            onBlur={this._handleBlur.bind(this, item, 'amount')}
            />
        </div>
        <IconButton
          disabled={disabled}
          style={style.insertIconButton}
          iconStyle={style.insertDriveFile}
          >
          <InsertDriveFileIcon />
        </IconButton>
      </div>
    );

    let feeElement = isEstimated ? estimatedFeeElement : actualFeeAndInsertDriveFileElement;

    return feeElement;
  },

  render() {
    let {
      style
    } = this.props;

    return (
      <div style={style.root}>
        {this._getCostTypeElement()}
        {this._getDescriptionElement()}
        {this._getFeeElement()}
      </div>
    );
  },

  _handleItemChange(costItem, e, selectedIndex, menuItem) {
    if (_.isFunction(this.props.handleItemChange)) {
      this.props.handleItemChange(costItem, e, selectedIndex, menuItem);
    }
  },

  _handleBlur(item, key, e) {
    if (_.isFunction(this.props.handleBlur)) {
      this.props.handleBlur(item, key, e);
    }
  }

});

module.exports = CostItem;
