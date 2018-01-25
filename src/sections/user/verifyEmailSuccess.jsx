const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Colors = require('epui-md/styles/colors');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const VerifyEmailSuccess = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/SafeEmailAndMobile/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    email: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    nTitleEmailValidationSuccess: PropTypes.string,
    nTextEmailValidationSuccess: PropTypes.string,
  },

  getDefaultProps() {
    return {
      email: '',
      username: '',
    };
  },

  getStyles() {
    let styles = {
      root: {
      },
      h2: {
        color: '#004588',
      },
      p: {
        margin: '10px 0 30px 0',
        color: '#727272',
      },
      fontSize12: {
        fontSize: '12px',
      },
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      username,
      email,
      nTitleEmailValidationSuccess,
      nTextEmailValidationSuccess,
      ...other,
    } = this.props;

    return (
      <div
        style={this.style('root')}
      >
        <h2
          style={this.style('h2')}
        >
          {nTitleEmailValidationSuccess}
        </h2>
        <p
          style={this.style('fontSize12')}
        >
          { _.template(nTextEmailValidationSuccess)(this.props) }
        </p>
      </div>
    );
  },

});

module.exports = VerifyEmailSuccess;
