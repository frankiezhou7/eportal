const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const AddButton = require('epui-md/svg-icons/content/add');
const FlatButton = require('epui-md/FlatButton');

const PropTypes = React.PropTypes;

let PersonList = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    onClick: PropTypes.func,
    nLabelButton : PropTypes.string,
    iconHeight: PropTypes.number,
    style: PropTypes.object,
    buttonStyle: PropTypes.object,
    icon: PropTypes.element,
  },

  getDefaultProps() {
    return {
      iconHeight: 24,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let padding = 2;
    let iconLength = this.props.iconHeight;
    let buttonContainerStyle ={
      display: 'inline-block',
      verticalAlign: 'top',
      textAlign: 'center',
      marginLeft: padding*3,
      marginRight: padding*3,
    };
    if(this.props.style){
      _.merge(buttonContainerStyle,this.props.style);
    }
    let buttonStyle = {
      backgroundColor: theme.accent1Color,
      borderRadius: iconLength,
      padding: iconLength/2,
      width: iconLength,
      height: iconLength,
      cursor: 'pointer',
      display: 'inline-block',
      textAlign: 'left',
    }
    if(this.props.buttonStyle){
      _.merge(buttonStyle,this.props.buttonStyle);
    }
    return {
      buttonContainer:buttonContainerStyle,
      button:buttonStyle,
      addIcon:{
        position: 'absolute',
        fill: theme.canvasColor,
        height: iconLength,
        width: iconLength,
      },
      buttonLabel:{
        textAlign: 'center',
        maxWidth: iconLength*3,
      },
      personInfosTitle:{
        fontSize: 16,
        fontWeight: 300,
        marginBottom: padding*5,
        display: 'block',
        paddingLeft: padding*3,
      }
    };
  },

  render() {
    let child = this.props.icon ?
        this.props.icon : <AddButton  style = {this.style('addIcon')}/>;
    return(
      <div
        style = {this.style('buttonContainer')}
        onClick = {this._handleAddPersonAction}
      >
        <div style = {this.style('button')} >
          {child}
        </div>
        <div style = {this.style('buttonLabel')}>
          <span>
            {this.props.nLabelButton}
          </span>
        </div>
      </div>
    );
  },

  _handleAddPersonAction(){
    if(this.props.onClick){
      this.props.onClick();
    }
  },

});
module.exports = PersonList;
