import React from 'react';
import _ from 'eplodash';
import ShipHeader from './connected-ship-header';
import ShipMixin from './mixins/ship';
import Transitions from 'epui-md/styles/transitions';
import NavigationContainer from 'epui-md/ep/NavigationContainer';
import { ListItem } from 'epui-md/List';
import RefreshIndicator from 'epui-md/ep/RefreshIndicator';
import DashboardIcon from 'epui-md/svg-icons/maps/menus-homepage';
import HistoryRecordIcon from 'epui-md/svg-icons/maps/menus-history-record';
import VoyageIcon from 'epui-md/svg-icons/maps/menus-voyage';
import ParticularsIcon from 'epui-md/svg-icons/maps/menus-ship-particulars';
import ExchangeIcon from 'epui-md/svg-icons/maps/menus-exchange';
import { mixin as AutoStyle } from 'epui-auto-style';

const PropTypes = React.PropTypes;

const CONTENT_PADDING_TOP = global.appHeight;
const CONTENT_WIDTH = global.contentWidth;
const APP_BAR_MAX_HEIGHT = global.appHeight;

export default React.createClass({
  displayName: 'Ship',

  mixins: [AutoStyle, ShipMixin],

  translations: require(`epui-intl/dist/Ship/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    params: PropTypes.object,
    children: PropTypes.object,
    ship: PropTypes.object,
    target: PropTypes.oneOf(['voyage', 'particulars','exchange','record']),
    nTitleShipVoyages: PropTypes.string,
    nTitleShipParticulars: PropTypes.string,
    nTitleShipLogs: PropTypes.string,
    nTitleShipReports: PropTypes.string,
    nTextShipNotFound: PropTypes.string,
    nTextExchange: PropTypes.string,
    nTextParticulars: PropTypes.string,
    nTextVoyage: PropTypes.string,
    nTextDashboard: PropTypes.string,
    nTextHistoryRecord: PropTypes.string,
    openLeftNav: PropTypes.func,
  },

  getDefaultProps: function() {
    return {
      target: 'voyage'
    };
  },

  getInitialState() {
    return {
      loading: true,
      contentHeight: 0,
      appBarHeightPercent: 0,
    };
  },

  getStyles() {
    let props = this.props;
    let theme = this.getTheme();

    let hp = this.state.appBarHeightPercent;
    hp = (hp > 1) ? 1 : (hp < 0 ? 0 : hp);

    let paddingTop = 72 + (APP_BAR_MAX_HEIGHT - 72) * hp - CONTENT_PADDING_TOP;

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
        margin: 'auto',
        maxWidth: global.contentWidth,
        height: '100%',
      },
      loader: {
        position: 'relative',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      loading: {
        width: '100%',
        position: 'absolute',
        top: APP_BAR_MAX_HEIGHT,
        zIndex: 2,
        opacity: 1,
        transition: Transitions.easeOut('all', '500ms'),
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

  renderNotFound() {
    return (
      <div style={this.style('wrapper')}>
        <div style={this.style('error.root')}>
          {this.t('nTextShipNotFound')}
        </div>
      </div>
    )
  },

  renderLoading() {
    return (
      <div style={this.style('wrapper')}>
        <div style={this.style('error.root')}>
          <RefreshIndicator />
        </div>
      </div>
    )
  },

  renderSubNavigationItems() {
    let theme = this.getTheme();
    let color = theme && theme.epColor.portColor;
    const dashboardIcon = (<DashboardIcon color={color}/>);
    const voyageIcon = (<VoyageIcon color={color}/>);
    const particularsIcon = (<ParticularsIcon color={color}/>);
    const exchangeIcon = (<ExchangeIcon color={color}/>);
    const historyRecordIcon = (<HistoryRecordIcon color={color}/>);
    return [(
      <ListItem
        key={'dashboard'}
        primaryText={this.t('nTextDashboard')}
        leftIcon={dashboardIcon}
        value={'dashboard'}
      />
    ), (
      <ListItem
        key={'voyage'}
        primaryText={this.t('nTextVoyage')}
        leftIcon={voyageIcon}
        value={'voyage'}
      />
    ), (
      <ListItem
        key={'particulars'}
        primaryText={this.t('nTextParticulars')}
        leftIcon={particularsIcon}
        value={'particulars'}
      />
    ),
    (
      <ListItem
        key={'exchange'}
        primaryText={this.t('nTextExchange')}
        leftIcon={exchangeIcon}
        value={'exchange'}
      />
    ),
    (
      <ListItem
        key={'record'}
        primaryText={this.t('nTextHistoryRecord')}
        leftIcon={historyRecordIcon}
        value={'record'}
      />
    )];
  },

  render() {
    let { ship, target } = this.props;
    if(!ship) { return null; }
    if(ship.getMeta('loading')) { return this.renderLoading(); }
    return (
      <div style={this.style('wrapper')}>
        <ShipHeader
          ref='header'
          ship={ship}
          style={this.s('appBar')}
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
          <div style = {this.s('content')}>
            {React.cloneElement(this.props.children, {...this.props})}
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
    if(_.includes(['record','voyage'],to)){
      to = this.props.params.voyageId ? `/${to}/${this.props.params.voyageId}` : to;
    }
    global.tools.toSubPath(`/ship/${this.props.ship._id}/${to}`);
    let nav = this.refs.nav;
    nav && nav._autoClose(2000);
  }
});
