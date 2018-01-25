const React = require('react');
const _ = require('eplodash');
const Checkbox = require('epui-md/Checkbox');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const IconButton = require('epui-md/IconButton');
const InsertDriveFileIcon = require('epui-md/svg-icons/editor/insert-drive-file');
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField');
const Translatable = require('epui-intl').mixin;
const TreeList = require('epui-md/tree-list');
const CostItem = require('./cost-item');

const PropTypes = React.PropTypes;
const COST_TYPE_WIDTH = 180;
const COST_TYPE_MAX_HEIGHT = 300;


const CostTree = React.createClass({

  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/CostItem/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    costItemsArray: PropTypes.array,
    costItemsType: PropTypes.oneOf(['actual', 'estimated']), // 实际费用，预计费用
    costTypesArray: PropTypes.array,
    disabled: PropTypes.bool,
    nHintTextDescription: PropTypes.string,
    nLabelCostEst: PropTypes.string,
    nLabelCostAct: PropTypes.string,
    nLabelTextOnlyEstimated: PropTypes.string,
    onChange: PropTypes.func,
    orderEntryId: PropTypes.string,
  },

  getDefaultProps() {
    return {
      costItemsArray: [],
      costItemsType: 'estimated',
      disabled: false,
    };
  },

  getInitialState() {
    return {
      costItems: this._makeNewId(_.cloneDeep(this.props.costItemsArray)),
      initialCostItems: this.props.costItemsArray,
      isDirty: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.costItemsArray !== this.props.costItemsArray) {
      this.setState({
        costItems: this._makeNewId(_.cloneDeep(nextProps.costItemsArray)),
        initialCostItems: nextProps.costItemsArray,
        isDirty: false
      });
    }
  },

  componentDidMount(){
  },
  componentWillMount() {
  },

  componentWillUnmount() {
  },

  componentWillUpdate() {
  },

  componentDidUpdate(){
    console.timeEnd('cost tree render time');
  },

  // shouldComponentUpdate(nextProps, nextState) {
  //   let shouldUpdate =  nextProps.costItemsArray !== this.props.costItemsArray ||
  //                       nextProps.disabled !== this.props.disabled ||
  //                       nextProps.costItemsType !== this.props.costItemsType;
  //
  //   return true; //shouldUpdate;
  // },

  getTheme() {
    return this.context.muiTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();

    let styles = {
      root: {
        width: '100%',
        height: '100%',
      },
      checkboxWrapper: {
        display: 'inline-block',
        float: 'left',
        margin: '15px 0 0 10px',
        width: '110px',
      },
      costType: {
        position: 'relative',
        display: 'inline-block',
        float: 'left',
        margin: '0 ' + '-' + COST_TYPE_WIDTH + 'px 0 0',
        width: COST_TYPE_WIDTH + 'px',
      },
      costTypeUnderlineStyle: {
        margin: '-7px 12px',
      },
      costTypeUnderlineStyleWhenDisabled: {
        borderTop: 'dotted 2px ' + theme.disabledColor,
      },
      descriptionWrapper: {
        display: 'inline-block',
        float: 'left',
        width: '100%',
      },
      description: {
        margin: '0 140px 0 ' + COST_TYPE_WIDTH + 'px',
      },
      dropDownMenu: {
        width: COST_TYPE_WIDTH + 'px',
      },
      // estimatedFee: {
      //   display: 'inline-block',
      //   float: 'left',
      //   width: '80px',
      //   height: '100%',
      // },
      estimatedFee: {
        display: 'inline-block',
        float: 'right',
        margin: '0 0 0 -80px',
        width: '80px',
      },
      estimatedFeeWrapper: {
        display: 'inline-block',
        float: 'right',
        margin: '0 0 0 -200px',
        width: '200px',
      },
      actualFeeWrapper: {
        display: 'inline-block',
        float: 'right',
        margin: '0 0 0 -128px',
      },
      actualFee: {
        display: 'inline-block',
        float: 'left',
        width: '80px',
      },
      inputStyle: {
        textAlign: 'right',
      },
      insertDriveFile: {
        fill: theme.primary1Color,
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    const data = this._convertCostItemsToTreeListData(this.state.costItems, undefined);

    return (
      <div style={styles.root}>
        <TreeList
          data={data}
          idField='__id'
          mode={this.props.disabled ? 'view' : 'edit'}
          onAdd={this._handleAddItem}
          onExpand={this._handleExpand}
          onRemove={this._handleRemoveItem}
          onRenderItem={this._handleRenderItem}
          rootWidth={868}
          key='tree-list'
          ref='tree-list' />
      </div>
    );
  },

  clearState() {
    this.setState({
      initialCostItems: [],
      costItems: []
    });
  },

  isDirty() {
    return this.state.isDirty;
  },

  getTotal() {
    let items = this.state.costItems;
    return _.reduce(items, (sum, item) => {
      let amt = Number(item.amount);
      amt = _.isNaN(amt) ? 0 : amt;
      return sum + amt;
    }, 0);
  },

  getValue() {
    let state = this.state;
    let originCostItems = _.cloneDeep(state.costItems);
    let costItems = [];

    for (let i = 0; i < originCostItems.length; i++) {
      let costItem = originCostItems[i];
      let amount = Number(costItem.amount);

      if (!_.isNaN(amount)) {
        costItem.amount = amount;
        delete costItem.__id;
        delete costItem.__parent;
        delete costItem.disabled;
        delete costItem.isParent;
        costItem.costType = costItem.selectedCostType;
        delete costItem.selectedCostType;
        costItems.push(costItem);
      } else {
        continue;
      }
    }

    return costItems;
  },

  restore() {
    this.setState({
      costItems: this._makeNewId(_.cloneDeep(this.state.initialCostItems))
    });
  },

  _handleItemChange(costItem, e, selectedIndex, menuItem) {
    let costItems = this.state.costItems;
    let changed = false;

    if (_.isArray(costItems)) {
      for (let i = 0; i < costItems.length; i++) {
        if (costItems[i].__id == costItem.__id) {
          costItems[i].shouldUpdate = true;
          costItems[i].selectedCostType = menuItem;
          costItems[i].isParent = this._isParent(this.props.costTypesArray, menuItem.payload);
        } else {
          costItems[i].shouldUpdate = false;
        }
      }

      this.setState({
        costItems: costItems,
        isDirty: true,
      }, this._emitChange);
    }
  },

  _handleExpand(item) {
    let expanded = item.expanded === undefined ? true : item.expanded;
    let costItems = this.state.costItems;

    for (let i = 0; i < costItems.length; i++) {
      if(costItems[i].__id == item.__id) {
        costItems[i].expanded = !expanded;
        break;
      }
    }

    this.setState({
      costItems: costItems
    });
  },

  _handleTouchTapUploadFile(ref, item, e) {
  },

  _handleBlur(item, key, e) {
    let id = item.__id;
    let val = e.target.value;
    this._updateTreeObjectByName(id, key, val, e);
  },

  // _handleCheck(item, e, checked) {
  //   let id = item.__id;
  //   let key = 'isOnlyEstimated';
  //
  //   this._updateTreeObjectByName(id, key, checked);
  // },

  /**
   * 费用只能输入money类型
   * @param  {[type]} item [description]
   * @param  {[type]} key  [description]
   * @param  {[type]} e    [description]
   * @return {[type]}      [description]
   */
  _handleKeyPress(item, key, e) {
    // e.preventDefault();
  },

  /**
   * tree-list的onRenderItem回调函数，动态生成每一行的元素
   * @param  {[array]}    item                [当前行节点json数组]
   * @param  {[number]}   innerContentWidth   [当前行容器宽度]
   * @param  {[number]}   innerContentHeight  [当前行容器高度]
   * @return {[PropTypes.element]}      [动态生成的行内容]
   */
  _handleRenderItem(item, innerContentWidth, innerContentHeight) {
    let styles = this.getStyles();
    let props = this.props;
    let disabled = props.disabled;

    // 判断渲染模式，actual还是estimated
    let isEstimated = props.costItemsType === 'estimated' ? true : false;

    let parentId = item.selectedCostType.parent;

    let costTypes = this._getAllChildrenByParentId(this.props.costTypesArray, parentId);

    let menuItems = costTypes;

    let selectedCostTypeId = item.selectedCostType._id;

    let selectedIndex = this._getSelectedIndexFromMenuItems(menuItems, selectedCostTypeId, '_id');

    item.disabled = disabled ? disabled : this._isParent(this.state.costItems, item.__id);

    styles.costType = this.mergeStyles(styles.costType, {
      height: innerContentHeight
    });

    styles.descriptionWrapper = this.mergeStyles(styles.descriptionWrapper, {
      height: innerContentHeight
    });

    // styles.estimatedFeeWrapper = this.mergeStyles(styles.estimatedFeeWrapper, {
    //   height: innerContentHeight
    // });

    styles.estimatedFee = this.mergeStyles(styles.estimatedFee, {
      height: innerContentHeight
    });

    styles.actualFee = this.mergeStyles(styles.actualFee, {
      height: innerContentHeight
    });

    let underlineStyle = item.disabled ?
                         this.mergeAndPrefix(styles.costTypeUnderlineStyle, styles.costTypeUnderlineStyleWhenDisabled) :
                         styles.costTypeUnderlineStyle;

    let costTypeElement = (
      <div style={styles.costType}>
        <DropDownMenu
          key='menu'
          autoWidth={true}
          displayMember='name'
          disabled={item.disabled}
          maxHeight={COST_TYPE_MAX_HEIGHT}
          menuItems={menuItems}
          selectedIndex={selectedIndex}
          style={styles.dropDownMenu}
          underlineStyle={underlineStyle}
          valueMember='_id'
          onChange={this._handleItemChange.bind(this, item)} />
      </div>
    );

    if(isEstimated) styles.description = this.mergeStyles(styles.description, {marginRight: '94px'});
    // if(isEstimated) styles.description = this.mergeStyles(styles.description, {marginRight: '212px'});

    let detailDescriptionElement = (
      <div style={styles.descriptionWrapper}>
        <div style={styles.description}>
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

    // let estimatedFeeElement = (
    //   <div style={styles.estimatedFeeWrapper}>
    //     <div style={styles.estimatedFee}>
    //       <TextField
    //         ref='amount'
    //         defaultValue={item.amount}
    //         disabled={disabled}
    //         fullWidth={true}
    //         hintText={this.t('nLabelCostEst')}
    //         onBlur={this._handleBlur.bind(this, item, 'amount')}
    //         onKeyPress={this._handleKeyPress.bind(this, item, 'amount')} />
    //     </div>
    //     <div style={styles.checkboxWrapper}>
    //       <Checkbox
    //         defaultChecked={item.checked}
    //         disabled={disabled}
    //         label={this.t('nLabelTextOnlyEstimated')}
    //         onCheck={this._handleCheck.bind(this, item)} />
    //     </div>
    //   </div>
    // );

    let estimatedFeeElement = (
      <div style={styles.estimatedFee}>
        <TextField
          key={item.__id}
          ref='amount'
          defaultValue={this._convertToFixed(item.amount)}
          disabled={disabled}
          fullWidth={true}
          hintText={this.t('nLabelCostEst')}
          inputStyle={styles.inputStyle}
          onBlur={this._handleBlur.bind(this, item, 'amount')}
          onKeyPress={this._handleKeyPress.bind(this, item, 'amount')} />
      </div>
    );

    let actualFeeAndInsertDriveFileElement = (
      <div style={styles.actualFeeWrapper}>
        <div style={styles.actualFee}>
          <TextField
            key="amount"
            ref="amount"
            defaultValue={this._convertToFixed(item.amount)}
            disabled={disabled}
            fullWidth={true}
            hintText={this.t('nLabelCostAct')}
            inputStyle={styles.inputStyle}
            onBlur={this._handleBlur.bind(this, item, 'amount')}
            onKeyPress={this._handleKeyPress.bind(this, item, 'amount')} />
        </div>
        <IconButton
          disabled={disabled}
          style={styles.insertIconButton}
          iconStyle={styles.insertDriveFile}
          onTouchTap={this._handleTouchTapUploadFile.bind(this, item)}>
          <InsertDriveFileIcon />
        </IconButton>
      </div>
    );

    let feeElement = isEstimated ? estimatedFeeElement : actualFeeAndInsertDriveFileElement;

    if (this.props.disabled) {
      styles.root.width = innerContentWidth - 48;
    }

    styles.underlineStyle = underlineStyle;

    return (
      // <div style={styles.root}>
      //   {costTypeElement}
      //   {detailDescriptionElement}
      //   {feeElement}
      // </div>
      <CostItem
        key={item.__id}
        isEstimated={isEstimated}
        item={item}
        menuItems={menuItems}
        selectedIndex={selectedIndex}
        style={styles}
        handleBlur={this._handleBlur}
        handleItemChange={this._handleItemChange}
        />
    );
  },

  _generateId() {
    this.uniqueId = this.uniqueId === undefined ? 1 : ++this.uniqueId;
    return this.uniqueId;
  },

  _makeNewId(costItems) {
    if (!this.ids) {
      this.ids = {};
    }
    _.forEach(costItems, (costItem) => {
      let id = costItem._id;

      if (!this.ids[id]) {
        this.ids[id] = this._generateId();
        costItem.__id = this.ids[id];
      } else {
        costItem.__id = this.ids[id];
      }
    });

    _.forEach(costItems, (costItem) => {
      let parent = costItem.parent;

      if (parent) {
        if (!this.ids[parent]) {
          this.ids[parent] = this._generateId();
          costItem.__parent = this.ids[parent];
        } else {
          costItem.__parent = this.ids[parent];
        }
      } else {
        costItem.__parent = parent;
      }

      costItem.selectedCostType = costItem.costType;
    });

    return costItems;
  },

  /**
   * handle add button event
   */
  _handleAddItem(item) {
    // 添加根节点
    if (!item) {
      item = {};
      item.__id = this._generateId();
      item.__parent = undefined;
      item.description = undefined;

      let costType = this._getAllChildrenByParentId(this.props.costTypesArray, undefined);
      costType = _.flatten(costType, true);

      if (costType.length === 0) return;

      item.costType = costType;
      item.selectedCostType = item.costType[0];
      item.isParent = this._isParent(this.props.costTypesArray, item.selectedCostType._id);
      item.disabled = false;

      let costItems = [];
      costItems = costItems.concat(this.state.costItems);
      costItems.push(item);

      this.setState({
        costItems: costItems
      });
    } else {
      let tempItem = {};
      let parent = item.__id;
      tempItem.__id = this._generateId();
      tempItem.__parent = parent;
      tempItem.description = undefined;

      let costType = this._getAllChildrenByParentId(this.props.costTypesArray, item.selectedCostType._id);
      costType = _.flatten(costType, true);

      if (costType.length === 0) return;

      tempItem.costType = costType;
      tempItem.selectedCostType = tempItem.costType[0];
      tempItem.isParent = this._isParent(this.props.costTypesArray, tempItem.selectedCostType._id);
      item.disabled = false;

      let costItems = [];
      costItems = costItems.concat(this.state.costItems);
      costItems.push(tempItem);

      this.setState({
        costItems: costItems
      });
    }
  },

  _convertToFixed(value) {
    let tempValue = Number(value);

    if (!_.isNaN(tempValue)) {
      value = tempValue.toFixed(2);
    }

    return value;
  },

  _handleRemoveItem(item) {
    let costItems = this.state.costItems;

    if (_.isArray(costItems)) {
      _.remove(costItems, (tempItem) => {
        return tempItem.__id === item.__id;
      });
    }

    this.setState({
      costItems: costItems,
      isDirty: true,
    }, this._emitChange);
  },

  _getSelectedIndexFromMenuItems(menuItems, value, fieldName) {
    let field = fieldName || 'payload';

    if (_.isArray(menuItems)) {
      let index = _.findIndex(menuItems, (item) => {
        return item[field] == value;
      });

      return index === -1 ? 0 : index;
    } else {
      return 0;
    }
  },

  _isParent(items, selectedCostType) {
    let isParent = false;

    if (_.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].parent == selectedCostType) {
          isParent = true;
          break;
        }
      }
    }

    return isParent;
  },

  /**
   * [_convertCostItemsToTreeListData 递归调用生成树形数据结构]
   * @param  {[array]}  items      [costItems数据]
   * @param  {[string]} parentName [父节点__id]
   * @return {[array]}             [树形结构json数组]
   */
  _convertCostItemsToTreeListData(items, parentName) {
    let treeListData = [];

    if (_.isArray(items)) {
      _.forEach(items, (item) => {
        if (item.hasOwnProperty('__parent')) {
          let parent = item.__parent;

          if (parent === parentName) {
            let tempItem = {};
            tempItem = _.assign({}, item);
            let children = [];

            children = this._convertCostItemsToTreeListData(items, item.__id);

            if (children.length) tempItem.children = children;

            treeListData.push(tempItem);
          }
        }
      });
    }

    return treeListData;
  },

  _getAllChildrenByParentId(items, pid) {
    let children = [];

    if (_.isArray(items)) {
      _.forEach(items, (item) => {
        if (item.parent == pid) {
          children.push(item);
          let subPid = item._id;
          let child = this._getAllChildrenByParentId(items, subPid);
          if (child.length !== 0) {
            children.push(child);
          }
        }
      });
    }

    return children;
  },

  _updateTreeObjectByName(id, name, value, e) {
    let costItems = this.state.costItems;
    let changed = false;
    let shouldSetState = true;
    let isDirty = this.state.isDirty;

    for (let i = 0; i < costItems.length; i++) {
      if (costItems[i].__id == id) {
        costItems[i].shouldUpdate = true;

        if (costItems[i][name] !== value) {
          isDirty = true;
          if (!costItems[i][name] && !value) {
            shouldSetState = false;
          }
          if (name === 'amount' && !!value) {
            changed = true;
          }
        } else {
          shouldSetState = false;
        }

        if (name === 'amount' && !!value) {
          value = this._convertToFixed(value);
          if (costItems[i][name] === value) {
            shouldSetState = false;
          }
          e.target.value = value;
        }
        costItems[i][name] = value;
        break;
      } else {
        costItems[i].shouldUpdate = false;
      }
    }

    if (shouldSetState) {
      if (changed) {
        this.setState({
          costItems: costItems,
          isDirty: isDirty
        }, this._emitChange);
      } else {
        this.setState({
          costItems: costItems,
          isDirty: isDirty
        });
      }
    }
  },

  /**
   * 调用外部onChange事件
   * @return {[type]} [description]
   */
  _emitChange() {
    if (_.isFunction(this.props.onChange)) {
      this.props.onChange(this.getValue());
    }
  }
});

module.exports = CostTree;
