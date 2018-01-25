const React = require('react');
const _ = require('eplodash');
const StylePropable = require('~/src/mixins/style-propable');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const InsertDriveFileIcon = require('epui-md/svg-icons/editor/insert-drive-file');
const IconButton = require('epui-md/IconButton');
const TextField = require('epui-md/TextField');
const TextFieldDateTime = require('epui-md/TextField/TextFieldDateTime');
const Translatable = require('epui-intl').mixin;
const TreeList = require('epui-md/tree-list');

const PropTypes = React.PropTypes;


const EventTree = React.createClass({

  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/EventTree/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    eventItemsArray: PropTypes.any,
    eventTypesArray: PropTypes.any,
    nHintTextDescription: PropTypes.string,
    nHintTextEventDateTime: PropTypes.string,
    onChange: PropTypes.func,
    orderEntryId: PropTypes.string,
  },

  getDefaultProps() {
    return {
      disabled: false,
      eventItemsArray: [],
    };
  },

  getInitialState() {
    return {
      eventItems: this._makeNewId(_.cloneDeep(this.props.eventItemsArray)),
      initialEventItems: this.props.eventItemsArray,
      isDirty: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.eventItemsArray !== this.props.eventItemsArray) {
      this.setState({
        eventItems: this._makeNewId(_.cloneDeep(nextProps.eventItemsArray)),
        initialEventItems: nextProps.eventItemsArray,
        isDirty: false
      });
    }
  },

  getTheme() {
    return this.context.muiTheme;
  },

  getStyles() {
    let theme = this.getTheme();
    let palette = theme.palette;

    let styles = {
      root: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      type: {
        base: {
          position: 'relative',
          display: 'inline-block',
          float: 'left',
          margin: '0 -180px 0 0',
          width: '180px',
        },
        menu: {
          width: '180px',
        },
        underline: {
          margin: '-7px 12px',
        }
      },
      description: {
        wrapper: {
          display: 'inline-block',
          position: 'absolute',
          left: 0,
          right: 100,
          bottom: 0,
        },
        base: {
          verticalAlign: 'bottom',
        }
      },
      date: {
        wrapper: {
          display: 'inline-block',
          width: '90px',
          margin: '0 0 0 -210px',
          position: 'absolute',
          right: 0,
          bottom: 0,
        },
        base: {
          verticalAlign: 'bottom',
        }
      },
    };

    return {
      root: this.mergeAndPrefix(styles.root),
      type: {
        base: this.mergeAndPrefix(styles.type.base),
        underline: this.mergeAndPrefix(styles.type.underline),
        menu: this.mergeAndPrefix(styles.type.menu),
      },
      description: {
        base: this.mergeAndPrefix(styles.description.base),
        wrapper: this.mergeAndPrefix(styles.description.wrapper),
      },
      date: {
        base: this.mergeAndPrefix(styles.date.base),
        wrapper: this.mergeAndPrefix(styles.date.wrapper),
      }
    };
  },

  render() {
    let styles = this.getStyles();

    const data = this._convertEventItemsToTreeListData(this.state.eventItems, undefined);

    return (
      <div style={styles.root}>
        <TreeList
          data={data}
          idField='__id'
          onRenderItem={this._handleRenderItem}
          onAdd={this._handleAddItem}
          onExpand={this._handleExpand}
          onRemove={this._handleRemoveItem}
          rowHeight={96}
          ref='tree-list' />
      </div>
    );
  },

  clearState() {
    this.setState({
      initialEventItems: [],
      eventItems: []
    });
  },

  isDirty() {
    return this.state.isDirty;
  },

  getValue() {
    return _.chain(this.state.eventItems)
    .map(
      (item) => {
        if(!item.message || !item.date) { return; }
        return {
          message: item.message,
          date: item.date,
        };
      }
    )
    .filter()
    .value();
  },

  restore() {
    this.setState({
      eventItems: this._makeNewId(_.cloneDeep(this.state.initialEventItems))
    });
  },

  _updateTreeObjectByName(id, name, value) {
    let eventItems = this.state.eventItems;
    let changed = false;
    let isDirty = this.state.isDirty;

    let found = _.find(eventItems, { __id: id });
    if(!found) { return; }

    if(found[name] !== value) {
      changed = true;
      found[name] = value;
    }

    if (!changed) { return; }

    this.setState({
      eventItems: eventItems,
      isDirty: true
    }, this._emitChange);
  },

  _handleBlur(item, key, e) {
    this._updateTreeObjectByName(item.__id, key, e.target.value);
  },

  /**
   * [_getSelectedIndexFromMenuItems description]
   * @param  {[type]} menuItems [description]
   * @param  {[type]} value     [description]
   * @param  {[type]} fieldName [description]
   * @return {[type]}           [description]
   */
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

  /**
   * [_handleItemChange description]
   * @param  {[type]} eventItem     [description]
   * @param  {[type]} e             [description]
   * @param  {[type]} selectedIndex [description]
   * @param  {[type]} menuItem      [description]
   * @return {[type]}               [description]
   */
  _handleItemChange(eventItem, e, selectedIndex, menuItem) {
    let eventItems = this.state.eventItems;

    if (_.isArray(eventItems)) {
      for (var i = 0; i < eventItems.length; i++) {
        if (eventItems[i].__id == eventItem.__id) {
          eventItems[i].type = menuItem;
          eventItems[i].isParent = this._checkIsParent(this.props.eventTypesArray, menuItem.payload);
          break;
        }
      }

      this.setState({
        eventItems: eventItems,
        isDirty: true
      }, this._emitChange);
    }
  },

  /**
   * [_handleExpand description]
   * @param  {[type]} item [description]
   * @return {[type]}      [description]
   */
  _handleExpand(item) {
    let expanded = item.expanded === undefined ? true : item.expanded;
    let eventItems = this.state.eventItems;

    for (let i = 0; i < eventItems.length; i++) {
      if(eventItems[i].__id == item.__id) {
        eventItems[i].expanded = !expanded;
        break;
      }
    }

    this.setState({
      eventItems: eventItems
    });
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

    // let parentId = item.type && item.type.parent;
    // let eventTypes = this._getAllChildrenByParentId(this.props.eventTypesArray, parentId);
    // let menuItems = eventTypes;
    // let selectedEventTypeId = item.type._id;
    // let selectedIndex = this._getSelectedIndexFromMenuItems(menuItems, selectedEventTypeId, '_id');

    item.disabled = false;// this._checkIsParent(this.state.eventItems, item.__id);

    // styles.eventType = this.mergeStyles(styles.eventType, {
    //   height: innerContentHeight
    // });
    //
    // styles.descriptionWrapper = this.mergeStyles(styles.descriptionWrapper, {
    //   height: innerContentHeight
    // });
    //
    // styles.event = this.mergeStyles(styles.event, {
    //   height: innerContentHeight
    // });
    //
    // let elType = (
    //   <DropDownMenu
    //     style={this.mergeAndPrefix(styles.type.base, styles.type.menu)}
    //     autoWidth={false}
    //     displayMember='name'
    //     valueMember='_id'
    //     menuItems={menuItems}
    //     selectedIndex={selectedIndex}
    //     disabled={item.disabled}
    //     underlineStyle={styles.type.underline}
    //     onChange={this._handleItemChange.bind(this, item)} />
    // );

    let elDescription = (
      <div style={styles.description.wrapper}>
        <TextField
          style={styles.description.base}
          disabled={item.disabled}
          fullWidth={true}
          hintText={this.t('nHintTextDescription')}
          key={item.__id + 'desc'}
          defaultValue={item.message}
          onBlur={this._handleBlur.bind(this, item, 'message')}
          rowsMax={3}
          rows={3}
          multiLine={true}
        />
      </div>
    );

    let elDate = (
      <div style={styles.date.wrapper}>
        <TextFieldDateTime
          style={styles.date.base}
          disabled={item.disabled}
          fullWidth={true}
          showYear={false}
          hintText={this.t('nHintTextEventDateTime')}
          key={item.__id + 'date'}
          baseDate={item.date ? new Date(item.date) : new Date()}
          defaultValue={item.date ? new Date(item.date) : new Date()}
          onBlur={this._handleBlur.bind(this, item, 'date')}
        />
      </div>
    );

    return (
      <div style={styles.root}>
        {elDescription}
        {elDate}
      </div>
    );
  },

  /**
   * [_checkIsParent description]
   * @param  {[type]} items             [description]
   * @param  {[type]} selectedEventType [description]
   * @return {[type]}                   [description]
   */
  _checkIsParent(items, selectedEventType) {
    let isParent = false;

    if (_.isArray(items)) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].parent == selectedEventType) {
          isParent = true;
          break;
        }
      }
    }

    return isParent;
  },

  /**
   * [_convertEventItemsToTreeListData 递归调用生成树形数据结构]
   * @param  {[array]}  items      [eventItems数据]
   * @param  {[string]} parentName [父节点__id]
   * @return {[array]}             [树形结构json数组]
   */
  _convertEventItemsToTreeListData(items, parentName) {
    let treeListData = [];

    if (_.isArray(items)) {
      _.forEach(items, (item) => {
        if (item.hasOwnProperty('__parent')) {
          let parent = item.__parent;

          if (parent === parentName) {
            let tempItem = {};
            tempItem = _.assign({}, item);
            let children = [];

            children = this._convertEventItemsToTreeListData(items, item.__id);

            if (children.length) tempItem.children = children;

            treeListData.push(tempItem);
          }
        }
      });
    }

    return treeListData;
  },

  /**
   * [_getAllChildrenByParentId description]
   * @param  {[type]} items [description]
   * @param  {[type]} pid   [description]
   * @return {[type]}       [description]
   */
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
   * 生成uniqueId
   * @return {[type]} [description]
   */
  _generateId() {
    this.uniqueId = this.uniqueId === undefined ? 1 : ++this.uniqueId;
    return this.uniqueId;
  },

  /**
   * [_makeNewId description]
   * @param  {[type]} eventItems [description]
   * @return {[type]}            [description]
   */
  _makeNewId(eventItems) {
    if (!this.ids) {
      this.ids = {};
    }
    _.forEach(eventItems, (eventItem) => {
      let id = eventItem._id;

      if (!this.ids[id]) {
        this.ids[id] = this._generateId();
        eventItem.__id = this.ids[id];
      } else {
        eventItem.__id = this.ids[id];
      }
    });

    _.forEach(eventItems, (eventItem) => {
      let parent = eventItem.parent;

      if (parent) {
        if (!this.ids[parent]) {
          this.ids[parent] = this._generateId();
          eventItem.__parent = this.ids[parent];
        } else {
          eventItem.__parent = this.ids[parent];
        }
      } else {
        eventItem.__parent = parent;
      }
    });

    return eventItems;
  },

  /**
   * [_handleAddItem]
   * @param  {[type]} item [description]
   * @return {[type]}      [description]
   */
  _handleAddItem(item) {
    // 添加根节点
    if (!item) {
      item = {};
      item.__id = this._generateId();
      item.__parent = undefined;
      item.message = undefined;

      let eventType = this._getAllChildrenByParentId(this.props.eventTypesArray, undefined);
      eventType = _.flatten(eventType, true);

      if (eventType.length === 0) return;

      item.eventType = eventType;
      item.type = item.eventType[0];
      item.isParent = this._checkIsParent(this.props.eventTypesArray, item.type._id);
      item.disabled = false;
      item.date = new Date();

      let eventItems = [];
      eventItems = eventItems.concat(this.state.eventItems);
      eventItems.push(item);

      this.setState({
        eventItems: eventItems
      });
    } else {
      let tempItem = {};
      let parent = item.__id;
      tempItem.__id = this._generateId();
      tempItem.__parent = parent;
      tempItem.message = undefined;

      let eventType = this._getAllChildrenByParentId(this.props.eventTypesArray, item.type._id);
      eventType = _.flatten(eventType, true);

      if (eventType.length === 0) return;

      tempItem.eventType = eventType;
      tempItem.type = tempItem.eventType[0];
      tempItem.isParent = this._checkIsParent(this.props.eventTypesArray, tempItem.type._id);
      tempItem.date = new Date();
      item.disabled = false;

      let eventItems = [];
      eventItems = eventItems.concat(this.state.eventItems);
      eventItems.push(tempItem);

      this.setState({
        eventItems: eventItems
      });
    }
  },

  /**
   * [_handleRemoveItem description]
   * @param  {[type]} item [description]
   * @return {[type]}      [description]
   */
  _handleRemoveItem(item) {
    let eventItems = this.state.eventItems;

    if (_.isArray(eventItems)) {
      _.remove(eventItems, (tempItem) => {
        return tempItem.__id === item.__id;
      });
    }

    this.setState({
      eventItems: eventItems,
      isDirty: true,
    });
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

module.exports = EventTree;
