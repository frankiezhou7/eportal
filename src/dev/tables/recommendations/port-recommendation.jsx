const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');

const PropTypes = React.PropTypes;

const createData = (number)=>{
  let data = [];
  for(let i =0; i<number; i++){
    data.push(
      {
        item:{
          name:'QINGDAO_'+i,
          dateUpdate: '2016-05-12 '+(10+i)+':00'
        },
        isPort: true,
        isRecommendablePlus: i%2 ? true: false,
        isRecommendable: i%2 ? false: true
      }
    );
  }
  return data;
};


const PortRecommendation = React.createClass({
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
      data: createData(20)
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
      tag:{
        paddingTop: 3,
        paddingBottom: 3,
        backgroundColor: '#159008',
        textAlign: 'center',
        color: '#fff',
        fontSize: 13,
        borderRadius: 4,
        width: 100,
        display: 'block',
        textAlign: 'center',
      },
    };

    return styles;
  },


  handleRemove(rows){
    if (global.epConfirm) {
      global.epConfirm('',this.t('nTextEnsureDeleteSelected'), ()=>{
        //todo : promise to remove selected data;
      });
    }
  },

  handleAdd() {
    let props = {
      title: this.t('nTextAddShip'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'ShipFormCompleted',
      props: {},
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handleView(index){
    let props = {
      title: this.t('nTextShipInfo'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'ShipView',
      props: {},
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handlePagerChange(pageIndex, pageSize){

  },

  creatExtraCols(number){
    let styles = this.getStyles();
    let data = this.props.data;
    let extraColumns = [];
    let recommendableClumns = [];
    let recommendablePlusStyle = styles.tag;
    let recommendableStyle = Object.assign({},styles.tag,{backgroundColor: '#4a90e2'});
    for(let i =0,len=data.length; i<len; i++){
      let isRecommendablePlus = data[i].isRecommendablePlus;
      recommendableClumns.push(
        <span
          key = {i}
          style = {isRecommendablePlus ? recommendablePlusStyle : recommendableStyle}
        >
          {isRecommendablePlus ? this.t('nLabelRecommendPlus') :this.t('nLabelRecommend')}
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

  render() {
    // define table strocutor
    const structor = {
      name: this.t('nLabelName'),
      type: this.t('nLabelType'),
      dateUpdate: this.t('nLabelDateUpdate'),
    };

    const {data} = this.props;
    const portType = this.t('nLabelPortType');
    const tableData = _.map(data,dt=>{
      return {
        name: dt.item? dt.item.name: '',
        type: portType,
        dateUpdate: dt.item? dt.item.dateUpdate: ''
      };
    });

    return (
      <div style={this.style('root')}>
        <DataTable
          ref = 'dataTable'
          structor = {structor}
          data = {tableData}
          extraColumns = {this.creatExtraCols(10)}
          showEditIcon = {false}
          onRemove = {this.handleRemove}
          onAdd = {this.handleAdd}
          onView = {this.handleView}
          onPagerChange = {this.handlePagerChange}
        />
      </div>
    );
  },
});

module.exports = PortRecommendation;
