const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

require('epui-intl/lib/locales/' + __LOCALE__);

const Item = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    item : PropTypes.object.isRequired,
    isActived: PropTypes.bool,
    onTouchTap: PropTypes.func,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      item:{
        primaryText: 'Agency',
        value: 'ORGA'
      },
      isActived: false,
    };
  },

  getStyles() {
    let isActived = this.props.isActived;
    let theme = this.context.muiTheme;
    let styles = {
      root: {
        minWidth: 85,
        backgroundColor: isActived ? theme.epColor.primaryColor : '#d8d8d8',
        color:  isActived ? theme.epColor.whiteColor : theme.epColor.fontColor,
        fontSize: 16,
        fontWeight: 500,
        cursor: 'pointer',
        display: 'inline-block',
        padding: 5,
        marginLeft: 2,
        textAlign: 'center',
      },
    };

    return styles;
  },

  handleTouchTap(){
    if(this.props.onTouchTap) this.props.onTouchTap(this.props.item.value);
  },

  render() {
    return (
      <div
        style={this.style('root')}
        onTouchTap = {this.handleTouchTap}
      >
        {this.props.item.primaryText}
      </div>
    );
  },
});

module.exports = Item;
