const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable = require('epui-md/ep/CustomizedTable/DataTable');
const Paper = require('epui-md/Paper');
const Toggle = require('epui-md/Toggle');
const RaisedButton = require('epui-md/RaisedButton');
const moment = require('moment');

const PropTypes = React.PropTypes;

const HomepageDataTable = React.createClass({
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
    partnerData: PropTypes.array,
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
    this.settings = ['banner', 'partner'];
    let initState = {
      errorText: null,
      visibility: {
        value: false,
      },
    };
    _.forEach(this.settings, setting => {
      initState[`is${_.capitalize(setting)}Fetching`] = true;
      initState[`${setting}Data`] = [];
      initState[`${setting}PageIndex`] = 1;
      initState[`${setting}Pagination`] = {
        cursor: 0,
        size: 10,
        total: 0,
        sortby:{
          dateCreate: -1
        },
        query: 'homepageBanners'
      }
    });
    initState.bannerPagination.size = 5;
    initState.partnerPagination.query = 'homepagePartners';
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
      }
    };
    return styles;
  },

  componentWillMount() {
    _.forEach(this.settings, setting => {
      this.findSettings(this.state[`${setting}Pagination`], null, setting);
    });
    this.findVisibleSetting();
  },

  findVisibleSetting() {
    if(global.api.epds && global.api.epds.findSettingByName){
      global.api.epds.findSettingByName.promise('partershipVisibility')
      .then((r) => {
        if (r.status === 'OK') {
          this.setState({ visibility: r.response, isFetching: false })
        }
      })
      .catch(e => {
        alert(this.t('nTextIinitFailed') + e);
      })
    }
  },

  updateVisibleSetting(bool) {
    if(global.api.epds && global.api.epds.updateSettingsById){
      global.api.epds.updateSettingsById.promise(this.state.visibility._id, { value: bool, __v: this.state.visibility.__v })
      .then((r) => {
        if (r.status === 'OK') {
          this.setState({ visibility: _.assign({}, r.response, {_id:this.state.visibility._id}), isFetching: false })
        }
      })
      .catch(e => {
        alert(this.t('nTextIinitFailed') + e);
      })
    }
  },

  findSettings(pagination,pageIndex, type){
    if(global.api.epds && global.api.epds.searchSettings){
        global.api.epds.searchSettings.promise(pagination).then((res)=>{
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
        global.api.epds.createSettings.promise(_.assign({},{name:`homepage${_.capitalize(type)}s`}, setting)).then((res)=>{
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
    if (global.epConfirm) {
      global.epConfirm('',this.t('nTextEnsureDeleteSelected'), ()=>{
        let data = this.state[`${_.toLower(type)}Data`];
        let ids = _.map(rows,row=>data[row]._id);
        this.removeSettings(ids, type);
      });
    }
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
      name: 'HomepageEditorDialog',
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
      name: 'HomepageEditorDialog',
      props: {
        homepageItemId: this.state[`${type}Data`][index]._id,
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

  handleToggle(e, bool) {
    this.updateVisibleSetting(bool);
  },

  render() {

    // define table strocutor
    const bannerStructor = {
      title: 'Banner',
      link: this.t('nLabelLink'),
      dateUpdate: this.t('nLabelDateUpdate'),
      dateCreate: this.t('nLabelDateCreate')
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

    const partnerStructor = {
      name: this.t('nLabelPartnerName'),
      logo: 'Logo',
      dateUpdate: this.t('nLabelDateUpdate'),
      dateCreate: this.t('nLabelDateCreate')
    };

    let partnerData  = _.map(this.state.partnerData,dt=>{
      return {
        _id : dt._id,
        name: dt.value.name,
        logo : (<img src={dt.value.img[0].url} style={{width: 100}}/>) || '-',
        dateUpdate : moment(dt.dateUpdate).format('YYYY-MM-DD hh:mm:ss'),
        dateCreate : moment(dt.dateCreate).format('YYYY-MM-DD hh:mm:ss')
      }
    })

    return (
      <div style={this.style('root')}>
        <div style={this.style('row')}>

          <div style={this.style('title')}>
            {this.t('nTextHomepageBanner')}
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
        <div style={this.style('row')}>
          <div style={this.style('title')}>
            {this.t('nTextHomepagePartner')}
            <div style={this.style('toggle')}>
              <span>{this.t('nLabelVisible')}</span>
              <Toggle style={{width: 50}} toggled={this.state.visibility.value} onToggle={(e, bool) => this.handleToggle(e, bool)}/>
            </div>

          </div>
          <Paper zDepth={1}>
            <DataTable
              ref = 'partner'
              structor = {partnerStructor}
              data = {partnerData}
              pageSize = {this.state.partnerPagination.size}
              pageSizeList = {[5,10]}
              pageIndex = {this.state.partnerPageIndex}
              total = {this.state.partnerPagination.total}
              onRemove = {(rows) => this.handleRemove(rows, 'partner')}
              onAdd = {() => this.handleAdd('partner')}
              showViewIcon={false}
              //onView = {(idx) => this.handleView(idx, 'partner')}
              onEdit = {(idx) => this.handleEdit(idx, 'partner')}
              onPagerChange = {(pageIndex, pageSize) => this.handlePagerChange(pageIndex, pageSize, 'partner')}
              tableRowStyle = {{height:90}}
              tableRowColumnStyle = {{padding: '10px 24px'}}
            />
          </Paper>
        </div>
      </div>
    );
  },
});

module.exports = HomepageDataTable;
