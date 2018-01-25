const React = require('react');
const _ = require('eplodash');
const AddIcon = require('epui-md/svg-icons/content/add');
const AutoStyle = require('epui-auto-style').mixin;
const Checkbox = require('epui-md/Checkbox');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const EventItem = require('./event-item');
const IconButton = require('epui-md/IconButton');
const IconLabelButton = require('epui-md/ep/IconLabelButton');
const InsertDriveFileIcon = require('epui-md/svg-icons/editor/insert-drive-file');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const RaisedButton = require('epui-md/RaisedButton');
const TextField = require('epui-md/TextField');
const Translatable = require('epui-intl').mixin;
const invariant = require('fbjs/lib/invariant');
const warning = require('fbjs/lib/warning');
const { Map, List } = require('epimmutable');
const TEMP_ID_PREFIX = 'temp_id_';

const EventList = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translatable],

  translations: require(`epui-intl/dist/EventTree/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    eventItemsArray: PropTypes.object,
    nHintTextDescription: PropTypes.string,
    nTextAdd: PropTypes.string,
    onChange: PropTypes.func,
    onAddItem: PropTypes.func,
    onRemoveItem: PropTypes.func,
    onListChange: PropTypes.func,
  },

  getDefaultProps() {
    return {
      disabled: false,
      eventItemsArray: null,
    };
  },

  getInitialState() {
    let eventItems = this.props.eventItemsArray;

    return {
      eventItems: eventItems ? (List.isList(eventItems) ? eventItems : List.of(eventItems)) : eventItems,
      isDirty: false,
    };
  },

  componentWillReceiveProps(nextProps) {
    let eventItems = nextProps.eventItemsArray;

    eventItems = eventItems ? (List.isList(eventItems) ? eventItems : List.of(eventItems)) : eventItems;

    this.setState({
      eventItems: eventItems,
    });
  },

  isDirty(){
    return this.state.isDirty;
  },

  clearDirty(){
    this.setState({
      isDirty: false
    });
  },

  getValue(){
    let eventItems = [];
    this.state.eventItems.forEach(eventItem => {
      let item = this.refs['item_' + eventItem._id].getValue();
      if(item._id.indexOf(TEMP_ID_PREFIX) > -1) { delete item._id; }
      eventItems.push(item);
    });

    return eventItems;
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
      },
      addButtonIconStyle: {
        fill: theme.accent1Color,
      },
      addButtonLabelStyle: {
        maxWidth: '100%',
        color: theme.accent1Color,
      },
      iconLabelButton: {
        width: '90px',
      },
    };
    return styles;
  },

  renderAddBtn(){
    let elAddBtn = (
      <div style={this.style('addBtn')}>
        <IconLabelButton
          ref='addBtn'
          iconElement={<AddIcon />}
          iconStyle={this.style('addButtonIconStyle')}
          label= {this.t('nTextAdd')}
          labelStyle={this.style('addButtonLabelStyle')}
          style={this.style('iconLabelButton')}
          handleTouchTap={this._handleAddItem}
        />
      </div>
    );

    return elAddBtn;
  },

  renderEventItems(){
    let eventItemsElements = [];

    this.state.eventItems.forEach(eventItem => {
      eventItemsElements.push(
        <EventItem
          ref={'item_' + eventItem._id}
          key={eventItem._id}
          item={eventItem}
          disabled={this.props.disabled}
          onItemChange={this._handleItemChange}
          onTouchTapDeleteBtn={this._handleBtnDelete}
        />
      );
    });

    return eventItemsElements;
  },

  render() {

    return (
      <div style ={this.style('root')}>
        {this.renderEventItems()}
        {this.renderAddBtn()}
      </div>
    );
  },

  _handleAddItem() {
    if(!this.props.orderEntry) return;

    let newItem = this.props.orderEntry.convertEventItemToModel({
      _id: this._generateTempId(),
    });

    let eventItems = this.state.eventItems.push(newItem);

    this.setState({
      eventItems: eventItems,
      isDirty: true,
    }, () => {
      if(this.props.onListChange) this.props.onListChange();
    });
  },

  _handleBtnDelete(itemId) {
    let eventItems = this.state.eventItems.filter(newItem => {
      return itemId !== newItem._id;
    });

    this.setState({
      eventItems: eventItems,
      isDirty: true,
    }, () => {
      if(this.props.onListChange) this.props.onListChange();
    });
  },

  _handleItemChange() {
    if(!this.state.isDirty) {
      this.setState({
        isDirty : true
      });
    }
  },

  _generateTempId(){
    return TEMP_ID_PREFIX + Math.random() * 10001;
  },

});

module.exports = EventList;
