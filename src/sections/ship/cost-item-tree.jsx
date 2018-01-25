const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField');
const TreeList = require('epui-md/tree-list');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const InsertDriveFileIcon = require('epui-md/svg-icons/editor/insert-drive-file');
const IconButton = require('epui-md/IconButton');

const CostItemTree = React.createClass({

  mixins: [StylePropable],

  translations: require(`epui-intl/dist/CostItem/${__LOCALE__}`),

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    nHintTextDescription: React.PropTypes.string,
    nLabelCostEst: React.PropTypes.string,
    nLabelCostAct: React.PropTypes.string,
    costItemsType: React.PropTypes.oneOf(['actual', 'estimated']), // 实际费用，预计费用
    costTypesArray: React.PropTypes.array,
    costItemsArray: React.PropTypes.array,
    orderEntryId: React.PropTypes.string,
  },

  getDefaultProps() {
    return {
      costItemsArray: [],
      costItemsType: 'actual',
    };
  },

  getInitialState() {
    return {
      costItems: this.props.costItemsArray,
      costTypes: costTypes,
    };
  },

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
      costType: {
        position: 'relative',
        display: 'inline-block',
        float: 'left',
        margin: '0 -180px 0 0',
        width: '180px',
      },
      costTypeUnderlineStyle: {
        margin: '-7px 12px',
      },
      descriptionWrapper: {
        display: 'inline-block',
        float: 'left',
        width: '100%',
      },
      description: {
        margin: '0 140px 0 180px',
      },
      dropDownMenu: {
        width: '180px',
      },
      estimatedFee: {
        display: 'inline-block',
        float: 'right',
        margin: '0 0 0 -80px',
        width: '80px',
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
      insertDriveFile: {
        fill: theme.primary1Color,
      }
    };

    return styles;
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

  _handleItemChange(costItem, e, selectedIndex, menuItem) {
    let costItems = _.clone(this.state.costItems, true);

    if (_.isArray(costItems)) {
      for (var i = 0; i < costItems.length; i++) {
        if (costItems[i]._id == costItem._id) {
          costItems[i].selectedCostType = menuItem;
          costItems[i].isParent = this._checkIsParent(this.state.costTypes, menuItem.payload);
          break;
        }
      }

      this.setState({
        costItems: costItems
      });
    }
  },

  _handleExpand(item) {
    let expanded = item.expanded === undefined ? true : item.expanded;
    let costItems = _.clone(this.state.costItems, true);

    for (let i = 0; i < costItems.length; i++) {
      if(costItems[i]._id == item._id) {
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

  _updateTreeObjectByName(id, name, value) {
    let costItems = _.cloneDeep(this.state.costItems);

    for (var i = 0; i < costItems.length; i++) {
      if (costItems[i]._id == id) {
        costItems[i][name] = value;
        break;
      }
    }

    this.setState({
      costItems: costItems
    });
  },

  _handleBlur(item, key, e) {
    let id = item._id;
    let val = e.target.value;
    this._updateTreeObjectByName(id, key, val);
  },

  /**
   * tree-list的onRenderItem回调函数，动态生成每一行的元素
   * @param  {[array]}    item                [当前行节点json数组]
   * @param  {[number]}   innerContentWidth   [当前行容器宽度]
   * @param  {[number]}   innerContentHeight  [当前行容器高度]
   * @return {[React.PropTypes.element]}      [动态生成的行内容]
   */
  _handleRenderItem(item, innerContentWidth, innerContentHeight) {
    let styles = this.getStyles();
    let props = this.props;

    // 判断渲染模式，actual还是estimated
    let isEstimated = props.costItemsType === 'estimated' ? true : false;

    let menuItems = item.costType;

    let selectedCostTypeId = item.selectedCostType._id;

    let selectedIndex = this._getSelectedIndexFromMenuItems(menuItems, selectedCostTypeId, '_id');

    item.disabled = this._checkIsParent(this.state.costItems, item._id);

    styles.costType = this.mergeStyles(styles.costType, {
      height: innerContentHeight
    });

    styles.descriptionWrapper = this.mergeStyles(styles.descriptionWrapper, {
      height: innerContentHeight
    });

    styles.estimatedFee = this.mergeStyles(styles.estimatedFee, {
      height: innerContentHeight
    });

    styles.actualFee = this.mergeStyles(styles.actualFee, {
      height: innerContentHeight
    });

    let costTypeElement = (
      <div style={styles.costType}>
        <DropDownMenu
          autoWidth={false}
          displayMember='name'
          valueMember='_id'
          menuItems={menuItems}
          selectedIndex={selectedIndex}
          style={styles.dropDownMenu}
          disabled={item.disabled}
          underlineStyle={styles.costTypeUnderlineStyle}
          onChange={this._handleItemChange.bind(this, item)} />
      </div>
    );

    if(isEstimated) styles.description = this.mergeStyles(styles.description, {marginRight: '92px'});

    let detailDescriptionElement = (
      <div style={styles.descriptionWrapper}>
        <div style={styles.description}>
          <TextField
            hintText={props.nHintTextDescription}
            fullWidth={true}
            onBlur={this._handleBlur.bind(this, item, 'description')} />
        </div>
      </div>
    );

    let estimatedFeeElement = (
      <div style={styles.estimatedFee}>
        <TextField
          hintText={props.nLabelCostEst}
          fullWidth={true}
          onBlur={this._handleBlur.bind(this, item, 'amount')} />
      </div>
    );

    let actualFeeAndInsertDriveFileElement = (
      <div style={styles.actualFeeWrapper}>
        <div style={styles.actualFee}>
          <TextField
            hintText={props.nLabelCostAct}
            fullWidth={true}
            onBlur={this._handleBlur.bind(this, item, 'amount')} />
        </div>
        <IconButton
          style={styles.insertIconButton}
          iconStyle={styles.insertDriveFile}
          onTouchTap={this._handleTouchTapUploadFile.bind(this, item)}>
          <InsertDriveFileIcon />
        </IconButton>
      </div>
    );

    let feeElement = isEstimated ? estimatedFeeElement : actualFeeAndInsertDriveFileElement;

    return (
      <div style={styles.root}>
        {costTypeElement}
        {detailDescriptionElement}
        {feeElement}
      </div>
    );
  },

  _checkIsParent(items, selectedCostType) {
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
   * @param  {[string]} parentName [父节点_id]
   * @return {[array]}             [树形结构json数组]
   */
  _convertCostItemsToTreeListData(items, parentName) {
    let treeListData = [];

    if (_.isArray(items)) {
      _.forEach(items, (item) => {
        if (item.hasOwnProperty('parent')) {
          let parent = item.parent;

          if (parent === parentName) {
            let tempItem = {};
            tempItem = _.assign({}, item);
            let children = [];

            children = this._convertCostItemsToTreeListData(items, item._id);

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

  /**
   * handle add button event
   */
  _handleAddItem(item) {
    // 添加根节点
    if (!item) {
      item = {};
      this.uniqueId = this.uniqueId === undefined ? 0 : ++this.uniqueId;
      item._id = this.uniqueId;
      item.parent = undefined;
      item.description = undefined;

      let costType = this._getAllChildrenByParentId(this.state.costTypes, undefined);
      costType = _.flatten(costType, true);

      if (costType.length === 0) return;

      item.costType = costType;
      item.selectedCostType = item.costType[0];
      item.isParent = this._checkIsParent(this.state.costTypes, item.selectedCostType._id);
      item.disabled = false;

      let costItems = [];
      costItems = costItems.concat(this.state.costItems);
      costItems.push(item);

      this.setState({
        costItems: costItems
      });
    } else {
      let tempItem = {};
      let parent = item._id;
      this.uniqueId = this.uniqueId === undefined ? 0 : ++this.uniqueId;
      tempItem._id = this.uniqueId;
      tempItem.parent = parent;
      tempItem.description = undefined;

      let costType = this._getAllChildrenByParentId(this.state.costTypes, item.selectedCostType._id);
      costType = _.flatten(costType, true);

      if (costType.length === 0) return;

      tempItem.costType = costType;
      tempItem.selectedCostType = tempItem.costType[0];
      tempItem.isParent = this._checkIsParent(this.state.costTypes, tempItem.selectedCostType._id);
      item.disabled = false;

      let costItems = [];
      costItems = costItems.concat(this.state.costItems);
      costItems.push(tempItem);

      this.setState({
        costItems: costItems
      });
    }
  },

  _handleRemoveItem(item) {
    let costItems = _.clone(this.state.costItems, true);

    if (_.isArray(costItems)) {
      _.remove(costItems, (tempItem) => {
        return tempItem._id === item._id;
      });
    }

    this.setState({
      costItems: costItems
    });
  },

  render() {
    let styles = this.getStyles();
    const data = this._convertCostItemsToTreeListData(this.state.costItems, undefined);

    return (
      <div style={styles.root}>
        <TreeList
          ref='tree-list'
          data={data}
          idField='_id'
          onRenderItem={this._handleRenderItem}
          onAdd={this._handleAddItem}
          onExpand={this._handleExpand}
          onRemove={this._handleRemoveItem} />
      </div>
    );
  }

});

module.exports = CostItemTree;
