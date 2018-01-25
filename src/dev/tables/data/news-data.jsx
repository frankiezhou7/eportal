const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable = require('epui-md/ep/CustomizedTable/DataTable');
const SearchTextField  = require('epui-md/ep/SearchTextField');
const FlatButton = require('epui-md/FlatButton');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const ThemeManager = require('~/src/styles/theme-manager');

const PropTypes = React.PropTypes;

const NewsDataTable = React.createClass({
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
      btn:{
        width: 100,
      },
    };
    return styles;
  },

  handleSearch(value){
    console.log('search value',value);
  },

  handlePublishBtn(index){
    console.log('publish button index '+index+' just clicked');
  },

  creatExtraCols(number){
    let extraColumns = [];
    let publishColumns = [];
    for(let i =1; i<1+number; i++){
      publishColumns.push(
        <FlatButton
          style = {this.style('btn')}
          key = {i}
          secondary = {true}
          label={i%2 ? this.t('nLabelPublish') : this.t('nLabelUnpublish')}
          onTouchTap = {this.handlePublishBtn.bind(this,i)}
        />
      );
    }
    extraColumns.push({
      style:{width: 120},
      key: 'publish',
      values: publishColumns
    });
    return extraColumns;
  },

  render() {

    // define table strocutor
    const structor = {
      title: this.t('nLabelTitle'),
      dateUpdate: this.t('nLabelDateUpdate')
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
          extraColumns = {this.creatExtraCols(20)}
          pageSize = {20}
          headerRightNode = { headerRightNode }
        />
      </div>
    );
  },
});

module.exports = NewsDataTable;
