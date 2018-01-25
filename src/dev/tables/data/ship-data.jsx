const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');
const SearchTextField  =  require('epui-md/ep/SearchTextField');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const ThemeManager = require('~/src/styles/theme-manager');

const PropTypes = React.PropTypes;

const ShipDataTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
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

  getStyles() {
    let styles = {
      root: {
        height: '100%',
        overflow: 'scroll',
      },
    };

    return styles;
  },

  handleSearch(value){
    console.log('search '+value+' ...');
  },

  handleRemove(rows){
    console.log('remove...');
    let register = global.register;
    let globalConfirm = register.confirm;
    if (globalConfirm) {
      globalConfirm(this.t('nTextEnsureDeleteSelected'), '', ()=>{
        alert('deleted!');
      });
    }
  },

  handleAdd(){
    console.log('add...');
  },

  handlePagerChange(pageIndex, pageSize){

  },

  render() {

    // define table strocutor
    const structor = {
      imo: this.t('nLabelImo'),
      name: this.t('nLabelName'),
      type: this.t('nLabelType'),
      dateUpdate: this.t('nLabelDateUpdate'),
    };

    let data = [];
    for(let i =1; i<21; i++){
      data.push(_.mapValues(structor,(value,key)=>{
        return value+'_'+i;
      }));
    }

    const headerRightNode = (<SearchTextField onSearch ={this.handleSearch} />);

    return (
      <div style={this.style('root')}>
        <DataTable
          ref = 'dataTable'
          structor = {structor}
          data = {data}
          pageSize = {20}
          onRemove = {this.handleRemove}
          onAdd = {this.handleAdd}
          onPagerChange = {this.handlePagerChange}
          headerRightNode = { headerRightNode }
        />
      </div>
    );
  },

});

module.exports = ShipDataTable;
