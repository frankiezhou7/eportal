const React = require('react');
const _ = require('eplodash');
const Colors = require('epui-md/styles/colors');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField');
const Translatable = require('epui-intl').mixin;

const RegisterVerifySecurity = React.createClass({

  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/SafeEmailAndMobile/${__LOCALE__}`),

  propTypes: {
    email: PropTypes.string.isRequired,
    errorCode: PropTypes.string,
    nTextDescVerifyEmail: PropTypes.string,
    nTextErrorSendingVerifyEmail: PropTypes.string,
    nTextMessageVerifyEmail: PropTypes.string,
    nTextSendingVerifyEmail:  PropTypes.string,
    nTitleVerifyEmail: PropTypes.string,
    sendVerificationEmail: PropTypes.func.isRequired,
    sender: PropTypes.string,
    working: PropTypes.bool.isRequired,
  },

  getDefaultProps() {
    return {
      email: 'li.wei@e-ports.com',
      sender: 'no-reply@e-ports.com',
      working: true,
    };
  },

  componentDidMount() {
    this.props.sendVerificationEmail();
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
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    var template = null;
    if(this.props.working) {
      template = this.props.nTextSendingVerifyEmail;
    } else {
      template = this.props.errorCode ? _.template(this.props.nTextSendingVerifyEmail)(this.props)
                                      : _.template(this.props.nTextMessageVerifyEmail)(this.props);
    }
    let message = _.template(template)(this.props);

    return (
      <div style={styles.root}>
        <h2 style={styles.h2}>{this.props.nTitleVerifyEmail}</h2>
        <p style={styles.p}>{this.props.nTextDescVerifyEmail}</p>
        <div style={styles.content}>
          <div style={styles.email}>
            <p style={styles.fontSize}>{message}</p>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = RegisterVerifySecurity;
