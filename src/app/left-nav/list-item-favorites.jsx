const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('eplodash');
const RaisedButton = require('epui-md/RaisedButton');
const AutoStylable = require('epui-auto-style');
const Translatable = require('epui-intl');

const ListItem = require('epui-md/List/ListItem');

const ListEntryShip = require('~/src/shared/list-entry-ship');
const ListEntryPort = require('~/src/shared/list-entry-port');

const IconButton = require('epui-md/IconButton');
const IconStar = require('epui-md/svg-icons/toggle/star');
const IconStarBorder = require('epui-md/svg-icons/toggle/star-border');
const IconPort = require('epui-md/svg-icons/ep/port');
const IconShip = require('epui-md/svg-icons/ep/ship');
const { Component, PropTypes } = React;

class ListItemFavorites extends Component {
  static propTypes = {
    user: PropTypes.object,
    type: PropTypes.oneOf(['port', 'ship']).isRequired,
    favorites: PropTypes.object,
    onItemTouchTap: PropTypes.func,
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = { loading: false };
  }

  componentWillMount() {
    this._fetchFavorites();
  }

  getStyles() {
    return {
      favIcon: {
        fill: '#EFAD0E',
      },
      fav: {
        position: 'absolute',
        right: 0,
      },
      empty: {
        color: 'grey'
      }
    };
  }

  renderStar(fav) {
    let handler = e => this._handleRemoveFavorite(e, fav);
    let tooltip = this.props.type === 'port' ? this.t('nHintRemoveFavoritePort') : this.t('nHintRemoveFavoriteShip');

    return (
      <IconButton
        disabled={!this._isEditable()}
        style={this.s('fav')}
        iconStyle={this.s('favIcon')}
        onTouchTap={handler}
      >
        <IconStar />
      </IconButton>
    )
  }

  render() {
    if(!this._isVisible()) { return null; }

    const { type, favorites } = this.props;
    let theme = this.context.muiTheme;
    let color = theme && theme.epColor.portColor;
    const portIcon = (<IconPort color={color}/>);
    const shipIcon = (<IconShip color={color}/>);
    const leftIcon = type === 'port' ? portIcon : shipIcon;
    const title = type === 'port' ? this.t('nTitleFavoritePorts') : this.t('nTitleFavoriteShips');
    const favs = !favorites ? null : type === 'port' ? favorites.get('ports') : favorites.get('ships');
    let items = [];
    if(favs) {
      items = favs.map(f => {
        const id = f.get('id');
        const name = f.get('name');
        const handler = e => this._handleTouchTap(e, id);
        const star = this.renderStar(f);
        return (
          <ListItem
            key={id}
            primaryText={name}
            rightIconButton={star}
            onTouchTap={handler}
          />
        );
      }).toArray();
    }

    if(items.length <= 0) {
      const text = type === 'port' ? this.t('nTextNoFavoritePort') : this.t('nTextNoFavoriteShip');
      const el = (<span style={this.s('empty')}>{text}</span>);
      items.push(
        <ListItem
          key='empty'
          primaryText={el}
        />
      );
    }

    return (
      <ListItem
        primaryText={title}
        primaryTogglesNestedList={true}
        nestedItems={items}
        leftIcon={leftIcon}
      />
    )
  }

  _fetchFavorites() {
    const { type, favorites } = this.props;
    const isVisible = this._isVisible();
    const isLoading = favorites && favorites.getMeta('loading');

    if(!favorites || !isVisible || isLoading) { return; }

    if(type === 'port' && !favorites.get('ports')) {
      favorites.getFavoritePorts();
    } else if(type === 'ship' && !favorites.get('ships')) {
      favorites.getFavoriteShips();
    }
  }

  _isVisible() {
    const { user } = this.props;
    return user && user.hasAccess('Favorite', 'viewer', 'admin');
  }

  _isEditable() {
    const { user } = this.props;
    return user && user.hasAccess('Favorite', 'updater', 'admin');
  }

  _handleTouchTap(e, id) {
    const { onItemTouchTap } = this.props;
    if(!onItemTouchTap) { return; }
    onItemTouchTap(e, id);
  }

  _handleRemoveFavorite(e, fav) {
    if(!this.props.favorites) { return; }
    this.props.favorites.removeFavorite(fav._id);
  }
}

module.exports = AutoStylable(Translatable(ListItemFavorites));
