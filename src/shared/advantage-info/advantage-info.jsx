const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const Paper = require('epui-md/Paper');
const TextField = require('epui-md/TextField');
const AdvantageItem = require('./advantage-item');
const RaisedButton = require('epui-md/RaisedButton');

const AdvantageInfo = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.array,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let { value } = this.props;
    return {
      itemId: value ? value.length : 0,
      removedIds: [],
    };
  },

  getStyles() {
    let styles = {
      root: {

      },
      button: {
        marginTop: 30,
      }
    };

    return styles;
  },

  getValue() {
    let items = [];
    let { itemId, removedIds } = this.state;
    let { value } = this.props;
    let length = value && value.length;
    let total = itemId ? itemId : length;
    for(let idx = 0; idx < total; idx++){
      if(_.indexOf(removedIds, idx) !== -1) continue;
      let val = this.refs[`item${idx}`] && this.refs[`item${idx}`].getValue();
      items.push(val);
    }

    return items;
  },

  renderAdvantageItem(value){
    let { itemId } = this.state;
    let elems = [];
    let length = value && value.length;
    let total = itemId ? itemId : length;
    for(let idx = 0; idx < total; idx++){
      elems.push(
        <AdvantageItem
          ref={`item${idx}`}
          style={this.style('item')}
          itemId={idx}
          onRemoveItem={this._handleDeleteItem}
          value={value && value[idx]}
        />
      );
    }

    return elems;
  },

  render() {
    let styles = this.getStyles();
    const {
      value,
    } = this.props;
    return (
      <div style={this.style('root')}>
        {this.renderAdvantageItem(value)}
        <div style={this.style('button')}>
          <RaisedButton
            key='save'
            label={this.t('nButtonAddAdvantage')}
            primary={true}
            capitalized='capitalize'
            onTouchTap={this._handleAddTouchTap} />
        </div>
      </div>
    );
  },

  _handleAddTouchTap() {
    let itemId = this.state.itemId + 1;
    this.setState({itemId});
  },

  _handleDeleteItem(itemId) {
    let { removedIds } = this.state;
    removedIds.push(itemId);
    this.setState({removedIds});
  },
});

module.exports = AdvantageInfo;
