const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');
const FlatButton = require('epui-md/FlatButton');
const CircularProgress = require('epui-md/CircularProgress');
const SearchTextField  =  require('epui-md/ep/SearchTextField');
const { formatDate } = require('~/src/utils');
const PropTypes = React.PropTypes;

const ShipDataTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/ShipForm/${__LOCALE__}`),
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

  getDefaultProps(){
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
      },
      errorText: null,
    };
  },

  getStyles() {
    let styles = {
      root: {
        height: '100%',
      },
    };

    return styles;
  },

  componentWillMount() {
    this.findShips(this.state.pagination);
  },

  findShips(pagination,pageIndex){
    if(global.api.epds && global.api.epds.findShips){
        global.api.epds.findShips.promise(pagination).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              data: res.response.entries,
              pagination: res.response.pagination,
              pageIndex : pageIndex!==undefined ? pageIndex : this.state.pageIndex
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

  searchShips(pagination,pageIndex){
    if(global.api.epds && global.api.epds.searchShips){
        global.api.epds.searchShips.promise(pagination).then((res)=>{
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
            //todo: deal with error
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


  handleSearch(value){
    this.setState({isFetching: true});
    let pagination = Object.assign({},this.state.pagination);
    pagination.query = value;
    pagination.cursor = 0;
    pagination.hasNext = true;
    this.searchShips(pagination,1);
  },

  handleInputChange(value){
    if(value.length >= 2){
      this.setState({isFetching: true});
      let pagination = Object.assign({},this.state.pagination);
      pagination.query = value;
      pagination.cursor = 0;
      pagination.hasNext = true;
      this.searchShips(pagination,1);
    }else if(value.length === 0){
      this.setState({isFetching: true});
      let pagination = Object.assign({},this.state.pagination);
      pagination = _.omit(pagination,'query');
      pagination.hasNext = true;
      this.findShips(pagination,1);
    }
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
        width: '100%',
        maxWidth: 'none',
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
        width: '100%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'ShipView',
      props: {
        shipId: this.state.data[index]._id
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handleEdit(index){
    let props = {
      title: this.t('nTextEditShip'),
      open: true,
      contentStyle: {
        width: '100%',
        maxWidth: 'none',
      }
    };

    let component = {
      name: 'ShipFormCompleted',
      props: {
        shipId: this.state.data[index]._id
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
    let value = this.refs.searchTextField.getValue();
    if(value && value.length>=2){
      pagination.query = value;
      pagination.hasNext = true;
      this.searchShips(pagination);
    }else{
      pagination = _.omit(pagination,'query');
      pagination.hasNext = true;
      this.findShips(pagination);
    }
    this.setState({
      isFetching: true,
      pagination: pagination,
      pageIndex: pageIndex
    });
  },

  render() {
    // define table strocutor
    const structor = {
      imo: this.t('nLabelImo'),
      name: this.t('nLabelName'),
      type: this.t('nLabelType'),
      dateUpdate: this.t('nLabelDateUpdate'),
    };

    let data  = _.map(this.state.data,dt=>{
      return {
        _id : dt._id,
        imo : dt.imo,
        name: dt.name,
        type: dt.type || '-',
        dateUpdate : formatDate(dt.dateUpdate)
      }
    });

    const headerRightNode = (
      <SearchTextField
        ref = 'searchTextField'
        searchText = {this.t('nTextInputShipName')}
        onChange = {this.handleInputChange}
        onSearch ={this.handleSearch}
        errorText = {this.state.errorText}
      />);

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
          headerRightNode = { headerRightNode }
        />
      </div>
    );
  },

});

module.exports = ShipDataTable;
