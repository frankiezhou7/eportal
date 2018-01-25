const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const EpAppBar = require('~/src/shared/app-bar-with-buttons');
const PropTypes = React.PropTypes;
const Tab = require('epui-md/Tabs/Tab');
const Tabs = require('epui-md/Tabs/Tabs');
const Translatable = require('epui-intl').mixin;
const IconButton = require('epui-md/IconButton');
const IconStar = require('epui-md/svg-icons/toggle/star');
const IconStarBorder = require('epui-md/svg-icons/toggle/star-border');
const FaqIcon = require('~/src/shared/frequently-asked-questions/faq-icon');

const NAME_FONTSIZE = [24, 12]; //[min, differ]
const NAME_LINEHEIGHT = [28, 14]; //[min, differ]
const NAME_PADDING = [3, 5]; //[min, differ]

const PortHeader = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/PortHeader/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
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
    port: PropTypes.object,
    favorites: PropTypes.object,
    user: PropTypes.object,
  },

  getDefaultProps() {
    return {
      port: {},
      heightPercent: 0,
    };
  },

  componentWillMount() {
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
        fontWeight: 'bold',
        position: 'relative',
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
      faq:{
        root:{
          display: 'inline-block',
          position :'absolute',
          right: '20px',
          textAlign:'left',
          cursor: 'pointer',
          lineHeight:1,
        },
      },
      fav: {
        root: {
          width: 'auto',
          height: 'auto',
          padding: 2,
          verticalAlign: 'top',
        },
        icon: {
          fill: '#EFAD0E',
        },
      },
    };

    return styles;
  },

  renderFavoriteStar() {
    const { port, favorites, user } = this.props;
    if(!port || !favorites || !user) { return null; }

    if(!user.hasAccess('Favorite', 'viewer', 'admin')) { return null; }

    const editable = user.hasAccess('Favorite', 'updater', 'admin');
    const ok = favorites.isFavoritePort(port._id);
    const icon = ok ? (<IconStar />) : (<IconStarBorder />);

    const handler = () => {
      if(ok) { return favorites.removeFavoritePort(port._id); }
      return favorites.addFavoritePort(port._id, port.name);
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
    let port = this.props.port;

    return (
      <div style={this.style('root')}>
        <div style={this.style('leftNode.code.root')}>
          <span style={this.style('leftNode.code.label')}>CODE : </span><span>{port.code || '-'}</span>
        </div>
        <div style={this.style('leftNode.name')}>{port.name}{this.renderFavoriteStar()}</div>
        <div style={this.style('leftNode.localName')}>{port.localName || '-'}</div>
      </div>
    );
  },

  renderRightNode() {
    let port = this.props.port;
    let items = [];

    if(port.portType && port.portType.name) {
      items.push(
        <div style={this.style('rightNode.root')} key='portType'>
          <span style={this.style('rightNode.label')}>{this.t('nLabelPortType')}</span>
          <span style={this.style('rightNode.value')}>{port.portType.name.toUpperCase()}</span>
        </div>
      );
    }
    if(port.portSizeType && port.portSizeType.name) {
      items.push(
        <div style={this.style('rightNode.root')} key='portSizeType'>
          <span style={this.style('rightNode.label')}>{this.t('nLabelPortSizeType')}</span>
          <span style={this.style('rightNode.value')}>{port.portSizeType.name.toUpperCase()}</span>
        </div>
      );
    }
    if(port.portNationality && port.portNationality.name) {
      items.push(
        <div style={this.style('rightNode.root')} key='portNationality'>
          <span style={this.style('rightNode.label')}>{this.t('nLabelPortNationality')}</span>
          <span style={this.style('rightNode.value')}>{port.portNationality.name.toUpperCase()}</span>
        </div>
      );
    }
    if(items.length <= 0) { return null; }

    return (
      <div style={this.style('root')}>
        {items}
      </div>
    );
  },

  render() {
    let {
      port,
      heightPercent,
      onLeftIconButtonTouchTap,
      onRightIconButtonTouchTap,
      ...others,
    } = this.props;

    let pathname = global.location.pathname;
    let redirect = pathname.substring(0, pathname.search('/port')) + '/notification';

    return (
      <EpAppBar
        {...others}
        ref="appBar"
        leftNode={this.renderLeftNode()}
        rightNode={this.renderRightNode()}
        showFAB={false}
        showMenuIconButton={true}
        zDepth={1}
      />
    );
  },
  
  _showNavigations() {
    let register = global.register;
    let leftNav = register && register.leftNav;
    let rightNav = register && register.rightNav;

    if (leftNav) { leftNav.show(); }
    if (rightNav) { rightNav.show(); }
  },

});

module.exports = PortHeader;
