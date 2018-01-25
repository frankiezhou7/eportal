const React = require('react');
const _ = require('eplodash');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;

const MAX_PASSWORD_LEN = 64;
const MAX_USER_NAME_LEN = 64;
const MIN_PASSWORD_LEN = 6;
const MIN_USER_NAME_LEN = 6;
const USER_NAME_PATTERN = '^[A-Za-z0-9@_\\-\\.]*$';

const LoginInfo = React.createClass({
  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/LoginInfo/${__LOCALE__}`),

  propTypes: {
    available: PropTypes.object,
    errorCodeVerifyUsername: PropTypes.string,
    errorTextPassword: PropTypes.string,
    errorTextUsername: PropTypes.string,
    maxPassword: PropTypes.number,
    maxUsername: PropTypes.number,
    minPassword: PropTypes.number,
    minUsername: PropTypes.number,
    nHintPassword: PropTypes.string,
    nHintPasswordConfirm: PropTypes.string,
    nHintUsername: PropTypes.string,
    nLabelPassword: PropTypes.string,
    nLabelPasswordConfirm: PropTypes.string,
    nLabelUsername: PropTypes.string,
    nTextErrorPasswordLength: PropTypes.string,
    nTextErrorPasswordNotMatch: PropTypes.string,
    nTextErrorPasswordRequired: PropTypes.string,
    nTextErrorUsernameInvalid: PropTypes.string,
    nTextErrorUsernameLength: PropTypes.string,
    nTextErrorUsernameRequired: PropTypes.string,
    nTextErrorUsernameUsed: PropTypes.string,
    password: PropTypes.string,
    regexUsername: PropTypes.string,
    userExists: PropTypes.func,
    username: PropTypes.string,
    usernameEditable: PropTypes.bool,
    verifyUsername: PropTypes.func,
    verifyUsernameSuccess: PropTypes.bool,
    wrapperStyle: PropTypes.object,
  },

  getDefaultProps() {
    return {
      maxPassword: MAX_PASSWORD_LEN,
      maxUsername: MAX_USER_NAME_LEN,
      minPassword: MIN_PASSWORD_LEN,
      minUsername: MIN_USER_NAME_LEN,
      regexUsername: USER_NAME_PATTERN,
      usernameEditable: true,
    };
  },

  getInitialState() {
    let {
      errorTextPassword,
      errorTextUsername,
      username,
      password,
    } = this.props;

    return {
      errorTextUsername: errorTextUsername,
      errorTextPassword: errorTextPassword,
      errorTextPasswordConfirm: null,
      password: password || '',
      passwordConfirm: password || '',
      username: username || '',
      verifingUsername: false,
    };
  },

  componentWillMount() {
    this.regexUsername = new RegExp(this.props.regexUsername);
  },

  componentWillReceiveProps(nextProps) {
    let available = nextProps.available;
    let loading = available ? available.loading : false;
    if (loading) { return; }
    if (available) {
      let errorText = available.exists ? this.t('nTextErrorUsernameUsed') : null;
      this.setState({
        errorTextUsername: errorText,
        verifingUsername: false,
      });
    }
  },

  getStyles() {
    let styles = {
      root: {
        paddingTop: '10px',
        width: '380px',
        height: '338px',
        boxSizing: 'border-box',
      },
      textField: {
        float: 'left',
        marginBottom: '10px',
      },
    };

    return styles;
  },

  getValue() {
    if(this._isValid()) {
      let username = this.refs.username.getValue();
      let password = this.refs.password.getValue();

      return {
        username: username,
        password: password,
      };
    }

    return null;
  },

  render() {
    let styles = this.getStyles();

    let {
      nHintPassword,
      nHintPasswordConfirm,
      nHintUsername,
      nLabelPassword,
      nLabelUsername,
      nLabelPasswordConfirm,
      usernameEditable,
      wrapperStyle,
      ...other,
    } = this.props;

    let {
      errorTextPassword,
      errorTextPasswordConfirm,
      errorTextUsername,
      password,
      passwordConfirm,
      username,
    } = this.state;

    return (
      <div style={this.mergeAndPrefix(styles.root, wrapperStyle)}>
        <TextField
          ref='username'
          key='name'
          disabled={!usernameEditable}
          errorText={errorTextUsername}
          floatingLabelText={this.t('nLabelUsername')}
          fullWidth={true}
          hintText={this.t('nHintUsername')}
          isWarning={true}
          showIcon={true}
          style={styles.textField}
          onChange={this._handleChangeUserName}
          onBlur={this._handleBlurUsername}
          value={username}
        />
        <TextField
          ref='password'
          key='pass'
          errorText={errorTextPassword}
          floatingLabelText={this.t('nLabelPassword')}
          fullWidth={true}
          hintText={this.t('nHintPassword')}
          isWarning={true}
          showIcon={true}
          style={styles.textField}
          type='password'
          onChange={this._handleChangePassword}
          onBlur={this._validatePassword}
          value={password}
        />
        <TextField
          ref='passwordConfirm'
          key='passConfirm'
          errorText={errorTextPasswordConfirm}
          floatingLabelText={this.t('nLabelPasswordConfirm')}
          fullWidth={true}
          hintText={this.t('nHintPasswordConfirm')}
          isWarning={true}
          showIcon={true}
          style={styles.textField}
          type='password'
          onChange={this._handlePasswordConfirm}
          onBlur={this._validatePasswordConfirm}
          value={passwordConfirm}
        />
      </div>
    );
  },

  _validateUsername() {
    let errorText = null;
    let username = this.refs.username.getValue();
    let len = username ? username.length : 0;

    if(len === 0) {
      errorText = this.t('nTextErrorUsernameRequired');
    } else if(len < this.props.minUsername || len > this.props.maxUsername) {
      errorText = _.template(this.t('nTextErrorUsernameLength'))(this.props);
    } else if(!this.regexUsername.test(username)) {
      errorText = this.t('nTextErrorUsernameInvalid');
    }

    this.setState({
      errorTextUsername: errorText,
    });

    return errorText === null;
  },

  _handleChangePassword(event, value) {
    this.setState({
      password: value,
    }, () => {
      this._validatePassword();
    });
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

  _handlePasswordConfirm(event, value) {
    this.setState({
      passwordConfirm: value,
    }, () => {
      this._validatePasswordConfirm();
    });
  },

  _validatePasswordConfirm() {
    let pass = this.refs.password.getValue();
    let conf = this.refs.passwordConfirm.getValue();
    let errorText = null;

    if(pass !== conf) {
      errorText = this.t('nTextErrorPasswordNotMatch');
    }

    this.setState({
      errorTextPasswordConfirm: errorText,
    });

    return errorText === null;
  },

  _handleChangeUserName(event, value) {
    this.setState({
      username: value,
    }, () => {
      this._validateUsername();
    });
  },

  _handleBlurUsername() {
    if(!this._validateUsername()) { return; }

    let username = this.refs.username.getValue();
    let fn = this.props.userExists;

    if(!this.state.verifingUsername && _.isFunction(fn)) {
      this.setState({
        verifingUsername: true,
      }, fn(username));
    }
  },

  _isValid() {
    let available = this.props.available;

    if (available) {
      if (available.exists) {
        return false;
      }
    }

    return this._validateUsername() && this._validatePassword() && this._validatePasswordConfirm();
  },
});

module.exports = LoginInfo;
