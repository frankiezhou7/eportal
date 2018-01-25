const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable = require('epui-md/ep/CustomizedTable/DataTable');
const SearchTextField  = require('epui-md/ep/SearchTextField');
const RaisedButton = require('epui-md/RaisedButton');
const { formatDate } = require('~/src/utils');

const PropTypes = React.PropTypes;

const RegulationDataTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/NewsForm/${__LOCALE__}`),
    require(`epui-intl/dist/Regulation/${__LOCALE__}`),
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
    this.findRegulation(this.state.pagination);
  },

  findRegulation(pagination,pageIndex){
    if(global.api.epds && global.api.epds.findRegulations){
        global.api.epds.findRegulations.promise(pagination).then((res)=>{
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

  createRegulation(regulation){
    if(global.api.epds && global.api.epds.createRegulation){
        global.api.epds.createRegulation.promise(regulation).then((res)=>{
          if(res.status === 'OK'){
            let pagination = Object.assign({},this.state.pagination,{
              cursor: ( this.state.pageIndex-1 >= 0 ? this.state.pageIndex-1 : 0 )*this.state.pagination.size,
              hasNext: true
            });
            alert(this.t('nTextOperationSuccess'));
            this.reFetchRegulation(pagination);
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
        });
    }
  },

  updateRegulation(id,update){
    if(global.api.epds && global.api.epds.updateRegulationById){
        global.api.epds.updateRegulationById.promise(id,update).then((res)=>{
          if(res.status === 'OK'){
            let pagination = Object.assign({},this.state.pagination,{
              cursor: ( this.state.pageIndex-1 >= 0 ? this.state.pageIndex-1 : 0 )*this.state.pagination.size,
              hasNext: true
            });
            alert(this.t('nTextOperationSuccess'));
            this.reFetchRegulation(pagination);
          }else{
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
        });
    }
  },

  searchRegulation(pagination,pageIndex){
    if(global.api.epds && global.api.epds.searchRegulations){
        global.api.epds.searchRegulations.promise(pagination).then((res)=>{
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


  removeRegulation(ids){
    if(global.api.epds && global.api.epds.removeRegulationByIds){
        global.api.epds.removeRegulationByIds.promise(ids).then((res)=>{
          if(res.status === 'OK'){
            let pagination = Object.assign({},this.state.pagination,{
              cursor: ( this.state.pageIndex-1 >= 0 ? this.state.pageIndex-1 : 0 )*this.state.pagination.size,
              hasNext: true
            });
            this.findRegulation(pagination,this.state.pageIndex);
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
      chinese: value,
      english: value,
    };
    this.searchRegulation(pagination,1);
  },

  handleInputChange(value){
    if(value.length >= 2){
      value = _.replace(value, '\'','');
      this.setState({isFetching: true});
      let pagination = Object.assign({},this.state.pagination);
      pagination.query = {
        title: value,
        summary: value,
        chinese: value,
        english: value,
      };
      pagination.hasNext = true;
      pagination.cursor = 0;
      this.searchRegulation(pagination,1);
    }else if(value.length === 0){
      this.setState({isFetching: true});
      let pagination = Object.assign({},this.state.pagination);
      pagination = _.omit(pagination,'query');
      pagination.hasNext = true;
      this.findRegulation(pagination,1);
    }
  },

  handlePublishBtn(index){
    let { data } = this.state;
    let regulation = data[index];
    if (global.epConfirm) {
      global.epConfirm('',regulation.isPublished ? this.t('nTextUnPublishRegulation') : this.t('nTextPublishRegulation'), ()=>{
        this.updateRegulation(regulation._id,{isPublished: !regulation.isPublished,__v:regulation.__v});
      });
    }
  },

  handleRemove(rows){
    if (global.epConfirm) {
      global.epConfirm('',this.t('nTextEnsureDeleteSelected'), ()=>{
        let data = this.state.data;
        let ids = _.map(rows,row=>data[row]._id);
        this.removeRegulation(ids);
      });
    }
  },

  handleSaveBtnTouchTap(regulation){
    if(regulation._id){
      this.updateRegulation(regulation._id,regulation);
    }else{
      this.createRegulation(regulation);
    }
  },

  handleAdd() {
    let props = {
      title: this.t('nTextAddRegulation'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: '1005',
      }
    };

    let component = {
      name: 'RegulationEditorDialog',
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
      title: this.t('nTextRegulationInfo'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'RegulationViewDialog',
      props: {
        regulationId: this.state.data[index]._id
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handleEdit(index){
    let props = {
      title: this.t('nTextEditRegulation'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: '1005',
      }
    };

    let component = {
      name: 'RegulationEditorDialog',
      props: {
        regulationId: this.state.data[index]._id,
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
    this.reFetchRegulation(pagination);
    this.setState({
      isFetching: true,
      pagination: pagination,
      pageIndex: pageIndex
    });
  },

  reFetchRegulation(pagination){
    let value = this.refs.searchTextField.getValue();
    if(value && value.length>=2){
      value = _.replace(value, '\'','');
      pagination.query = {
        title: value,
        summary: value,
        chinese: value,
        english: value,
      };
      pagination.hasNext = true;
      this.searchRegulation(pagination);
    }else{
      pagination = _.omit(pagination,'query');
      pagination.hasNext = true;
      this.findRegulation(pagination);
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
    };

    let data  = _.map(this.state.data,dt=>{
      return {
        _id : dt._id,
        title : dt.title || '-',
        dateUpdate : formatDate(dt.dateUpdate),
        dateCreate: formatDate(dt.dateCreate),
      }
    })

    const headerRightNode = (
      <SearchTextField
        ref = 'searchTextField'
        searchText = {this.t('nTextInputRegulationKeyword')}
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
          pageSize = {this.state.pagination.size}
          pageSizeList = {[10,20]}
          pageIndex = {this.state.pageIndex}
          total = {this.state.pagination.total}
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

module.exports = RegulationDataTable;
