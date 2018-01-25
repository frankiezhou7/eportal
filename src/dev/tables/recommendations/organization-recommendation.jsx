const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');
const HeaderRight = require('./organization-header');

const PropTypes = React.PropTypes;

const OrganizationRecommendation = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationTable/${__LOCALE__}`),
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

  getDefaultProps() {
    return {
      data: [],
    };
  },

  getStyles() {
    let styles = {
      root: {
        paddingTop: 14,
        with: '100%',
        height: '100%',
        overflow: 'scroll',
      },
      title:{
        marginTop: 10,
        marginBottom:30,
        fontSize: 20,
        fontWeight: 500,
        textTransform: 'uppercase',
      },
      section:{
        marginBottom: 50,
      },
    };

    return styles;
  },

  creatExtraCols(number){
    let extraColumns = [];
    let recommendableClumns = [];
    for(let i =1; i<1+number; i++){
      recommendableClumns.push(
        <span
          key = {i}
          style = {{
            paddingTop: 3,
            paddingBottom: 3,
            backgroundColor: i%2 ? '#159008': '#4a90e2',
            textAlign: 'center',
            color: '#fff',
            fontSize: 13,
            borderRadius: 4,
            width: 100,
            display: 'block',
            textAlign: 'center',
          }}
        >
          {i%2 ? this.t('nLabelRecommendPlus') :this.t('nLabelRecommend')}
        </span>
      );
    }
    extraColumns.push({
      style:{width: 120},
      key: 'recommended',
      values: recommendableClumns
    });
    return extraColumns;
  },

  handleItemTouchTap(value){

  },

  render() {

    // define table strocutor
    const structor = {
      name: this.t('nLabelName'),
      type: this.t('nLabelType'),
      dateUpdate: this.t('nLabelDateUpdate'),
    };

    let data = [];
    for(let i =1; i<11; i++){
      data.push(_.mapValues(structor,(value,key)=>{
        return value+'_'+i;
      }));
    }

    const headerRight = (
      <HeaderRight onItemTouchTap = {this.handleItemTouchTap} />
    );

    return (
      <div style={this.style('root')}>
        <DataTable
          ref = 'dataTable'
          headerRightNode = {headerRight}
          structor = {structor}
          data = {data}
          extraColumns = {this.creatExtraCols(10)}
          showEditIcon = {false}
        />
      </div>
    );
  },
});

module.exports = OrganizationRecommendation;
