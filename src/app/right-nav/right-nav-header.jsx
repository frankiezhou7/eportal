const React = require('react');
const _ = require('eplodash');
const AccountCircle = require('epui-md/svg-icons/action/account-circle');
const AutoStyle = require('epui-auto-style').mixin;
const Avatar = require('epui-md/Avatar');
const Utils = require('~/src/utils');
const BackgroundImg = require('./background.png');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const RightNavHeader = React.createClass({
  mixins: [AutoStyle, Translatable],

  propTypes: {
    username: PropTypes.string,
    fullname: PropTypes.string,
    photoURL: PropTypes.string,
    isSuperAdmin: PropTypes.bool,
    orgName: PropTypes.string,
  },

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      orgName: '',
      username: '',
      fullname: null,
      isSuperAdmin: true,
    };
  },

  getInitialState() {
    return {};
  },

  getStyles() {
    let styles = {
      root: {
        position: 'relative',
        width: '100%',
        maxWidth: '256px',
        height: '200px',
        overflow: 'hidden',
        background: `url(${BackgroundImg})`,
        backgroundColor: this.context.muiTheme.palette.primary1Color,
      },
      account: {
        marginTop: '-6px',
        marginLeft: '-6px',
        width: '74px',
        height: '74px',
        fill: '#ffffff',
      },
      avatar: {
        marginTop: '44px',
        marginLeft: '24px',
        width: '62px',
        height: '62px',
        overflow: 'hidden',
      },
      info: {
        root: {
          padding: '0 24px',
          width: '100%',
          height: '70px',
          position: 'absolute',
          bottom: '0px',
          boxSizing: 'border-box',
          color: '#ffffff',
        },
        small: {
          width: '100%',
          height: '35px',
          fontSize: '12px',
          fontFamily:'Roboto-Regular',
          wordBreak: 'keep-all',
        },
        username: {
          width: '100%',
          height: '30px',
          fontSize: '24px',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          wordBreak: 'keep-all',
          fontFamily:'Roboto-Regular',
          color: '#fff',
          lineHeight: '24px',
          letterSpacing: 0,
        },
        container:{
          marginTop: -5,
        },
      },
    };

    return styles;
  },

  renderAvatar() {
    let photoURL = this.props.photoURL;

    let el = photoURL ? (
      <Avatar
        size={64}
        src={photoURL}
        style={this.style('avatar')}
      />
    ) : (
      <div style={this.style('avatar')}>
        <AccountCircle style={this.style('account')} />
      </div>
    );

    return el;
  },

  renderDetails(){
    let { orgName, isSuperAdmin, username, fullname } = this.props;
    return (
      <div
        ref={(ref) => this.info = ref}
        style={this.style('info.root')}
      >
        { isSuperAdmin ?
          <div style={Object.assign({},this.style('info.small'),{fontSize:'16px'})}>
            {Utils.displayWithLimit(orgName,70)}
          </div> :
          <div style = {this.s('info.container')}>
            <div style={this.style('info.username')}>
              {fullname ? fullname :username}
            </div>
            <div style={this.style('info.small')}>
              {Utils.displayWithLimit(orgName,60)}
            </div>
          </div>
        }
      </div>
    );
  },

  render() {
    let {
      username,
      fullname,
      ...other,
    } = this.props;

    return (
      <div
        ref={(ref) => this.root = ref}
        style={this.style('root')}
      >
        {this.renderAvatar()}
        {this.renderDetails()}
      </div>
    );
  },
});

module.exports = RightNavHeader;
