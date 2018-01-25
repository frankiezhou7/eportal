const React = require('react');
const _ = require('eplodash');
const ErrorIcon = require('epui-md/svg-icons/alert/error');
const RaisedButton = require('epui-md/RaisedButton');
const InfoIcon = require('epui-md/svg-icons/action/info');
const Snackbar = require('epui-md/Snackbar');
const TextField = require('epui-md/TextField');
const { getSubPath } = require('~/src/utils');
const PropTypes = React.PropTypes;
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const ChangePassword = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/ChangePassword/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    changePass: PropTypes.object,
    changePassword: PropTypes.func,
    close: PropTypes.func,
    errorTextPassword: PropTypes.string,
    maxPassword: PropTypes.number,
    minPassword: PropTypes.number,
    nTextChangePassword: PropTypes.string,
    nTextChangePasswordFail: PropTypes.string,
    nTextPasswordError: PropTypes.string,
    nTextPasswordAlreadyUsed: PropTypes.string,
    nTextChangePasswordSuccess: PropTypes.string,
    nTextClose: PropTypes.string,
    nTextReturnToLogin: PropTypes.string,
    open: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      open: false,
      minPassword: 6,
      maxPassword: 64,
    };
  },

  getInitialState() {
    return {
      error: null,
      errorTextPassword: this.props.errorTextPassword,
      errorTextPasswordConfirm: null,
      success: false,
    };
  },

  getStyles() {
    let {
      error,
      success,
    } = this.state;
    let visible = success ? 'visible' : (error ? 'visible' : 'hidden');

    let styles = {
      root: {
        paddingTop: 20,
      },
      errorIcon: {
        float: 'left',
        fill: '#f44336',
      },
      infoIcon: {
        float: 'left',
        fill: '#2196f3',
      },
      errorText: {
        display: 'inline-block',
        lineHeight: '24px',
        marginLeft: '5px',
      },
      password: {
        display: 'block',
        marginBottom: '10px',
        width: '500px',
      },
      passwordConfirm: {
        display: 'block',
        marginBottom: '10px',
        width: '500px',
      },
      changePass: {
        marginTop: '15px',
        marginRight: '-15px',
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

  render() {
    let {
      loading,
      success,
      message,
    } = this.state;

    let {
      changePass,
    } = this.props;

    let errorText = success ? this.t('nTextChangePasswordSuccess') : message ? message : this.t('nTextChangePasswordFail');
    let labelConfirm = this.t('nTextSave');

    return (
      <div style={this.style('root')}>
        <TextField
          ref='oldPassword'
          key={0}
          disabled={loading}
          errorText={this.state.errorTextOldPassword}
          floatingLabelText={this.t('nLabelOldPassword')}
          fullWidth={true}
          hintText={this.t('nHintOldPassword')}
          isWarning={true}
          showIcon={true}
          style={this.style('password')}
          type='password'
          onChange={this._validateOldPassword}
          onBlur={this._validateOldPassword}
        />
        <TextField
          ref='newPassword'
          key={1}
          disabled={loading}
          errorText={this.state.errorTextPassword}
          floatingLabelText={this.t('nLabelNewPassword')}
          fullWidth={true}
          hintText={this.t('nHintNewPassword')}
          isWarning={true}
          showIcon={true}
          style={this.style('passwordConfirm')}
          type='password'
          onChange={this._validatePassword}
          onBlur={this._validatePassword}
        />
        <TextField
          ref='newPasswordConfirm'
          key={2}
          disabled={loading}
          errorText={this.state.errorTextPasswordConfirm}
          floatingLabelText={this.t('nLabelNewPasswordConfirm')}
          fullWidth={true}
          hintText={this.t('nHintNewPasswordConfirm')}
          isWarning={true}
          showIcon={true}
          style={this.style('passwordConfirm')}
          type='password'
          onChange={this._validatePasswordConfirm}
          onBlur={this._validatePasswordConfirm}
        />
        <div style={this.style('changePass')}>
           <RaisedButton
              ref='changePass'
              disabled={loading}
              label={labelConfirm}
              secondary={true}
              capitalized = {'Capitalize'}
              style={this.style('btnConfirm')}
              onTouchTap={this._handleTouchTapChangePassword}
            />
        </div>
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={5000}
          onRequestClose={this._handleRequestClose}
        />
      </div>
    );
  },

  _handleTouchTapChangePassword() {
    if (this._isValid()) {
      let oldPassword = this.refs.oldPassword.getValue();
      let password = this.refs.newPassword.getValue();

      oldPassword = this._trim(oldPassword);
      password = this._trim(password);
      let changePassword = this.props.changePassword;

      if (_.isFunction(changePassword)) {
        this.setState({
          loading: true,
          success: false,
        });

        changePassword
          .promise(oldPassword, password)
          .then(({ status, errorCode }, rej) => {
            let success = true;
            let message = this.t('nTextChangePasswordSuccess');
            let open = true;
            let loading =false;
            this.setState({ open, loading, message, success });
          })
          .catch((err) => {
            let errorCode = err.code;
            let message = errorCode ? this.t('nText'+_. upperFirst(_.camelCase(errorCode))) : this.t('nTextChangePasswordFail');
            this.setState({
              error: true,
              open : true,
              loading: false,
              success: false,
              message: message
            });
          });
      }
    }
  },

  _isValid() {
    let valid = this._validateOldPassword() && this._validatePassword() && this._validatePasswordConfirm();
    return valid;
  },

  _validateOldPassword() {
    let oldPass = this.refs.oldPassword.getValue();
    let len = oldPass ? oldPass.length : 0;
    let errorText = null;

    if (len === 0) {
      errorText = this.t('nErrorTextOldPasswordRequired');
    }

    this.setState({
      errorTextOldPassword: errorText,
    });

    return errorText === null;
  },

  _validatePassword() {
    let pass = this.refs.newPassword.getValue();
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
    let pass = this.refs.newPassword.getValue();
    let conf = this.refs.newPasswordConfirm.getValue();
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

  _handleRequestClose(){
    this.setState({
      open:false,
      message: null
    });
  },
});

module.exports = ChangePassword;
