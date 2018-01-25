const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DashboardCard = require('./dashboard-card');
const IconAdd = require('epui-md/svg-icons/action/ship-register');
const IconSearch = require('epui-md/svg-icons/action/ship-search');
const DashboardCardButton = require('./dashboard-card-button');
const AddButton = require('epui-md/svg-icons/content/add');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const QuickRegisterDialog = require('~/src/app/ship-dialog/ship-quick-form');
const QuickOrderDialog = require('~/src/app/dashboard/quickOrder/quick-order-dialog');
const EventListener = require('epui-md/internal/EventListener');
const Events = require('epui-md/utils/events');
const PropTypes = React.PropTypes;
const StyleResizable = require('epui-md/utils/styleResizable');
const Translatable = require('epui-intl').mixin;
const moment = require('moment');
const { getSubPath } = require('~/src/utils');

const { ACCOUNT_TYPE } = require('~/src/shared/constants');

const Sizes = {
  SMALL: 1,
  MEDIUM: 2,
  LARGE: 3,
  XLARGE: 4,
  XXLARGE: 5,
};

const DashboardCards = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Dashboard/${__LOCALE__}`),

  contextTypes: {
  	muiTheme: PropTypes.object,
    guides: PropTypes.object,
  },

  propTypes: {
    showMore: PropTypes.bool,
    more: PropTypes.array,
    account: PropTypes.object,
    entry: PropTypes.array,
    favorites: PropTypes.array,
    style: PropTypes.object,
    nTextChooseShip: PropTypes.string,
    nTextLoadMore: PropTypes.string,
    loadMore: PropTypes.number,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      registerOpen: false,
      searchOpen: false,
      showMore: this.props.showMore,
      loadNumber: 18,
    };
  },

  componentWillMount() {
    if(global.location.pathname.search(/\/quickOrder$/) !== -1)
    this.setState({searchOpen:true});
  },

  componentWillUpdate(nextProps) {
    const AddNumber = 20;
    let { loadNumber } = this.state;
    if(nextProps.loadMore !== this.props.loadMore){
      this.setState({loadNumber:loadNumber + AddNumber * nextProps.loadMore});
    }
  },

  componentDidMount() {
    this._updateDeviceSize();

    this.timer = setTimeout(() => {
      const { guides } = this.context;
      guides.signIn('dashboard.cards.search', this.refs.search);
      guides.signIn('dashboard.cards.register', this.refs.register);
    }, 460);
  },

  componentWillUnmount() {
    const { guides } = this.context;
    guides.signOff('dashboard.cards.search');
    guides.signOff('dashboard.cards.register');
    clearTimeout(this.timer);
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let { style } = this.props;
    let { deviceSize } = this.state;
    let styles = {
      root: {
        position: 'relative',
        margin: '20px auto',
        padding: '5px',
        width: '380px',
        maxWidth: '1170px',
        overflow: 'hidden',
        textAlign: 'left',
        boxSizing: 'border-box',
      },
      rootWhenMedium: {
        width: '590px',
      },
      rootWhenLarge: {
        width: '880px',
      },
      rootWhenXLarge: {
        width: '1170px',
      },
      card: {
        margin: '5px 10px',
        width: '350px',
        height: '150px',
      },
      addBtn:{
        width: 120,
        textAlign: 'center',
        position: 'fixed',
        right: 100,
        top: 28,
        zIndex: 1000,
      },
      cardWhenMedium: {
        width: '270px',
      },
      cardWhenLarge: {
        width: '270px',
      },
      cardWhenXLarge: {
        width: '270px',
      },
      buttonWhenMedium: {
        right: 100,
      },
      buttonWhenLarge: {
        right: 200,
      },
      buttonWhenXLarge: {
        right: 400,
      },
      moreWrapper: {
        marginTop: '20px',
        width: '100%',
        height: '40px',
        boxSizing: 'border-box',
        textAlign: 'center',
      },
      more: {
        textDecoration: 'underline',
        cursor: 'pointer',
        color: theme.epColor.orangeColor,
        fontSize: '16px',
      },
      message: {},
    };

    if (deviceSize === Sizes.MEDIUM) {
      styles.root = _.merge(styles.root, styles.rootWhenMedium);
      styles.card = _.merge(styles.card, styles.cardWhenMedium);
      styles.addBtn = _.merge(styles.addBtn, styles.buttonWhenMedium);
    }

    if (deviceSize === Sizes.LARGE) {
      styles.root = _.merge(styles.root, styles.rootWhenLarge);
      styles.card = _.merge(styles.card, styles.cardWhenLarge);
      styles.addBtn = _.merge(styles.addBtn, styles.buttonWhenMedium);
    }

    if (deviceSize === Sizes.XLARGE) {
      styles.root = _.merge(styles.root, styles.rootWhenXLarge);
      styles.card = _.merge(styles.card, styles.cardWhenXLarge);
      styles.addBtn = _.merge(styles.addBtn, styles.buttonWhenLarge);
    }

    if (deviceSize === Sizes.XXLARGE) {
      styles.root = _.merge(styles.root, styles.rootWhenXLarge);
      styles.card = _.merge(styles.card, styles.cardWhenXLarge);
      styles.addBtn = _.merge(styles.addBtn, styles.buttonWhenXLarge);
    }

    styles.root = _.merge(styles.root, style);

    return styles;
  },

  renderCards(entry, more, favorites) {
    let favs = [].concat(favorites);
    let elements = [];
    let arr = this.state.showMore && entry;
    arr && arr.forEach((entry, index) => {
      let orderType = entry.type;
      let segment = entry.segment;
      let ship = entry.ship;
      let read = entry.read;
      // let isFavorite = entry.isFavorite;
      let timePoint = this._getTimePoints(segment);
      // let port = timePoint && timePoint.type === 'ETA' ?
      //            segment && segment.arrivalPort :
      //            segment && segment.departurePort;
      // 根据侯同章的建议改成到达港口
      let port = _.get(segment, 'arrivalPort');
      let portName = port && port.name;
      let shipId = ship && ship._id;
      let shipName = ship && ship.name;
      let typeName = orderType && orderType.name;
      let isFav = !!_.find(favs, { id: shipId });
      let isFin = entry.isFinished;
      elements.push(
        <DashboardCard
          key={shipId}
          orderType={typeName}
          portName={portName}
          shipId={shipId}
          shipName={shipName}
          style={this.style('card')}
          timePoint={timePoint}
          onTouchTap={this._handleTouchTapCard}
          isFinished={isFin}
          isFavorite={isFav}
          read={read}
        />
      );

      _.isArray(favs) && _.remove(favs, (fav) => {
        return fav.id == shipId;
      });
    });
    if (_.isArray(favs)) {
      _.forEach(favs, (fav, idx) => {
        let shipId = fav.id;
        let shipName = fav.name;
        elements.unshift(
          <DashboardCard
            key={shipId}
            shipId={shipId}
            shipName={shipName}
            style={this.style('card')}
            onTouchTap={this._handleTouchTapCard}
            isFavorite={true}
          />
        );
      });
    }

    // let elementLoads = [], { loadNumber } = this.state;
    // if( loadNumber < arr.length) {
    //   elementLoads = elements.slice(0, loadNumber);
    // }else {
    //   elementLoads = elements;
    // }

    elements.push(
      <DashboardCardButton
        ref='search'
        key='search'
        style={this.style('card')}
        title={this.t('nTextSearchShip')}
        icon={<IconSearch />}
        onTouchTap={this._handleTouchTapSearch}
      />
    );

    elements.push(
      <DashboardCardButton
        ref='register'
        key='register'
        style={this.style('card')}
        title={this.t('nTextRegisterShip')}
        icon={<IconAdd />}
        onTouchTap={this._handleTouchTapRegister}
      />
    );

    return elements;
  },

  renderAddBtn() {
    // if(!this.props.account.isConsigner()) { return; }
    return(
      <div style = {this.style('addBtn')} title={this.t('nTextQuickOrderTitle')}>
        <FloatingActionButton
          onTouchTap={this._handleAddTouch}
          backgroundColor = {'#f5a623'}
        >
          <AddButton />
        </FloatingActionButton>
      </div>
    );
  },

  renderQuickOrderDialog() {
    let { searchOpen } = this.state;
    return searchOpen && (
      <QuickOrderDialog
        ref='quickOrder'
        onCloseDialog={this._handleCloseDialog}
        open={searchOpen}
      />
    );
  },

  renderQuickRegisterDialog() {
    let { registerOpen } = this.state;
    return registerOpen && (
      <QuickRegisterDialog
        ref='quickRegister'
        onCloseDialog={this._handleCloseDialog}
        open={registerOpen}
      />
    );
  },

  render() {
    let {
      entry,
      more,
      favorites,
    } = this.props;

    let { showMore } = this.state;

    const elLoadMore = false ? (
      <div style={this.style('moreWrapper')}>
        <span
          onTouchTap={this._handleLoadMore}
          style={this.style('more')}
        >
          {this.t('nTextLoadMore')}
        </span>
      </div>
    ) : null;

    return (
      <div style={this.style('root')}>
        <EventListener
          target={window}
          onResize={this._updateDeviceSize}
        />
        {this.renderCards(entry, more, favorites)}
        {elLoadMore}
        {this.renderAddBtn()}
        {this.renderQuickOrderDialog()}
        {this.renderQuickRegisterDialog()}
      </div>
    );
  },

  _handleAddTouch(){
    this.setState({searchOpen:true});
  },

  _handleCloseDialog(){
    setTimeout(() => {
      this.setState({
        searchOpen:false,
        registerOpen:false,
      });
    },500)
  },

  _handleTouchTapSearch() {
    global.cli.navigation.openComboSearch('');
  },

  _handleTouchTapRegister() {
    // global.tools.toSubPath('ship/register');
    this.setState({registerOpen:true});
  },

  _handleTouchTapCard(shipId) {
    if (!shipId) { return; }
    global.tools.toSubPath(`ship/${shipId}/voyage`);
  },

  _updateDeviceSize() {
    let width = window.innerWidth;
    if( width >= 1470) this.setState({deviceSize: Sizes.XXLARGE});
    else if (width >= 1170) this.setState({deviceSize: Sizes.XLARGE});
    else if (width >= 880) this.setState({deviceSize: Sizes.LARGE});
    else if (width >= 590) this.setState({deviceSize: Sizes.MEDIUM});
    else this.setState({deviceSize: Sizes.SMALL}); // width >= 375
  },

  _getEstimatedAndTime(segment) {
    let tp = _.get(segment, ['schedule', 'timePoints']);
    let arrival = tp.arrival;
    return {
      type:arrival.estimated ? 'ETA' : 'ATA',
      time:arrival.time,
    }
  },

  _getTimePoints(segment) {
    let tp = _.get(segment, ['schedule', 'timePoints']);
    if(!tp) { return null; }

    let pts = [tp.arrival, tp.berth, tp.departure];
    let periods = _.map(pts, (pt) => { return pt && pt.period && pt.period.toUpperCase(); });
    let dates = _.map(pts, (pt) => { return pt && pt.time; });
    let type = tp.arrival.estimated ? 'ETA' : 'ATA';

    let pt = pts[0];
    let date = dates[0];
    let period = periods[0];


    let now = moment();

    _.forEach(dates, (d, idx) => {
      if(!d || now.isAfter(moment(d))) { return; }
      pt = pts[idx];
      period = pt.estimated ? null : periods[idx];
    });

    if(!date) { return null; }

    let titDate = this.toShortDateAndTime(date);
    let strDate = this.toShortDateWithoutYear(date);
    let strTime = period ? (period !== 'FULLDAY' ? this.t(`nLabelVoyageTimePeriod${period}`) : null) : this.toTime(date);

    return {
      date: date,
      titDate: titDate,
      type: type,
      strDate: strDate,
      strTime: strTime,
    };
  },

  _handleLoadMore() {
    this.setState({
      showMore: false,
    })
  }
});

module.exports = DashboardCards;
