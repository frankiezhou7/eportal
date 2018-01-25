const React = require('react');
const _ = require('eplodash');
const Item = require('./item');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const OrganizationHeaderRight = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    items : PropTypes.array,
    onItemTouchTap : PropTypes.func,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      items:[
        {
          primaryText: 'Agency',
          value: 'ORGA'
        },
        {
          primaryText: 'Supplier',
          value: 'ORSP'
        },
        {
          primaryText: 'Inspection',
          value: 'ORIN'
        },
        {
          primaryText: 'SPRO',
          value: 'ORSR'
        },
        {
          primaryText: 'Workshop',
          value: 'ORWS'
        },
        {
          primaryText: 'Shipyard',
          value: 'ORSY'
        },
        {
          primaryText: 'Shipping Company',
          value: 'OROT'
        }
      ],
    };
  },

  getInitialState(){
    return {
      value: this.props.items ? this.props.items[0].value: '',
    }
  },

  getStyles() {
    let styles = {
      root: {
        paddingRight: 5,
      },
    };

    return styles;
  },

  handleTouchTap(value){
    this.setState({value:value});
    if(this.props.onItemTouchTap) this.props.onItemTouchTap(value);
  },

  render() {
    return (
      <div style={this.style('root')}>
        {_.map(this.props.items,item=>{
          return (
            <Item
              key = {item.value}
              item = {item}
              onTouchTap = {this.handleTouchTap}
              isActived = { item.value === this.state.value }
            />
          );
        })}
      </div>
    );
  },
});

module.exports = OrganizationHeaderRight;
