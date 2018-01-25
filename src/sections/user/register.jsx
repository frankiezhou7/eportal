const React = require('react');
const _ = require('eplodash');
const BaseForm = require('./baseForm');
const FlatButton = require('epui-md/FlatButton');
const LoginInfo = require('./loginInfo');
const NotificationInfo = require('./notificationInfo');
const PersonalInfo = require('./personalInfo');
const PropTypes = React.PropTypes;
const SafeEmailAndMobile = require('./safeEmailAndMobile');
const ServiceContent = require('./serviceContent');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const UploadAvatar = require('./uploadAvatar');
const VerifyEmail = require('./verifyEmail');
const VerifyMobile = require('./verifyMobile');
const { getSubPath } = require('~/src/utils');

const Register = React.createClass({
  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/Register/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    birthDate: PropTypes.string,
    countryCode: PropTypes.string,
    email: PropTypes.string,
    errorCode: PropTypes.string,
    firstName: PropTypes.string,
    firstNameMaxLen: PropTypes.number,
    firstNameMinLen: PropTypes.number,
    gender: PropTypes.oneOf(['male', 'female']),
    lastName: PropTypes.string,
    lastNameMaxLen: PropTypes.number,
    lastNameMinLen: PropTypes.number,
    mobile: PropTypes.number,
    nErrorTextBirthDate: PropTypes.string,
    nErrorTextFirstName: PropTypes.string,
    nErrorTextLastName: PropTypes.string,
    nErrorTextNationality: PropTypes.string,
    nErrorTextWhenRegisterFail: PropTypes.string,
    nLabelAgree: PropTypes.string,
    nLabelDisagree: PropTypes.string,
    nTextAgreeButton: PropTypes.string,
    nTextDisagreeButton: PropTypes.string,
    nTextDropDownMenuAutoCompleted: PropTypes.string,
    nTextDropDownMenuAutoCompletedItem: PropTypes.string,
    nTextFirstNameLength: PropTypes.number,
    nTextLastNameLength: PropTypes.number,
    nTextLogin: PropTypes.string,
    nTextNext: PropTypes.string,
    nTextNoticeLoginInfo: PropTypes.string,
    nTextNoticeUrl: PropTypes.string,
    nTextPleaseInputContactInfo: PropTypes.string,
    nTextPleaseInputContactInfoDetail: PropTypes.string,
    nTextPleaseInputLoginInfo: PropTypes.string,
    nTextPleaseInputPersonalInfo: PropTypes.string,
    nTextPleaseInputPersonalInfoNotice: PropTypes.string,
    nTextPrev: PropTypes.string,
    nTextSkip: PropTypes.string,
    nTextTitle: PropTypes.string,
    nTextUploadAvatarNotice: PropTypes.string,
    percent: PropTypes.number,
    register: PropTypes.func,
    reset: PropTypes.func,
    sendCode: PropTypes.func,
    sendCodeToken: PropTypes.bool,
    sendVerificationEmailSuccess: PropTypes.bool,
    sender: PropTypes.string,
    sending: PropTypes.bool,
    step: PropTypes.string,
    updateUserInfo: PropTypes.func,
    username: PropTypes.string,
    verifing: PropTypes.bool,
    verifyCode: PropTypes.string,
    verifyMobileToken: PropTypes.bool,
    info: PropTypes.object,
    userEmergencyInfo: PropTypes.object,
  },

  getDefaultProps() {
    return {
      firstNameMaxLen: 64,
      firstNameMinLen: 1,
      lastNameMaxLen: 64,
      lastNameMinLen: 1,
      step: 'serviceContent',
    };
  },

  getInitialState() {
    let {
      birthDate,
      countryCode,
      email,
      firstName,
      gender,
      lastName,
      mobile,
      step,
    } = this.props;

    return {
      birthDate: birthDate,
      countryCode: countryCode,
      countryName: '',
      email: email,
      firstName: firstName,
      gender: gender,
      lastName: lastName,
      mobile: mobile,
      nErrorTextBirthDate: '',
      nErrorTextFirstName: '',
      nErrorTextLastName: '',
      nErrorTextNationality: '',
      nErrorTextWhenRegisterFail: null,
      step: step,
    };
  },

  componentWillReceiveProps(nextProps) {
    let info = nextProps.info;
    let { step, token } = this.state;
    let userEmergencyInfo = nextProps.userEmergencyInfo;

    if (info) {
      let loading = info.loading;
      if (loading) { return; }
      let name = info.username;
      let err = info.error;
      if (err) {
        this.setState({
          nErrorTextWhenRegisterFail: this.t('nErrorTextWhenRegisterFail'),
        });
      } else if (name && step === 'safeEmailAndMobile' && token !== 'prev') {
        this.setState({
          step: 'notificationInfo',
          nErrorTextWhenRegisterFail: null,
        });
      }
    }
  },

  getStyles() {
    let styles = {
      root: {},
      footer: {
        display: 'inline-block',
        float: 'right',
      },
      buttonMargin: {
        marginRight: '10px',
      },
      h2: {
        color: '#004588',
      },
      p: {
        margin: '10px 0',
        color: '#727272',
      },
    };

    return styles;
  },

  renderBody() {
    let props = this.props;
    let styles = this.getStyles();
    let body = {};

    let {
      errorCode,
      nTextAgreeButton,
      nTextDisagreeButton,
      nTextDropDownMenuAutoCompleted,
      nTextDropDownMenuAutoCompletedItem,
      nTextLogin,
      nTextNext,
      nTextNoticeUrl,
      nTextPleaseInputContactInfo,
      nTextPleaseInputContactInfoDetail,
      nTextNoticeLoginInfo,
      nTextPleaseInputLoginInfo,
      nTextPleaseInputPersonalInfo,
      nTextPleaseInputPersonalInfoNotice,
      nTextPrev,
      nTextSkip,
      nTextUploadAvatarNotice,
      percent,
      sendCode,
      sendCodeToken,
      sender,
      sending,
      sendVerificationEmailSuccess,
      verifing,
      verifyCode,
      verifyMobileToken,
    } = this.props;

    let {
      birthDate,
      countryCode,
      countryName,
      email,
      firstName,
      gender,
      lastName,
      mobile,
      nErrorTextBirthDate,
      nErrorTextFirstName,
      nErrorTextLastName,
      nErrorTextNationality,
      step,
      username,
      password,
    } = this.state;

    switch (step) {
      case 'serviceContent':
        body.content = (<ServiceContent />);
        body.footer = (
          <div style={styles.footer}>
            <FlatButton
              label={this.t('nTextDisagreeButton')}
              primary={true}
              style={styles.buttonMargin}
              onTouchTap={this._handleTouchTap.bind(null, 'serviceContent', 'disagree')}
            />
            <FlatButton
              label={this.t('nTextAgreeButton')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'serviceContent', 'agree')}
            />
          </div>
        );

        break;
      case 'loginInfo':
        body.content = (
          <div>
            <h2 style={styles.h2}>{this.t('nTextPleaseInputLoginInfo')}</h2>
            <p style={styles.p}>{this.t('nTextNoticeLoginInfo')}</p>
            <LoginInfo
              {...this.props}
              ref='loginInfo'
              username={username}
              password={password}
            />
          </div>
        );
        body.footer = (
          <div style={styles.footer}>
            <FlatButton
              label={this.t('nTextNext')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'loginInfo', 'next')}
            />
          </div>
        );

        break;
      case 'personalInfo':
        body.content = (
          <div>
            <h2 style={styles.h2}>{this.t('nTextPleaseInputPersonalInfo')}</h2>
            <p style={styles.p}>{this.t('nTextPleaseInputPersonalInfoNotice')}</p>
            <PersonalInfo
              ref='personalInfo'
              birthDate={birthDate}
              firstName={firstName}
              gender={gender}
              lastName={lastName}
              nErrorTextBirthDate={nErrorTextBirthDate}
              nErrorTextFirstName={nErrorTextFirstName}
              nErrorTextLastName={nErrorTextLastName}
              nErrorTextNationality={nErrorTextNationality}
              nTextDropDownMenuAutoCompleted={this.t('nTextDropDownMenuAutoCompleted')}
              nTextDropDownMenuAutoCompletedItem={this.t('nTextDropDownMenuAutoCompletedItem')}
              selectedName={countryName}
              selectedValue={countryCode}
              onBlur={this._handleBlur}
            />
          </div>
        );
        body.footer = (
          <div style={styles.footer}>
            <FlatButton
              label={this.t('nTextPrev')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'personalInfo', 'prev')}
              style={styles.buttonMargin}
            />
            <FlatButton
              label={this.t('nTextNext')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'personalInfo', 'next')}
            />
          </div>
        );

        break;
      case 'uploadAvatar':
        body.content = (
          <UploadAvatar
            ref='verifyAvatar'
            file={this.state.avatar}
            percent={percent}
            uploadAvatar={this._onUploadAvatar}
            nTextUploadAvatarNotice={this.t('nTextUploadAvatarNotice')}
          />
        );
        body.footer = (
          <div style={styles.footer}>
            <FlatButton
              label={this.t('nTextPrev')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'uploadAvatar', 'prev')}
              style={styles.buttonMargin}
            />
            <FlatButton
              label={this.t('nTextSkip')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'uploadAvatar', 'skip')}
              style={styles.buttonMargin}
            />
            <FlatButton
              label={this.t('nTextNext')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'uploadAvatar', 'next')}
            />
          </div>
        );

        break;
      case 'safeEmailAndMobile':
        body.content = (
          <div style={styles.root}>
            <h2 style={styles.h2}>{this.t('nTextPleaseInputContactInfo')}</h2>
            <p style={styles.p}>{this.t('nTextPleaseInputContactInfoDetail')}</p>
            <SafeEmailAndMobile
              ref='safeEmailAndMobile'
              nErrorTextWhenRegisterFail={this.state.nErrorTextWhenRegisterFail}
              safeEmail={email}
              safeMobile={mobile}
            />
          </div>
        );
        body.footer = (
          <div style={styles.footer}>
            <FlatButton
              label={this.t('nTextPrev')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'safeEmailAndMobile', 'prev')}
              style={styles.buttonMargin}
            />
            <FlatButton
              label={this.t('nTextNext')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'safeEmailAndMobile', 'next')}
            />
          </div>
        );

        break;
      case 'verifyEmail':
        body.content = (
          <VerifyEmail
            ref='verifyEmail'
            email={email}
            sender={sender}
            working={sendVerificationEmailSuccess}
            sendVerificationEmail={this._sendVerificationEmail}
          />
        );
        body.footer = (
          <div style={styles.footer}>
            <FlatButton
              label={this.t('nTextNext')}
              disabled={sendVerificationEmailSuccess}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'verifyEmail', 'next')}
            />
          </div>
        );

        break;
      case 'verifyMobile':
        body.content = (
          <VerifyMobile
            ref='verifyMobile'
            verifyCode={verifyCode}
            sendCode={sendCode}
            sendCodeToken={sendCodeToken}
            errorCode={errorCode}
            sending={sending}
            verifing={verifing}
            success={verifyMobileToken}
            mobile={mobile}
          />
        );
        body.footer = (
          <div style={styles.footer}>
            <FlatButton
              disabled={!verifyMobileToken}
              label={this.t('nTextNext')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'verifyMobile', 'next')}
            />
          </div>
        );

        break;
      case 'notificationInfo':
        body.content = (
          <NotificationInfo
            {...this.props}
            ref='notificationInfo'
            username={username}
            nTextNoticeUrl={nTextNoticeUrl}
          />
        );
        body.footer = (
          <div style={styles.footer}>
            <FlatButton
              label={this.t('nTextLogin')}
              primary={true}
              onTouchTap={this._handleTouchTap.bind(null, 'notificationInfo', 'login')}
            />
          </div>
        );

        break;
      default:
    }

    return body;
  },

  render() {
    let body = this.renderBody();

    let {
      nTextTitle,
    } = this.props;

    return (
      <BaseForm
        title={this.t('nTextTitle')}
        content={body.content}
        footer={body.footer}
      />
    );
  },

  _handleBlur(ref, val) {
    switch (ref) {
      case 'firstName':
        let firstName = val.firstName && val.firstName.trim();
        this._validateFirstName(firstName);
        break;
      case 'lastName':
        let lastName = val.lastName && val.lastName.trim();
        this._validateLastName(lastName);
        break;
      default:
    }
  },

  _handleTouchTap(step, token, e) {
    switch (step) {
      case 'serviceContent':
        if (token === 'disagree') {
          if (_.isFunction(global.tools.toSubPath)) {
            global.tools.toSubPath('/login');
          }
        } else if (token === 'agree') {
          this.setState({
            step: 'loginInfo',
          });
        }

        break;
      case 'loginInfo':
        if (token === 'next') {
          let loginInfoForm = this.refs.loginInfo;
          let loginInfo = loginInfoForm.getValue();

          if (loginInfo) {
            let username = loginInfo.username;
            username = this._trim(username);
            let password = loginInfo.password;
            password = this._trim(password);

            let user = {
              username: username,
              password: password,
            };

            let state = _.merge(user, { step: 'personalInfo' });

            this.setState(state);
          }
        }

        break;
      case 'personalInfo':
        if (token === 'next') {
          let personalInfoForm = this.refs.personalInfo;
          let personalInfo = personalInfoForm.getValue();

          let {
            firstName,
            lastName,
          } = personalInfo;

          if (personalInfo) {
            this.firstName = firstName && firstName.trim();
            this.lastName = lastName && lastName.trim();

            if (!this._validateFirstName(firstName) || !this._validateLastName(lastName)) { return; }

            step = 'uploadAvatar';
          }
        } else if (token === 'prev') {
          let personalInfoForm = this.refs.personalInfo;
          let personalInfo = personalInfoForm.getValue();
          let {
            firstName,
            lastName,
          } = personalInfo;

          if (personalInfo) {
            this.firstName = firstName && firstName.trim();
            this.lastName = lastName && lastName.trim();
          }
          step = 'loginInfo';
        }

        this.setState({
          firstName: this.firstName,
          lastName: this.lastName,
          step: step,
        });

        break;
      case 'uploadAvatar':
        if (token === 'next' || token === 'skip') {
          let fn = this.props.updateUserInfo;

          let {
            birthDate,
            countryCode,
            email,
            firstName,
            gender,
            lastName,
            mobile,
            userid,
          } = this.state;

          step = 'safeEmailAndMobile';
        } else if (token === 'prev') {
          step = 'personalInfo';
        }

        this.setState({
          step: step,
          token: token,
        });

        break;
      case 'safeEmailAndMobile':
        let safeEmailAndMobileForm = this.refs.safeEmailAndMobile;
        let safeEmailAndMobile = safeEmailAndMobileForm.getValue();

        if (safeEmailAndMobile) {
          this.email = safeEmailAndMobile.safeEmail;
          this.mobile = safeEmailAndMobile.safeMobile;
        }

        if (token === 'next') {
          if (!safeEmailAndMobile.safeEmailIsValid || !safeEmailAndMobile.safeMobileIsValid) { return; }

          let {
            avatar,
            username,
            password,
            firstName,
            lastName,
          } = this.state;

          let { register } = this.props;

          let user = {
            username: username,
            password: password,
            name: {
              surname: firstName,
              givenName: lastName,
            },
            emergencyEmail: this.email,
          };

          if (this.mobile && this.mobile.trim()) {
            user.emergencyMobile = this.mobile;
          }

          if (_.isFunction(register)) {
            register(user, avatar);
          }
        } else if (token === 'prev') {
          step = 'uploadAvatar';
        }

        this.setState({
          email: this.email,
          mobile: this.mobile,
          step: step,
          token: token,
        });

        break;
      case 'verifyEmail':
        if (token === 'next') {
          step = !!this.state.mobile ? 'verifyMobile' : 'notificationInfo';
        }
        this.setState({
          step: step,
        });

        break;
      case 'verifyMobile':
        if (token === 'next') {
          step = 'notificationInfo';
        }

        this.setState({
          step: step,
        });

        break;
      case 'notificationInfo':
        if (token === 'login') {
          let redirect = getSubPath('/login');
          global.tools.toSubPath(redirect);
        }

        break;
      default:
    }
  },

  _onUploadAvatar(file) {
    this.setState({
      avatar: file,
    });
  },

  _validateFirstName(firstName) {
    let {
      firstNameMaxLen,
      firstNameMinLen,
    } = this.props;
    let firstNameLen = firstName ? firstName.length : 0;
    let nErrorTextFirstName = null;
    if (firstNameLen === 0) {
      nErrorTextFirstName = this.t('nErrorTextFirstName');
    } else if (firstNameLen > firstNameMaxLen || firstNameLen < firstNameMinLen) {
      nErrorTextFirstName = _.template(this.t('nTextFirstNameLength'))(this.props);
    }

    this.setState({
      nErrorTextFirstName: nErrorTextFirstName,
    });

    return nErrorTextFirstName === null;
  },

  _validateLastName(lastName) {
    let {
      lastNameMaxLen,
      lastNameMinLen,
    } = this.props;
    let lastNameLen = lastName ? lastName.length : 0;
    let nErrorTextLastName = null;
    if (lastNameLen === 0) {
      nErrorTextLastName = this.t('nErrorTextLastName');
    } else if (lastNameLen > lastNameMaxLen || lastNameLen < lastNameMinLen) {
      nErrorTextLastName = _.template(this.t('nTextLastNameLength'))(this.props);
    }

    this.setState({
      nErrorTextLastName: nErrorTextLastName,
    });

    return nErrorTextLastName === null;
  },

  _sendVerificationEmail() {
    // TODO: send verification Email
  },

  _trim(str) {
    if (str) { str = str.replace(/[\r\n\t]/g, ''); }
    if (str) { str = str.replace(/ /g, ''); }

    return str;
  },
});

module.exports = Register;
