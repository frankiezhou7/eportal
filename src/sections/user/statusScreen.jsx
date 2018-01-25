const React = require('react');
const PropTypes = React.PropTypes;
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const CommonForm = require('./commonForm');
const Translatable = require('epui-intl').mixin;
const ThemeManager = require('~/src/styles//theme-manager');
const RaisedButton = require('epui-md/RaisedButton');
const BlueRawTheme = require('~/src/styles//raw-themes/blue-raw-theme');
const ActionViewSuccess = require('epui-md/svg-icons/action/view-success');
const ScreenMixin = require('~/src/mixins/screen');
const EpAppBar = require('~/src/shared/ep-app-bar');
const WhiteLogo = require('~/src/statics/' + __LOCALE__ + '/css/logo-white.svg');
const { getSubPath } = require('~/src/utils');
const { verifyActionEmailToken, updateUserStatus, resendActivationEmail } = global.api.user;
const TOKEN_MIN_LENGTH = 64;

const activeEmailSuccess = React.createClass({
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
  propTypes: {
    location: PropTypes.object,
    children: PropTypes.element,
    nTextActiveTokenSuccess: PropTypes.string,
    nTextActiveTokenNot: PropTypes.string,
    nTextSendRemind: PropTypes.string,
    nTextHeading: PropTypes.string,
  },
  contextTypes: {
  	muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme)
    };
  },
  getDefaultProps() {
    return {

    }
  },
  getInitialState() {
    return {
      username: '',
      valid: false,
      passed: false,
      resendActiveState: false
    }
  },
  getStyles() {
    let styles = {
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
        marginTop: '60px'
      },
      linkIcon: {
        width: '100px',
        height: '100px',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: '#004588',
        paddingTop: '80px'
      },
      linkRemind: {
        color: 'rgba(0,0,0, 0.87)',
        fontSize: '16px',
        marginBottom: '40px'
      }
    };

    return styles;
  },
  componentWillMount(){
    let query = this.props.location.query;
    if (!query) { return; }
    let username = query.username;
    let token = query.token;
    let passState = {
      normal: true,
      locked: false,
    }
    if (!username || !token || token.length < TOKEN_MIN_LENGTH) {
      this.setState({
        valid: false,
      });
      return;
    }
    verifyActionEmailToken.promise(username, token).then(res => {
      let {
        response: {
          valid,
          passed,
        },
      } = res;
      this.setState({
        valid: valid,
        passed: passState[passed],
        username: username
      });
    }, err => {
      console.log(err);
    }).catch(() => {
      this.setState({
        valid: false,
      });
    })
  },
  renderSuccess(){
    let style = this.getStyles();
    return(
      <div style={style.textCenter}>
        <ActionViewSuccess style={style.linkIcon} />
      <p style={style.linkRemind}>{this.t('nTextActiveTokenSuccess')}</p>
      </div>
    )
  },
  renderError(){
    let style = this.getStyles();
    return this.state.passed === true ? (
      <div style={_.assign(style.textCenter, style.marginTop)}>
        <p style={style.linkRemind}>{this.t('nTextActiveTokenNotNormall')} </p>
      </div>
    ) : (
      <div style={_.assign(style.textCenter, style.marginTop)}>
        <p style={style.linkRemind}>{this.t('nTextActiveTokenNot')} </p>
        <RaisedButton
          label={this.t('nTextSendRemind')}
          secondary={true}
          disabled={this.state.resendActiveState}
          capitalized="capitalized"
          onClick={this._resendActivationEmail}
        />
      </div>
    )
  },
  render(){
    let logo = <img style={this.style('logo')} src={WhiteLogo} />;
    let valid = this.state.valid;
    let style = this.getStyles();
    return(
      <div style={this.style('root')}>
        <EpAppBar
          showMenuIconButton={false}
          leftNode={logo}
          leftNodeStyles = {this.style('leftNode')}
        />
        <div style={this.style('background')}>
          <div style={{marginTop: '60px'}}>
            <CommonForm title={this.t('nTextHeading')} content={valid? this.renderSuccess() : this.renderError()} />
          </div>
        </div>
      </div>
    )
  },
  componentWillUpdate(nextProps, nextState){
    this.setPageTitle("Activation Success");
    if(nextState.valid){
      let status = 'normal';
      updateUserStatus.promise(nextState.username, status).then(res => {
        setTimeout(function(){
          let redirect = getSubPath('/login');
          global.tools.toSubPath(redirect);
        }, 3000)
      }, err => {
        console.log(err)
      })
    }
    if(nextState.passed){
      setTimeout(function(){
        let redirect = getSubPath('/login');
        global.tools.toSubPath(redirect);
      }, 3000)
    }
  },

  _resendActivationEmail(){
    let username = this.state.username;
    resendActivationEmail.promise(username).then(res => {
      this.setState({
        resendActiveState: true
      })
    }, err => {
      console.log(err)
    })
  },
})

module.exports = activeEmailSuccess
