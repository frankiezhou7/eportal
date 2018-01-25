const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BaseForm = require('./baseForm');
const ErrorIcon = require('epui-md/svg-icons/alert/error');
const InfoIcon = require('epui-md/svg-icons/action/info');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const TextField = require('epui-md/TextField');
const Translatable = require('epui-intl').mixin;
const { getSubPath } = require('~/src/utils');
const TOKEN_MIN_LENGTH = 64;

const RestPassword = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ResetPassword/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    errorTextPassword: PropTypes.string,
    location: PropTypes.object,
    maxPassword: PropTypes.number,
    minPassword: PropTypes.number,
    nHintPassword: PropTypes.string,
    nHintPasswordConfirm: PropTypes.string,
    nLabelPassword: PropTypes.string,
    nLabelPasswordConfirm: PropTypes.string,
    nTextErrorPasswordLength: PropTypes.string,
    nTextErrorPasswordNotMatch: PropTypes.string,
    nTextErrorPasswordRequired: PropTypes.string,
    nTextResetPassword: PropTypes.string,
    nTextResetPasswordFail: PropTypes.string,
    nTextResetPasswordSuccess: PropTypes.string,
    nTextReturnToLogin: PropTypes.string,
    nTextTokenOutOfDate: PropTypes.string,
    resetPass: PropTypes.object,
    resetPassword: PropTypes.func,
    verifyLostPasswordToken: PropTypes.func,
    verifyToken: PropTypes.object,
  },

  getDefaultProps() {
    return {
      minPassword: 6,
      maxPassword: 64,
    };
  },

  getInitialState() {
    return {
      error: null,
      errorTextPassword: this.props.errorTextPassword,
      errorTextPasswordConfirm: null,
      password: '',
      valid: false,
    };
  },

  componentWillMount() {
    let query = this.props.location.query;
    if (!query) { return; }
    let username = query.username;
    let token = query.token;
    if (!username || !token || token.length < TOKEN_MIN_LENGTH) {
      this.setState({
        loading: false,
        valid: false,
      });

      return;
    }
    let { verifyLostPasswordToken } = this.props;

    if (_.isFunction(verifyLostPasswordToken)) {
      this.setState({
        username: username,
        token: token,
        loading: true,
      }, () => {
        verifyLostPasswordToken
          .promise(username, token)
          .then((res, rej) => {
            let {
              response: {
                valid,
              },
            } = res;

            this.setState({
              loading: false,
              valid: valid,
            });
          })
          .catch(() => {
            this.setState({
              loading: false,
              valid: false,
            });
          });
      });
    }
  },

  getStyles() {
    let {
      error,
      success,
      valid,
    } = this.state;
    let visible = valid ? (success ? 'visible' : (error ? 'visible' : 'hidden')) : (valid === undefined ? 'hidden' : 'visible');

    let styles = {
      root: {
      },
      errorIcon: {
        float: 'left',
        fill: '#f44336',
      },
      errorText: {
        display: 'inline-block',
        lineHeight: '24px',
        marginLeft: '5px',
      },
      infoIcon: {
        float: 'left',
        fill: '#2196f3',
      },
      password: {
        display: 'block',
        marginBottom: '20px',
        width: '300px',
      },
      passwordConfirm: {
        display: 'block',
        width: '300px',
      },
      resetPass: {
        marginTop: '30px',
      },
      subHeader: {
        marginTop: '20px',
        fontSize: '18px',
      },
      zone: {
        marginTop: '20px',
        color: success ? 'rgba(0, 0, 0, 0.87)' : '#f44336',
        visibility: visible,
        fontSize: '16px',
      },
    };

    return styles;
  },

  renderContent() {
    let {
      loading,
      success,
      valid,
    } = this.state;

    let disabled = !valid || success || loading;
    let errorText = valid ? (success ? this.t('nTextResetPasswordSuccess') : this.t('nTextResetPasswordFail')) : this.t('nTextTokenOutOfDate');
    let label = valid ? (success ? this.t('nTextReturnToLogin') : this.t('nTextResetPassword')) : this.t('nTextReturnToLogin');

    return (
      <div style={this.style('root')}>
        <TextField
          ref='password'
          key='1'
          disabled={disabled}
          errorText={this.state.errorTextPassword}
          floatingLabelText={this.t('nLabelPassword')}
          fullWidth={true}
          hintText={this.t('nHintPassword')}
          isWarning={true}
          onBlur={this._validatePassword}
          onChange={this._handleChangePassword}
          showIcon={true}
          style={this.style('password')}
          type='password'
          value={this.state.password}
        />
        <TextField
          ref='passwordConfirm'
          key='2'
          disabled={disabled}
          errorText={this.state.errorTextPasswordConfirm}
          floatingLabelText={this.t('nLabelPasswordConfirm')}
          fullWidth={true}
          hintText={this.t('nHintPasswordConfirm')}
          isWarning={true}
          onBlur={this._validatePasswordConfirm}
          onChange={this._validatePasswordConfirm}
          showIcon={true}
          style={this.style('passwordConfirm')}
          type='password'
        />
        <div style={this.style('zone')}>
          { success ? <InfoIcon style={this.style('infoIcon')} /> : <ErrorIcon style={this.style('errorIcon')} /> }
          <div style={this.style('errorText')}>
            {errorText}
          </div>
        </div>
        <div style={this.style('resetPass')}>
          <RaisedButton
            ref='resetPass'
            disabled={loading}
            label={label}
            primary={true}
            onTouchTap={this._handleTouchTapResetPassWord}
          />
        </div>
      </div>
    );
  },

  render() {
    let styles = this.getStyles();

    return (
      <BaseForm
        ref="baseForm"
        title={this.t('nTextResetPassword')}
        content={this.renderContent()}
      />
    );
  },

  _handleChangePassword(event, value) {
    this.setState({
      password: value,
    });
  },

  _handleTouchTapResetPassWord() {
    let {
      success,
      valid,
    } = this.state;

    if (valid && !success) {
      if (this._isValid()) {
        let {
          password,
          token,
          username,
        } = this.state;

        username = this._trim(username);
        password = this._trim(password);
        const { resetPassword } = this.props;

        if (_.isFunction(resetPassword)) {
          this.setState({
            loading: true,
          }, () => {
            resetPassword
              .promise(username, token, password)
              .then((res, rej) => {
                this.setState({
                  loading: false,
                  success: true,
                });
              })
              .catch(() => {
                this.setState({
                  loading: false,
                  success: false,
                });
              });
          });
        }
      }
    } else {
      let redirect = getSubPath('login');
      global.tools.toSubPath(redirect);
    }
  },

  _isValid() {
    let valid = this._validatePassword() && this._validatePasswordConfirm();

    return valid;
  },

  _validatePassword() {
    let pass = this.refs.password.getValue();
    let len = pass ? pass.length : 0;
    let errorText = null;

    if(len === 0) {
      errorText = this.t('nTextErrorPasswordRequired');
    } else if(len < this.props.minPassword || len > this.props.maxPassword) {
      errorText = _.template(this.t('nTextErrorPasswordLength'))(this.props);
    }

    this.setState({
      errorTextPassword: errorText,
    });

    return errorText === null;
  },

  _validatePasswordConfirm() {
    let pass = this.refs.password.getValue();
    let conf = this.refs.passwordConfirm.getValue();
    let errorText = null;

    if(pass !== conf) {
      errorText = this.t('nTextErrorPasswordNotMatch');
    }

    this.setState({
      error: null,
      errorTextPasswordConfirm: errorText,
    });

    return errorText === null;
  },

  _trim(str) {
    if (str) { str = str.replace(/[\r\n\t]/g, ''); }
    if (str) { str = str.replace(/ /g, ''); }

    return str;
  },
});

module.exports = RestPassword;
