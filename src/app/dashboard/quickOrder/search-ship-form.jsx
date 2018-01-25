const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const FlatButton = require('epui-md/FlatButton');
const IconSearch = require('epui-md/svg-icons/action/search');
const TextField = require('epui-md/TextField/TextField');
const ListEntryShip = require('./list-entry-ship');
const Paper = require('epui-md/Paper');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const { comboSearch } = global.api.epds;
const PropTypes = React.PropTypes;

const SearchShip = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Dashboard/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onItemTouchTap: PropTypes.func,
    onCheckAvailable: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {
      loading: false,
      results: {},
      isSearched: false,
      valueLength: 0,
    };
  },

  getStyles() {
    let styles = {
      root: {
        width: 760,
        height: 265,
        padding: '10px 0px',
        overflow: 'auto',
      },
      title: {
        fontSize: 16,
        color: '#4a4a4a',
        display: 'block',
        marginTop: 20,
      },
      search: {
        root: {
          position: 'relative',
        },
        icon: {
          margin: '6px 10px',
          fill: '#F5A622',
          position: 'absolute',
          left: 510,
          top: 5,
        },
        input: {
          display: 'inline-block',
          float: 'left',
          border: 'none',
          outline: 0,
          width: 546,
          height: 48,
          fontSize: 16,
          verticalAlign: 'middle',
          cursor: null,
        },
      },
      entry: {
        height: 48,
        position: 'relative',
        cursor: 'pointer',
      },
      notFound:{
        width: '100%',
        height: '100%',
        lineHeight: '265px',
        textAlign: 'center',
      },
      searchTitle: {
        fontSize: 16,
        display: 'block',
        marginBottom: 15,
      },
      result: {
        position: 'absolute',
        top: 160,
      },
    };

    return styles;
  },

  componentWillMount() {

  },

  componentDidMount() {

  },

  renderSearchInput(styles) {
    return (
      <div style={styles.search.root} onTouchTap={this._handleTouchTap}>
        <TextField
          ref='searchInput'
          hintText={this.t('nHintTextSearchPorts')}
          style={styles.search.input}
          onChange={this._handleInputChange}
        />
        <IconSearch
          style={styles.search.icon}
        />
      </div>
    );
  },

  renderShipEntry(entry, styles) {
    return (
      <div
        className='ship-search-entry'
        key={entry._id}
        style={styles.entry}
      >
        <ListEntryShip
          entry={entry}
          showIcon={false}
          onTouchTap={this._handleTouchTapShip.bind(this, entry)}
        />
      </div>
    )
  },

  renderShipList(results, styles) {
    let entries = null;
    let { isSearched } = this.state;
    if(results && results.length > 0) {
      entries = _.map(results, it => this.renderShipEntry(it,styles));
      return (
        <div style={styles.result}>
          <span style={styles.searchTitle}>
            {this.t('nTextSearchResult')}
          </span>
          {this.renderPaper(entries,styles)}
        </div>
      );
    }
    else{
      if(isSearched){
        let node = (
          <div style={styles.notFound}>
            {this.t('nTextNoShipFound')}
          </div>
        );
        return (
          <div style={styles.result}>
            <span style={styles.searchTitle}>
              {this.t('nTextSearchResult')}
            </span>
            {this.renderPaper(node,styles)}
          </div>
        );
      }else{
        return null;
      }
    }
  },

  renderPaper(node,styles) {
    return (
      <Paper
        zDepth={1}
        style={styles.root}
      >
        {node}
      </Paper>
    );
  },

  render() {
    let styles = this.getStyles();
    const { loading, results, error } = this.state;
    return (
      <div>
        <span style={styles.title}>{this.t('nTextSearchVessel')}</span>
        {this.renderSearchInput(styles)}
        {this.renderShipList(results, styles)}
      </div>
    );
  },

  _search(searchQuery) {
    const { onCheckAvailable } = this.props;
    if(!searchQuery || !comboSearch) {
      return this.setState({
        results: null,
        error: null,
        loading: false
      });
    };

    this.setState({
      loading: true
    }, () => {
      comboSearch.promise(searchQuery, true).then(res => {
        let error, results = null, loading = false, isSearched = true;

        if(res.status !== 'OK') {
          error = res;
        } else {
          results = res.response;
        }

        this.setState({ results, error, loading, isSearched });
        this.props.onCheckAvailable(results.length);
      }).catch(err => {
        this.setState({
          results: null,
          error: err,
          loading: false
        });
        this.props.onCheckAvailable(0);
      });
    });
  },

  _handleInputChange() {
    let value = this.refs.searchInput.getValue();
    let valueLength = value.length;
    this.setState({
      valueLength,
    });
    if(this.state.valueLength === 1){
      if( valueLength < this.state.valueLength ) {
        this.setState({
          results:{},
          isSearched: false,
        });
        this.props.onCheckAvailable(true);
        return;
      }
    }

    this._search(value);
  },

  _handleTouchTapShip(entry) {
    const { onItemTouchTap } = this.props;
    if(onItemTouchTap) {
      onItemTouchTap(entry);
    }
  }
});

module.exports = SearchShip;
