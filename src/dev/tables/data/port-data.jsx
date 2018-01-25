const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const SearchTextField  =  require('epui-md/ep/SearchTextField');
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;

const {
  findPorts,
  searchPorts,
} = global.api.epds;

const MIN_QUERY_LENGTH = 2;

const PortDataTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
    require(`epui-intl/dist/Port/${__LOCALE__}`),
    require(`epui-intl/dist/PortDialog/${__LOCALE__}`),
    require(`epui-intl/dist/RecommendationTable/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    data: PropTypes.array,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
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
    };
  },

  componentWillMount() {
    this.findPorts(this.state.pagination);
  },

  getStyles() {
    let styles = {
      root: {
        height: '100%',
        overflow: 'scroll',
      },
    };

    return styles;
  },

  findPorts(pagination, pageIndex) {
    if (_.isFunction(findPorts)) {
      findPorts
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

  searchPorts(pagination, pageIndex) {
    if (_.isFunction(searchPorts)) {
      searchPorts
        .promise(pagination)
        .then((res) => {
          if (res.status === 'OK') {
            let resPagination = res.response.pagination;
            let newPagination = Object.assign({}, this.state.pagination, {
              cursor: 0,
              total: _.isNil(resPagination.total) ? resPagination.total : this.state.pagination.total,
            });
            this.setState({
              data: res.response.entries,
              isFetching: false,
              pageIndex: !_.isNil(pageIndex) ? pageIndex : this.state.pageIndex,
              pagination: newPagination,
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

  handlePagerChange(pageIndex, pageSize) {
    let pagination = Object.assign({}, this.state.pagination, {
      cursor: (pageIndex - 1 >= 0 ? pageIndex - 1 : 0) * pageSize,
      size: pageSize,
    });
    let value = this.searchTextField.getValue();
    if (value && value.length >= MIN_QUERY_LENGTH) {
      pagination.query = value;
      this.searchPorts(pagination);
    } else {
      pagination = _.omit(pagination, 'query');
      if (!pagination.hasNext) { return; }
      this.findPorts(pagination);
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
    pagination.query = value;
    this.searchPorts(pagination, 1);
  },

  handleInputChange(value) {
    if (value.length >= MIN_QUERY_LENGTH) {
      this.setState({
        isFetching: true,
      });
      let pagination = Object.assign({}, this.state.pagination);
      pagination.cursor = 0;
      pagination.query = value;
      this.searchPorts(pagination, 1);
    } else if (value.length === 0) {
      this.setState({
        isFetching: true,
      });
      let pagination = Object.assign({}, this.state.pagination);
      pagination = _.omit(pagination, 'query');
      this.findPorts(pagination, 1);
    }
  },

  handleEdit(index) {
    let props = {
      title: this.t('nTextPortInfo'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'PortFormDialog',
      props: {
        portId: this.state.data[index]._id,
      },
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  handleView(index) {
    let { data } = this.state;

    let props = {
      title: this.t('nTextPortInfo'),
      open: true,
      contentStyle: {
        width: '90%',
        maxWidth: 1005,
      }
    };

    let component = {
      name: 'PortViewDialog',
      props: {
        portId: data[index] && data[index]._id,
      }
    };

    if (global.register.dialog) {
      global.register.dialog.generate(props, component);
    }
  },

  render() {
    let {
      pageIndex,
      pagination,
    } = this.state;

    // define table strocutor
    const structor = {
      name: this.t('nLabelName'),
      code: this.t('nLabelCode'),
      dateUpdate: this.t('nLabelDateUpdate'),
    };

    let data = _.map(this.state.data, dt => {
      return {
        name: dt.name,
        code: dt.code || '-',
        dateUpdate: dt.dateUpdate || '-'
      }
    });

    const headerRightNode = (
      <SearchTextField
        ref={(ref) => this.searchTextField = ref}
        searchText={this.t('nTextPortName')}
        onChange={this.handleInputChange}
        onSearch={this.handleSearch}
      />
    );

    return (
      <div style={this.style('root')}>
        <Paper zDepth={1}>
          <DataTable
            ref={(ref) => this.dataTable = ref}
            data={data}
            headerRightNode={headerRightNode}
            onAdd={this.handleAdd}
            onEdit={this.handleEdit}
            onPagerChange={this.handlePagerChange}
            onRemove={this.handleRemove}
            onView={this.handleView}
            pageIndex={pageIndex}
            pageSize={pagination.size}
            pageSizeList={[10, 20]}
            structor={structor}
            total={pagination.total}
          />
        </Paper>
      </div>
    );
  },
});

module.exports = PortDataTable;
