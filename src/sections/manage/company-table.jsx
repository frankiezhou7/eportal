const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DataTable = require('epui-md/ep/CustomizedTable/DataTable');
const PropTypes = React.PropTypes;
const SearchTextField = require('epui-md/ep/SearchTextField');
const Translatable = require('epui-intl').mixin;
const { formatDate } = require('~/src/utils');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const {
  findOrganizations,
  searchOrganizations,
} = global.api.epds;

const MIN_QUERY_LENGTH = 2;

const CompanyTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/AuditCompany/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    data: PropTypes.array,
    allCountries: PropTypes.object,
    verifyStatus: PropTypes.number,
  },

  getDefaultProps() {
    return {
      data: [],
      verifyStatus: 0,
    };
  },

  getInitialState() {
    let type = 'byRegister';
    if(this.props.verifyStatus === 1){
      type = {
        $in: ['byRegister', 'byComplete'],
      }
    }
    return {
      isFetching: true,
      data: [],
      pageIndex: 1,
      pagination: {
        query: {
          verifyStatus:this.props.verifyStatus,
          type: type
        },
        cursor: 0,
        size: 10,
        total: 0,
        sortby: {
          dateUpdate: -1
        }
      },
      errorText: null,
    };
  },

  componentWillReceiveProps(nextProps) {
    if(nextProps.verifyStatus !== this.props.verifyStatus){
      let type = 'byRegister';
      if(nextProps.verifyStatus === 1){
        type = {
          $in: ['byRegister', 'byComplete'],
        }
      }
      let newPagination = {
        query: {
          verifyStatus:nextProps.verifyStatus,
          type: type,
        },
        cursor: 0,
        size: 10,
        total: 0,
        sortby: {
          dateUpdate: -1
        }
      }
      this.setState({
        pagination:newPagination,
        pageIndex:1,
      },() => {
        this.searchTextField.resetValue();
        this.findOrganizations(this.state.pagination);
      })

    }
  },

  refresh() {
    let type = 'byRegister';
    if(this.props.verifyStatus === 1){
      type = {
        $in: ['byRegister', 'byComplete'],
      }
    }
    let newPagination = {
      query: {
        verifyStatus:this.props.verifyStatus,
        type: type
      },
      cursor: 0,
      size: 10,
      total: 0,
      sortby: {
        dateUpdate: -1
      }
    }
    this.setState({
      pagination:newPagination,
      pageIndex:1,
    },() => {
      this.searchTextField.resetValue();
      this.findOrganizations(this.state.pagination);
    })
  },

  componentWillMount() {
    this.findOrganizations(this.state.pagination);
  },

  findOrganizations(pagination, pageIndex) {
    if (_.isFunction(findOrganizations)) {
      findOrganizations
        .promise(pagination)
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

  generate(index ,isEdit) {
    let organizationId = !_.isNil(index) && this.state.data[index] && this.state.data[index]._id;

    let props = {
      title: this.t('nTextAuditCompany'),
      open: true,
      contentStyle: {
        width: '640px',
      },
      titleStyle: {
        color:'#004588',
        border: 0,
      },
      modal: true,
    };

    let component = {
      name: 'RegisterOrganization',
      props: {
        refresh: this.refresh,
        organizationId,
        isEdit:isEdit,
        verifyStatus:this.state.data[index].verifyStatus
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  searchOrganizations(pagination, pageIndex) {
    if (_.isFunction(searchOrganizations)) {
      let type = 'byRegister';
      if(this.props.verifyStatus === 1){
        type = {
          $in: ['byRegister', 'byComplete'],
        }
      }
      delete pagination.query.type;
      searchOrganizations
        .promise(pagination,{
          verifyStatus:this.props.verifyStatus,
          type: type
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

  handleEdit(index) {
    this.generate(index, true);
  },

  handleView(index) {
    this.generate(index, false);
  },

  handleInputChange(value) {
    if (value.length >= MIN_QUERY_LENGTH) {
      this.setState({
        isFetching: true,
      });
      let type = 'byRegister';
      if(this.props.verifyStatus === 1){
        type = {
          $in: ['byRegister', 'byComplete'],
        }
      }
      let pagination = {
        query: {
          name: value,
          type: type,
        },
        cursor: 0,
        size: 10,
        total: 0,
        hasNext:true,
        sortby: {
          dateUpdate: -1
        }
      }
      this.searchOrganizations(pagination, 1);
    } else if (value.length === 0) {
      this.setState({
        isFetching: true,
      });
      let type = 'byRegister';
      if(this.props.verifyStatus === 1){
        type = {
          $in: ['byRegister', 'byComplete'],
        }
      }
      let pagination = {
        query: {
          verifyStatus:this.props.verifyStatus,
          type: type,
        },
        cursor: 0,
        size: 10,
        total: 0,
        sortby: {
          dateUpdate: -1
        }
      }
      this.findOrganizations(pagination, 1);
    }
  },

  handlePagerChange(pageIndex, pageSize) {
    let pagination = Object.assign({}, this.state.pagination, {
      cursor: (pageIndex - 1 >= 0 ? pageIndex - 1 : 0) * pageSize,
      size: pageSize,
    });
    let value = this.searchTextField.getValue();
    if (value && value.length >= MIN_QUERY_LENGTH) {
      pagination.query= {
        name:value
      };
      pagination.hasNext = true;
      this.searchOrganizations(pagination);
    } else {
      delete pagination.query.name;
      pagination.hasNext = true;
      this.findOrganizations(pagination);
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
    let pagination = Object.assign({}, this.state.pagination);
    pagination.query= {
      name:value
    };
    pagination.cursor = 0,
    pagination.hasNext = true,
    this.searchOrganizations(pagination, 1);
  },

  getStyles() {
    let styles = {
      root: {
        height: '100%',
      },
    };

    return styles;
  },

  render() {
    let {
      pageIndex,
      pagination,
    } = this.state;
    let allCountries = this.props.allCountries && this.props.allCountries.toJS();
    // define table strocutor
    const structor = {
      name: this.t('nLabelName'),
      country: this.t('nLabelCountry'),
    };

    let data = _.map(this.state.data, dt => {
      let country = _.find(allCountries, {
        _id: dt.country
      });
      return {
        name: dt.name,
        country: country && country.name || '-',
      }
    });

    const headerRightNode = (
      <SearchTextField
        ref={(ref) => this.searchTextField = ref}
        searchText={this.t('nTextOrganizationName')}
        onChange={this.handleInputChange}
        onSearch={this.handleSearch}
        errorText = {this.state.errorText}
      />
    );

    return (
      <div style={this.style('root')}>
        <DataTable
          ref={(ref) => this.dataTable = ref}
          data={data}
          headerRightNode={headerRightNode}
          onEdit={this.handleEdit}
          onPagerChange={this.handlePagerChange}
          onView={this.handleView}
          pageIndex={pageIndex}
          pageSize={pagination.size}
          pageSizeList={[10, 20]}
          structor={structor}
          total={pagination.total}
        />
      </div>
    );
  },
});

module.exports = connect(
  (state, props) => {
    return {
      allCountries: state.getIn(['country', 'list']),
    };
  }
)(CompanyTable);
