const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const Paper = require('epui-md/Paper');
const TextField = require('epui-md/TextField');
const Clear = require('epui-md/svg-icons/content/clear');
const RaisedButton = require('epui-md/RaisedButton');

const AdvantageItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onRemoveItem: PropTypes.func,
    value: PropTypes.string,
    itemId: PropTypes.number,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let { value } = this.props;
    return {
      show: true,
    };
  },

  getStyles() {
    let styles = {
      root: {
        position: 'relative',
      },
      item: {
        display: this.state.show ? 'block' : 'none',
        width: '800px',
      },
      button: {
        position: 'absolute',
        width: 18,
        height: 18,
        fill: '#f5a623',
        top: 37,
        right: -30,
        cursor: 'pointer',
      }
    };

    return styles;
  },

  getValue() {
    return this.refs.advantage.getValue();
  },

  render() {
    let styles = this.getStyles();
    const {
      value,
      itemId
    } = this.props;
    return (
      <div style={this.style('root')}>
        <Clear style={this.style('button')} onClick={this._handleRemoveItem.bind(this,itemId)}/>
        <TextField
          ref='advantage'
          style={this.style('item')}
          floatingLabelText={`${itemId + 1}` + '\\'}
          defaultValue={value}
        />
      </div>
    );
  },

  _handleRemoveItem(itemId) {
    const {
      onRemoveItem,
    } = this.props;
    this.setState({
      show: false,
    });
    onRemoveItem(itemId);
  },
});

module.exports = AdvantageItem;
