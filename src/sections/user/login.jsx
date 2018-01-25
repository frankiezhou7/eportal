const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Avatar = require('epui-md/Avatar');
const ClearFix = require('epui-md/internal/ClearFix');
const Colors = require('epui-md/styles/colors');
const EventListener = require('epui-md/internal/EventListener');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const RaisedButton = require('epui-md/RaisedButton');
const Visible = require('epui-md/svg-icons/action/visible');
const Invisible = require('epui-md/svg-icons/action/invisible');
const TextField = require('epui-md/TextField/TextField');
const Transitions = require('epui-md/styles/transitions');
const Translatable = require('epui-intl').mixin;
const keycode = require('keycode');
const { getSubPath } = require('~/src/utils');
let { logoff } = global.cli.user;
let { logout } = global.api.user;

const USER_NAME_PATTERN = new RegExp('^[A-Za-z0-9@_\\-\\.]*$');
const USER_EMAIL_PATTERN = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i);

require('./login-animation.css');

const Login = React.createClass({
  mixins: [AutoStyle, Translatable, PureRenderMixin],

  translations: [
    require(`epui-intl/dist/Login/${__LOCALE__}`),
    require(`epui-intl/dist/LoginInfo/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    available: PropTypes.object,
    errorText: PropTypes.string,
    fetchMe: PropTypes.func,
    initialize: PropTypes.func,
    initialized: PropTypes.bool,
    local: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    account: PropTypes.object,
    maxPassword: PropTypes.number,
    maxUsername: PropTypes.number,
    minPassword: PropTypes.number,
    minUsername: PropTypes.number,
    nButtonLogin: PropTypes.string,
    nButtonLogout: PropTypes.string,
    nLabelUserPassword: PropTypes.string,
    nLabelUserEmail: PropTypes.string,
    nTextArentYou: PropTypes.string,
    nTextErrorPasswordRequired: PropTypes.string,
    nTextErrorUseremailRequired: PropTypes.string,
    nTextErrorWhenError: PropTypes.string,
    nTextErrorWhenLoginFail: PropTypes.string,
    nTextForgotPassword: PropTypes.string,
    nTextNotRegistered: PropTypes.string,
    nTextPreparingUser: PropTypes.string,
    nTextNotReviewed: PropTypes.string,
    nTextWelcomeYou: PropTypes.string,
    redirectTo: PropTypes.string,
    reset: PropTypes.func,
    submit: PropTypes.func,
    user: PropTypes.object,
    username: PropTypes.string,
    usernameChange: PropTypes.func,
    working: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      isLoginSuccess: false,
      maxPassword: 64,
      maxUsername: 64,
      minPassword: 6,
      minUsername: 6,
      redirectTo: global.tools.getSubPath('/'),
      working: false,
    };
  },

  getInitialState() {
    return {
      errorText: null,
      errorTextPassword: null,
      errorTextUsername: null,
      inputusername: null,
      showPassword: false,
      isActionUser: true,
    };
  },

  componentWillMount() {
    const {
      fetchMe,
      initialized,
    } = this.props;

    if(!initialized) {
      fetchMe();
    }
  },

  componentDidMount() {
    const { initialize, account } = this.props;
    // 登录页面加载成功后，初始化 Redux Store 中的数据
    if (_.isFunction(initialize)) {
      initialize();
    }

    if(this.isLoggingOut()) { return; }

    if(!this.isLoadingUser() && this.isLoggedIn()) {
      return this.redirect(account);
    }
  },

  componentWillReceiveProps(nextProps) {
    if(this.isLoggingOut(nextProps)) { return; }
    if(this.isLoadingUser(nextProps)) { return; }
    if(this.isLoadingAccount(nextProps)) { return; }

    let local = nextProps.local;
    let animateAvatar = this.props.local.get('photoURL') !== local.get('photoURL');
    this.setState({
      animateAvatar: animateAvatar,
    });

    let error = local.get('error');
    let errCode = error && error.code;
    let errMsg = null;

    if(errCode) {
      errMsg = this._getErrMsg(errCode);
      this.setState({
        errorTextPassword: errMsg,
      });
      return;
    }

    if(this.isLoggedIn(nextProps) && !this.hasPosition(nextProps)) {
      //console.log(nextProps.account.organization.verifyStatus)
      this.setState({
        errorText: this.t('nTextNoPositionFound')
      });
      return;
    }

    if(this.isLoggedIn(nextProps) && this.hasPosition(nextProps)) {

      if(this.checkAccount(nextProps)){
        let user = nextProps.user;
        let acc = nextProps.account;

        debug(`用户(${user._id})已登录: 职位ID=${user.position._id}, 组=${user.position.group.name}, 用户账户=${acc.name}, 账户类型=${acc.types.toJS().join(', ')}`);
        if(this.hasLoggedIn) {
          this.hasLoggedIn = false;
          this.redirect(acc);
        }
      }
    }

    this.focusUsername() || this.focusPassword();
  },

  componentDidUpdate() {
    // this.focusUsername() || this.focusPassword();
  },

  isInited(props) {
    return (props || this.props).initialized;
  },

  isLoggingOut(props) {
    return (props || this.props).loggingOut;
  },

  isLoadingUser(props) {
    props = props || this.props;
    return props.user ? !!props.user.getMeta('loading') : false;
  },

  isLoggedIn(props) {
    props = props || this.props;
    return !!props.user && !props.user.isAnonymous();
  },

  hasPosition(props) {
    props = props || this.props;
    let user = props.user;
    return user ? !!user.position : false;
  },

  isLoadingAccount(props) {
    props = props || this.props;
    let acc = props.account;
    return acc ? !!acc.getMeta('loading') : false;
  },

  checkAccount(props) {
    props = props || this.props;
    let acc = props.account;
    let isLoading = acc && acc.getMeta('loading');
    if(acc) {
      let flag = _.get(acc, ['organization','verifyStatus'], 1);
      let isActionUserFlag = flag === 1 ? true : false;
      this.setState({
        isActionUser: isActionUserFlag
      });
      if(!isActionUserFlag) { return false; }
      if(acc._id && isActionUserFlag) {
        if(_.isUndefined(this.hasLoggedIn))
        this.hasLoggedIn = true;
        return true;
      }

      this.setState({
        errorText: this.t('nTextNoPositionFound'),
      });
      return false;
    }

    let user = props.user;
    let pos = user.position;
    let grp = pos && pos.group;
    acc = grp && grp.account;
    if(_.isString(acc)) { props.findAccountById(acc); }
    if(_.isObject(acc)) { props.findAccountById(acc._id); }
    return false;
  },

  isQuick(props) {
    props = props || this.props;
    return props.local.get('quick');
  },

  redirect(account) {
    let isCompleted = _.get(account.toJS(), ['organization', 'type']) === 'ByComplete' || !_.get(account.toJS(), ['organization', 'type']) || account.isOther();
    if(!isCompleted) {
      global.tools.toSubPath('complete-company-information');
      return;
    }
    global.tools.toSubPath(this.props.redirectTo, true);
  },

  getStyles() {
    let theme = this.context.muiTheme;

    let styles = {
      root: {
        margin: '136px auto auto',
        width: '330px',
        height: '610px',
        overflow: 'hidden',
      },
      container: {
        paddingTop: '12px',
        width: '260px',
        height: '88px',
        boxSizing: 'border-box',
        position: 'relative',
      },
      paper: {
        margin: '0px auto',
        padding: '30px 30px 30px 30px',
        // width: '320px',
      },
      login: {
        width: '256px',
      },
      loginContainer: {
        width: '260px',
      },
      loginButton: {
        marginTop: '10px',
        minWidth: '100%',
      },
      loginButtonCase: {
        textTransform: 'capitalize'
      },
      logoContainer: {
        margin: '0px auto 38px',
        width: '139px',
        height: '136px',
      },
      avatarContainer: {
        margin: '0 auto',
        width: '100%',
        height: '80px',
        textAlign: 'center',
      },
      avatar: {
      },
      avatarAnimated: {
        animationName: 'loginAvatar',
        animationDuration: '500ms',
      },
      helpContainer: {
        float: 'right',
        marginTop: '14px',
        maxWidth: '200px',
        overflow: 'hidden',
      },
      a: {
        retrieve: {
          color: '#004588',
          textDecoration: 'none',
          cursor: 'pointer',
        },
        reset: {
          color: '#F5A623',
          display: 'block',
          textDecoration: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          wordBreak: 'keep-all',
        },
      },
      unregistered: {
        color: Colors.amberA400,
      },
      welcome: {
        display: 'inline-block',
        margin: '40px auto 20px',
        width: '260px',
        textAlign: 'center',
        color: '#212121',
        fontSize: '18px',
        lineHeight: '25px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordBreak: 'keep-all',
      },
      welcomeContainer: {
        width: '260px',
        height: '88px',
        boxSizing: 'border-box',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordBreak: 'keep-all',
      },
      reloadEaseOut: {
        transform: 'translateX(-260px)',
        opacity: 0,
        transition: Transitions.easeOut('1500ms', 'opacity', '200ms') + ', ' +
                    Transitions.easeOut('1500ms', 'transform', '200ms'),
      },
      usernameContainer: {
        width: '260px',
        height: '88px',
      },
      username: {
        marginTop: '24px',
      },
      reloadusernameEaseOut: {
        transform: 'translateX(-260px)',
        opacity: 1,
        transition: Transitions.easeOut('1500ms', 'opacity', '200ms') + ', ' +
                    Transitions.easeOut('1500ms', 'transform', '200ms'),
      },
      overflow: {
        overflow: 'hidden',
      },
      preparing: {
        textAlign: 'center',
        fontSize: '16px'
      },
      errorMessage: {
        color: theme.palette.errorColor,
        marginBottom: 10,
      },
      visible: {
        width: 18,
        height: 18,
        color: '#004588',
        display: this.state.showPassword === false ? 'inline-block' : 'none',
        cursor: 'pointer',
      },
      invisible: {
        width: 18,
        height: 18,
        color: '#004588',
        display: this.state.showPassword === true ? 'inline-block' : 'none',
        cursor: 'pointer',
      },
      visibleContainer: {
        position: 'absolute',
        right: 0,
        top : 55,
      },
      slogan: {
        color: '#004588',
        textTransform: 'uppercase',
        fontSize: 26,
        fontWeight: '500',
        paddingLeft: 15,
        marginBottom: 40,
      },
    };

    if(this.state.animateAvatar) {
      styles.avatar = _.merge(styles.avatar, styles.avatarAnimated);
    }

    return styles;
  },

  renderError() {
    let err = this.props.errorText || this.state.errorText;

    return err ? (
      <div style={this.style('errorMessage')}>
        {err}
      </div>
    ) : null;
  },

  renderAvatar() {
    // if(!this.isInited() || this.isLoggedIn()) { return null; }
    if(this.isLoggedIn()) { return null; }

    return (
      <div style={this.style('avatarContainer')}>
        <Avatar
          src={this.props.local.get('photoURL')}
          size={80}
          style={this.style('avatar')}
        />
      </div>
    );
  },

  renderUsername() {
    // if(!this.isInited() || this.isLoggedIn()) { return null; }
    if(this.isLoggedIn()) { return null; }

    let username = this.props.local.get('username');

    return this.isQuick() ? (
      <div style={this.style('welcomeContainer')}>
        <p style={this.style('welcome')} title={username}>{this.t('nTextWelcomeYou')}{username}</p>
      </div>
    ) : (
      <div style={this.style('usernameContainer')}>
        <TextField
          ref='username'
          key='username'
          defaultValue={username}
          disabled={this.isLoadingUser()}
          errorText={this.state.errorTextUsername}
          floatingLabelText={this.t('nLabelUserEmail')}
          fullWidth={true}
          onChange={this._validateUsername}
          onBlur={this._onFinishUsername}
          style={this.style('username')}
        />
      </div>
    );
  },

  focusUsername() {
    if(this.refs.username) {
      this.refs.username.focus();
      return true;
    }
    return false;
  },

  renderLogo() {
    return (
      <div style={this.style('logoContainer')} >
        <img src={require('~/src/app/images/logo.svg')} />
      </div>
    );
  },

  renderPassword() {
    // if(!this.isInited() || this.isLoggedIn()) { return null; }
    if(this.isLoggedIn()) { return null; }

    return this.isLoggedIn() ? null : (
      <div style={this.style('container')}>
        <TextField
          ref='password'
          key='password'
          type={ this.state.showPassword === true ? 'text' : 'password' }
          disabled={this.isLoadingUser()}
          errorText={this.state.errorTextPassword}
          floatingLabelText={this.t('nLabelUserPassword')}
          fullWidth={true}
          width='88%'
          onChange={this._validatePassword}/>
        <div style={this.style('visibleContainer')}>
          <Invisible
            style={this.style('invisible')}
            onClick={this._handleShowPassword}
          />
          <Visible
            style={this.style('visible')}
            onClick={this._handleShowPassword}
          />
        </div>
      </div>
    );
  },

  focusPassword() {
    if(this.refs.password) {
      this.refs.password.focus();
      return true;
    }
    return false;
  },

  renderHelper() {
    // if(!this.isInited() || this.isLoggedIn()) { return null; }
    if(this.isLoggedIn()) { return null; }

    return this.isLoggedIn() ? null : (
      <div style={this.style('helpContainer')}>
        <a
          style={this.style('a.retrieve')}
          onTouchTap={this._retrieve}
        >
          {this.t('nTextForgotPassword')}
        </a>
      </div>
    );
  },

  renderPostHelper() {
    // if(!this.isInited() || this.isLoggedIn()) { return null; }
    if(this.isLoggedIn()) { return null; }

    let username = this.props.local.get('username');
    let nTextArentYou = this.t('nTextArentYou');
    let title = `${nTextArentYou}${username}?`;

    return !this.isLoggedIn() ?
    this.isQuick() ? (
      <a
        style={this.style('a.reset')}
        onClick={this._reset}
        title={title}
      >
        {title}
      </a>
    ) : (
      <a
        style={this.style('a.reset')}
        onClick={this._register}
      >
        {this.t('nTextNotRegistered')}
      </a>
    ) : null;
  },

  renderButton() {
    let loading = this.isLoadingUser();
    let loggedIn = this.isLoggedIn();

    return (
      <RaisedButton
        backgroundColor='#004588'
        disabled={ loading }
        fullWidth={true}
        label={ !loggedIn ? this.t('nButtonLogin') : this.t('nButtonLogout') }
        primary={ loggedIn }
        secondary={ !loggedIn }
        style={this.style('loginButton')}
        labelStyle={this.style('loginButtonCase')}
        onClick={this._handleClick}
      />
    );
  },

  renderAction() {
    if(this.isLoggingOut()) {
      return (
        <div style={this.style('preparing')}>
          正在登出...
        </div>
      );
    }
//Your user account has not been approved, please wait a moment
    // if(!this.isInited() || (this.isLoggedIn() && this.hasPosition()) || this.isLoadingAccount()) {
    if((this.isLoggedIn() && this.hasPosition()) || this.isLoadingAccount()) {
      let flag = _.get(this.props.account && this.props.account.toJS(),['organization','verifyStatus'],1);
      let self = this;
      if(flag === 0){
        setTimeout(function(){
          if(_.isFunction(logout)){
            logout();
          }
          if(_.isFunction(logoff)){
            logoff();
          }
          //this.t('nTextNoPositionFound') = null;
          self.setState({
            errorText: null,
            errorTextUsername: null,
            isActionUser: true,
          });
        }, 3000)
      }
      let content;
      if(flag === 1){
        content = this.t('nTextPreparingUser');
      }

      if(flag === 0){
        content = this.t('nTextNotReviewed');
      }

      return (
        <div style={this.style('preparing')}>
          {content}
        </div>
      );
    }

    return (
      <ClearFix>
        { this.renderError() }
        <div style={this.style('loginContainer')}>
          { this.renderHelper() }
          { this.renderButton() }
          <div style={this.style('helpContainer')}>
            { this.renderPostHelper() }
          </div>
        </div>
      </ClearFix>
    );
  },

  render() {
    return(
      <EventListener
        target={window}
        onKeyUp={this._handleWindowKeyUp}
      >
        <ClearFix>
          <div style={this.style('root')}>
            {/*{ this.renderLogo() }*/}
            <div style={this.style('slogan')}>ALL PORTS, ONE E-PORTS</div>
            <div style={this.style('paper')}>
              { this.renderAvatar() }
              { this.renderUsername() }
              { this.renderPassword() }
              { this.renderAction() }
            </div>
          </div>
        </ClearFix>
      </EventListener>
    );
  },

  _handleShowPassword() {
    this.setState({showPassword:!this.state.showPassword});
  },

  _handleClick() {
    if(!this._checkAvailability()) { return; }

    this.setState({ errorText: null });

    let {
      login,
      logout,
      user,
    } = this.props;

    if(!user || user.isAnonymous()) {
      let username = this._getUsername();
      username = this._trim(username);
      let password = this.refs.password.getValue();
      password = this._trim(password);

      if (_.isFunction(login)) {
        login(username, password);
      }
    } else if (_.isFunction(logout)) {
      logout();
    }
  },

  _getErrMsg(errCode) {
    let errMsg = this.t('nTextErrorWhenError');

    switch (errCode) {
      case 'LOGIN_FAILED':
        errMsg = this.t('nTextErrorWhenLoginFail');
        break;
      case 'USER_IS_BANNED':
        errMsg = this.t('nTextErrorWhenLoginBanned');
        break;
      case 'USER_IS_LOCKED':
        errMsg = this.t('nTextErrorWhenLoginLocked');
        break;
      default:
    }

    return errMsg;
  },

  _getUsernameNode() {
    return this.refs.username && this.refs.username.getDOMNode();
  },

  _getPasswordNode() {
    return this.refs.password && this.refs.password.getDOMNode();
  },

  _handleWindowKeyUp(e) {
    if (keycode(e) === 'enter') {
      this._handleClick();
    }
  },

  _getUsername() {
    return this.refs.username ? this.refs.username.getValue() : this.props.local.get('username');
  },

  _validateUsername() {
    let username = this._getUsername();
    username = username && username.trim();
    let len = username ? username.length : 0;
    let state = {
      errorTextUsername: null,
    };

    if(len === 0) {
      state.errorTextUsername = this.t('nTextErrorUseremailRequired');
    }else if(!USER_EMAIL_PATTERN.test(username)) {
      state.errorTextUsername = this.t('nTextErrorUsernameIsInvalid');
    }

    this.setState(state);

    return state.errorTextUsername === null;
  },

  _validatePassword() {
    let password = this.refs.password.getValue();
    password = password && password.trim();
    let len = password ? password.length : 0;
    let state = {
      errorTextPassword: null
    };

    if(len === 0) {
      state.errorTextPassword = this.t('nTextErrorPasswordRequired');
    } else if(len < this.props.minPassword || len > this.props.maxPassword) {
      state.errorTextPassword = _.template(this.t('nTextErrorPasswordLength'))(this.props);
    }

    this.setState(state);

    return state.errorTextPassword === null;
  },

  _onFinishUsername() {
    if(!this._validateUsername()) { return; }

    let newName = this.refs.username.getValue();
    if(this.state.inputusername !== newName) {
      if(_.isFunction(this.props.usernameChange)) {
        this.props.usernameChange(newName);
      }
      this.setState({
        inputusername: newName
      });
    }
  },

  _checkAvailability() {
    let { user } = this.props;
    let { errorTextUsername, errorTextPassword } = this.state;
    if(user && !user.isAnonymous()) { return true; }

    let valid = this._validateUsername() && this._validatePassword();

    let name = this.refs.username;
    let pass = this.refs.password;
    if(errorTextUsername) {
      return name.focus();
    }
    if(errorTextPassword) {
      return pass.focus();
    }

    return valid;
  },

  _reset() {
    // if(this.refs.username) {
    //   this.refs.username.clearValue();
    // }
    // this.refs.password.clearValue();

    this.setState({
      inputusername: null,
      errorTextUsername: null,
      errorTextPassword: null,
    });

    if(_.isFunction(this.props.reset)) {
      this.props.reset();
    }
  },

  _register() {
    global.tools.toSubPath('/reg');
  },

  _retrieve() {
    global.tools.toSubPath('/retrieve');
  },

  _trim(str) {
    if (str) { str = str.replace(/[\r\n\t]/g, ''); }
    if (str) { str = str.replace(/ /g, ''); }

    return str;
  },
});


module.exports = Login;
