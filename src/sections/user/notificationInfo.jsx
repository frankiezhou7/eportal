const React = require('react');
const _ = require('eplodash');
const Avatar = require('epui-md/Avatar');
const Colors = require('epui-md/styles/colors');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;

const NotificationInfo = React.createClass({
  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/NotificationInfo/${__LOCALE__}`),

  propTypes: {
    username: PropTypes.string,
    nTextStatusInfo: PropTypes.string,
    nTextAccountInfo: PropTypes.string,
    nTextSecondary: PropTypes.string,
    nTextSendMail: PropTypes.string,
    nTextNoticeMethodTitle1: PropTypes.string,
    nTextNoticeMethodContent1: PropTypes.string,
    nTextNoticeMethodTitle2: PropTypes.string,
    nTextNoticeMethodContent2: PropTypes.string,
    nTextNoticeUrl: PropTypes.string,
    sendNoticeMail: PropTypes.func,
  },

  getDefaultProps() {
    return {
      username: '',
    };
  },

  _handleTouchTap(e) {
    let {
      username,
      sendNoticeMail,
    } = this.props;

    let fn = sendNoticeMail;

    if (_.isFunction(fn)) {
      fn(username);
    }
  },

  getStyles() {
    let styles = {
      root: {
        color: '#727272',
      },
      h2: {
        color: '#004588',
      },
      b: {
        fontWeight: 'bold',
      },
      fontWeight500: {
        fontWeight: '500',
      },
      p: {
        margin: '10px 0 30px 0',
        color: '#727272',
      },
      fontSize12: {
        fontSize: '12px',
      },
      fontSize15: {
        fontSize: '15px',
      },
      content: {
        width: '100%',
      },
      footer: {
        display: 'inline-block',
        float: 'right',
      },
      buttonMargin: {
        marginRight: '10px',
      },
      sendVerificationCode: {
        display: 'inline-block',
        marginLeft: '5px',
      },
      verificationCode: {
        display: 'inline-block',
        width: '160px',
      },
      sendMail: {
        marginLeft: '186px',
      },
      link: {
        textAlign: 'center',
      },
      margin: {
        margin: 0,
      },
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      username,
      nTextAccountInfo,
      nTextNoticeMethodTitle1,
      nTextNoticeMethodTitle2,
      nTextNoticeMethodContent1,
      nTextNoticeMethodContent2,
      nTextNoticeUrl,
      nTextSendMail,
      nTextSecondary,
      nTextStatusInfo,
      ...other,
    } = this.props;

    let tempNTextAccountInfo = this.t('nTextAccountInfo', this.props);

    return (
      <div style={styles.root}>
        <h2 style={styles.h2}>
          {this.t('nTextStatusInfo')}
        </h2>
        <p style={styles.fontSize12}>
          {tempNTextAccountInfo}
        </p>
      </div>
    );
  },
});

module.exports = NotificationInfo;
