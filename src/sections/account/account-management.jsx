const React = require('react');
const _ = require('eplodash');
const NavigationContainer = require('epui-md/ep/NavigationContainer');
const RoleManagementDialog = require('./account-management-dialog/role-management-dialog');
const UserManagementDialog = require('./account-management-dialog/user-management-dialog');
const Paper = require('epui-md/Paper');
const DataTable =  require('epui-md/ep/CustomizedTable/DataTable');
const Dialog =  require('epui-md/ep/Dialog');
const RawTextField = require('epui-md/TextField/TextField');
const FlatButton = require('epui-md/FlatButton');
const Validatable = require('epui-md/HOC/Validatable');
const RaisedButton = require('epui-md/RaisedButton');
const IconSettings = require('epui-md/svg-icons/action/settings');
const EditIcon  = require('epui-md/svg-icons/editor/mode-edit');
const DeleteIcon  = require('epui-md/svg-icons/action/delete');
const { ListItem } = require('epui-md/List');
const IconButton = require('epui-md/IconButton');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const ScreenMixin = require('~/src/mixins/screen');
const moment = require('moment');
const PropTypes = React.PropTypes;
const TextField = Validatable(RawTextField);

const AccountManagement = React.createClass({

  mixins: [AutoStyle, ScreenMixin, Translatable],

  translations: [
    require(`epui-intl/dist/User/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Account/${__LOCALE__}`),
    require(`epui-intl/dist/Navigation/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    user: PropTypes.object,
    users: PropTypes.object,
    userGroups: PropTypes.object,
    account: PropTypes.object,
    target: PropTypes.string,
    findUserGroupsByOwner: PropTypes.func,
    createUserGroup: PropTypes.func,
    removeUserGroupById: PropTypes.func,
    updateUserGroupById: PropTypes.func,
    findUsersByUserGroup: PropTypes.func,
    createUserByUserGroup: PropTypes.func,
    updateUserByUserGroup: PropTypes.func,
    removeUsersAndWithPositionByIds: PropTypes.func,
    fetchMe: PropTypes.func,
    userExists: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  componentWillMount(){
    let { user, userGroups, findUserGroupsByOwner } = this.props;
    if(_.isFunction(findUserGroupsByOwner)){
      let pid = _.get(user.getPosition().toJS(), '_id');
      this.setState({positionId: pid});
      findUserGroupsByOwner(pid);
    }
  },

  componentDidMount() {
    this.setPageTitle(this.t('nTextAccountManagement'));
  },

  componentWillReceiveProps(nextProps) {
    let { userGroups, users, user } = nextProps;
    //active first navigation item
    if(userGroups.count() > 0 && userGroups !== this.props.userGroups){
      userGroups = _.get(userGroups.toJS(), 'entries');
      this.setState({
        active: userGroups[0]._id,
        roleInfo: userGroups[0],
      });
    }
    //active the newest created navigation item
    // if(nextProps.userGroups !== this.props.userGroups && this.props.userGroups.count() > 0){
    //   userGroups = _.get(userGroups.toJS(), 'entries');
    //   let userGroup = userGroups[userGroups.length - 1];
    //   this.setState({
    //     active: userGroup._id,
    //     roleInfo: {name:userGroup.name, id:userGroup._id},
    //   });
    // }
    //set new pagination when created new user
    if(users !== this.props.users && users.count() > 0){
      this.setState({pagination: _.get(users.toJS(), 'pagination')});
    }

    if(users !== this.props.users && users.count() === 0){
      let pagination = {
        query: {

        },
        cursor: 0,
        size: 10,
        total: 0,
      };
      this.setState({pagination});
    }
  },

  componentWillUpdate(nextProps,nextState){
    //fetch user list when change navigation item
    let pagination = {
      query: {

      },
      cursor: 0,
      size: 10,
      total: 0,
    };
    if(nextState.active !== this.state.active && nextState.active !== 'addRole'){
      let userGroups = _.get(nextProps.userGroups.toJS(), 'entries');
      let index = _.findIndex(userGroups, {_id: nextState.active});
      this.setState({
        roleInfo: userGroups[index],
      },()=>{
        this.findUsers(pagination, nextState.active);
      });

    }
  },

  getInitialState(){
    return {
      roleMode: null,
      userMode: null,
      user: {},
      userIndex: [],
      positionId: '',

      isFetching : true,
      data: [],
      pageIndex: 1,
      pagination:{
        query: {

        },
        cursor: 0,
        size: 10,
        total: 0,
      },
      userOpen: false,
      deleteRoleOpen: false,
    };
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const iconButtonSize = 30;
    const iconSize = 20;

    let styles = {
      root:{
        marginLeft: -4,
        marginRight: -6,
        width: '100%',
        height: '100%',
      },
      coverContent: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        zIndex: 2,
      },
      content: {
        marginLeft: 10,
        marginRight: 6,
      },
      nav:{
        left: 4,
        overflowY: 'auto',
      },
      icon:{
        fill:theme.palette.accent1Color,
        width: iconSize,
        height: iconSize,
        position: 'absolute',
        top: (iconButtonSize-iconSize)/2,
        right: (iconButtonSize-iconSize)/2,
      },
      iconButton:{
        width: iconButtonSize,
        height: iconButtonSize,
        marginTop: (48-iconButtonSize)/2,
      },
      btnContainer:{
      },
      alertText: {
        fontSize: 16,
        color: '#rgba(0,0,0,0.54)',
        marginBottom: 6,
      },
      addBtn:{
        color: theme.palette.accent1Color,
        fontSize: 16,
      },
    }
    return styles;
  },

  renderSubNavigationItems() {
    let { userGroups } = this.props;
    userGroups = _.get(userGroups.toJS(), 'entries');
    let items = [];

    items.push(
      <ListItem
        key = {'addRole'}
        primaryText = {<div style = {this.style('addBtn')}>{this.t('nTextAddRole')}</div>}
        value = {'addRole'}
        onTouchTap = {this._handleAddRole}
      />
    );

    _.forEach(userGroups,group => {
      items.push(
        <ListItem
          key = {group._id}
          primaryText = {group.name}
          value = {group._id}
          rightIconButton = {
            <div style = {this.style('btnContainer')}>
              <IconButton
                iconStyle = {this.s('icon')}
                style = {this.s('iconButton')}
                onTouchTap = {(event) => this._handleEdit(event,group)}
              >
                <EditIcon/>
              </IconButton>
              <IconButton
                iconStyle = {this.s('icon')}
                style = {this.s('iconButton')}
                onTouchTap = {(event)=>this._handleDelete(event,group)}
              >
                <DeleteIcon/>
              </IconButton>
            </div>
          }
        />
      );
    });

    return items;
  },



  renderDeleteUserDialog(){
    const actions = [
      <FlatButton
        label={this.t('nButtonCancel')}
        primary={true}
        onTouchTap={this._handleCloseDeleteDialog.bind(this, 'user')}
      />,
      <FlatButton
        label={this.t('nButtonOk')}
        primary={true}
        onTouchTap={this._handleConfirmDeleteUser}
      />,
    ];

    return (
      <Dialog
        ref='deleteUser'
        title={this.t('nTextDeleteUser')}
        actions={actions}
        modal={false}
      >
        <div style={this.style('alertText')}>{this.t('nTextConfirmDeleteUser')}</div>
        <div style={this.style('alertText')}>
          {this.t('nTextCannotUndo')}
          <span style={{color:'#E44D3C'}}>{' (' + this.t('nTextCannotRegisterUser') + ')'}</span>
        </div>
      </Dialog>
    );
  },

  renderDeleteRoleDialog(group){
    let { pagination: { total } } = this.state;
    let hasDeletedAll = total === 0;
    const actions = hasDeletedAll ? [
      <FlatButton
        label={this.t('nButtonCancel')}
        primary={true}
        onTouchTap={this._handleCloseDeleteDialog.bind(this, 'role')}
      />,
      <FlatButton
        label={this.t('nButtonOk')}
        primary={true}
        onTouchTap={this._handleConfirmDeleteRole.bind(this, group)}
      />,
    ] : [
        <FlatButton
          label={this.t('nButtonOk')}
          primary={true}
          onTouchTap={this._handleCloseDeleteDialog.bind(this, 'role')}
      />
    ];

    let diffContent = hasDeletedAll ? (
      <div style={this.style('alertText')}>{this.t('nTextCannotUndo')}</div>
    ) : (
      <div style={this.style('alertText')}>{this.t('nTextConfirmBeforeRemoveRole')}</div>
    );

    return (
      <Dialog
        ref='deleteRole'
        title={this.t('nTextDeleteRole')}
        actions={actions}
        modal={false}
        open={this.state.deleteRoleOpen}
      >
        <div style={this.style('alertText')}>{this.t('nTextConfirmDeleteRole')}</div>
        {diffContent}
      </Dialog>
    );
  },

  render() {
    let { target, account, users, userGroups, ...other } = this.props;
    let { active, roleInfo, roleMode, user, userMode, pagination, pageIndex, userOpen } = this.state;
    let accMngt = this.props.user.getAccountManagement();
    let isAddUser = _.get(accMngt, 'addUser', false);
    let isEditUser = _.get(accMngt, 'editUser', false);
    let isDeleteUser = _.get(accMngt, 'deleteUser', false);
    let isAddRole = active === 'addRole';
    let data = this.getUsersList(users);
    const structor = {
      email: this.t('nLabelEmail'),
      name: this.t('nLabelName'),
      role: this.t('nLabelRole'),
      dateUpdate: this.t('nLabelDateUpdate'),
    };

    return (
      <div style = {this.s('root')}>
        <NavigationContainer
          menuItems={this.renderSubNavigationItems()}
          value={active}
          style={this.s('coverContent')}
          navStyle = {this.s('nav')}
          navDepth = {1}
          navigatorWidth ={200}
          onChange={this._onSubNavigationChange}
          keepOpen ={true}
          float = {false}
        >
          <Paper style = {this.s('content')}>
            <DataTable
              ref = 'dataTable'
              style={{display: userGroups.count() > 0 ? 'block' : 'none'}}
              structor = {structor}
              data = {data}
              pageSize = {_.get(pagination, 'size')}
              pageSizeList = {[10,20]}
              pageIndex = {pageIndex}
              total = {_.get(pagination, 'total')}
              onRemove = {this._handleDeleteUser}
              onAdd = {this._handleAddUser}
              showViewIcon = {false}
              onView = {this._handleViewUser}
              onEdit = {this._handleEditUser}
              onPagerChange = {this._handlePagerChange}
              showPager={!isAddRole}
              addable={isAddUser && userGroups.count() > 0 && !isAddRole }
              editable={isEditUser && !isAddRole}
              removable={isDeleteUser && !isAddRole}
              selectable={isAddUser && !isAddRole || isDeleteUser && !isAddRole}
            />
          </Paper>
        </NavigationContainer>
        <RoleManagementDialog
          ref='roleMgt'
          {...other}
          account={account}
          value={roleInfo}
          mode={roleMode}
          onClearActive={this._handleClearActive}
          onFetchUserGroups={this.fetchUserGroups}
        />
        <UserManagementDialog
          ref='userMgt'
          {...other}
          account={account}
          user={user}
          role={roleInfo}
          mode={userMode}
          onFetchUsers={this.findUsers}
          onCloseDialog={this._handleCloseUserDialog}
          open={userOpen}
        />
        {this.renderDeleteUserDialog()}
        {this.renderDeleteRoleDialog(roleInfo)}
      </div>
    );
  },

  findUsers(pagination, groupId){
    if(pagination === null) { pagination = this.state.pagination; }
    if(_.isFunction(this.props.findUsersByUserGroup)){
      this.props.findUsersByUserGroup(pagination, groupId)
    }
  },

  getUsersList(data){
    let users = _.get(data.toJS(), 'entries', []);
    let arr = [];
    for(let user of users){
      arr.push({
        _id: user._id,
        name: _.get(user, ['name', 'surname'], '') + ' ' + _.get(user, ['name', 'givenName'], ''),
        email: user.username,
        role: _.get(this.state.roleInfo, 'name'),
        dateUpdate: moment(user.dateUpdate).format('YYYY-MM-DD'),
        position: user.position,
        __v: user.__v,
        fullName: _.get(user, 'name'),
      });
    };
    return arr;
  },

  fetchUserGroups(){
    if(_.isFunction(this.props.findUserGroupsByOwner)){
      this.props.findUserGroupsByOwner(this.state.positionId);
    }
    if(_.isFunction(this.props.fetchMe)) { this.props.fetchMe() };
  },

  _handlePagerChange(pageIndex, pageSize){
    let pagination = Object.assign({},this.state.pagination,{
      cursor: ( pageIndex - 1 >= 0 ? pageIndex - 1 : 0 ) * pageSize,
      size: pageSize
    });
    pagination.hasNext = true;
    this.findUsers(pagination, this.state.active);
    this.setState({
      isFetching: true,
      pagination: pagination,
      pageIndex: pageIndex
    });
  },

  _handleClearActive(){
    if(this.props.userGroups.count() > 0){
      let userGroups = _.get(this.props.userGroups.toJS(), 'entries');
      this.setState({
        active: userGroups[0]._id,
        roleInfo: userGroups[0],
      });
    }else{
      this.setState({active: null, roleInfo: {}});
    }
  },

  _handleAddRole() {
    if(!_.get(this.props.user.getAccountManagement(), 'addRole')) return;
    this.setState({roleMode: 'ADD', roleInfo: {}}, () => {
      this.refs.roleMgt.show();
    });
  },

  _handleEdit(event, group){
    if(!_.get(this.props.user.getAccountManagement(), 'editRole')) return;
    this.setState({roleMode: 'EDIT', roleInfo: group}, () => {
      this.refs.roleMgt.show()
    });
  },

  _handleDelete(event,group){
    if(!_.get(this.props.user.getAccountManagement(), 'deleteRole')) return;
    this.setState({roleInfo: group, active: group._id, deleteRoleOpen: true});
  },

  _handleDeleteUser(userIndex){
    this.setState({userIndex},() => {
      this.refs.deleteUser.show();
    });
  },

  _handleConfirmDeleteRole(group) {
    if(_.isFunction(this.props.removeUserGroupById)){
      this.props.removeUserGroupById.promise(this.state.roleInfo._id, this.state.roleInfo.__v)
      .then(res=>{
        if(res.status == 'OK'){
          this.fetchUserGroups();
        }
      });
    }
    this.setState({deleteRoleOpen: false});
  },

  _handleConfirmDeleteUser() {
    let { users, removeUsersAndWithPositionByIds } = this.props;
    let data = this.getUsersList(users);

    let ids = [];
    _.forEach(this.state.userIndex, index => {
      ids.push(data[index]._id);
    });

    let pagination = {
      query: {

      },
      cursor: 0,
      size: 10,
      total: 0,
    };

    if(_.isFunction(removeUsersAndWithPositionByIds)){
      removeUsersAndWithPositionByIds.promise(ids)
      .then((res)=>{
        if(res.status === 'OK'){
          this.findUsers(pagination, this.state.active);
        }
      }).catch(err=>{
        console.log(err);
      });
    }
    this.refs.deleteUser.close();
  },

  _handleCloseDeleteDialog(type) {
    if(type === 'user') { this.refs.deleteUser.close(); }
    if(type === 'role') { this.setState({deleteRoleOpen: false}); }
  },

  _handleCloseUserDialog() {
    this.setState({userOpen: false});
  },

  _handleAddUser(){
    this.setState({userMode: 'ADD', user: {}, userOpen: true});
  },

  _handleViewUser(){
    console.log('view user');
  },

  _handleEditUser(id, row){
    this.setState({userMode: 'EDIT', user:row, userOpen: true});
  },

  _onSubNavigationChange(ref, target) {
    this.setState({active: target});
    // console.log(target);
    //global.tools.toSubPath(`/account/account-management/${target}`);
  }

});

module.exports = AccountManagement;
