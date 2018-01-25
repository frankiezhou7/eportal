const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable = require('epui-md/ep/CustomizedTable/DataTable');
const SearchTextField  = require('epui-md/ep/SearchTextField');
const RaisedButton = require('epui-md/RaisedButton');
const { formatDate } = require('~/src/utils');

const PropTypes = React.PropTypes;

const NewsDataTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/NewsForm/${__LOCALE__}`),
    require(`epui-intl/dist/NewsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
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

  getInitialState(){
    return {
      isFetching : true,
      data: [],
      pageIndex: 1,
      pagination:{
        cursor: 0,
        size: 10,
        total: 0,
        sortby:{
          dateCreate: -1
        }
      },
      errorText: null,
    };
  },

  getStyles() {
    let styles = {
      root: {
        height: '100%',
      },
      btn:{
        width: 100,
      },
      buttons: {

      },
      button: {
        marginRight: '5px',
      }
    };
    return styles;
  },

  componentWillMount() {
    this.findNews(this.state.pagination);
  },

  findNews(pagination,pageIndex){
    if(global.api.epds && global.api.epds.findNews){
        global.api.epds.findNews.promise(pagination).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              data: res.response.entries,
              pagination: res.response.pagination,
              pageIndex : pageIndex!==undefined ? pageIndex : this.state.pageIndex
            });
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
        });
    }
  },

  createNews(news){
    if(global.api.epds && global.api.epds.createNews){
        global.api.epds.createNews.promise(news).then((res)=>{
          if(res.status === 'OK'){
            let pagination = Object.assign({},this.state.pagination,{
              cursor: ( this.state.pageIndex-1 >= 0 ? this.state.pageIndex-1 : 0 )*this.state.pagination.size,
              hasNext: true
            });
            alert(this.t('nTextOperationSuccess'));
            this.reFetchNews(pagination);
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
        });
    }
  },

  updateNews(id,update){
    if(global.api.epds && global.api.epds.updateNewsById){
        global.api.epds.updateNewsById.promise(id,update).then((res)=>{
          if(res.status === 'OK'){
            let pagination = Object.assign({},this.state.pagination,{
              cursor: ( this.state.pageIndex-1 >= 0 ? this.state.pageIndex-1 : 0 )*this.state.pagination.size,
              hasNext: true
            });
            alert(this.t('nTextOperationSuccess'));
            this.reFetchNews(pagination);
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
        });
    }
  },

  searchNews(pagination,pageIndex){
    if(global.api.epds && global.api.epds.searchNews){
        global.api.epds.searchNews.promise(pagination).then((res)=>{
          if(res.status === 'OK'){
            let resPagination = res.response.pagination;
            let newPagination = Object.assign({},this.state.pagination,{
              cursor: 0,
              total: resPagination.total!==null ? resPagination.total : this.state.pagination.total
            });
            this.setState({
              isFetching: false,
              data: res.response.entries,
              pagination: newPagination,
              pageIndex : pageIndex!==undefined ? pageIndex : this.state.pageIndex,
              errorText: null,
            });
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          if(err.code && err.code === 'INVALID_REQUEST'){
            this.setState({
              errorText: this.t('nTextInvalidSearchText')
            });
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        });
    }
  },


  removeNews(ids){
    if(global.api.epds && global.api.epds.removeNewsByIds){
        global.api.epds.removeNewsByIds.promise(ids).then((res)=>{
          if(res.status === 'OK'){
            let pagination = Object.assign({},this.state.pagination,{
              cursor: ( this.state.pageIndex-1 >= 0 ? this.state.pageIndex-1 : 0 )*this.state.pagination.size,
              hasNext: true
            });
            this.findNews(pagination,this.state.pageIndex);
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

  handleSearch(value){
    value = _.replace(value, '\'','');
    this.setState({isFetching: true});
    let pagination = Object.assign({},this.state.pagination);
    pagination.query = {
      title: value,
      summary: value,
      content: value,
    };
    this.searchNews(pagination,1);
  },

  handleInputChange(value){
    if(value.length >= 2){
      value = _.replace(value, '\'','');
      this.setState({isFetching: true});
      let pagination = Object.assign({},this.state.pagination);
      pagination.query = {
        title: value,
        summary: value,
        content: value,
      };
      pagination.hasNext = true;
      pagination.cursor = 0;
      this.searchNews(pagination,1);
    }else if(value.length === 0){
      this.setState({isFetching: true});
      let pagination = Object.assign({},this.state.pagination);
      pagination = _.omit(pagination,'query');
      pagination.hasNext = true;
      this.findNews(pagination,1);
    }
  },

  handlePublishBtn(index){
    let { data } = this.state;
    let news = data[index];
    if (global.epConfirm) {
      global.epConfirm('',news.isPublished ? this.t('nTextUnPublishNews') : this.t('nTextPublishNews'), ()=>{
        this.updateNews(news._id,{isPublished: !news.isPublished,__v:news.__v});
      });
    }
  },

  handleRemove(rows){
    if (global.epConfirm) {
      global.epConfirm('',this.t('nTextEnsureDeleteSelected'), ()=>{
        let data = this.state.data;
        let ids = _.map(rows,row=>data[row]._id);
        this.removeNews(ids);
      });
    }
  },

  handleSaveBtnTouchTap(news){
    if(news._id){
      this.updateNews(news._id,news);
    }else{
      this.createNews(news);
    }
  },

  handleAdd() {
    let props = {
      title: this.t('nTextAddNews'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'NewsEditorDialog',
      props: {
        onSave : this.handleSaveBtnTouchTap
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

  handleEdit(index){
    let props = {
      title: this.t('nTextEditNews'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'NewsEditorDialog',
      props: {
        newsId: this.state.data[index]._id,
        onSave : this.handleSaveBtnTouchTap
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handlePagerChange(pageIndex, pageSize){
    let pagination = Object.assign({},this.state.pagination,{
      cursor: ( pageIndex-1 >= 0 ? pageIndex-1 : 0 )*pageSize,
      size: pageSize
    });
    this.reFetchNews(pagination);
    this.setState({
      isFetching: true,
      pagination: pagination,
      pageIndex: pageIndex
    });
  },

  reFetchNews(pagination){
    let value = this.refs.searchTextField.getValue();
    if(value && value.length>=2){
      value = _.replace(value, '\'','');
      pagination.query = {
        title: value,
        summary: value,
        content: value,
      };
      pagination.hasNext = true;
      this.searchNews(pagination);
    }else{
      pagination = _.omit(pagination,'query');
      pagination.hasNext = true;
      this.findNews(pagination);
    }
  },

  creatExtraCols(number){
    let extraColumns = [];
    let publishColumns = [];
    let data = this.state.data;
    for(let i =0; i<data.length; i++){
      publishColumns.push(
        <RaisedButton
          style = {this.style('btn')}
          key = {i}
          secondary = {true}
          label={data[i].isPublished ? this.t('nLabelUnpublish') : this.t('nLabelPublish')}
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
      dateUpdate: this.t('nLabelDateUpdate'),
      dateCreate: this.t('nLabelDateCreate'),
      type: this.t('nLabelType'),
    };

    let data  = _.map(this.state.data,dt=>{
      return {
        _id : dt._id,
        title : dt.title || '-',
        dateUpdate : formatDate(dt.dateUpdate),
        dateCreate: formatDate(dt.dateCreate),
        type: _.get(dt, ['type', 'value'], '-'),
      }
    })

    const headerRightNode = (
      <SearchTextField
        ref = 'searchTextField'
        searchText = {this.t('nTextInputNewsKeyWord')}
        onSearch ={this.handleSearch}
        onChange = {this.handleInputChange}
        errorText = {this.state.errorText}
      />
    );
    return (
      <div style={this.style('root')}>
        <DataTable
          ref = 'dataTable'
          structor = {structor}
          data = {data}
          pageSize = {_.get(this.state.pagination, 'size', 10)}
          pageSizeList = {[10,20]}
          pageIndex = {this.state.pageIndex}
          total = {_.get(this.state.pagination, 'total', 0)}
          onRemove = {this.handleRemove}
          onAdd = {this.handleAdd}
          onView = {this.handleView}
          onEdit = {this.handleEdit}
          onPagerChange = {this.handlePagerChange}
          extraColumns = {this.creatExtraCols(20)}
          headerRightNode = { headerRightNode }
        />
      </div>
    );
  },
});

module.exports = NewsDataTable;
