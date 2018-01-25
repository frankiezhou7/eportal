const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

let DivButton = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    iconHeight: PropTypes.number,
    refId : PropTypes.any,
    onClick: PropTypes.func,
    labelButton : PropTypes.string,
    style: PropTypes.object,
    hoverColor: PropTypes.string,
    isActive: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      labelButton: '',
      refId:'',
      hoverColor: "#fff",
      isActive: false,
    };
  },

  getInitialState(){
    return {
        hover: false,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let padding = 2;
    let iconLength = this.props.iconHeight;
    let buttonStyle ={
      display: 'inline-block',
      textAlign: 'center',
      cursor: 'pointer',
    };
    if(this.props.style){
      _.merge(buttonStyle,this.props.style);
    }
    buttonStyle.color= (this.state.hover || this.props.isActive )? this.props.hoverColor : (this.props.style.color ? this.props.style.color: 'initial');
    return {
      button:buttonStyle,
    };
  },

  render() {
    return(
      <div
        style = {this.style('button')}
        onClick = {this._handleClick}
        onMouseEnter = {this._handleMouseEnter}
        onMouseLeave = {this._handleMouseLeave}
      >
        {this.props.labelButton}
      </div>
    );
  },

  _handleClick(){
    if(this.props.onClick){
      this.props.onClick(this.props.refId);
    }
  },

  _handleMouseEnter(){
    if(!this.state.hover){
      this.setState({
        hover: true,
      });
    }
  },

  _handleMouseLeave(){
    if(this.state.hover){
      this.setState({
        hover: false,
      });
    }
  },


});
module.exports = DivButton;
