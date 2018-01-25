const React = require('react');
const _ = require('eplodash');
const Colors = require('epui-md/styles/colors');
const FlatButton = require('epui-md/FlatButton');
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const CODE_LENGTH = 6, DURATION = 20;

const VerifyMobile = React.createClass({

  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/VerifyMobile/${__LOCALE__}`),

  propTypes: {
    codeLength: PropTypes.number,
    errorCode: PropTypes.string,
    sending: PropTypes.bool,
    verifing: PropTypes.bool,
    mobile: PropTypes.string.isRequired,
    nButtonWaitingSendVerificationCode: PropTypes.string,
    nButtonSendVerificationCode: PropTypes.string,
    nButtonSendingVerificationCode: PropTypes.string,
    nButtonVerifingCode: PropTypes.string,
    nHintVerificationCode: PropTypes.string,
    nButtonSendingVerificationCodeSuccess: PropTypes.string,
    nLabelVerificationCode: PropTypes.string,
    nTextDescVerifyMobile: PropTypes.string,
    nTextMessageVerifyMobile: PropTypes.string,
    nTextMessageVerifyMobileFail: PropTypes.string,
    nTextMessageVerifyMobileSuccess: PropTypes.string,
    nTitleVerifyMobile: PropTypes.string,
    sendCode: PropTypes.func.isRequired,
    sendCodeSuccess: PropTypes.bool,
    sendCodeToken: PropTypes.bool,
    success: PropTypes.bool,
    verifyCode: PropTypes.func.isRequired,
    duration: PropTypes.number,
  },

  getDefaultProps() {
    return {
      mobile: '',
      codeLength: CODE_LENGTH,
      sending: false,
      verifing: false,
      duration: DURATION,
    };
  },

  getInitialState() {
    return {
      sending: this.props.sending,
      verifing: this.props.verifing,
      counter: 0,
    };
  },

  componentWillReceiveProps(nextProps) {
    if(!_.isBoolean(this.props.success) && _.isBoolean(this.props.success)) {
      this.setState({
        sending: false,
        verifing: false
      });
    }

    if (this.state.sending !== nextProps.sending) {
      this.setState({
        sending: nextProps.sending
      });
    }

    if (this.state.verifing !== nextProps.verifing) {
      this.setState({
        verifing: nextProps.verifing
      });
    }

    if(this.props.errorCode !== nextProps.errorCode) {
      this.setState({
        sending: false,
        verifing: false
      });
    }
  },

  _handleSendCode(e) {
    let self = this;
    if (this.props.sendCode && _.isFunction(this.props.sendCode)) {
      this.props.sendCode(this.props.mobile);
    }
    this.setState({
      sending: true,
      verfing: false,
      counter: this.props.duration,
    });

    this._intv = setInterval(function() {
      let c = self.state.counter - 1;
      if(c <= 0) {
        clearInterval(self._intv);
      }
      self.setState({
        counter: c
      });
    }, 1000);
  },

  _handleCodeChange() {
    let code = this.refs.code.getValue();
    if(code.length !== this.props.codeLength) { return; }

    this.props.verifyCode(code);
    this.setState({
      sending: false,
      verfing: true,
    });
  },

  _handleCodeFocus() {
    let field = this.refs.code;
    let code = field.getValue();
    if(code) {
      let input = field._getInputNode();
      input.setSelectionRange(0, code.length);
    }
  },

  getStyles() {
    let styles = {
      root: {},
      h2: {
        color: '#3F51B5'
      },
      b: {
        fontWeight: 'bold'
      },
      p: {
        margin: '10px 0 30px 0',
        color: Colors.lightBlack
      },
      fontSize: {
        fontSize: '12px'
      },
      content: {
        width: '100%'
      },
      footer: {
        display: 'inline-block',
        float: 'right'
      },
      buttonMargin: {
        marginRight: '10px'
      },
      sendVerificationCode: {
        display: 'inline-block',
        marginLeft: '5px'
      },
      verificationCode: {
        display: 'inline-block',
        width: '160px'
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();
    let elResultMessage = null,
      btnEnabled = true,
      txtEnabled = true,
      btnLabel = this.props.nButtonSendVerificationCode
    ;

    if(this.state.verifing) {
      btnEnabled = false;
      txtEnabled = false;
      // btnLabel = this.props.nButtonVerifingCode;
      elResultMessage = (
        <p style={styles.error}>{this.props.nButtonVerifingCode}</p>
      );
    } else if(this.state.sending) {
      btnEnabled = false;
      txtEnabled = false;
      btnLabel = this.props.nButtonSendingVerificationCode;
    } else if(this.state.counter > 0) {
      btnEnabled = false;
      txtEnabled = true;
      btnLabel = _.template(this.props.nButtonWaitingSendVerificationCode)({
        seconds: this.state.counter
      });
    }

    if(_.isBoolean(this.props.success)) {
      if(this.props.success === true) {
        btnEnabled = false;
        txtEnabled = false;
        btnLabel = this.props.nButtonSendVerificationCode;
        elResultMessage = (
          <p style={styles.success}>{this.props.nTextMessageVerifyMobileSuccess}</p>
        );
      } else if(this.state.counter <= 0) {
        btnLabel = this.props.nButtonSendVerificationCode;
        elResultMessage = (
          <p style={styles.fail}>{this.props.nTextMessageVerifyMobileFail}</p>
        );
      } else if (_.isBoolean(this.props.sendCodeToken)) {
        if (this.props.sendCodeToken) {
          elResultMessage = (
            <p style={styles.success}>{this.props.nButtonSendingVerificationCodeSuccess}</p>
          );
        }
      } else {
        elResultMessage = (
          <p style={styles.fail}>{this.props.nTextMessageVerifyMobileFail}</p>
        );
      }
    }

    if(this.props.errorCode) {
      btnEnabled = false;
      txtEnabled = false;
      elResultMessage = (
        <p style={styles.error}>{this.props.nTextMessageVerifyMobileFail}</p>
      );
    }

    let tempNTextMessageVerifyMobile = _.template(this.props.nTextMessageVerifyMobile)(this.props);

    return (
      <div style={styles.root}>
        <h2 style={styles.h2}>{this.props.nTitleVerifyMobile}</h2>
        <p style={styles.p}>{this.props.nTextDescVerifyMobile}</p>
        <div style={styles.content}>
          <div style={styles.mobile}>
            <p style={styles.fontSize}>{tempNTextMessageVerifyMobile}</p>
          </div>
          <div>
            <div style={styles.verificationCode}>
              <TextField
                ref='code'
                disabled={!txtEnabled}
                floatingLabelText={this.props.nLabelVerificationCode}
                hintText={this.props.nHintVerificationCode}
                fullWidth={true}
                onBlur={this._handleCodeChange}
                onChange={this._handleCodeChange}
                onFocus={this._handleCodeFocus} />
            </div>
            <div style={styles.sendVerificationCode}>
              <FlatButton
                disabled={!btnEnabled}
                label={btnLabel}
                primary={true}
                onTouchTap={this._handleSendCode} />
            </div>
          </div>
          {elResultMessage}
        </div>
      </div>
    );
  }
});

module.exports = VerifyMobile;
