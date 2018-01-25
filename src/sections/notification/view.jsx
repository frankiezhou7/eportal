const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Header = require('./header');
const NavigationContainer = require('epui-md/ep/NavigationContainer');
const RightContent = require('./right-content');
const ScreenMixin = require('~/src/mixins/screen');
const React = require('react');
const { ListItem } = require('epui-md/List');
const Translatable = require('epui-intl').mixin;
const { connect } = require('react-redux');

const PropTypes = React.PropTypes;

const NotificationView = React.createClass({
  mixins: [AutoStyle, ScreenMixin, Translatable],

  translations: require(`epui-intl/dist/Notification/${__LOCALE__}`),

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    user: PropTypes.object,
  },

  getDefaultProps() {
    return { };
  },

  getInitialState() {
    return {
      shipId: null,
      user: _.get(this.props.user, '_id', null),
    };
  },

  componentWillMount(){
    if(_.isFunction(global.api.message.getShipsUpdateStatus)){
      global.api.message.getShipsUpdateStatus.promise()
      .then((res)=>{
        if(res.status === 'OK'){
          this.setState({
            ships: res.response.ships,
            shipId: _.get(_.head(res.response.ships), '_id', null),
          });
        }
      })
      .catch((err)=>{
        console.log(err);
        console.log(this.t('nTextInitedFailed'));
      })
    }
  },

  componentDidMount() {
    this.setPageTitle(this.t('nTextNotification'));
  },

  getStyles() {
    return {
      root: {
        height: '100%',
        paddingTop: global.appHeight,
        boxSizing: 'border-box',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        backgroundImage: `url('${require('~/src/shared/pic/background.svg')}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 100%',
        backgroundColor: '#f0f0f0',
        overflowY: 'auto',
        marginRight: -6,
      },
      appBar: {
        position: 'fixed',
        top: 0,
      },
      coverContent: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        zIndex: 2,
      },
      content: {
        margin: 'auto',
        maxWidth: global.contentWidth,
        height: '100%',
        display: 'flex',
      },
      nav:{
        left: 4,
        overflowY: 'scroll',
      },
      text:{
        textOverflow: 'ellipsis',
        wordBreak: 'break-word',
        textTransform: 'uppercase',
        fontSize: 14,
      },
      item:{
        borderBottom: '1px solid #e5e5e5',
        backgroundColor: '#fafafa',
      },
      selectedItem:{
        backgroundColor: '#fadbaa',
      },
      circle:{
        width: 13,
        height: 13,
        borderRadius: '50%',
        position: 'absolute',
        right: 0,
        top: 4,
        backgroundColor: '#e44d3c',
      },
    };
  },

  renderSubNavigationItems() {
    let items = [];
    let { ships, shipId } = this.state;
    _.forEach(ships,ship=>{
      let unreadIcon = (shipId != ship._id) && (ship.read === false) ? (<div style = {this.s('circle')}></div>):null;
      let primaryText = (<div style = {this.s('text')}>{ship.name}</div> );
      items.push(
        <ListItem
          style = {this.style('item')}
          key = {ship._id}
          primaryText = {primaryText}
          value = {ship._id}
          rightIcon = {unreadIcon}
        />
      );
    });
    return items;
  },

  render() {
    let {
      ships,
      shipId,
      user,
    } = this.state;

    return (
      <div style={this.s('root')}>
        <Header style={this.s('appBar')}/>
        <div style={this.s('content')}>
          <NavigationContainer
            menuItems={this.renderSubNavigationItems()}
            value={this.state.shipId}
            style={this.s('coverContent')}
            navStyle = {this.s('nav')}
            selectedItemStyle = {this.s('selectedItem')}
            navigatorWidth ={160}
            navDepth = {1}
            onChange={this._onSubNavigationChange}
            keepOpen ={true}
            float = {false}
          >
            <RightContent
              ref='content'
              shipId={shipId}
              user={user}
            />
          </NavigationContainer>
        </div>
      </div>
    );
  },

  _onSubNavigationChange(ref, shipId) {
    this.setState({shipId: shipId});
    this.refs.content.onLoading(shipId);
  },

});


module.exports = connect(
  (state, props) => {
    return {
      user: state.getIn(['session', 'user']),
    };
  }
)(NotificationView);
