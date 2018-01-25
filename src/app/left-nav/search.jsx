const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('eplodash');
const RaisedButton = require('epui-md/RaisedButton');
const AutoStylable = require('epui-auto-style');
const Translatable = require('epui-intl');

const ListEntryShip = require('~/src/shared/list-entry-ship');
const ListEntryPort = require('~/src/shared/list-entry-port');
const QuickRegisterDialog = require('~/src/app/ship-dialog/ship-quick-form');

const IconButton = require('epui-md/IconButton');
const IconStar = require('epui-md/svg-icons/toggle/star');
const IconStarBorder = require('epui-md/svg-icons/toggle/star-border');

const { Component, PropTypes } = React;

class SearchResults extends Component {
  static propTypes = {
    user: PropTypes.object,
    searchQuery: PropTypes.string,
    countries: PropTypes.any,
    favorites: PropTypes.any,
    onItemTouchTap: PropTypes.func,
    comboSearch: PropTypes.func,
  };

  static contextTypes = {
    muiTheme: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      registerOpen: false,
    };
  }

  componentWillMount() {
    const { countries, favorites } = this.props;

    if(!countries || countries.size <= 0) { global.api.epds.listCountries(); }
    if(!favorites || !favorites.ships) { favorites.getFavoriteShips(); }
    if(!favorites || !favorites.ports) { favorites.getFavoritePorts(); }

    this._search();
  }

  componentWillReceiveProps(nextProps) {
    const { searchQuery } = nextProps;

    if (searchQuery !== this.props.searchQuery) {
      this._search(nextProps);
    }
  }

  getStyles() {
    const palette = this.context.muiTheme.palette;

    let styles = {
      root: {
        borderTop: '1px solid #EAEAEA',
      },
      body: {
        padding: 10,
        borderTop: '1px solid #EAEAEA',
      },
      text: {
        paddingBottom: 10,
      },
      btnRegister: {
        width: '100%'
      },
      empty: {
        paddingTop: 10
      },
      note: {
        paddingTop: 10,
        color: 'grey'
      },
      info: {
        color: palette.infoColor,
      },
      favIcon: {
        fill: '#EFAD0E',
      },
      fav: {
        position: 'absolute',
        right: 0,
      },
      entry: {
        height: 48,
        position: 'relative',
        borderBottom: '1px solid #EAEAEA',
      }
    }

    return styles;
  }

  renderStar(entry) {
    if(!this._isFavVisible()) { return; }

    const { favorites } = this.props;

    let isPort = entry.category === 'port';
    let favs =  isPort ? favorites.ports : favorites.ships;

    let fav = favs && favs.find(f => f.id === entry._id);
    let Icon = fav ? IconStar : IconStarBorder;
    const editable = this._isFavEditable();

    let handler = fav && editable ? e => this._handleRemoveFavorite(e, entry, fav) : e => this._handleAddFavorite(e, entry, fav);

    let tooltip = null;
    if(fav) {
      tooltip = isPort ? this.t('nHintRemoveFavoritePort') : this.t('nHintRemoveFavoriteShip');
    } else {
      tooltip = isPort ? this.t('nHintAddFavoritePort') : this.t('nHintAddFavoriteShip');
    }

    return (
      <IconButton
        disabled={!editable}
        iconStyle={this.s('favIcon')}
        onTouchTap={handler}
        style={this.s('fav')}
      >
        <Icon />
      </IconButton>
    )
  }

  renderShipEntry(entry) {
    return (
      <div
        className='combo-search-entry'
        key={entry._id}
        style={this.s('entry')}
      >
        <ListEntryShip
          entry={entry}
          showIcon={true}
          onTouchTap={e => this._handleTouchTapShip(e, entry._id)}
        />
        {this.renderStar(entry)}
      </div>
    )
  }

  renderPortEntry(entry) {
    return (
      <div
        className='combo-search-entry'
        key={entry._id}
        style={this.s('entry')}
      >
        <ListEntryPort
          entry={entry}
          showIcon={true}
          countries={this.props.countries}
          onTouchTap={e => this._handleTouchTapPort(e, entry._id)}
        />
        {this.renderStar(entry)}
      </div>
    );
  }

  renderEntry(entry) {
    if(entry.category === 'port') { return this.renderPortEntry(entry); }
    if(entry.category === 'ship') { return this.renderShipEntry(entry); }
  }

  renderGuide(showEmpty) {
    let elEmpty = showEmpty ? (<div style={this.s('text', 'empty')}>{this.t('nTextNoPortOrShip')}</div>) : null;
    return (
      <div key='guide-register' className='combo-search-empty' style={this.s('body')}>
        {elEmpty}
        <div style={this.s('text', 'note')}>{this.t('nTextGuideToRegisterShip')}</div>
        <RaisedButton
          style={this.s('btnRegister')}
          primary={true}
          fullWidth={true}
          label={this.t('nLabelRegisterShip')}
          onTouchTap={this._handleRegisterShip}
        />
      </div>
    );
  }

  renderNoResult() {
    let searchQuery = this.props.searchQuery;
    let results = this.state.results;

    return !searchQuery ? (
      <div
        className='combo-search-initial'
        style={this.s('body', 'text', 'info')}
        dangerouslySetInnerHTML={{__html: this.t('nHtmlSearchHint')}}
      />
    ) : this.renderGuide(true);
  }

  renderQuickRegisterDialog() {
    let { registerOpen } = this.state;
    if(!registerOpen) return;
    return (
      <QuickRegisterDialog
        onCloseDialog={this._handleCloseDialog.bind(this)}
      />
    );
  }

  render() {
    const { loading, results, error } = this.state;

    let entries = null;

    if(results && results.length > 0) {
      entries = _.map(results, it => this.renderEntry(it));

      if(results.length < 20) {
        entries.push(this.renderGuide(false));
      }
    }

    if(!loading && !entries) {
      return (
        <div>
          {this.renderNoResult()}
          {this.renderQuickRegisterDialog()}
        </div>
      );
    }

    return (
      <div className='combo-search' style={this.s('root')}>
        {entries}
        {this.renderQuickRegisterDialog()}
      </div>
    );
  }

  _search(props) {
    props = props || this.props;

    const { searchQuery, comboSearch } = props;
    if(!searchQuery || !comboSearch) {
      return this.setState({
        results: null,
        error: null,
        loading: false
      });
    }

    this.setState({
      loading: true
    }, () => {
      comboSearch.promise(this.props.searchQuery).then(res => {
        let error, results = null, loading = false;

        if(res.status !== 'OK') {
          error = res;
        } else {
          debug(`综合搜索: key=${searchQuery}, count=${res.response.length}`);
          results = res.response;
        }

        this.setState({ results, error, loading });
      }).catch(err => {
        debug(`综合搜索出错`, err);
        this.setState({
          results: null,
          error: err,
          loading: false
        });
      });
    });
  }

  _handleCloseDialog(){
    this.setState({registerOpen:false});
  }

  _handleAddFavorite = (evt, entry) => {
    const favorites = this.props.favorites;
    if(entry.category === 'ship') {
      favorites.addFavoriteShip(entry._id, entry.name);
    } else if(entry.category === 'port') {
      favorites.addFavoritePort(entry._id, entry.name);
    }
  }

  _handleRemoveFavorite = (e, entry, favEntry) => {
    const favorites = this.props.favorites;
    favorites.removeFavorite(favEntry._id);
  }

  _handleTouchTapShip = (e, id) => {
    const { onItemTouchTap } = this.props;
    if(onItemTouchTap) {
      onItemTouchTap(e, 'open_ship', id);
    }
    global.tools.toSubPath(`/ship/${id}`);
  }

  _handleTouchTapPort = (e, id) => {
    const { onItemTouchTap } = this.props;
    if(onItemTouchTap) {
      onItemTouchTap(e, 'open_port', id);
    }
    global.tools.toSubPath(`/port/${id}`);
  }

  _handleRegisterShip = e => {
    // const { onItemTouchTap } = this.props;
    // if(onItemTouchTap) {
    //   onItemTouchTap(e, 'register_ship');
    // }
    // global.tools.toSubPath(`/ship/register`);
    this.setState({registerOpen:true});
  }

  _isFavVisible = () => {
    const { user } = this.props;
    return user && user.hasAccess('Favorite', 'viewer', 'admin');
  }

  _isFavEditable = () => {
    const { user } = this.props;
    return user && user.hasAccess('Favorite', 'updater', 'admin');
  }
}

module.exports = AutoStylable(Translatable(SearchResults));
