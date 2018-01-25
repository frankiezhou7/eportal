const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const MainAccountButton = require('~/src/shared/main-account-button');
const MainNavigationButton = require('~/src/shared/main-navigation-button');
const IconButton = require('epui-md/IconButton');
const EpAppBar = require('./ep-app-bar');
const HelpIcon = require('epui-md/svg-icons/ep/help');
const NoticeIcon = require('epui-md/svg-icons/ep/notice');
const { Link } = require('react-router');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const EpAppBarWithButton = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/AppBar/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    iconElementLeft : PropTypes.element,
    iconElementRight : PropTypes.element,
    iconStyleRight: PropTypes.object,
    leftNode : PropTypes.element,
    rightNode : PropTypes.element,
    bottomNode : PropTypes.element,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState(){
    return {
      hasMessages: false
    }
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let styles = {
      iconStyleRignt: {
        marginRight: '-2px',
      },
      rightContainer:{
        display: 'flex',
        minWidth: 150,
        alignItems: 'center',
        justifyContent: 'flex-end',
      },
      icon:{
        fill: '#fff',
        cursor: 'pointer',
        marginRight: 15,
        width: 26,
        height: 26,
      },
      link:{},
      circle:{
        backgroundColor: '#e44d3c',
        width: 10,
        height: 10,
        borderRadius: '50%',
        position: 'absolute',
        marginTop: -36,
        marginLeft: 27,
      },
      iconButton:{
        marginRight: 5,
      },
    };
    return styles;
  },

  componentWillMount() {
    this._fetchUpdateStatus();
  },

  _fetchUpdateStatus(){
    if(_.isFunction(global.api.message.getGlobalUpdateStatus)){
      global.api.message.getGlobalUpdateStatus.promise()
      .then((res)=>{
        if(res.status === 'OK'){
          this.setState({hasMessages:res.response.update});
        }
      })
      .catch((err)=>{
        console.log(this.t('nTextInitedFailed'));
      })
    }
  },

  renderRightIconButton() {
    return (
      <div style = {this.style('rightContainer')}>
        <Link
          style = {this.style('link')}
          target="_blank"
          to= {`/${__LOCALE__}/notification`}
        >
         <IconButton
          tooltip= {this.t('nTextNotification')}
          iconStyle= {this.style('icon')}
          >
            <NoticeIcon/>
          </IconButton>
         { this.state.hasMessages ? <div style = { this.style('circle')}/> :null }
        </Link>
        <Link
          style = {this.style('link')}
          target="_blank"
          to= {`/${__LOCALE__}/faq`}
        >
          <IconButton
            tooltip= {this.t('nTextHelp')}
            iconStyle= {this.style('icon')}
            style = {this.style('iconButton')}
          >
            <HelpIcon/>
          </IconButton>
        </Link>
        <MainAccountButton />
      </div>
    );
  },

  render() {
    let {
      iconElementLeft,
      iconElementRight,
      iconStyleRight,
      ...others
    } = this.props;
    return (
      <EpAppBar
        {...others}
        ref="appBar"
        iconElementLeft={<MainNavigationButton />}
        iconElementRight={this.renderRightIconButton()}
        iconStyleRight={this.style('iconStyleRignt')}
      />
    );
  },
});

module.exports = EpAppBarWithButton;
