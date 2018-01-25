const React = require('react');
const _ = require('eplodash');
const Immutable = require('epimmutable');
const IList = Immutable.List;
const IMap = Immutable.Map;
const AutoStyle = require('epui-auto-style').mixin;
const AddIcon = require('epui-md/svg-icons/content/add');
const DeleteIcon = require('epui-md/svg-icons/action/delete');
const IconButton = require('epui-md/IconButton');
const IconLabelButton = require('epui-md/ep/IconLabelButton');
const Translatable = require('epui-intl').mixin;
const ComponentCollection = {
  'SelectField': require('epui-md/SelectField'),
  'TextField': require('epui-md/TextField'),
  'TextFieldUnit': require('epui-md/TextField/TextFieldUnit'),
};

const KEY_REGEX = /(^n[A-Z].*$)|(^[A-Z].*$)/;
const PropTypes = React.PropTypes;

const PortFormList = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ProductConfigs/${__LOCALE__}`),

  propTypes: {
    addButtonLabel: PropTypes.string,
    disabled: PropTypes.bool,
    items: PropTypes.object,
    nTextAdd: PropTypes.string,
    value: PropTypes.array,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {
      item: IList(),
      items: IList(),
    };
  },

  componentWillMount() {
    let items = this.props.items;
    let value = this.props.value;

    this._getVirtualItem(items, value);
  },

  componentWillReceiveProps(nextProps, nextState) {
    let items = nextProps.items;
    let value = nextProps.value;

    this._getVirtualItem(items, value);
  },

  getValue() {
    let items = this.state.items;
    let value = [], self = this;

    items.forEach((item, index) => {
      let obj = {};

      if (IList.isList(item)) {
        item.forEach(i => {
          let component = i.get('component');
          let name = i.get('name');

          let ref = `[${index}].${name}`;

          if (component) {
            let el = self.refs[ref];

            if (el) {
              let val = el.getValue();

              obj[name] = name === 'payloadType' ? '565f99fdd4c6d9dd32dd44f1' : val;
            }
          }
        });
      }

      value.push(obj);
    });

    return value;
  },

  getStyles() {
    let styles = {
      root: {
      },
      addButtonIconStyle: {
        fill: '#2196f3',
      },
      addButtonLabelStyle: {
        maxWidth: '100%',
        color: '#2196f3',
      },
      deleteIconButton: {
        float: 'right',
        top: '10px',
      },
      deleteIcon: {
        fill: '#2196f3',
      },
      iconLabelButtonWrapper: {
        margin: '16px 0',
        width: '150px',
      },
      itemWrapper: {
        width: '100%',
        height: '100%',
      },
    };

    return styles;
  },

  renderItems() {
    let {
      items,
    } = this.state;

    let styles = this.getStyles();

    let listItems = [], self = this;

    if (IList.isList(items)) {
      items.forEach((item, index) => {
        let listItem = [];
        let disabled = false;

        if (IList.isList(item)) {
          for (let i of item) {
            let name = i.get('name');
            let value = i.get('value');
            let virtual = i.get('virtual');

            if (name === 'editable' && !virtual) {
              disabled = value === undefined ? false : !value;
            }
          }

          item.forEach(i => {
            let component = i.get('component');
            let name = i.get('name');
            let layout = i.get('layout');
            let props = i.get('props');
            let value = i.get('value');
            let virtual = i.get('virtual');

            props = props ? props.toJS() : {};
            name = `[${index}].${name}`;
            props = _.merge(props, {
              ref: name,
              key: name,
              disabled: disabled,
              style: {
                margin: '0 8px',
              }
            });

            if (component === 'TextField' ||
                component === 'TextFieldUnit' ||
                component === 'SelectField'
            ) {
              props = _.merge(props, {
                defaultValue: value,
              });
            }

            props = self._getTranslatedProps(props);

            if (component) {
              listItem.push(
                React.createElement(
                  ComponentCollection[component],
                  props
                )
              );
            }
          });
        }

        if (listItem.length) {
          let deleteIcon = disabled ? null : (
            <IconButton
              key={`deleteIcon${index}`}
              style={styles.deleteIconButton}
              iconStyle={styles.deleteIcon}
  						onTouchTap={this._handleTouchTapRemove.bind(this, index)}
            >
              <DeleteIcon />
            </IconButton>
          );

          let itemElement = (
            <div
              key={index}
              style={this.style('itemWrapper')}
            >
              {listItem}
              {deleteIcon}
            </div>
          );

          listItems.push(itemElement);
        }
      });
    }

    let addButton = this.props.disabled ? null : (
      <div
        key="addButton"
        style={styles.iconLabelButtonWrapper}
      >
        <IconLabelButton
          iconElement={<AddIcon />}
          iconStyle={styles.addButtonIconStyle}
          label={this.props.nTextAdd}
          labelStyle={styles.addButtonLabelStyle}
          handleTouchTap={this._handleTouchTapAdd}
        />
      </div>
    );

    listItems.push(addButton);

    return listItems;
  },

  render() {
    let styles = this.getStyles();

    return (
      <div style={styles.root}>
        {this.renderItems()}
      </div>
    );
  },

  /**
   * add button event
   * @return {[type]} [description]
   */
  _handleTouchTapAdd() {
    let item = this.state.item;
    let items = this.state.items;

    items = items.push(item);

    this.setState({
      items: items,
    });
  },

  /**
   * remove button event
   * @param  {[type]} index [description]
   * @return {[type]}       [description]
   */
  _handleTouchTapRemove(index) {
    let items = this.state.items;
    items = items.delete(index);

    this.setState({
      items: items,
    });
  },

  /**
   * 对component的props进行多语言处理
   * @param  {[type]} object [description]
   * @return {[type]}   [description]
   */
  _getTranslatedProps(object) {
    let self = this;

    if (_.isObject(object) && !_.isArray(object)) {
      object = _.mapValues(object, (value) => {
        if (KEY_REGEX.test(value)) {
          return self.t(value);
        } else {
          return value;
        }
      });
    }

    return object;
  },

  /**
   * get virtual item
   * @param  {[type]} items [description]
   * @return {[type]}       [description]
   */
  _getVirtualItem(items, value) {
    let virtualItem = IList();

    if (IList.isList(items)) {
      items.forEach((item, index) => {
        if (IList.isList(item)) {
          item.forEach(i => {
            let name = i.get('name');
            let value = i.get('value');
            let virtual = i.get('virtual');

            if(virtual) {
              virtualItem = virtualItem.isEmpty() ? items.get(index) : virtualItem;
              items = items.delete(index);
            }
          });
        }
      });
    }

    if (items.size <= 1 && value) {
      if (_.isArray(value)) {
        let virtual = virtualItem;
        value.forEach((val, index) => {
          let item = IList();
          virtual.forEach((vir, idx) => {
            let name = vir.get('name');
            let tempValue = val[name];
            vir = vir.delete('virtual');
            vir = vir.set('value', tempValue);
            item = item.push(vir);
          });

          if (!item.isEmpty()) {
            items = items.push(item);
          }
        });
      }
    }

    this.setState({
      item: virtualItem,
      items: items,
    });
  },

});

module.exports = PortFormList;
