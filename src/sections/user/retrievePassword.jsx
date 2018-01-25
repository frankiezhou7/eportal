const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const CommonForm = require('./commonForm');
const EventListener = require('epui-md/internal/EventListener');
const KeyCode = require('keycode');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const TextField = require('epui-md/TextField');
const Translatable = require('epui-intl').mixin;
const ClearFix = require('epui-md/internal/ClearFix');
const { getSubPath } = require('~/src/utils');

const SAFE_EMAIL_REGEXP = new RegExp('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$', 'i');

const RetrievePassword = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/LoginInfo/${__LOCALE__}`),
    require(`epui-intl/dist/ResetPassword/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },

  propTypes: {
    maxUsername: PropTypes.number,
    minUsername: PropTypes.number,
    nErrorTextAccountRequired: PropTypes.string,
    nErrorTextError: PropTypes.string,
    nErrorTextLoginFail: PropTypes.string,
    nErrorTextUserNotFound: PropTypes.string,
    nTextAccount: PropTypes.string,
    nTextInformation: PropTypes.string,
    nTextNeedToRetrieveAccount: PropTypes.string,
    nTextRetrievePassword: PropTypes.string,
    nTextRetrieveLoginPassword: PropTypes.string,
    nTextRetrieveLoginPasswordForget: PropTypes.string,
    nTextRetrievePasswordWithEmail: PropTypes.string,
    nTextReturnAndLogin: PropTypes.string,
    retrieve: PropTypes.object,
    sendLostPasswordToken: PropTypes.func,
  },

  getDefaultProps() {
    return {
      maxUsername: 64,
      minUsername: 6,
    };
  },

  getInitialState() {
    return {
      doing: false,
      error: null,
      errorText: null,
      email: null,
      ttl: null,
      token: false,
    };
  },

  // componentWillReceiveProps(nextProps) {
  //   let retrieve = nextProps.retrieve;
  //   let err = retrieve ? retrieve.getMeta('error') : false;
  //   let loading = retrieve ? retrieve.getMeta('loading') : false;
  //
  //   if (loading) { return; }
  //
  //   if (err) {
  //     this.setState({
  //       errorText: this.t('nErrorTextLoginFail'),
  //       email: null,
  //       ttl: null,
  //     });
  //
  //     return;
  //   }
  //
  //   let email = retrieve && retrieve.get('email');
  //   let ttl = retrieve && retrieve.get('ttl');
  //
  //   this.setState({
  //     errorText: null,
  //     email: email,
  //     token: true,
  //     ttl: ttl,
  //     doing: false,
  //   });
  // },

  getStyles() {
    let styles = {
      root: {
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
      },
      capitalize: {
        textTransform: 'capitalize',
      }
    };

    return styles;
  },

  renderContent() {
    let {
      doing,
      email,
      errorText,
      token,
      ttl,
    } = this.state;
    let style = this.getStyles();

    let {
      retrieve,
    } = this.props;

    let validPeriod = ttl ? ttl / 60 : null;
    let info = this.t('nTextInformation', { email: email, validPeriod: validPeriod });

    let retrieveEl = (
      <div style={_.assign(this.style('textCenter'), this.style('marginTop'))}>
        <div style={this.style('setP')}>
          {this.t('nTextNeedToRetrieveAccount')}
        </div>
        <div style={_.assign(style.setPwdText, style.itemHeight)}>
          <ClearFix>
            <TextField
              ref='account'
              fullWidth={true}
              disabled={!!doing}
              errorText={errorText}
              floatingLabelText={this.t('nTextAccount')}
              loading={doing}
              style={this.style('retrieve.account')}
              onBlur={this._handleBlur}
              onChange={this._handleChange}
            />
          </ClearFix>
        </div>
        <RaisedButton
          ref='retrieve'
          label={this.t('nTextResetBtn')}
          secondary={true}
          disabled={!!doing}
          labelStyle={_.assign(this.style('setPwdLabel'), this.style('capitalize'))}
          onTouchTap={this._handleTouchTap}
        />
      </div>
    );

    let retrieveSuccessEl = (
      <div style={_.assign(this.style('textCenter'), this.style('marginTop'))}>
        <div style={this.style('setP')}>
          {info}
        </div>
        <div style={this.style('setP')}>
          {this.t('nTextLoginEmailToAuthenticate')}
        </div>
        <div style={this.style('marginTop')}>
          <RaisedButton
            ref='redirect'
            label={this.t('nTextReturnAndLogin')}
            secondary={true}
            labelStyle={this.style('capitalize')}
            onTouchTap={this._handleTouchTapRedirect}
          />
        </div>
      </div>
    );

    return token ? retrieveSuccessEl : retrieveEl;
  },

  render() {
    let styles = this.getStyles();

    let {
      nTextAccount,
      nTextNeedToRetrieveAccount,
      nTextRetrievePassword,
      nTextRetrieveLoginPassword,
      nTextRetrieveLoginPasswordForget,
    } = this.props;

    return (
      <div
        ref="root"
        style={this.style('root')}
      >
        <EventListener
          target={window}
          onKeyUp={this._handleWindowKeyUp}
        >
          <CommonForm
            ref="baseForm"
            title={this.t('nTextRetrieveLoginPasswordForget')}
            content={this.renderContent()}
          />
        </EventListener>
      </div>
    );
  },

  _handleBlur(e) {
    let username = e.target.value;
    this._validateUserName(username);
  },

  _handleChange(e) {
    let username = e.target.value;
    this._validateUserName(username);
  },

  _handleTouchTap() {
    let el = this.refs.account;
    let username = el.getValue();

    if (!this._validateUserName(username)) {
      el.focus();
      return;
    }

    this.setState({
      doing: true,
    }, () => {
      api.user.sendLostPasswordToken.promise(username).then(res => {
        this.setState({
          errorText: null,
          email: res.response.email,
          token: true,
          ttl: res.response.ttl,
          doing: false,
        })
      }, err => {
        this.setState({
          errorText: this.t('nErrorTextLoginFail'),
          email: null,
          token: false,
          ttl: null,
          doing: false,
        });
      });
    });
  },

  _handleTouchTapRedirect() {
    this.context.router.push(getSubPath('/login'));
  },

  _handleWindowKeyUp(e) {
    if (e.keyCode === KeyCode.ENTER && !this.state.token) {
      this._handleTouchTap();
    }
  },

  _trim(str) {
    if (str) { str = str.replace(/[\r\n\t]/g, ''); }
    if (str) { str = str.replace(/ /g, ''); }

    return str;
  },

  _validateUserName(username) {
    username = this._trim(username);
    let len = username ? username.length : 0;
    let errorText = null;

    if (!username) {
      errorText = this.t('nErrorTextAccountRequired');
    } else if(!SAFE_EMAIL_REGEXP.test(username)) {
      errorText = this.t('nErrorPasswordIsInvalid');
    }

    this.setState({
      errorText: errorText,
    });

    return errorText === null;
  },
})

module.exports = RetrievePassword;
