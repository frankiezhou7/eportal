const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const CancelButton = require('epui-md/svg-icons/content/clear');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const Paper = require('epui-md/Paper');
const PersonButton = require('epui-md/svg-icons/action/accessibility');
const PropTypes = React.PropTypes;
const Ranks = require('epui-md/svg-icons/ep/ranks');
const Translatable = require('epui-intl').mixin;

const PersonItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
    hasCompanyName: PropTypes.object,
  },

  propTypes: {
    person: PropTypes.object,
    nLabelPersonName: PropTypes.string,
    nLabelEdit: PropTypes.string,
    nTextRemove: PropTypes.string,
    onRemove: PropTypes.func,
    onPersonClick:PropTypes.func,
    iconHeight : PropTypes.number,
    selectable: PropTypes.bool,
    hoverable: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      person : {},
      iconHeight: 24,
      hoverable: true,
      selectable: false,
    };
  },

  getInitialState: function() {
    return {
      hover: false,
      select: false,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let iconLength = this.props.iconHeight;
    let coverOpacity =0.65;
    let theme = this.getTheme();
    let width = 190;

    return {
      root:{
        display: 'inline-block',
        marginLeft : padding*3,
        marginRight: padding*3,
        marginTop: padding*3,
        verticalAlign: 'top',
        textAlign: 'center',
        minWidth : width,
        cursor: 'pointer',
      },
      person:{
        backgroundColor: this.state.select ? theme.accent1Color : '#79b2ea' || theme.primary1Color,
        height: 29,
        cursor: 'pointer',
        textAlign: 'center',
      },
      personIcon:{
        fill: this.state.hover ? theme.accent1Color :theme.canvasColor,
        height: iconLength,
        width: iconLength,
        float: 'left',
        marginTop: 2,
      },
      deleteIcon:{
        fill: theme.accent1Color,
        height: iconLength,
        width: 20,
        float: 'right',
        cursor: 'pointer'
      },
      personRank:{
        color : theme.canvasColor,
        height: iconLength,
        width: iconLength,
      },
      cover:{
        display: this.state.hover ? 'block': 'none',
        opacity : coverOpacity,
        backgroundColor: theme.primary1Color,
        width: iconLength*2,
        height: iconLength*2,
        borderRadius: iconLength,
        textAlign: 'center',
        marginTop: -iconLength/2,
        marginLeft: -iconLength/2,
      },
      personContainer:{
        textAlign: 'center',
        color: this.state.select ? theme.accent1Color : '#000',
        overflow: 'hidden',
        height: this.props.person.phone ? 40 : 80,
        minWidth : width,
        maxWidth : 700,
      },
      phoneContainer:{
        textAlign: 'center',
        color: this.state.select ? theme.accent1Color : 'rgb(121, 178, 234)',
        minWidth : width,
        maxWidth : 700,
      },
      personTable:{
        height : '100%',
        display: 'block',
        // width : width,
      },
      personTableCell:{
        textAlign: 'center',
        color: this.state.select ? theme.accent1Color : '#000',
        verticalAlign: 'middle',
        display: 'block',
        padding: '1px 10px 1px 10px',
        overflow: 'hidden',
        height: this.context.hasCompanyName ?  40 : this.props.person.phone ? 40 : 80,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: this.context.hasCompanyName ?  '40px' : this.props.person.phone ? '40px' : '80px',
        overflow: 'hidden',
        whiteSpace: 'pre-line',
        maxWidth: 170,
        wordWrap: 'break-word',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      phoneTableCell: {
        textAlign: 'center',
        verticalAlign: 'middle',
        display: 'block',
        padding: '1px 10px 1px 10px',
        overflow: 'hidden',
        height: this.context.hasCompanyName ?  40 : this.props.person.phone ? 40 : 80,
        fontSize: 14,
        fontWeight: 500,
        lineHeight: this.context.hasCompanyName ?  '20px' : this.props.person.phone ? '20px' : '80px',
        overflow: 'hidden',
        whiteSpace: 'pre-line',
        maxWidth: 170,
        wordWrap: 'break-word',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      countryName:{
        color: '#4990e2',
      },
    };
  },

  isSelected(){
    return this.props.selectable && this.state.select;
  },

  renderPersonIcon(){
    let personIcon = (<PersonButton  style = {this.style('personIcon')}/>);
    if(this.props.person.seaManClass){
      let RankIcon = Ranks[this.props.person.seaManClass];
      if(RankIcon){
        personIcon = <RankIcon style = {this.style('personIcon')}/>;
      }
    }
    return(
      <div style = {this.style('person')}>
        {this.renderDelIcon()}
        {personIcon}
      </div>
    );
  },

  renderPersonName(){
    let countryName = this.context.hasCompanyName ? (
      <div style ={this.style('personTableCell','countryName')}>
        {this.props.person.country}
      </div>
    ) : null;

    return(
      <div style = {this.style('personContainer')}>
        <div style = {this.style('personTable')}>
          <div style ={this.style('personTableCell')}>
            {this.props.person.name}
          </div>
          {countryName}
        </div>
      </div>
    );
  },

  renderDelIcon(){
    return this.state.hover ? <CancelButton
      title ={this.t('nTextRemove')}
      style={this.style('deleteIcon')}
      onClick={this._handleRemoveTouch}
    />: null;
  },

  renderPersonPhone(){
    if(!this.props.person.phone) return null;
    return(
      <div style = {this.style('phoneContainer')}>
        <div style = {this.style('personTable')}>
          <div style ={this.style('phoneTableCell')}>
            {this.props.person.phone}
          </div>
        </div>
      </div>
    );
  },

  render() {
    let styles = this.getStyles();
    let zDepth = this.state.hover ? 3: 1;
    return (
      <Paper
        style = {this.style('root')}
        zDepth = {zDepth}
        onMouseEnter = {this._handleMouseOver}
        onMouseLeave= {this._handleMouseOut}
        onClick = {this._handlePaperClick}
        title = {this.props.person.name}
      >
        {this.renderPersonIcon()}
        {this.renderPersonName()}
        {this.renderPersonPhone()}
      </Paper>
    );
  },

  _handleMouseOver(){
    if(this.props.hoverable && !this.state.hover){
      this.setState({
        hover: true,
      });
    }
  },

  _handleMouseOut(){
    if(this.props.hoverable && this.state.hover){
      this.setState({
        hover: false,
      });
    }
  },

  _handleRemoveTouch(e){
    e.stopPropagation();
    global.notifyOrderDetailsChange(true);
    if(this.props.onRemove){
      this.props.onRemove(this.props.person.id);
    }
  },

  // _handleClick(){
  //   global.notifyOrderDetailsChange(true);
  //   if(this.props.selectable){
  //     this.setState({
  //       select : !this.state.select,
  //     });
  //   }
  // },

  _handlePaperClick(){
    if(this.props.selectable){
      this.setState({
        select : !this.state.select,
      });
    }
    if(this.props.onPersonClick) this.props.onPersonClick(this.props.person);
  },

});

module.exports = PersonItem;
