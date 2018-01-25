const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const EpAppBar = require('~/src/shared/app-bar-with-buttons');
const PropTypes = React.PropTypes;
const ShipDialog = require('~/src/app/ship-dialog');
const Tab = require('epui-md/Tabs/Tab');
const Tabs = require('epui-md/Tabs/Tabs');
const Translatable = require('epui-intl').mixin;
const IconButton = require('epui-md/IconButton');
const IconStar = require('epui-md/svg-icons/toggle/star');
const IconStarBorder = require('epui-md/svg-icons/toggle/star-border');
const FaqIcon = require('~/src/shared/frequently-asked-questions/faq-icon');

const NAME_FONTSIZE = [24, 12]; //[min, differ]
const NAME_LINEHEIGHT = [28, 14]; //[min, differ]
const NAME_PADDING = [13, 5]; //[min, differ]

const ShipHeader = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ShipHeader/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    getShipTypes: PropTypes.func,
    heightPercent: PropTypes.number,
    iconElementLeft: PropTypes.element,
    iconElementRight: PropTypes.element,
    iconClassNameLeft: PropTypes.string,
    iconClassNameRight: PropTypes.string,
    location: PropTypes.object,
    nLabelShipType: React.PropTypes.string,
    nLabelShipSizeType: React.PropTypes.string,
    nLabelShipNationality: React.PropTypes.string,
    nLabelCallSign: React.PropTypes.string,
    nLabelVoyages: React.PropTypes.string,
    nLabelShipParticulars: React.PropTypes.string,
    nLabelShipLogs: React.PropTypes.string,
    nLabelShipReports: React.PropTypes.string,
    nLabelGRT: React.PropTypes.string,
    nLabelNRT: React.PropTypes.string,
    nLabelDWT: React.PropTypes.string,
    nLabelTonnage: React.PropTypes.string,
    nLabelMore: React.PropTypes.string,
    onLeftIconButtonTouchTap: PropTypes.func,
    onRightIconButtonTouchTap: PropTypes.func,
    onTabActive: PropTypes.func,
    ship: PropTypes.object,
    shipTypes: PropTypes.object,
    favorites: PropTypes.object,
    user: PropTypes.object,
  },

  getDefaultProps() {
    return {
      heightPercent: 0,
    };
  },

  componentWillMount() {
    this._getShipTypes();
    this._showNavigations();
  },

  componentDidMount() {
    if(process.env.NODE_ENV !== 'production') {
      if(this.props.iconElementLeft && this.props.iconClassNameLeft) {
        console.warn(
          'Properties iconClassNameLeft and iconElementLeft cannot be simultaneously ' +
          'defined. Please use one or the other.'
        );
      }

      if(this.props.iconElementRight && this.props.iconClassNameRight) {
        console.warn(
          'Properties iconClassNameRight and iconElementRight cannot be simultaneously ' +
          'defined. Please use one or the other.'
        );
      }
    }
  },

  componentDidUpdate(prevProps, prevState) {
    this._showNavigations();
  },

  getStyles() {
    let spacing = this.context.muiTheme.spacing;
    let themeVariables = this.context.muiTheme.appBar;

    let hp = this.props.heightPercent;
    hp = hp > 1 ? 1 : ((hp < 0) ? 0 : hp);

    let nameLineHeight = (NAME_LINEHEIGHT[0] + NAME_LINEHEIGHT[1] * hp) + 'px';
    let nameFontSize = (NAME_FONTSIZE[0] + NAME_FONTSIZE[1] * hp) + 'px';

    let styles = {
      root: {
        color: themeVariables.textColor,
        fontSize: 12,
        fontWeight: 'bold'
      },
      leftNode: {
        imo: {
          root: {
            lineHeight: '18px'
          },
          label: {
            backgroundColor: themeVariables.textColor,
            color: themeVariables.color,
            padding: '1px 2px',
            marginRight: 2,
            marginLeft: 2
          }
        },
        name: {
          lineHeight: nameLineHeight,
          fontSize: nameFontSize
        },
        localName: {
          opacity: hp
        }
      },
      bottomNode: {
        opacity: hp
      },
      iconStyleRignt: {
        marginRight: '-2px',
      },
      rightNode: {
        root: {
          padding: '0 5px',
          display: 'inline-block'
        },
        label: {
          color: themeVariables.textColor,
          display: 'block'
        },
        value: {
          fontSize: 14
        }
      },
      ship:{
        root:{
          color:themeVariables.textColor,
          fontWeight: 500,
          fontSize :12,
          position: 'relative',
        },
        particulars:{
          marginTop : -5,
        },
        element:{
          display: 'inline-block',
          marginRight :20,
          textAlign:'left',
        },
        viewMore:{
          cursor: 'pointer',
          marginLeft: 10,
          fontSize:10,
          color: this.context.muiTheme.palette.accent1Color,
        },
      },
      faq: {
        icon:{
          display: 'inline-block',
          position :'absolute',
          right: '20px',
          textAlign:'left',
          cursor: 'pointer',
          lineHeight:1
        },
      },
      fav: {
        root: {
          width: 'auto',
          height: 'auto',
          padding: 2,
          verticalAlign: 'top'
        },
        icon: {
          fill: '#EFAD0E'
        }
      },
    };

    return styles;
  },

  renderFavoriteStar() {
    const { ship, favorites, user } = this.props;
    if(!ship || !favorites || !user) { return null; }

    if(!user.hasAccess('Favorite', 'viewer', 'admin')) { return null; }

    const editable = user.hasAccess('Favorite', 'updater', 'admin');
    const ok = favorites.isFavoriteShip(ship._id);
    const icon = ok ? (<IconStar />) : (<IconStarBorder />);

    const handler = () => {
      if(ok) { return favorites.removeFavoriteShip(ship._id); }
      return favorites.addFavoriteShip(ship._id, ship.name);
    };

    return (
      <IconButton
        disabled={!editable}
        style={this.s('fav.root')}
        iconStyle={this.s('fav.icon')}
        onTouchTap={handler}>
        {icon}
      </IconButton>
    );
  },

  renderLeftNode() {
    let ship = this.props.ship;

    return (
      <div style={this.style('root')}>
        <div style={this.style('leftNode.imo.root')}>
          <span style={this.style('leftNode.imo.label')}>IMO</span>
          <span>{ship.imo || '-'}</span>
        </div>
        <div style={this.style('leftNode.name')}>{ship.name}{this.renderFavoriteStar()}</div>
        <div style={this.style('leftNode.localName')}>
          {ship.shipLocalName || '-'}
        </div>
      </div>
    );
  },

  renderRightNode() {
    let ship = this.props.ship.toJS();
    let items = [];
    let shipType = this._findShipType(ship.type);

    return (
      <div style={this.style('ship.root')}>
        {/*<div style={this.style('ship.particulars')}>
          <span>{this.t('nLabelShipParticulars')}</span>
          <span
            style={this.style('ship.viewMore')}
            onClick={this._viewShipForm}
          >
            {this.t('nLabelMore')}
          </span>
        </div>*/}
        <div style={this.style('ship.element')}>
          <div>{this.t('nLabelShipType')}</div>
          <div>{shipType}</div>
        </div>
        <div style={this.style('ship.element')}>
          <div>{this.t('nLabelNRT')}</div>
          <div>{ship.nrt && ship.nrt.ictm69 ? ship.nrt.ictm69 +' '+ this.t('nLabelTonnage') : '-'}</div>
        </div>
        <div style = {this.style('ship.element')}>
          <div>{this.t('nLabelGRT')}</div>
          <div>{ship.grt && ship.grt.ictm69 ? ship.grt.ictm69 +' '+ this.t('nLabelTonnage') : '-'}</div>
        </div>
      </div>
    );
  },

  renderTab() {
    let {
      location,
      ship,
    } = this.props;

    let currentPath = location && location.pathname;
    let shipId = ship && ship.get('_id');

    let tabs = [{
      name: this.t('nLabelVoyages'),
      route: `/ship/${shipId}/voyages`
    }, {
      name: this.t('nLabelShipParticulars'),
      route: `/ship/${shipId}/particulars`
    }, {
      name: this.t('nLabelShipLogs'),
      route: `/ship/${shipId}/logs`
    }, {
      name: this.t('nLabelShipReports'),
      route: `/ship/${shipId}/reports`
    }];

    let items = [];
    tabs.forEach((obj, index) => {
      if(obj.name && obj.route) {
        items.push(
          <Tab
            key={obj.route}
            label={obj.name}
            value={obj.route}
            onActive={this._handleTabActive}
          />
        );
      }
    });

    return (
      <Tabs
        ref='tabs'
        key='ship-tabs'
        value={currentPath}
        style={this.style('bottomNode')}
      >
        {items}
      </Tabs>
    );
  },

  render() {
    let {
      ship,
      heightPercent,
      onLeftIconButtonTouchTap,
      onRightIconButtonTouchTap,
      ...others,
    } = this.props;

    let pathname = global.location.pathname;
    let redirect = pathname.substring(0, pathname.search('/ship')) + '/notification';

    return (
      <EpAppBar
        {...others}
        ref="appBar"
        bottomNode={this.renderTab()}
        leftNode={this.renderLeftNode()}
        rightNode={this.renderRightNode()}
        showFAB={false}
        showMenuIconButton={true}
        zDepth={1}
      >
        <ShipDialog ref='dialog' />
      </EpAppBar>
    );
  },
  
  _handleTabActive(tab){
    this.context.router.push(tab.props.value);
    if(this.props.onTabActive) {
      this.props.onTabActive(tab);
    }
  },

  _findShipType(type) {
    if (type) {
      let types = this.props.shipTypes;
      types = types && types.toJS();

      if (_.isArray(types)) {
        let index = _.findIndex(types, {code: type});
        if (index === -1) { return '-'; }

        return types[index].name ? types[index].name.toUpperCase() : '-';
      }
    }

    return '-';
  },

  _getShipTypes() {
    let {
      getShipTypes,
      shipTypes,
    } = this.props;

    if (!shipTypes || shipTypes.size === 0) {
      if (_.isFunction(getShipTypes)) {
        getShipTypes();
      }
    }
  },

  _showNavigations() {
    let register = global.register;
    let leftNav = register && register.leftNav;
    let rightNav = register && register.rightNav;

    if (leftNav) { leftNav.show(); }
    if (rightNav) { rightNav.show(); }
  },

  _viewShipForm() {
    //show ship form dialog
    let ship = this.props.ship;
    let shipId = ship && ship._id;
    if (shipId) {
      let dialogEl = this.refs.dialog;
      dialogEl.show(shipId);
    }
  },
});

module.exports = ShipHeader;
