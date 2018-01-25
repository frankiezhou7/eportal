const React = require('react');
const _ = require('eplodash');
const Account = require('epui-md/svg-icons/action/account-circle');
const Avatar = require('epui-md/Avatar');
const IconButton = require('epui-md/IconButton');
const { PropTypes, Component } = React;
const { connect } = require('react-redux');

const AVATAR_SIZE = 32;

function getStyles(props, context, state) {
  const styles = {
    root: {
      marginTop: '-3px',
      marginLeft: '-6px',
      fill: '#FFFFFF',
      color: '#FFFFFF',
      backgroundColor: 'transparent',
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
    },
    avatar: {
      margin: '0px',
      width: AVATAR_SIZE,
      height: AVATAR_SIZE,
    },
  };

  return styles;
}

class MainAccountButton extends Component {
  static propTypes = {
    avatarStyle: PropTypes.object,
    style: PropTypes.object,
    url: PropTypes.string,
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  handleTouchTap = (evt) => {
    let { toggleRightNav } = global.cli.navigation;
    if (_.isFunction(toggleRightNav)) {
      toggleRightNav(true);
    }
  }

  render() {
    let {
      avatarStyle,
      style,
      url,
      ...other,
    } = this.props;

    const styles = getStyles(this.props, this.context, this.state);
    const icon = url ? null : <Account style={Object.assign({}, styles.avatar, avatarStyle)} />;

    return (
      <IconButton
        iconStyle={Object.assign({}, styles.root, style)}
        onTouchTap={this.handleTouchTap}
      >
        <Avatar
          icon={icon}
          size={AVATAR_SIZE}
          src={url}
        />
      </IconButton>
    );
  }
};

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      url: state.getIn(['lastLogin', 'photoURL']),
    };
  },
)(MainAccountButton);
