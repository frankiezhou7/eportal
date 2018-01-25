const React = require('react');
const PropTypes = React.PropTypes;
const _ = require('eplodash');
const CommonForm = require('./commonForm');
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;
const ThemeManager = require('~/src/styles//theme-manager');
const EventListener = require('epui-md/internal/EventListener');
const BlueRawTheme = require('~/src/styles//raw-themes/blue-raw-theme');
const TextField = require('epui-md/TextField/TextField');
const RadioButton = require('epui-md/RadioButton');
const Visible = require('epui-md/svg-icons/action/visible');
const Invisible = require('epui-md/svg-icons/action/invisible');
const RadioButtonGroup = require('epui-md/RadioButton/RadioButtonGroup');
const ActionViewSuccess = require('epui-md/svg-icons/action/view-success');
const ClearFix = require('epui-md/internal/ClearFix');
const Checkbox = require('epui-md/Checkbox');
const Dialog = require('epui-md/ep/Dialog/Dialog');
const ServerDialog = require('./serverDialog');
const keycode = require('keycode');
const { userExists, enroll, resendActivationEmail } = global.api.user;


const SAFE_EMAIL_REGEXP = new RegExp('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$', 'i');

const Reg = React.createClass({
  mixins: [Translatable],

  translations: require(`epui-intl/dist/Register/${__LOCALE__}`),

  childContextTypes: {
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme)
    };
  },
  propTypes: {
    setPwdUsername: PropTypes.string,
    setPwdEmail: PropTypes.string,
    nTextHeading: PropTypes.string,
    nTextCompany: PropTypes.string,
    nErrorCompanyRequired: PropTypes.string,
    nLabelRoleTitle: PropTypes.string,
    nLabelRolePrincipal: PropTypes.string,
    nLabelRoleAgent: PropTypes.string,
    nLabelRolePrincipalRemind: PropTypes.string,
    nLabelRoleAgentRemind: PropTypes.string,
    nErrorTextRole: PropTypes.string,
    nTextCompanyEmail: PropTypes.string,
    nErrorCompanyEmailRequired: PropTypes.string,
    nErrorCompanyEmailIsInvalid: PropTypes.string,
    nTextPassword: PropTypes.string,
    nErrorPasswordRequired: PropTypes.string,
    nErrorPasswordIsInvalid: PropTypes.string,
    nLabelServer: PropTypes.string,
    nTextButtonSend: PropTypes.string,
    passwordMinLen: PropTypes.number,
    passwordMaxLen: PropTypes.number,
  },
  getDefaultProps() {
    return {
      setPwdUsername: "Username",
      setPwdEmail: "User Email",
      passwordMaxLen: 12,
      passwordMinLen: 6,
    }
  },
  getInitialState() {
    return {
      step: 'infoEntering',
      errorTextCompany: null,
      errorTextCompanyEmail: null,
      errorTextPassword: null,
      roleMessageRemind: "",
      roleTips: null,
      serverDialogShow: false,
      serverCheck: true,
      errorTextSetPassword: null,
      email: 'yourname@email.com',
      userExists: false,
      showPassword: false,
      isResendEmail: true,
    }
  },
  getStyles() {
    return {
      textCenter: {
        textAlign: 'center'
      },
      createBtn: {
        marginLeft: 'auto',
        marginRight: 'auto'
      },
      createBtnLabel: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: 'normal',
        textTransform: 'capitalize'
      },
      itemHeight: {
        height: '90px',
        position: 'relative',
      },
      roleTitle: {
        marginTop: '0',
        fontSize: '16px',
        color: 'rgba(0,0,0, 0.38)'
      },
      radio: {
        float: 'left',
        width: '140px'
      },
      radioLabel: {
        fontSize: '16px',
        textTransform: 'capitalize'
      },
      radioIcon: {
        marginRight: '10px',
        color: '#5A5A5A'
      },
      radioRemind: {
        marginTop: '5px',
        marginBottom: '0',
        color: '#F5A623',
        fontSize: '14px',
        lineHeight: '20px',
        fontWeight: '300'
      },
      radiotips: {
        fontSize: '12px',
        color: 'rgb(244, 67, 54)',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
      },
      serverCheck: {
        width: '20px',
        float: 'left'
      },
      serverTerm: {
        float: 'left',
        marginLeft: '-10px',
        paddingTop: '3px',
        color: '#004588',
        fontSize: '16px',
        fontWeight: '400'
      },
      serverMargin: {
        marginTop: '14px',
        marginBottom: '54px'
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
        fontSize: '16px'
      },
      linkSend: {
        color: '#004588',
        textTransform: 'capitalize',
        fontSize: '16px',
        cursor: 'pointer'
      },
      linkSendFalse: {
        color:  '#ccc',
        cursor: 'auto',
      },
      margintop: {
        marginTop: '44px'
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
        right: 10,
        top : 38,
        backgroundColor: '#fff'
      },
    }
  },

  readerCompany(){
    let style = this.getStyles();
    return (
      <div style={style.itemHeight}>
        <TextField
          ref='company'
          key='company'
          errorText={this.state.errorTextCompany}
          floatingLabelText={this.t('nTextCompany')}
          fullWidth={true}
          onBlur={this._onFinishCompany}
        />
      </div>
    )
  },
  readerCheckbox(){
    let style = this.getStyles();
    return (
      <ClearFix>
        <p style={style.roleTitle}>{this.t('nLabelRoleTitle')}</p>
        <ClearFix>
          <RadioButtonGroup name="radioGroup" onChange={this._radioClick} ref='radioGroup'>
            <RadioButton value={this.t('nLabelRolePrincipalValue')} label={this.t('nLabelRolePrincipal')} labelStyle={style.radioLabel} iconStyle={style.radioIcon} style={style.radio} />
            <RadioButton value={this.t('nLabelRoleAgentValue')} label={this.t('nLabelRoleAgent')} labelStyle={style.radioLabel} iconStyle={style.radioIcon} style={style.radio} />
          </RadioButtonGroup>
        </ClearFix>
        <p style={style.radioRemind}>{this.state.roleMessageRemind}</p>
        <div style={{display: this.state.roleMessageRemind? 'none':'block'}}><p style={style.radiotips}>{this.state.roleTips}</p></div>
      </ClearFix>
    )
  },
  readerCompanyEmail(){
    let style = this.getStyles();
    return (
      <div style={style.itemHeight}>
        <TextField
          ref='email'
          key='email'
          errorText={this.state.errorTextCompanyEmail}
          floatingLabelText={this.t('nTextCompanyEmail')}
          fullWidth={true}
          onBlur={this._onFinishCompanyEmail}
        />
      </div>
    )
  },
  readerPassword(){
    let style = this.getStyles();
    return (
      <div style={style.itemHeight}>
        <TextField
          ref='password'
          key='password'
          type={this.state.showPassword === true ? 'text' : 'password'}
          errorText={this.state.errorTextPassword}
          floatingLabelText={this.t('nTextPassword')}
          fullWidth={true}
          onChange={this._validatePassword}
          onBlur={this._onFinishPassword}
        />
        <div style={style.visibleContainer}>
          <Invisible
            style={style.invisible}
            onClick={this._handleShowPassword}
          />
          <Visible
            style={style.visible}
            onClick={this._handleShowPassword}
          />
        </div>
      </div>
    )
  },
  readerServerTerm(){
    let style = this.getStyles();
    return (
      <ClearFix style={style.serverMargin}>
        <Checkbox style={style.serverCheck} checked={this.state.serverCheck} onCheck={this._handleServerCheck} />
      <a href="javascript:;" style={style.serverTerm} onClick={this._handleServer}>{this.t('nLabelServer')}</a>
      </ClearFix>
    )
  },
  renderFooter(){
    let style = this.getStyles();
    return (
      <div style={style.textCenter}>
        <RaisedButton
          label={this.t('nTextButtonSend')}
          secondary={true}
          disabled={!this.state.serverCheck}
          style={style.createBtn}
          labelStyle={style.createBtnLabel}
          onClick={this._createBtnClick}
        />
      </div>
    )
  },
  randerBody(){
    let style = this.getStyles();
    let body = {};
    let { step } = this.state;
    switch (step) {
      case 'infoEntering':
        body.title = this.t('nTextHeading');
        body.content = (
          <div>
            {this.readerCompany()}
            {this.readerCheckbox()}
            {this.readerCompanyEmail()}
            {this.readerPassword()}
            {this.readerServerTerm()}
            {this.renderFooter()}
          </div>
        )
        break;
      case 'activeEmail':
        body.title = this.t('nTextHeading');
        body.content = (
          <div style={style.textCenter}>
            <ActionViewSuccess style={style.linkIcon} />
            <p style={style.linkRemind}>{this.t('nTextActiveRemind')}{this.state.email}</p>
            <p><a style={this.state.isResendEmail ? style.linkSend : _.merge({}, style.linkSend, style.linkSendFalse)} onClick={this._resendActivationEmail}>{this.t('nTextResendRemind')}</a></p>
          </div>
        )
        break;
    }

    return body;
  },
  render(){
    let body = this.randerBody();
    return(
      <EventListener
        target={window}
        onKeyUp={this._handleWindowKeyUp}
      >
        <ClearFix>
          <div style={{marginTop: '60px'}}>
            <CommonForm title={body.title} content={body.content} />
            <ServerDialog serverDialogShow={this.state.serverDialogShow} onCloseDialog={this._handleCloseDialog} />
          </div>
        </ClearFix>
    </EventListener>
    )
  },
  _onFinishCompany(){
    let company = this.refs.company.getValue().trim();
    if(company.length === 0){
      this.setState({
        errorTextCompany: this.t('nErrorCompanyRequired')
      })
    }else {
      this.setState({
        errorTextCompany: null
      })
    }
  },

  _handleShowPassword() {
    this.setState({showPassword:!this.state.showPassword});
  },

  _handleWindowKeyUp(e) {
    if (keycode(e) === 'enter') {
      this._createBtnClick();
    }
  },

  _userExists(email){
    userExists.promise(email).then(res => {
      if(res.status === 'OK') {
        this.setState({
          userExists: res.response.exists,
          errorTextCompanyEmail: res.response.exists? this.t('nTextExitsUser') : null,
        })
      }
    }, err => {
    })
  },
  // 光标离开邮箱输入框 验证
  _onFinishCompanyEmail(){
    let companyEmail = this.refs.email.getValue().trim();
    if(companyEmail.length === 0){
      this.setState({
        errorTextCompanyEmail: this.t('nErrorCompanyEmailRequired')
      })
    }else {
      let validationFlag = SAFE_EMAIL_REGEXP.test(companyEmail);
      if(validationFlag){
        this._userExists(companyEmail);
      }else {
        this.setState({
          errorTextCompanyEmail: this.t('nErrorCompanyEmailIsInvalid')
        })
      }
    }
  },
  _validateCommonPassword(password){
    if(password.length < this.props.passwordMinLen || password.length > this.props.passwordMaxLen){
      this.setState({
        errorTextPassword: _.template(this.t('nErrorPasswordIsInvalid'))(this.props)
      })
    }else {
      this.setState({
        errorTextPassword: null
      })
    }
  },
  // 密码输入框val改变触发
  _validatePassword(){
    let password = this.refs.password.getValue().trim();
    this._validateCommonPassword(password);
  },
  // 光标离开密码输入框 验证
  _onFinishPassword(){
    let password = this.refs.password.getValue().trim();
    if(password.length === 0){
      this.setState({
        errorTextPassword: this.t('nErrorPasswordRequired')
      })
    }else {
      this._validateCommonPassword(password);
    }
  },
  _radioClick(evt, val){
    let regRoleMsg = "";
    if(val === this.t('nLabelRolePrincipalValue')){
      regRoleMsg = this.t('nLabelRolePrincipalRemind');
    }else if(val === this.t('nLabelRoleAgentValue')){
      regRoleMsg = this.t('nLabelRoleAgentRemind');
    }
    this.setState({
      roleMessageRemind: regRoleMsg,
      roleTips: null
    })
  },
  // 弹出服务条款
  _handleServer(){
    this.setState({
      serverDialogShow: true
    })
  },
  _handleCloseDialog(){
    this.setState({
      serverDialogShow: false
    })
  },
  _handleServerCheck(){
    this.setState({
      serverCheck: !this.state.serverCheck
    })
  },
  _createBtnSuccess(){
    let background = {};
    if(!this.state.serverCheck){
      background.background = "#004588"
    }else {
      background.background = "#000"
    }
    return background;
  },
  _createBtnClick(){
    let roleTips = this.t('nErrorTextRole');
    let radioGroupValue = this.refs.radioGroup.getSelectedValue();
    let company = this.refs.company.getValue().trim();
    let email = this.refs.email.getValue().trim();
    let password = this.refs.password.getValue().trim();
    let validationFlag = SAFE_EMAIL_REGEXP.test(email);

    if(company == "" || this.state.errorTextCompany !== null){
      this.refs.company.focus()
    }else if(radioGroupValue === "") {
      this.setState({
        roleTips: roleTips
      })
    }else if(email == "" || this.state.errorTextCompanyEmail !== null || !validationFlag) {
      this.refs.email.focus();
    }else if(password == "" || this.state.errorTextPassword !== null) {
      this.refs.password.focus()
    }else {
      userExists.promise(email).then(res => {
        if(res.status === 'OK') {
          if(!res.response.exists){
            enroll.promise(company,radioGroupValue,email,password).then(res => {
              this.setState({
                  email: email,
                  step: "activeEmail"
                })
            }, err => {
            })
          }else {
            this.setState({
              userExists: res.response.exists,
              errorTextCompanyEmail: res.response.exists? this.t('nTextExitsUser') : null,
            })
          }

        }
      }, err => {
      })

    }
  },
  _resendActivationEmail(){
    let { email, isResendEmail } = this.state;
    isResendEmail ? resendActivationEmail.promise(email).then(res => {
      this.setState({
        isResendEmail: false,
      })
    }, err => {
    }) : null
  }
})

module.exports = Reg
