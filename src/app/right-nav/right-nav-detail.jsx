const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const List = require('epui-md/List/List');
const ListItem = require('epui-md/List/ListItem');
const Person = require('epui-md/svg-icons/social/person');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const AccountManagementIcon = require('epui-md/svg-icons/ep/account-manage');
const UnLockIcon = require('epui-md/svg-icons/ep/unlock');
const DomainIcon = require('epui-md/svg-icons/social/domain');
const PersonIcon = require('epui-md/svg-icons/ep/person');
const Translatable = require('epui-intl').mixin;

const RightNavDetail = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Navigation/${__LOCALE__}`),
    require(`epui-intl/dist/ChangePassword/${__LOCALE__}`),
  ],

  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  propTypes: {
    nTextNavigationAccountInfo: PropTypes.string,
    nTextAccountManagement: PropTypes.string,
    nTextLogout: PropTypes.string,
    onLogout: PropTypes.func,
    user: PropTypes.object,
    account: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getStyles() {
    let styles = {
      root: {
        position: 'relative',
        width: '100%',
        maxWidth: '256px',
        height: 'calc(100% - 200px)',
        overflowY: 'scroll',
      },
      list: {
        root: {
        },
        item: {
        },
        innerDiv:{
          paddingLeft: 56,
        }
      },
      icon:{
        fill: this.context.muiTheme.epColor.primaryColor,
      },
      logout: {
        marginTop: '2px',
        width: '100%',
        height: '48px',
        textAlign: 'center',
      },
      logoutBtn: {
        width: '100%',
        marginTop: 100,
      },
      dialog: {
        contentStyle: {
          width: '400px',
        },
      },
    };

    return styles;
  },

  render() {
    let user = this.props.user.toJS();
    let isAdmin = this._isOrdinary() && (_.includes(_.get(user, ['position', 'group', 'admins'], []), _.get(user, ['position', '_id'])) || _.get(user, 'isSuperAdmin') === true);
    return (
      <div style={this.style('root')}>
        <List style={this.style('list.root')}>
          <ListItem
            ref={(ref) => this.accountManagement = ref}
            leftIcon={<AccountManagementIcon style = {this.style('icon')}/>}
            primaryText={this.t('nTextAccountManagement')}
            style={_.assign({}, this.style('list.item'),{display: isAdmin ? 'block' : 'none'})}
            innerDivStyle = {this.style('list.innerDiv')}
            onTouchTap={this._handleTouchTapListItem.bind(this,'account-management')}
          />
          <ListItem
            ref={(ref) => this.companyInfo = ref}
            leftIcon={<DomainIcon style = {this.style('icon')}/>}
            primaryText={this.t('nTextCompanyInformation')}
            style={_.assign({}, this.style('list.item'),{display: isAdmin ? 'block' : 'none'})}
            innerDivStyle = {this.style('list.innerDiv')}
            onTouchTap={this._handleTouchTapListItem.bind(this,'company-information')}
          />
          <ListItem
            ref={(ref) => this.userProfile = ref}
            leftIcon={<PersonIcon style = {this.style('icon')}/>}
            primaryText={this.t('nTextUserProfile')}
            style={this.style('list.item')}
            innerDivStyle = {this.style('list.innerDiv')}
            onTouchTap={this._handleTouchTapListItem.bind(this,'user-profile')}
          />
          <ListItem
            ref={(ref) => this.changePassword = ref}
            leftIcon={<UnLockIcon style = {this.style('icon')}/>}
            primaryText={this.t('nTextChangePassword')}
            style={this.style('list.item')}
            innerDivStyle = {this.style('list.innerDiv')}
            onTouchTap={this._handleTouchTapListItem.bind(this,'change-password')}
          />
        </List>
        <div style={this.style('logout')}>
          <RaisedButton
            ref={(ref) => this.logout = ref}
            label={this.t('nTextLogout')}
            primary={true}
            style={this.style('logoutBtn')}
            onTouchTap={this._handleTouchTap}
          />
        </div>
      </div>
    );
  },

  _isOrdinary(){
    let { account } = this.props;
    let isConsigner = account.isConsigner();
    let isConsignee = account.isConsignee();
    return _.compact([isConsigner,isConsignee]).length === 1;
  },

  _handleConfirm() {
    let fn = this.props.onLogout;
    if (_.isFunction(fn)) { fn(); }
  },

  _handleTouchTap() {
    let { closeRightNav } = global.cli.navigation;
    let globalConfirm = global.epConfirm;
    if (_.isFunction(closeRightNav)) {
      closeRightNav();
    }

    let content = this.t('nTextExitSystem');
    let title = this.t('nTitleConfirmToExit');
    let onConfirm = this._handleConfirm;
    if (globalConfirm) { globalConfirm(content, title, onConfirm); }
  },

  _handleTouchTapListItem(target){
    global.tools.toSubPath(`/account/${target}`);
    this._close();
  },

  _close(){
    let { closeRightNav } = global.cli.navigation;
    if (_.isFunction(closeRightNav)) { closeRightNav(); }
  },

});

module.exports = RightNavDetail;
