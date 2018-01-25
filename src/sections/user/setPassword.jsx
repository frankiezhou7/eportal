const React = require('react');
const PropTypes = React.PropTypes;
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const CommonForm = require('./commonForm');
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;
const ThemeManager = require('~/src/styles//theme-manager');
const BlueRawTheme = require('~/src/styles//raw-themes/blue-raw-theme');
const TextField = require('epui-md/TextField/TextField');
const ActionViewSuccess = require('epui-md/svg-icons/action/view-success');
const ClearFix = require('epui-md/internal/ClearFix');
const ScreenMixin = require('~/src/mixins/screen');
const EpAppBar = require('~/src/shared/ep-app-bar');
const WhiteLogo = require('~/src/statics/' + __LOCALE__ + '/css/logo-white.svg');
const { verifyLostPasswordToken, resetPassword, logout } = global.api.user;
let { logoff } = global.cli.user;
const TOKEN_MIN_LENGTH = 64;

const setPassword = React.createClass({
  mixins: [AutoStyle, ScreenMixin, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/Register/${__LOCALE__}`),
  ],

  childContextTypes: {
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },
  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme)
    };
  },
  propTypes: {
    location: PropTypes.object,
    setPwdUsername: PropTypes.string,
    setPwdEmail: PropTypes.string,
    nSavePsdWelcome: PropTypes.string,
    nSavePsdTips: PropTypes.string,
    nSavePsdRemind: PropTypes.string,
    nErrorPasswordIsInvalid: PropTypes.string,
    nSavePsdToken: PropTypes.string,
    nTextPassword: PropTypes.string,
    nTextSavePsd: PropTypes.string,
    nTextSetPsdHeading: PropTypes.string,
    nErrorPasswordRequired: PropTypes.string,
    nErrorPasswordIsInvalid: PropTypes.string,
    passwordMinLen: PropTypes.number,
    passwordMaxLen: PropTypes.number,
  },
  getDefaultProps() {
    return {
      setPwdUsername: "Username",
      setPwdEmail: "User Email",
      passwordMaxLen: 64,
      passwordMinLen: 6,
    }
  },
  getInitialState() {
    let query = this.props.location.query;
    return {
      errorTextSetPassword: null,
      username: query.username,
      token: query.token,
      valid: false,
    }
  },

  componentWillMount(){
    let query = this.props.location.query;
    if (!query) { return; }
    if (_.isFunction(logout)) {
      logout();
    }
    if (_.isFunction(logoff)) {
      logoff();
    }
    let username = query.username;
    let token = query.token;
    if (!username || !token || token.length < TOKEN_MIN_LENGTH) {
      this.setState({
        valid: false,
      });
      return;
    }
    verifyLostPasswordToken.promise(username, token).then(res => {
      let {
        response: {
          valid,
        },
      } = res;
      this.setState({
        valid: valid
      });
    }).catch(() => {
      this.setState({
        valid: false,
      });
    })
  },

  getStyles() {
    return {
      root: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
      },
      background: {
        width: '100%',
        height: '100%',
        minWidth: '400px',
        minHeight: '800px',
        // backgroundImage: 'url(' + require(`~/src/statics/${__LOCALE__}/css/bg.png`) + ')',
        backgroundImage: `url('${require('~/src/shared/pic/background.svg')}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 100%',
        backgroundColor: '#fff',
        zoom: 1,
      },
      logo: {
        marginTop: 12,
      },
      leftNode:{
        position: 'absolute',
        top: 6,
      },
      textCenter: {
        textAlign: 'center'
      },
      marginTop: {
        marginTop: '40px'
      },
      itemHeight: {
        height: '90px',
      },
      setP: {
        margin: '0',
        color: 'rgba(0,0,0,0.87)',
        fontSize: '16px',
        lineHeight: '24px'
      },
      setRemind: {
        paddingTop: '20px',
        color: 'rgba(245,166,35,1)',
        fontSize: '14px',
        fontWeight: '100'
      },
      setError: {
        paddingTop: '20px',
        color: 'red',
        fontSize: '14px',
        fontWeight: '100',
      },
      setPwdText: {
        width: '330px',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginBottom: '40px',
        textAlign: 'left'
      },
      setPwdLabel: {
        fontSize: '16px',
        fontWeight: '100'
      }
    }
  },

  renderContent(style) {
    let { valid, username } = this.state;
    return (
      <div style={_.assign(style.textCenter, style.marginTop)}>
        <p style={style.setP}>{this.t('nSavePsdWelcome')}, {username}</p>
        <p style={style.setP}>{this.t('nSavePsdTips')}, {username}</p>
        <p style={style.setP}>{valid && this.t('nSavePsdRemind')}</p>
      <p style={valid ? style.setRemind : style.setError}>{valid ? _.template(this.t('nErrorPasswordIsInvalid'))(this.props) : this.t('nSavePsdToken')}</p>
        {valid && this.renderPassword(style)}
      </div>
    )
  },

  renderPassword(style){
    return (
      <div>
        <div style={_.assign(style.setPwdText, style.itemHeight)}>
        <ClearFix>
          <TextField
            ref='setPassword'
            key='setPassword'
            type='password'
            fullWidth={true}
            errorText={this.state.errorTextSetPassword}
            floatingLabelText={this.t('nTextPassword')}
            onChange={this._validateSetPassword}
            onBlur={this._onFinishSetPassword}
          />
        </ClearFix>
        </div>
        <RaisedButton
          label={this.t('nTextSavePsd')}
          secondary={true}
          labelStyle={style.setPwdLabel}
          capitalized="capitalized"
          onClick={this._setPasswordSendClick}
        />
      </div>
    )
  },

  render(){
    let body = {};
    let logo = <img style={this.style('logo')} src={WhiteLogo} />;
    let style = this.getStyles();

    body.title = this.t('nTextSetPsdHeading');
    body.content = this.renderContent(style);

    return(
      <div style={this.style('root')}>
        <EpAppBar
          showMenuIconButton={false}
          leftNode={logo}
          leftNodeStyles = {this.style('leftNode')}
        />
        <div style={this.style('background')}>
          <div style={{marginTop: '60px'}}>
            <CommonForm title={body.title} content={body.content} />
          </div>
        </div>
      </div>
    )
  },

  _validateCommonSetPassword(){
    let setPassword = this.refs.setPassword.getValue().trim();
    if(setPassword == ""){
      this.setState({
        errorTextSetPassword: this.t('nErrorPasswordRequired')
      })
    }else if(setPassword.length < this.props.passwordMinLen || setPassword.length > this.props.passwordMaxLen) {
      this.setState({
        errorTextSetPassword: _.template(this.t('nErrorPasswordIsInvalid'))(this.props)
      })
    }else {
      this.setState({
        errorTextSetPassword: null
      })
    }
  },
  _validateSetPassword(){
    this._validateCommonSetPassword()
  },

  _onFinishSetPassword(){
    this._validateCommonSetPassword()
  },

  _setPasswordSendClick(){
    let password = this.refs.setPassword.getValue().trim();
    if(password == ""  || this.state.errorTextSetPassword !== null){
      this.refs.setPassword.focus()
    }else {
      if(this.state.valid && _.isFunction(resetPassword)){
        resetPassword.promise(this.state.username, this.state.token, password)
        .then(res => {
          if(res.status === 'OK') {
            global.tools.toSubPath('login');
          }
        })
        .catch(err => {

        })
      }
    }
  }
})

module.exports = setPassword;
