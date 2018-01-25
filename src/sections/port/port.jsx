import React from 'react';
import _ from 'eplodash';
import PortHeader from './connected-port-header';
import Transitions from 'epui-md/styles/transitions';
import NavigationContainer from 'epui-md/ep/NavigationContainer';
import { ListItem } from 'epui-md/List';
import IconShip from 'epui-md/svg-icons/maps/directions-boat';
import DashboardIcon from 'epui-md/svg-icons/maps/menus-homepage';
import ParticularsIcon from 'epui-md/svg-icons/maps/menus-port-particulars';
import { mixin as AutoStyle } from 'epui-auto-style';
import { mixin as Translatable } from 'epui-intl';
import RefreshIndicator from 'epui-md/ep/RefreshIndicator';
const PropTypes = React.PropTypes;

const CONTENT_PADDING_TOP = global.appHeight;
const CONTENT_WIDTH = global.contentWidth;
const APP_BAR_MAX_HEIGHT = global.appHeight;

export default React.createClass({
  displayName: 'Port',

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Port/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.object,
    port: PropTypes.object,
    target: PropTypes.oneOf(['info', 'line-up']),
    isFetching: PropTypes.bool,
    nTitleShipVoyages: PropTypes.string,
    nTitleShipParticulars: PropTypes.string,
    nTitleShipLogs: PropTypes.string,
    nTitleShipReports: PropTypes.string,
    nTextShipNotFound: PropTypes.string,
    nTextDashboard: PropTypes.string,
    nTextInfo: PropTypes.string,
    openLeftNav: PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      target: 'info'
    };
  },

  getInitialState() {
    return {
      contentHeight: 0,
      appBarHeightPercent: 0,
    };
  },

  getStyles() {
    let props = this.props;
    let theme = this.getTheme();

    let hp = this.state.appBarHeightPercent;
    hp = (hp > 1) ? 1 : (hp < 0 ? 0 : hp);

    let paddingTop = 56 + (APP_BAR_MAX_HEIGHT - 56) * hp - CONTENT_PADDING_TOP;

    let styles = {
      wrapper: {
        height: '100%',
        paddingTop: APP_BAR_MAX_HEIGHT,
        boxSizing: 'border-box',
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      },
      appBar: {
        position: 'fixed',
        top: 0,
      },
      coverContent:{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        zIndex: 2,
      },
      content:{
        maxWidth: global.contentWidth,
        margin: 'auto',
      },
      loader: {
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      loaded: {
        top: '96px',
      },
      error: {
        root: {
          width: 560,
          marginLeft: 'auto',
          marginRight: 'auto',
          textAlign: 'center',
        },
        text: {

        }
      }
    };
    return styles;
  },

  getTheme() {
    return this.context.muiTheme;
  },


  renderSubNavigationItems() {
    let theme = this.getTheme();
    let color = theme && theme.epColor.portColor;

    const dashboardIcon = (<DashboardIcon color={color}/>);
    const particularsIcon = (<ParticularsIcon color={color}/>);

    // <ListItem
    //   key={'lineUp'}
    //   primaryText={'Line Up'}
    //   leftIcon={icon}
    //   value={'line-up'}
    // />

    return [(
      <ListItem
        key={'dashboard'}
        primaryText={this.t('nTextDashboard')}
        leftIcon={dashboardIcon}
        value={'dashboard'}
      />
    ), (
      <ListItem
        key={'info'}
        primaryText={this.t('nTextInfo')}
        leftIcon={particularsIcon}
        value={'info'}
      />
    )];
  },

  render() {
    let { port, target } = this.props;
    if(!port) { return null; }
    return (
      <div style={this.style('wrapper')}>
        <PortHeader
          ref='header'
          port={port}
          style={this.style('appBar')}
        />
        <NavigationContainer
          ref='nav'
          menuItems={this.renderSubNavigationItems()}
          navigatorWidth={216}
          showToggle={true}
          value={target}
          style={this.s('coverContent')}
          onChange={this._onSubNavigationChange}
        >
          <div style = {this.style('content')}>
            {this.props.isFetching ? <RefreshIndicator />:
              React.cloneElement(this.props.children, {...this.props})}
          </div>
        </NavigationContainer>
      </div>
    );
  },

  _onSubNavigationChange(ref, to) {
    if(to === 'dashboard') {
      global.tools.toSubPath(`/${to}`);
      return;
    }
    global.tools.toSubPath(`/port/${this.props.port._id}/${to}`);
    let nav = this.refs.nav;
    nav && nav._autoClose(2000);
  }
});
