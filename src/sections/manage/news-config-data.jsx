const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable = require('epui-md/ep/CustomizedTable/DataTable');
const Dialog = require('epui-md/ep/Dialog/Dialog');
const Paper = require('epui-md/Paper');
const Toggle = require('epui-md/Toggle');
const FlatButton = require('epui-md/FlatButton');
const RaisedButton = require('epui-md/RaisedButton');
const moment = require('moment');

const PropTypes = React.PropTypes;

const NewsConfigDataTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/NewsForm/${__LOCALE__}`),
    require(`epui-intl/dist/Homepage/${__LOCALE__}`),
    require(`epui-intl/dist/NewsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    bannerData : PropTypes.array,
    typeData: PropTypes.array,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      data: [],
    };
  },

  getInitialState(){
    this.settings = ['type', 'banner'];
    let initState = {
      errorText: null,
    };
    _.forEach(this.settings, setting => {
      initState[`is${_.capitalize(setting)}Fetching`] = true;
      initState[`${setting}Data`] = [];
      initState[`${setting}PageIndex`] = 1;
      initState[`${setting}Pagination`] = {
        cursor: 0,
        size: 5,
        total: 0,
        sortby:{
          dateCreate: -1
        },
        query: 'newsBanners'
      }
    });
    initState.typePagination.size = 10;
    initState.typePagination.query = 'newsTypes';
    return initState;
  },

  getStyles() {
    let styles = {
      root: {
        height: '100%',
      },
      row: {
        paddingBottom: 25,
        position: 'relative',
      },
      title: {
        fontSize: 22,
        padding: '15px 0px',
      },
      btn:{
        width: 100,
      },
      toggle: {
        fontSize: 16,
        display: 'flex',
        float: 'right',
      },
      button: {
        marginRight: '5px',
      },
      alertText: {
        fontSize: 16,
        color: '#rgba(0,0,0,0.54)',
        marginBottom: 6,
      },
    };
    return styles;
  },

  componentWillMount() {
    _.forEach(this.settings, setting => {
      this.findSettings(this.state[`${setting}Pagination`], null, setting);
    });
  },

  findSettings(pagination,pageIndex, type){
    if(global.api.epds && global.api.epds.searchSettings && global.api.epds.searchNewsTypes){
        let api;
        if(type !== 'type') { api = global.api.epds.searchSettings;}
        else { api = global.api.epds.searchNewsTypes; }
        api.promise(pagination, false).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              [`is${_.capitalize(type)}Fetching`]: false,
              [`${type}Data`]: res.response.entries,
              [`${type}Pagination`]: res.response.pagination,
              [`${type}PageIndex`] : pageIndex!==null ? pageIndex : this.state[`${type}PageIndex`],
            });
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
        });
    }
  },

  createSettings(setting, type){
    if(global.api.epds && global.api.epds.createSettings){
        global.api.epds.createSettings.promise(_.assign({},{name:`news${_.capitalize(type)}s`}, setting)).then((res)=>{
          if(res.status === 'OK'){
            let pagination = Object.assign({},this.state[`${type}Pagination`],{
              cursor: ( this.state[`${type}PageIndex`]-1 >= 0 ? this.state[`${type}PageIndex`]-1 : 0 )*this.state[`${type}Pagination`].size,
              hasNext: true
            });
            alert(this.t('nTextOperationSuccess'));
            this.reFetchSettings(pagination, type);
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
        });
    }
  },

  updateSettings(id,update, type){
    if(global.api.epds && global.api.epds.updateSettingsById){
        global.api.epds.updateSettingsById.promise(id,update).then((res)=>{
          if(res.status === 'OK'){
            let pagination = Object.assign({},this.state[`${type}Pagination`],{
              cursor: ( this.state[`${type}PageIndex`]-1 >= 0 ? this.state[`${type}PageIndex`]-1 : 0 )*this.state[`${type}Pagination`].size,
              hasNext: true
            });
            alert(this.t('nTextOperationSuccess'));
            this.reFetchSettings(pagination, type);
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
        });
    }
  },

  removeSettings(ids, type){
    if(global.api.epds && global.api.epds.removeSettingsByIds){
        global.api.epds.removeSettingsByIds.promise(ids).then((res)=>{
          if(res.status === 'OK'){
            let pagination = Object.assign({},this.state[`${type}Pagination`],{
              cursor: ( this.state[`${type}PageIndex`]-1 >= 0 ? this.state[`${type}PageIndex`]-1 : 0 )*this.state[`${type}Pagination`].size,
              hasNext: true
            });
            this.findSettings(pagination,this.state[`${type}PageIndex`], type);
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

  handleRemove(rows, type){
    let { typeData } = this.state;
    let hasDeletedAll = _.every(rows, row => typeData[row].count === 0);
    if(type === 'type' && !hasDeletedAll){
      this.refs.deleteNewsType.show();
      return;
    }
    if (global.epConfirm) {
      global.epConfirm('',this.t('nTextEnsureDeleteSelected'), ()=>{
        let data = this.state[`${_.toLower(type)}Data`];
        let ids = _.map(rows,row=>data[row]._id);
        this.removeSettings(ids, type);
      });
    }
  },

  handleCloseDeleteNewsTypeDialog() {
    this.refs.deleteNewsType.close();
  },

  handleSaveBtnTouchTap(setting, type){
    if(setting._id){
      this.updateSettings(setting._id, setting, type);
    }else{
      this.createSettings(setting, type);
    }
  },

  handleAdd(type) {
    let props = {
      title: this.t(`nTextAdd${_.capitalize(type)}`),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'NewsConfigEditorDialog',
      props: {
        onSave : (setting) => this.handleSaveBtnTouchTap(setting, type),
        type
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  // handleView(index, type){
  //   let props = {
  //     title: this.t(`nText${_.capitalize(type)}Info`),
  //     open: true,
  //     contentStyle: {
  //       width: '90%',
  //       maxWidth: 1005,
  //     }
  //   };
  //
  //   let component = {
  //     name: 'HomepageViewDialog',
  //     props: {
  //       regulationId: this.state.data[index]._id
  //     },
  //   };
  //
  //   if (global.register.dialog) {
  //     global.register.dialog.generate(props, component);
  //   }
  // },

  handleEdit(index, type){
    let props = {
      title: this.t(`nTextEdit${_.capitalize(type)}`),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };
    let component = {
      name: 'NewsConfigEditorDialog',
      props: {
        newsConfigItemId: this.state[`${type}Data`][index]._id,
        onSave : (setting) => this.handleSaveBtnTouchTap(setting, type),
        type
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handlePagerChange(pageIndex, pageSize, type){
    let pagination = Object.assign({},this.state[`${type}Pagination`],{
      cursor: ( pageIndex-1 >= 0 ? pageIndex-1 : 0 )*pageSize,
      size: pageSize
    });
    this.reFetchSettings(pagination, type);
    this.setState({
      [`is${_.capitalize(type)}Fetching`]: true,
      [`${type}Pagination`]: pagination,
      [`${type}PageIndex`]: pageIndex
    });
  },

  reFetchSettings(pagination, type){
    pagination.hasNext = true;
    this.findSettings(pagination, null, type);
  },

  renderDeleteNewsTypeDialog(){
    const actions = [
        <FlatButton
          label={this.t('nButtonOk')}
          primary={true}
          onTouchTap={this.handleCloseDeleteNewsTypeDialog}
      />
    ];

    return (
      <Dialog
        ref='deleteNewsType'
        title={this.t('nTextDeleteNewsType')}
        actions={actions}
        modal={false}
      >
        <div style={this.style('alertText')}>{this.t('nTextConfirmDeleteNewsType')}</div>
        <div style={this.style('alertText')}>{this.t('nTextConfirmBeforeRemoveNewsType')}</div>
      </Dialog>
    );
  },

  render() {

    // define table strocutor
    const bannerStructor = {
      title: 'Banner',
      link: this.t('nLabelLink'),
      dateUpdate: this.t('nLabelDateUpdate'),
      dateCreate: this.t('nLabelDateCreate'),
    };

    let bannerData  = _.map(this.state.bannerData,dt=>{
      return {
        _id : dt._id,
        title : (<img src={dt.value.img[0].url} style={{width: 100}}/>) || '-',
        link: dt.value.link,
        dateUpdate : moment(dt.dateUpdate).format('YYYY-MM-DD hh:mm:ss'),
        dateCreate : moment(dt.dateCreate).format('YYYY-MM-DD hh:mm:ss')
      }
    })

    const typeStructor = {
      name: this.t('nLabelTypeName'),
      count: this.t('nLabelNewsCount'),
      dateUpdate: this.t('nLabelDateUpdate'),
      dateCreate: this.t('nLabelDateCreate'),
    };

    let typeData  = _.map(this.state.typeData,dt=>{
      return {
        _id : dt._id,
        name: dt.value,
        count : dt.count || 0,
        dateUpdate : moment(dt.dateUpdate).format('YYYY-MM-DD hh:mm:ss'),
        dateCreate : moment(dt.dateCreate).format('YYYY-MM-DD hh:mm:ss')
      }
    })

    return (
      <div style={this.style('root')}>
        <div style={this.style('row')}>

          <div style={this.style('title')}>
            {this.t('nTextNewsType')}
          </div>
          <Paper zDepth={1}>
            <DataTable
              ref = 'type'
              structor = {typeStructor}
              data = {typeData}
              pageSize = {this.state.typePagination.size}
              pageSizeList = {[10,20]}
              pageIndex = {this.state.typePageIndex}
              total = {this.state.typePagination.total}
              onRemove = {(rows) => this.handleRemove(rows, 'type')}
              onAdd = {() => this.handleAdd('type')}
              showViewIcon={false}
              //onView = {(idx) => this.handleView(idx, 'type')}
              onEdit = {(idx) => this.handleEdit(idx, 'type')}
              onPagerChange = {(pageIndex, pageSize) => this.handlePagerChange(pageIndex, pageSize, 'type')}
            />
          </Paper>
        </div>
        <div style={this.style('row')}>
          <div style={this.style('title')}>
            {this.t('nTextNewsBanner')}
          </div>
          <Paper zDepth={1}>
            <DataTable
              ref = 'banner'
              structor = {bannerStructor}
              data = {bannerData}
              pageSize = {this.state.bannerPagination.size}
              pageSizeList = {[5,10]}
              pageIndex = {this.state.bannerPageIndex}
              total = {this.state.bannerPagination.total}
              onRemove = {(rows) => this.handleRemove(rows, 'banner')}
              onAdd = {() => this.handleAdd('banner')}
              showViewIcon={false}
              //onView = {(idx) => this.handleView(idx, 'BANNER')}
              onEdit = {(idx) => this.handleEdit(idx, 'banner')}
              onPagerChange = {(pageIndex, pageSize) => this.handlePagerChange(pageIndex, pageSize, 'banner')}
              tableRowStyle = {{height:90}}
              tableRowColumnStyle = {{padding: '10px 24px'}}
            />
          </Paper>
        </div>
        {this.renderDeleteNewsTypeDialog()}
      </div>
    );
  },
});

module.exports = NewsConfigDataTable;
