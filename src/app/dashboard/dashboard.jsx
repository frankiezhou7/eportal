import _ from 'eplodash';
import React from 'react';
import ReactDOM from 'react-dom';
import RaisedButton from 'epui-md/RaisedButton';
import DashboardCards from './dashboard-cards';
import DashboardHeader from './dashboard-header';
import DashboardSearch from './dashboard-search';
import ScreenMixin from '../../mixins/screen';
import WelcomeSplash from './welcome-splash';
import Loading from 'epui-md/ep/RefreshIndicator';
import cache, { HIDE_WELCOME_SPLASH } from '~/src/cache';

const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const ACCOUNT_TYPE = require('~/src/shared/constants').ACCOUNT_TYPE;

const PropTypes = React.PropTypes;

const Dashboard = React.createClass({
  mixins: [AutoStyle, ScreenMixin, Translatable],

  translations: require(`epui-intl/dist/Dashboard/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    dashboardActions: PropTypes.object,
    dashboardStore: PropTypes.object,
    favorites: PropTypes.object,
    getFavoriteShips: PropTypes.func,
    getRecentOrdersForEachShip: PropTypes.func,
    recent: PropTypes.object,
    user: PropTypes.object,
    account: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      hideSplash: cache.get(HIDE_WELCOME_SPLASH),
      loadMore: 0,
      recent: [],
    };
  },

  componentWillMount() {
    // let isComplete = _.get(this.props.account.toJS(), 'isComplete');
    // if(isComplete) {
    //   global.toSubPath('reg');
    // }
    this._fetchFavorites();
  },

  componentDidMount() {
    this.setPageTitle(this.t('nPageTitleDashboard'));
  },

  getStyles() {
    let styles = {
      root: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        bottom: '0px',
        left: '0px',
        textAlign: 'center',
        overflowY: 'auto',
        backgroundImage: `url('${require('~/src/shared/pic/background.svg')}')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: '50% 100%'
      },
      body: {
        position: 'relative',
        paddingTop: '72px',
        height: '100%',
        boxSizing: 'border-box',
        overflowY: 'auto',
      },
      loading: {
        margin: '72px auto',
      },
      loadMore:{
        margin: '20px auto',
      },
      btnContainer:{
        height: 100,
      },
    };

    return styles;
  },

  renderHeader() {
    let { user } = this.props;

    return (
      <DashboardHeader
        ref='header'
        user={user}
      />
    );
  },

  renderCards(entry) {
    const {
      favorites,
      account
    } = this.props;
    let type = account && account.get('types');
    type = type && type.toJS()[0];
    let entries = entry && entry.toJS() || [];
    let favs = favorites && favorites.toJS();
    favs = favs.ships || [];
    entries = _.sortBy(entries, entry => {
      if(_.has(entry,['segment','schedule','timePoints','arrival','time']))
      return -Date.parse(entry.segment.schedule.timePoints.arrival.time)
    });
    entries = _.sortBy(entries, entry => entry.isFinished);
    let favAta = [];
    let favEta = [];
    let ataNotFin = [];
    let etaArr =[]
    let ataFin = [];
    let repeat = 0;
    _.forEach(entries, item => {
      let ship = item.ship;
      let shipId = ship._id;
      let isFin = item.isFinished;
      let segment = item.segment;
      if(_.has(segment,['schedule','timePoints','arrival','estimated'])) {
        if(!!_.find(favs, { id: shipId })){
          favEta.push(item);
          repeat++;
          return;
        };
        etaArr.push(item);
      }else {
        if(!!_.find(favs, { id: shipId })){
          favAta.push(item);
          repeat++;
          return;
        };
        isFin ? ataFin.push(item) : ataNotFin.push(item);
      }
    });
    let length = entries.length + favs.length - repeat;
    let showMore = length > 40;
    let types = account && account.types;
    types = types && types.toJS();
    // if(types && types[0] === ACCOUNT_TYPE.CONSIGNER) showMore = false;
    entries = [].concat(favAta, favEta, ataNotFin, etaArr, ataFin);

    let el = (
      <div ref ={(container)=>{this.rootContainer = container}} style={this.style('body')}>
        <div ref ={(container)=>{this.cardsContainer = container}}>
          <DashboardCards
            ref= {(container)=>{this.cards = container}}
            showMore={true}
            entry={entries}
            more={ataFin}
            account={account}
            favorites={favs}
          />
          <div style = {this.s('btnContainer')}>
            {this.renderLoadMore()}
          </div>
        </div>
      </div>
    );
    return el;
  },

  renderSplash() {
    return (<WelcomeSplash onStart={this._handleSplash} />);
  },

  renderLoadMore(){
    let {recent} = this.props;
    const loading = recent && recent.getMeta('loading');
    let pagination = recent.get('pagination');
    let hasNext = pagination && pagination.get('hasNext');
    if(!hasNext){ return null };
    return loading ? <Loading style = {this.style('loadMore')}/> :
    <RaisedButton
      ref='loadMore'
      label={'Load More'}
      onTouchTap = {this._handleLoadMore}
      style={this.style('loadMore')}
    />;
  },

  render() {
    const { favorites, recent } = this.props;
    const { hideSplash } = this.state;

    const loading = recent && recent.getMeta('loading');
    const error = recent && recent.getMeta('error');

    const pagination = recent.get('pagination');
    const isFirstLoading = pagination ? false : true;

    const content = loading && isFirstLoading ? <Loading style = {this.style('loading')}/> :
      !hideSplash ? this.renderSplash() :
      this.renderCards(recent.get('entries'), favorites.get('ships'));

    return (
      <div style={this.style('root')}>
        {this.renderHeader()}
        {content}
      </div>
    );
  },

  _fetchFavorites() {
    const {
      favorites,
      getFavoriteShips,
      getRecentOrdersForEachShip,
    } = this.props;

    const isVisible = this._isVisible();

    if (!isVisible) return;

    if (_.isFunction(getRecentOrdersForEachShip)) {
      getRecentOrdersForEachShip();
    }
    if (!favorites.get('ships') && _.isFunction(getFavoriteShips)) { getFavoriteShips(); }
  },

  _isVisible() {
    const { user } = this.props;

    return user && user.hasAccess('Favorite', 'viewer', 'admin');
  },

  _handleLoadMore(){
    let {recent, getRecentOrdersForEachShip} = this.props;
    let pagination = recent.get('pagination');
    if(pagination) getRecentOrdersForEachShip({pagination : pagination.toJS()});
  },

  _handleSplash(e, showMore) {
    debug(`关闭SPLASH，是否显示详细导航:`, showMore);
    cache.set(HIDE_WELCOME_SPLASH, true);
    this.setState({ hideSplash: true });
    global.GUIDES.toggleVisible(showMore);
  },
});

module.exports = Dashboard;
