const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');
const { formatDate } = require('~/src/utils');
const PropTypes = React.PropTypes;

const NewsRecommendation = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationTable/${__LOCALE__}`),
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/NewsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    data : PropTypes.array,
    nLabelOnTop: PropTypes.string,
    nLabelRecommended: PropTypes.string
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getInitialState(){
    return {
      data: []
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

  findNewsRecommendations(){
    if(global.api.epds && global.api.epds.findRecommendableNews){
        global.api.epds.findRecommendableNews.promise().then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              data: res.response
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

  addNewsRecommendations(id,update){
    if(global.api.epds && global.api.epds.updateTopAndRecommendableForNews){
        global.api.epds.updateTopAndRecommendableForNews.promise(id,update).then((res)=>{
          if(res.status === 'OK'){
            this.findNewsRecommendations();
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

  removeNewsRecommendations(ids){
    if(global.api.epds && global.api.epds.removeTopAndRecommendableForNews){
        global.api.epds.removeTopAndRecommendableForNews.promise(ids).then((res)=>{
          if(res.status === 'OK'){
            this.findNewsRecommendations();
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

  componentWillMount() {
    this.findNewsRecommendations();
  },

  handleRecommendBtnTouchTap(id){
    this.addNewsRecommendations(id,{isRecommendable:true});
  },


  handleOnTopBtnTouchTap(id){
    this.addNewsRecommendations(id,{isOnTop:true});
  },

  handleRemove(rows){
    if (global.epConfirm) {
      let data = this.state.data;
      global.epConfirm('',this.t('nTextEnsureDeleteSelected'), ()=>{
        let ids = _.map(rows,row=>data[row]._id);
        this.removeNewsRecommendations(ids);
      });
    }
  },

  handleAdd() {
    let props = {
      title: this.t('nTextAddNewsRecommendation'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'RecommendationsDialog',
      props: {
        type: 'NEWS',
        onRecommendBtnTouchTap : this.handleRecommendBtnTouchTap,
        onTopBtnTouchTap : this.handleOnTopBtnTouchTap
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handleView(index){
    let props = {
      title: this.t('nTextNewsInfo'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'NewsViewDialog',
      props: {
        newsId: this.state.data[index]._id
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
    let topStyles = styles.tag;
    let recommendableStyle = Object.assign({},styles.tag,{backgroundColor: '#4a90e2'});
    for(let i =0,len=data.length; i<len; i++){
      let isRecommendable = data[i].isRecommendable;
      recommendableClumns.push(
        <span
          key = {i}
          style = {isRecommendable ? recommendableStyle : topStyles}
        >
          {isRecommendable ? this.t('nLabelRecommend') :this.t('nLabelOnTop')}
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
      title: this.t('nLabelTitle'),
      dateCreate: this.t('nLabelDateCreate'),
    };

    const {data} = this.state;
    const tableData = _.map(data,(dt,index)=>{
      return {
        _id : dt._id || index,
        title: dt.title,
        dateCreate: formatDate(dt.dateCreate),
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
          addable = {data.length < 10}
          showPager = {false}
        />
      </div>
    );
  },
});

module.exports = NewsRecommendation;
