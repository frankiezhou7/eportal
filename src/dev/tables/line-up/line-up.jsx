const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const ThemeManager = require('~/src/styles/theme-manager');
const DropDownMenu  = require('epui-md/ep/EPDropDownMenu');
const MenuItem  = require('epui-md/MenuItem');
const OptionIcon = require('epui-md/svg-icons/content/filter-list');
const IconButton = require('epui-md/IconButton');
const IconMenu = require('epui-md/IconMenu/IconMenu');

const PropTypes = React.PropTypes;

const LineUp = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/LineUpTable/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    data : PropTypes.array,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  getDefaultProps() {
    return {
      data: [],
    };
  },

  getInitialState(){
    return {
      teminal: 1,
      payloadType: 1
    }
  },

  getStyles() {
    let theme = ThemeManager.getMuiTheme(BlueRawTheme);
    const marginLeft = 24;
    let styles = {
      root: {
        height: '100%',
        overflow: 'scroll',
      },
      header:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      menu:{
        marginLeft: marginLeft,
      },
      menuUnderline:{
        display: 'none',
      },
      icon:{
        fill: theme.epColor.secondaryColor,
      },
    };

    return styles;
  },

  handleTeminalChange(terminal){

  },

  handlePayloadTypeChange(payloadType){

  },

  handleSave(){

  },

  handleImport(){

  },

  handleExport(){

  },

  handleDownloadTemplate(){

  },

  handleDeleteAll(){

  },

  handleSearch(){

  },

  render() {

    // define table strocutor
    const structor = {
      vsl: this.t('nLabelVsl'),
      cgoOre: this.t('nLabelCgoOre'),
      cgoQty: this.t('nLabelCgoQty'),
      etaAta: this.t('nLabelEtaAta'),
      etbAtb: this.t('nLabelEtbAtb'),
      berth: this.t('nLabelBerth'),
      terminal: this.t('nLabelTerminal'),
      status: this.t('nLabelStatus')
    };

    let data = [];

    for(let i =1; i<21; i++){
      data.push(_.mapValues(structor,(value,key)=>{
        return value+'_'+i;
      }));
    }

    const iconElem = (
      <IconButton>
        <OptionIcon />
      </IconButton>
    );

    const headerRightNode =(
      <div style = {this.style('header')}>
        <DropDownMenu
          style = {this.style('menu')}
          underlineStyle = {this.style('menuUnderline')}
          value={this.state.teminal}
          onChange={this.handleTeminalChange}
        >
           <MenuItem value={1} primaryText="TERMINAL ONE" />
           <MenuItem value={2} primaryText="TERMINAL TWO" />
           <MenuItem value={3} primaryText="TERMINAL THREE" />
           <MenuItem value={4} primaryText="TERMINAL FOUR" />
           <MenuItem value={5} primaryText="TERMINAL FIVE" />
        </DropDownMenu>
        <DropDownMenu
          style = {this.style('menu')}
          underlineStyle = {this.style('menuUnderline')}
          value={this.state.payloadType}
          onChange={this.handlePayloadTypeChange}
        >
           <MenuItem value={1} primaryText="FOODS" />
           <MenuItem value={2} primaryText="ORE" />
           <MenuItem value={3} primaryText="COAL MINE" />
        </DropDownMenu>
        <IconMenu
          iconStyle = { this.style('icon') }
          iconButtonElement={iconElem}
          anchorOrigin={{horizontal: 'right', vertical: 'top'}}
          targetOrigin={{horizontal: 'right', vertical: 'top'}}
        >
          <MenuItem primaryText= {this.t('nLabelSave')} onTouchTap = { this.handleSave }/>
          <MenuItem primaryText= {this.t('nLabelImport')} onTouchTap = { this.handleImport }/>
          <MenuItem primaryText= {this.t('nLabelExport')} onTouchTap = { this.handleExport }/>
          <MenuItem primaryText= {this.t('nLabelDownloadTemplate')} onTouchTap = { this.handleDownloadTemplate }/>
          <MenuItem primaryText= {this.t('nLabelDeleteAll')} onTouchTap = { this.handleDeleteAll }/>
        </IconMenu>
      </div>
    );

    return (
      <div style={this.style('root')}>
       <DataTable
          ref = 'dataTable'
          structor = {structor}
          data = {data}
          pageSize = {20}
          headerRightNode = { headerRightNode }
        />
      </div>
    );
  },
});

module.exports = LineUp;
