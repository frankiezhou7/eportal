const React = require('react');
const _ = require('eplodash');
const ActionWaiting = require('epui-md/svg-icons/action/waiting');
import ActionVisibility from 'epui-md/svg-icons/action/visibility'
const RaisedButton = require('epui-md/RaisedButton');
const Dialog = require('epui-md/ep/Dialog');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');
const FlatButton = require('epui-md/FlatButton');
const CircularProgress = require('epui-md/CircularProgress');
const SearchTextField  =  require('epui-md/ep/SearchTextField');
const { formatDate } = require('~/src/utils');

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

const PropTypes = React.PropTypes;

/**
 * type could be:
 *    -   0: unverified
 *    -   1: Verified
 *    -   2: refused
 */
function ShipTable(verifyStatus) {
  return React.createClass({
    mixins: [AutoStyle, Translatable],

    translations: [
      require(`epui-intl/dist/DataTable/${__LOCALE__}`),
      require(`epui-intl/dist/Common/${__LOCALE__}`),
      require(`epui-intl/dist/ShipForm/${__LOCALE__}`),
      require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
      require(`epui-intl/dist/DialogConfirm/${__LOCALE__}`),
      require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    ],

    contextTypes: {
      muiTheme: PropTypes.object,
    },

    propTypes: {
      data : PropTypes.array,
      verifyStatus: PropTypes.number
    },

    childContextTypes: {
      muiTheme: PropTypes.object,
    },

    getDefaultProps(){
      return {
        data: [],
        verifyStatus: 0,
      };
    },

    getInitialState(){
      return {
        isFetching : true,
        data: [],
        pageIndex: 1,
        pagination:{
          query: {
            verifyStatus: this.props.verifyStatus,
          },
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

    componentWillMount() {
      let pagination = _.assign({}, this.state.pagination, {
        query: { verifyStatus: this.props.verifyStatus }
      })
      this.findShips(pagination);
    },

    verifyFinished() {
      let pagination = Object.assign({},this.state.pagination,{
        cursor: ( this.state.pageIndex-1 >= 0 ? this.state.pageIndex-1 : 0 ) * this.state.pagination.size,
        hasNext: true,
        query: { verifyStatus: this.props.verifyStatus }
      });
      this.findShips(pagination, this.state.pageIndex);
    },

    checkStatus(response) {
      if (response.status !== 'OK')
        throw new Error(`invalid res.status value: ${response.status}`)
      else
        return response
    },

    findShips(pagination, pageIndex) {
      if (!(global.api.epds && global.api.epds.findShips)) {
        console.error('global.api.epds.findShips is undefined')
        return
      }

      global.api.epds.findShips.promise(pagination)
      .then(this.checkStatus)
      .then(res => {
        this.setState({
          pageIndex : pageIndex ? pageIndex : this.state.pageIndex,
          pagination: res.response.pagination,
          data: res.response.entries,
          isFetching: false,
        })
      })
      .catch(e => {
        alert(this.t('nTextIinitFailed') + e)
      })
    },

    /**
     * This function will automatically set the `option` field of the request
     * to : { verifyStatus: this.props.verifyStatus}
     *
     * So you don't need to pass `verifyStatus` to `searchShips`.
     */
    searchShips(pagination, pageIndex) {
      if (!(global.api.epds && global.api.epds.searchShips)) {
        console.error('global.api.epds.searchShips is undefined')
        return
      }

      global.api.epds.searchShips
      .promise(pagination, { verifyStatus: this.props.verifyStatus})
      .then(this.checkStatus)
      .then(res => {
        let resPagination = res.response.pagination;
        let newPagination = Object.assign({}, this.state.pagination, {
          cursor: 0,
          total: resPagination.total !== null ? resPagination.total : this.state.pagination.total
        });
        this.setState({
          pageIndex : pageIndex ? pageIndex : this.state.pageIndex,
          pagination: newPagination,
          data: res.response.entries,
          isFetching: false,
          errorText: null,
        })
      })
      .catch(err => {
        console.error(`error on 'searchShips': ${err}`)
        if (err.code && err.code === 'INVALID_REQUEST')
          this.setState({ errorText: this.t('nTextInvalidSearchText') })
        else
          alert(this.t('nTextIinitFailed'))
      })
    },

    handleSearch(value){
      value = _.replace(value, '\'','');
      this.setState({isFetching: true});
      let pagination = Object.assign({}, this.state.pagination, {
        query: { name: value }
      })
      this.searchShips(pagination, 1);
      this.setState({searched:true, value});
    },

    handleInputChange(value){
      // console.log('pagination:', this.state.pagination, '\nvalue:', value)
      // console.log('this.props.verifyStatus', this.props.verifyStatus)
      this.setState({ isFetching: true })
      let pagination = Object.assign({}, this.state.pagination, {
        hasNext: true,
        cursor: 0,
      })
      if (value) {
        if (value.length >= 2) {
          pagination.query = { name: _.replace(value, '\'','') }
          this.searchShips(pagination, 1);
          this.setState({searched:true, value});
        } else if (value.length === 1) {
          // do nothing
        }
      } else {
        pagination.query = { verifyStatus: this.props.verifyStatus }
        this.findShips(pagination, 1);
        this.setState({searched:false});
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
          verifyStatus: verifyStatus,
          shipId: this.state.data[index]._id,
          verifyFinished: this.verifyFinished,
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

      // if verifyStatus === 1, show "Edit" button, else show "Verify" button
      let component
      if (verifyStatus !== 1) {
        component = {
          name: 'ShipFormVerify',
          props: {
            shipId: this.state.data[index]._id,
            verifyFinished: this.verifyFinished,
          },
        }
      } else {
        component = {
          name: 'ShipFormCompleted',
          props: {
            shipId: this.state.data[index]._id
          },
        }
      }

      if (global.register.dialog) {
        global.register.dialog.generate(props, component);
      }
    },

    handlePagerChange(pageIndex, pageSize){
      let pagination = Object.assign({},this.state.pagination,{
        cursor: ( pageIndex - 1 >= 0 ? pageIndex - 1 : 0 ) * pageSize,
        size: pageSize
      });
      let value = this.refs.searchTextField.getValue();
      // console.log(`searchText: ${value}`)
      if (value) {
        if (value.length >= 2) {
          pagination.query = { name: _.replace(value, '\'','') }
          pagination.hasNext = true;
          this.searchShips(pagination);
          this.setState({searched:true, value});
        } else if (value.length === 1) {
          // do nothing
        }
      } else {
        // pagination = _.omit(pagination,'query');
        pagination.query = { verifyStatus: this.props.verifyStatus }
        pagination.hasNext = true;
        this.findShips(pagination);
        this.setState({searched:false});
      }
      this.setState({
        isFetching: true,
        pagination: pagination,
        pageIndex: pageIndex
      });
    },

    render() {
      // define table strocutor
      let structor = {
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
          dateUpdate : formatDate(dt.dateUpdate),
          visibleStatus: CODE_TYPE[dt.visibleStatus]
        }
      })
      let headerLeftNode = null;
      if(this.props.verifyStatus === 1) {
        structor.visibleStatus = this.t('nLabelVisibleStatus');
          headerLeftNode = (
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
      }else {
        _.forEach(data, item=>{
          delete item.visibleStatus
        })
      }

      const headerRightNode = (
        <SearchTextField
          ref = 'searchTextField'
          searchText = {this.t('nTextInputShipName')}
          onChange = {this.handleInputChange}
          onSearch ={this.handleSearch}
          errorText = {this.state.errorText}
        />);

      const actions = [
        <FlatButton
          label={this.t('nButtonNo')}
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.handleDialogClose}
        />,
        <FlatButton
          label={this.t('nButtonConfirm')}
          primary={true}
          keyboardFocused={true}
          onTouchTap={this.handleDialogSubmit}
        />,
      ];

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
            onAdd = {this.handleAdd}
            onRemove = {this.handleRemove}
            onView = {this.handleView}
            onEdit = {this.handleEdit}
            onPagerChange = {this.handlePagerChange}
            headerLeftNode = {headerLeftNode}
            headerRightNode = { headerRightNode }
            viewIcon={ verifyStatus === 0 ? <ActionWaiting /> : <ActionVisibility /> }
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
      )
    },

    handleDialogClose() {
      this.setState({open: false});
    },

    handleDialogSubmit() {
      let data  = _.map(this.state.data,dt=>{
        return {_id : dt._id}
      });

      let ids = [];
      _.forEach(this.state.rows, row => {
        ids.push(data[row]._id);
      });

      let paginationSet = {
        query: {
          verifyStatus: this.props.verifyStatus,
        },
        cursor: 0,
        size: 10,
        total: 0,
      };

      let pagination = _.assign({}, paginationSet, {
        query: { verifyStatus: this.props.verifyStatus }
      });

      if(global.api.epds && global.api.epds.removeShipByIds){
          global.api.epds.removeShipByIds.promise(ids).then((res)=>{
            if(res.status === 'OK'){
              if(this.state.searched){
                let pagination = Object.assign({}, this.state.pagination);
                pagination.query = { name: _.replace(this.state.value, '\'','') };
                pagination.cursor = 0;
                pagination.hasNext = true;
                this.searchShips(pagination, 1);
              }else{
                let cursor = _.get(this.state.pagination, 'cursor', 0);
                if(cursor > 0) {
                  cursor = cursor - 10;
                }
                this.findShips(Object.assign({}, this.state.pagination,{cursor:cursor}));
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

    handleRemove(rows){
      this.setState({rows,open:true});
    },

    _handleTouchButton(type) {
      let data = this.state.data;
      let rows = this.refs.dataTable.getSelectRows();
      if(!rows || rows.length <= 0) return;
      let docs = _.map(rows,row=>data[row]);
      if(global.api.epds && global.api.epds.updateShips){
          global.api.epds.updateShips.promise(docs, {visibleStatus:TYPE_CODE[type]}).then((res)=>{
            if(res.status === 'OK'){
              let mergeShips = res.response;
              let ships = Object.assign({}, this.state.data);
              _.forEach(mergeShips, (item)=>{
                let mergeShip = _.find(ships,{_id:item._id});
                mergeShip.visibleStatus = item.visibleStatus;
                mergeShip.__v = item.__v;
              })
              this.setState({
                data: ships
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
}


module.exports = {
  WaitedShip: ShipTable(0),
  VerifiedShip: ShipTable(1),
  FailedShip: ShipTable(2),
}
