const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DataTable = require('epui-md/ep/CustomizedTable/DataTable');
const RaisedButton = require('epui-md/RaisedButton');
const Dialog = require('epui-md/ep/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const SearchTextField = require('epui-md/ep/SearchTextField');
const Translatable = require('epui-intl').mixin;
const { formatDate } = require('~/src/utils');

const {
  findOrganizations,
  searchOrganizations,
} = global.api.epds;

const MIN_QUERY_LENGTH = 2;

const TYPE_CODE = {
  public: 0,
  private: 1,
  protected: 2,
};
const CODE_TYPE= {
  0: '可见',
  1: '登录可见',
  2: '不可见',
};
const OrganizationData = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/Organization/${__LOCALE__}`),
    require(`epui-intl/dist/DialogConfirm/${__LOCALE__}`),
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    data: PropTypes.array,
  },

  getDefaultProps() {
    return {
      data: [],
    };
  },

  getInitialState() {
    return {
      isFetching: true,
      data: [],
      pageIndex: 1,
      pagination: {
        cursor: 0,
        size: 10,
        total: 0,
      },
      errorText: null,
      open: false,
      rows: [],
      searched: false,
      value: '',
    };
  },

  componentWillMount() {
    this.findOrganizations(this.state.pagination);
  },

  findOrganizations(pagination, pageIndex) {
    if (_.isFunction(findOrganizations)) {
      let newPagination = Object.assign({},pagination,{
        query:{
          type:{$ne: 'byRegister'},
          $or:[{ parent:null },{ parent:{ $exists:false } }]
        }
      })
      findOrganizations
        .promise(newPagination)
        .then((res) => {
          if (res.status === 'OK') {
            this.setState({
              data: res.response.entries,
              isFetching: false,
              pageIndex: !_.isNil(pageIndex) ? pageIndex : this.state.pageIndex,
              pagination: res.response.pagination,
            });
          } else {
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err => {
          alert(this.t('nTextIinitFailed') + err);
          //todo: deal with err
        });
    }
  },

  generate(index) {
    let organizationId = !_.isNil(index) && this.state.data[index] && this.state.data[index]._id;

    let props = {
      title: this.t('nTextOrganizationInfo'),
      open: true,
      contentStyle: {
        width: '100%',
        maxWidth: 'none',
      },
      modal: true,
    };

    let component = {
      name: 'OrganizationForm',
      props: {
        organizationId,
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  searchOrganizations(pagination, pageIndex) {
    if (_.isFunction(searchOrganizations)) {
      searchOrganizations
        .promise(pagination, {
          type: {
            $ne :'byRegister'
          },
          $or:[{ parent:null },{ parent:{ $exists:false } }]
        })
        .then((res) => {
          if (res.status === 'OK') {
            let resPagination = res.response.pagination;
            let newPagination = Object.assign({}, this.state.pagination, {
              cursor: 0,
              total: !_.isNil(resPagination.total) ? resPagination.total : this.state.pagination.total,
            });
            this.setState({
              data: res.response.entries,
              isFetching: false,
              pageIndex: !_.isNil(pageIndex) ? pageIndex : this.state.pageIndex,
              pagination: newPagination,
              errorText: null,
            });
          } else {
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err => {
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

  handleAdd() {
    this.generate();
  },

  handleEdit(index) {
    this.generate(index);
  },

  handleInputChange(value) {
    if (value.length >= MIN_QUERY_LENGTH) {
      value = _.replace(value, '\'','');
      this.setState({
        isFetching: true,
      });
      let pagination = Object.assign({}, this.state.pagination);
      pagination.cursor = 0;
      pagination.hasNext = true;
      pagination.query = { name: value };
      this.searchOrganizations(pagination, 1);
      this.setState({searched:true, value});
    } else if (value.length === 0) {
      this.setState({
        isFetching: true,
      });
      let pagination = Object.assign({}, this.state.pagination);
      pagination = _.omit(pagination, 'query');
      this.findOrganizations(pagination, 1);
      this.setState({searched:false});
    }
  },

  handlePagerChange(pageIndex, pageSize) {
    let pagination = Object.assign({}, this.state.pagination, {
      cursor: (pageIndex - 1 >= 0 ? pageIndex - 1 : 0) * pageSize,
      size: pageSize,
    });
    let value = this.searchTextField.getValue();
    if (value && value.length >= MIN_QUERY_LENGTH) {
      value = _.replace(value, '\'','');
      pagination.query = { name: value };
      pagination.hasNext = true;
      this.searchOrganizations(pagination);
      this.setState({searched:true, value});
    } else {
      pagination = _.omit(pagination, 'query');
      pagination.hasNext = true;
      this.findOrganizations(pagination);
      this.setState({searched:false});
    }

    this.setState({
      isFetching: true,
      pagination: pagination,
      pageIndex: pageIndex,
    });
  },

  handleSearch(value) {
    this.setState({
      isFetching: true
    });
    value = _.replace(value, '\'','');
    let pagination = Object.assign({}, this.state.pagination);
    pagination.query = { name: value };
    pagination.cursor = 0;
    pagination.hasNext = true;
    this.searchOrganizations(pagination, 1);
    this.setState({searched:true, value});
  },

  handleView(index) {
    let { data } = this.state;

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
        organizationId: data[index] && data[index]._id,
      }
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  getStyles() {
    let styles = {
      root: {
        height: '100%',
      },
      buttons: {

      },
      button: {
        marginRight: '5px',
      }
    };

    return styles;
  },

  render() {
    let {
      pageIndex,
      pagination,
    } = this.state;

    // define table strocutor
    const structor = {
      name: this.t('nLabelName'),
      type: this.t('nLabelType'),
      dateUpdate: this.t('nLabelDateUpdate'),
      visibleStatus: this.t('nLabelVisibleStatus')
    };

    let data = _.map(this.state.data, dt => {
      let type = dt.type;
      if(type == 'byComplete') { type = 'Completed'; }
      return {
        name: dt.name,
        type: type || '-',
        dateUpdate: formatDate(dt.dateUpdate) || '-',
        visibleStatus: CODE_TYPE[dt.visibleStatus]
      }
    });
    const headerLeftNode = (
      <div
        style={this.style('buttons')}
      >
        <RaisedButton
          style={this.style('button')}
          label={this.t('nLabelPublic')}
          onMouseDown={this._handleTouchButton.bind(this, 'public')}
        />
        <RaisedButton
          style={this.style('button')}
          label={this.t('nLabelPrivate')}
          onMouseDown={this._handleTouchButton.bind(this, 'private')}
        />
        <RaisedButton
          style={this.style('button')}
          label={this.t('nLabelProtected')}
          onMouseDown={this._handleTouchButton.bind(this, 'protected')}
        />
      </div>
    );
    const headerRightNode = (
      <SearchTextField
        ref={(ref) => this.searchTextField = ref}
        searchText={this.t('nTextInputOrganizationName')}
        onChange={this.handleInputChange}
        onSearch={this.handleSearch}
        errorText = {this.state.errorText}
      />
    );

    const actions = [
      <FlatButton
        label={this.t('nButtonNo')}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this._handleDialogClose}
      />,
      <FlatButton
        label={this.t('nButtonConfirm')}
        primary={true}
        keyboardFocused={true}
        onTouchTap={this._handleDialogSubmit}
      />,
    ];

    return (
      <div style={this.style('root')}>
        <DataTable
          ref={(ref) => this.dataTable = ref}
          data={data}
          headerLeftNode={headerLeftNode}
          headerRightNode={headerRightNode}
          onAdd={this.handleAdd}
          onEdit={this.handleEdit}
          onPagerChange={this.handlePagerChange}
          onRemove={this._handleRemove}
          onView={this.handleView}
          pageIndex={pageIndex}
          pageSize={pagination.size}
          pageSizeList={[10, 20]}
          structor={structor}
          total={pagination.total}
        />
        <Dialog
          title={this.t('nTextAlertTitle')}
          actions={actions}
          modal={false}
          open={this.state.open}
        >
          {this.t('nTextDeleteInfoConfirm')}
        </Dialog>
      </div>
    );
  },

  _handleDialogClose() {
    this.setState({open: false});
  },

  _handleDialogSubmit() {
    let data  = _.map(this.state.data,dt=>{
      return {_id : dt._id}
    });

    let ids = [];
    _.forEach(this.state.rows, row => {
      ids.push(data[row]._id);
    });

    if(global.api.epds && global.api.epds.removeOrganizationByIds){
        global.api.epds.removeOrganizationByIds.promise(ids).then((res)=>{
          if(res.status === 'OK'){
            if(this.state.searched){
              let pagination = Object.assign({}, this.state.pagination);
              pagination.query = { name: _.replace(this.state.value, '\'','')};
              pagination.cursor = 0;
              pagination.hasNext = true;
              this.searchOrganizations(pagination, 1);
            }else{
              this.findOrganizations(this.state.pagination);
            }
            this.setState({open:false});
          }else{
            //todo: deal with error
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          //todo: deal with err
          alert(this.t('nTextIinitFailed'));
        });
    }
  },

  _handleRemove(rows){
    this.setState({rows,open:true});
  },

  _handleTouchButton(type) {
    let data = this.state.data;
    let rows = this.dataTable.getSelectRows();
    if(!rows || rows.length <= 0) return;
    let docs = _.map(rows,row=>data[row]);
    if(global.api.epds && global.api.epds.updateOrganizations){
        global.api.epds.updateOrganizations.promise(docs, {visibleStatus:TYPE_CODE[type]}).then((res)=>{
          if(res.status === 'OK'){
            let mergeOrganizations = res.response;
            let organizations = Object.assign({}, this.state.data);
            _.forEach(mergeOrganizations, (item)=>{
              let mergeorganization = _.find(organizations,{_id:item._id});
              mergeorganization.visibleStatus = item.visibleStatus;
              mergeorganization.__v = item.__v;
            })
            this.setState({
              data: organizations
            },);
          }else{
            //todo: deal with error
            alert(this.t('nTextIinitFailed'));
          }
        }).catch(err=>{
          //todo: deal with err
          alert(this.t('nTextIinitFailed'));
        });
    }
  }
});

module.exports = OrganizationData;
