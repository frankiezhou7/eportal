const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DeleteIcon = require('epui-md/svg-icons/action/delete');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const IconButton = require('epui-md/IconButton');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const TextField = require('epui-md/TextField');
const TextFieldDateTime = require('epui-md/TextField/TextFieldDateTime');
const Translatable = require('epui-intl').mixin;
const { List } = require('epimmutable');

const EventItem = React.createClass({

  mixins: [AutoStyle, Translatable, PureRenderMixin],

  translations: require(`epui-intl/dist/EventTree/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    disabled: PropTypes.bool,
    item: PropTypes.object,
    menuItems: PropTypes.object,
    nTextAdd:PropTypes.string,
    nTextRemove:PropTypes.string,
    nLabelDescription:PropTypes.string,
    onTouchTapDeleteBtn: PropTypes.func,
  },

  getDefaultProps() {
    return {
      disabled: false,
      item: {},
      menuItems: {},
    };
  },

  getInitialState() {
    return{

    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();

    let styles = {
      root: {
        position: 'relative',
        height: '96px',
        margin: '0 0 0 20px',
      },
      date: {
        wrapper: {
          display: 'inline-block',
          width: '90px',
          position: 'absolute',
          right: 60,
          bottom: 0,
        },
        base: {
          verticalAlign: 'bottom',
        },
      },
      deleteIconStyle: {
        fill: theme.greyColor,
      },
      deleteIconButton:{
        top: '40px',
        verticalAlign: 'bottom',
      },
      description: {
        wrapper: {
          display: 'inline-block',
          position: 'absolute',
          left: 0,
          right: 160,
          bottom: 0,
        },
        base: {
          verticalAlign: 'bottom',
        },
      },
    };

    return styles;
  },

  getValue(){
    let item = this.props.item.toJS();
    let itemRef = this._generateItemRef();
    item.description = this.refs['description_' + itemRef].getValue();
    item.date = this.refs['date_' + itemRef].getValue();
    return item;
  },

  renderDescription(item, itemRef) {
    let elDescription = (
      <div style={this.style('description.wrapper')}>
        <TextField
          ref ={'description_' + itemRef}
          key={'description_' + itemRef}
          defaultValue={item.message}
          disabled={this.props.disabled}
          fullWidth={true}
          hintText={this.t('nHintTextDescription')}
          multiLine={true}
          rowsMax={3}
          rows={3}
          style={this.style('description.base')}
          onBlur={this._handleBlur.bind(this, item, 'message')}
          onChange={this._handleItemChange.bind(this, item, 'message')}
        />
      </div>
    );

    return elDescription;
  },

  renderDate(item, itemRef) {
    let elDate = (
      <div style={this.style('date.wrapper')}>
        <TextFieldDateTime
          ref ={'date_' + itemRef}
          key={'date_' + itemRef}
          baseDate={item.date ? new Date(item.date) : new Date()}
          defaultValue={item.date ? new Date(item.date) : new Date()}
          disabled={this.props.disabled}
          fullWidth={true}
          hintText={this.t('nHintTextEventDateTime')}
          showYear={false}
          style={this.style('date.base')}
          onBlur={this._handleBlur.bind(this, item, 'date')}
          onChange={this._handleItemChange.bind(this, item, 'date')}
        />
      </div>
    );

    return elDate;
  },

  renderDeleteButton() {
    let elDelete = (
      <IconButton
        disabled={this.props.disabled}
        style={this.style('deleteIconButton')}
        title = {this.t('nTextRemove')}
        onTouchTap={this._handleTouchTapRemove}>
      >
        <DeleteIcon style={this.style('deleteIconStyle')}/>
      </IconButton>
    );

    return elDelete;
  },

  render() {
    let styles = this.getStyles();
    let selectedIndex = 0 ;

    let itemRef = this._generateItemRef();
    let item = this.props.item;

    return (
      <div style={this.style('root')}>
        {this.renderDescription(item, itemRef)}
        {this.renderDate(item, itemRef)}
        {this.renderDeleteButton()}
      </div>
    );
  },

  _handleBlur(item, key, e) {
  },

  _handleTouchTapRemove() {
    let fn = this.props.onTouchTapDeleteBtn;

    if(_.isFunction(fn)) {
      let itemId = this.props.item._id ? this.props.item._id :this.props.item.refId;
      fn(itemId);
    }
  },

  _handleItemChange() {
    let fn = this.props.onItemChange;

    if(_.isFunction(fn)) {
      fn();
    }
  },

  _generateItemRef() {
    return this.props.item._id;
  },

});

module.exports = EventItem;
