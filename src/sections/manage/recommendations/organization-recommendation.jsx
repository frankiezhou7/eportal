const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');
const HeaderRight = require('./organization-header');
const { formatDate } = require('~/src/utils');
const PropTypes = React.PropTypes;

const types = {
  ORGA: 'Agency',
  ORSP: 'Supplier',
  ORIN: 'Inspection',
  ORSR: 'SPRO',
  ORWS: 'Workshop',
  ORSY: 'Shipyard',
  OROT: 'Shipping Company'
};

const CODE_TYPE= {
  0: '可见',
  1: '登录可见',
  2: '不可见',
};

const OrganizationRecommendation = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationTable/${__LOCALE__}`),
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/OrganizationDialog/${__LOCALE__}`),
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

  getInitialState(){
    return {
      data: [],
      type: 'ORGA',
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


  componentWillMount() {
    this.findOrganizationRecommendations();
  },


  findOrganizationRecommendations(){
    if(global.api.epds && global.api.epds.findRecommendationByType){
        global.api.epds.findRecommendationByType.promise(false,this.state.type,999).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              data: res.response.results
            });
          }else{
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
          //todo: deal with err
        });
    }
  },

  createOrganizationRecommendations(recommendation){
    if(global.api.epds && global.api.epds.createOrUpdateRecommendation){
        global.api.epds.createOrUpdateRecommendation.promise(recommendation).then((res)=>{
          if(res.status === 'OK'){
            this.findOrganizationRecommendations();
            alert(this.t('nTextAddSuccess'));
          }else{
            alert(this.t('nTextAddFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextAddFailed')+err);
          //todo: deal with err
        });
    }
  },

  removeOrganizationRecommendations(ids){
    if(global.api.epds && global.api.epds.removeRecommendationByIds){
        global.api.epds.removeRecommendationByIds.promise(ids).then((res)=>{
          if(res.status === 'OK'){
            this.findOrganizationRecommendations();
          }else{
            alert(this.t('nTextRemoveFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextRemoveFailed')+err);
          //todo: deal with err
        });
    }
  },

  handleRecommendBtnTouchTap(id){
    this.createOrganizationRecommendations({
      item: id,
      type : this.state.type,
      isOrganization:true,
      isRecommendable:true
    });
  },


  handleRecommendPlusBtnTouchTap(id){
    this.createOrganizationRecommendations({
      item: id,
      type : this.state.type,
      isOrganization:true,
      isRecommendablePlus: true
    });
  },

  handleRemove(rows){
    if (global.epConfirm) {
      let data = this.state.data;
      global.epConfirm('',this.t('nTextEnsureDeleteSelected'), ()=>{
        let ids = _.map(rows,row=>data[row]._id);
        this.removeOrganizationRecommendations(ids);
      });
    }
  },

  handleAdd() {
    let props = {
      title: this.t('nTextAddOrganizationRecommendation'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'RecommendationsDialog',
      props: {
        type: 'ORGANIZATION',
        role: this.state.type,
        onRecommendBtnTouchTap : this.handleRecommendBtnTouchTap,
        onRecommendPlusBtnTouchTap : this.handleRecommendPlusBtnTouchTap
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handleView(index){
    let props = {
      title: this.t('nTextOrganizationInfo'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'OrganizationViewDialog',
      props: {
        organizationId: this.state.data[index].item && this.state.data[index].item._id
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  creatExtraCols(number){
    let styles = this.getStyles();
    let data = this.state.data;
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

  handleItemTouchTap(value){
    this.setState({type:value},()=>{this.findOrganizationRecommendations();});
  },

  render() {

    // define table strocutor
    const structor = {
      name: this.t('nLabelName'),
      type: this.t('nLabelType'),
      dateCreate: this.t('nLabelDateCreate'),
      visibleStatus: this.t('nLabelVisibleStatus')
    };

    const {data} = this.state;
    const tableData = _.map(data,(dt,index)=>{
      return {
        _id : dt.item ? dt.item._id: index,
        name: dt.item ? dt.item.name: '',
        type: types[this.state.type],
        dateCreate: formatDate(dt.item && dt.item.dateCreate),
        visibleStatus: dt.item ? CODE_TYPE[dt.item.visibleStatus] :''
      };
    });

    const headerRight = (
      <HeaderRight onItemTouchTap = {this.handleItemTouchTap} />
    );

    return (
      <div style={this.style('root')}>
        <DataTable
          ref = 'dataTable'
          headerRightNode = {headerRight}
          structor = {structor}
          data = {tableData}
          extraColumns = {this.creatExtraCols(10)}
          showEditIcon = {false}
          onRemove = {this.handleRemove}
          onAdd = {this.handleAdd}
          onView = {this.handleView}
          showPager = {false}
        />
      </div>
    );
  },
});

module.exports = OrganizationRecommendation;
