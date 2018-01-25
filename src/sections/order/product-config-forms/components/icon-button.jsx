const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

let IconButton = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    title: PropTypes.string,
    refId : PropTypes.any,
    onClick: PropTypes.func,
    children: PropTypes.element,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {
      refId:'',
      title: '',
    };
  },

  getInitialState(){
    return {

    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let padding = 2;
    let buttonStyle ={
      display: 'inline-block',
      textAlign: 'center',
      cursor: 'pointer',
    };
    if(this.props.style){
      _.merge(buttonStyle,this.props.style);
    }
    return {
      button:buttonStyle,
    };
  },

  render() {
    return(
      <div
        title = {this.props.title}
        style = {this.style('button')}
        onClick = {this._handleClick}
      >
        {this.props.children}
      </div>
    );
  },

  _handleClick(){
    if(this.props.onClick){
      this.props.onClick(this.props.refId);
    }
  },

});
module.exports = IconButton;
