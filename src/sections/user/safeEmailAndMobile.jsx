const React = require('react');
const _ = require('eplodash');
const Avatar = require('epui-md/Avatar');
const ErrorIcon = require('epui-md/svg-icons/alert/error');
const LinkedStateMixin = require('react-addons-linked-state-mixin');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;

const SAFE_EMAIL_REGEXP = new RegExp('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$', 'i');
const SAFE_MOBILE_REGEXP = new RegExp('^[\+]?[(]?[0-9]{3}[)]?[-\s]?[0-9]{3}[-\s]?[0-9]{4,26}$', 'im');

const SafeEmailAndMobile = React.createClass({

  mixins: [StylePropable, LinkedStateMixin, Translatable],

  translations: require(`epui-intl/dist/SafeEmailAndMobile/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    maxEmergencyEmailLen: PropTypes.number,
    minEmergencyEmailLen: PropTypes.number,
    maxEmergencyMobileLen: PropTypes.number,
    minEmergencyMobileLen: PropTypes.number,
    nErrorTextWhenRegisterFail: PropTypes.string,
    nHintTextSafeEmail: PropTypes.string,
    nHintTextSafeMobile: PropTypes.string,
    nLabelSafeEmail: PropTypes.string,
    nLabelSafeMobile: PropTypes.string,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    safeEmail: PropTypes.string,
    safeMobile: PropTypes.string,
    wrapperStyle: PropTypes.object,
  },

  getDefaultProps() {
    return {
      maxEmergencyEmailLen: 128,
      minEmergencyEmailLen: 6,
      maxEmergencyMobileLen: 32,
      minEmergencyMobileLen: 6,
    };
  },

  getInitialState() {
    let {
      safeEmail,
      safeMobile,
    } = this.props;

    return {
      safeEmail: safeEmail || '',
      safeEmailIsValid: true,
      safeMobile: safeMobile || '',
      safeMobileIsValid: true,
    };
  },

  getStyles() {
    let { nErrorTextWhenRegisterFail } = this.props;
    let styles = {
      root: {
        width: '380px',
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
      textField: {
        marginBottom: '10px',
      },
      zone: {
        marginTop: '20px',
        color: '#f44336',
        visibility: !!nErrorTextWhenRegisterFail,
        fontSize: '16px',
      },
    };

    return styles;
  },

  getValue() {
    let safeEmailIsValid = this._validateSafeEmail();
    let safeMobileIsValid = this._validateSafeMobile();

    let {
      safeEmail,
      safeMobile,
    } = this.state;

    return {
      safeEmail: safeEmail && safeEmail.trim(),
      safeEmailIsValid: safeEmailIsValid,
      safeMobile: safeMobile && safeMobile.trim(),
      safeMobileIsValid: safeMobileIsValid,
    };
  },

  render() {
    let styles = this.getStyles();

    let {
      nErrorTextWhenRegisterFail,
      nLabelSafeEmail,
      nLabelSafeMobile,
      nHintTextSafeEmail,
      nHintTextSafeMobile,
      wrapperStyle,
      ...other,
    } = this.props;

    let {
      nErrorTextSafeEmail,
      nErrorTextSafeMobile,
    } = this.state;

    return (
      <div style={this.mergeAndPrefix(styles.root, wrapperStyle)}>
        <TextField
          ref='safeEmail'
          errorText={nErrorTextSafeEmail}
          floatingLabelText={this.t('nLabelSafeEmail')}
          fullWidth={true}
          hintText={this.t('nHintTextSafeEmail')}
          onBlur={this._validateSafeEmail}
          onChange={this._handleChangeSafeEmail}
          showIcon={true}
          style={styles.textField}
          value={this.state.safeEmail}
        />
        <TextField
          ref='safeMobile'
          errorText={nErrorTextSafeMobile}
          floatingLabelText={this.t('nLabelSafeMobile')}
          fullWidth={true}
          hintText={this.t('nHintTextSafeMobile')}
          onBlur={this._validateSafeMobile}
          onChange={this._handleChangeSafeMobile}
          showIcon={true}
          style={styles.textField}
        />
        <div style={this.mergeAndPrefix(styles.zone)}>
          {!!nErrorTextWhenRegisterFail && <ErrorIcon style={this.mergeAndPrefix(styles.errorIcon)} />}
          <div style={this.mergeAndPrefix(styles.errorText)}>
            {nErrorTextWhenRegisterFail}
          </div>
        </div>
      </div>
    );
  },

  _handleChangeSafeEmail(event, value) {
    this.setState({
      safeEmail: value,
    });
  },

  _handleChangeSafeMobile(event, value) {
    this.setState({
      safeMobile: value,
    });
  },

  _validateSafeEmail() {
    let {
      maxEmergencyEmailLen,
      minEmergencyEmailLen,
    } = this.props;
    let safeEmail = this.refs.safeEmail.getValue();
    safeEmail = safeEmail && safeEmail.trim();
    let len = safeEmail ? safeEmail.length : 0;
    let nErrorTextSafeEmail = null, isValid = false;

    if (len === 0) {
      nErrorTextSafeEmail = this.t('nErrorTextSafeEmailIsRequired');
    } else if (len < minEmergencyEmailLen || len > maxEmergencyEmailLen) {
      nErrorTextSafeEmail = _.template(this.t('nTextErrorEmergencyEmailLength'))(this.props);
    } else if (!SAFE_EMAIL_REGEXP.test(safeEmail)) {
      nErrorTextSafeEmail = this.t('nErrorTextSafeEmailIsNotValid');
    } else {
      isValid = true;
    }

    this.setState({
      safeEmailIsValid: isValid,
      nErrorTextSafeEmail: nErrorTextSafeEmail,
    });

    return nErrorTextSafeEmail === null;
  },

  _validateSafeMobile() {
    let {
      maxEmergencyMobileLen,
      minEmergencyMobileLen,
    } = this.props;
    let safeMobile = this.refs.safeMobile.getValue();
    safeMobile = safeMobile && safeMobile.trim();
    let len = safeMobile ? safeMobile.length : 0;
    let nErrorTextSafeMobile = null, isValid = false;

    if (len !== 0 && (len < minEmergencyMobileLen || len > maxEmergencyMobileLen)) {
      nErrorTextSafeMobile = _.template(this.t('nTextErrorEmergencyMobileLength'))(this.props);
    } else if (len !== 0 && !SAFE_MOBILE_REGEXP.test(safeMobile)) {
      nErrorTextSafeMobile = this.t('nErrorTextSafeMobileIsNotValid');
    } else {
      isValid = true;
    }

    this.setState({
      safeMobileIsValid: isValid,
      nErrorTextSafeMobile: nErrorTextSafeMobile,
    });

    return nErrorTextSafeMobile === null;
  },

});

module.exports = SafeEmailAndMobile;
