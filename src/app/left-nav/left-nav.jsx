const _ = require('eplodash');
const React = require('react');
const ReactDOM = require('react-dom');
const Drawer = require('epui-md/Drawer');
const Paper = require('epui-md/Paper');

const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const Header = require('./header');
const Search = require('./connected-search');
const Navigation = require('./connected-navigation');

const PropTypes = React.PropTypes;

require('./style.css');


const LeftNav = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Navigation/${__LOCALE__}`),
    require(`epui-intl/dist/Favorites/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    user: PropTypes.object,
    mode: PropTypes.oneOf(['search', 'navigate']),
    open: PropTypes.bool,
    docked: PropTypes.bool,
    onRequestToggle: PropTypes.func,
    searchQuery: PropTypes.string,
  },

  getDefaultProps() {
    return {
      mode: 'navigate',
      open: false,
      docked: false,
      searchQuery: '',
    };
  },

  getInitialState() {
    const { mode, searchQuery } = this.props;
    return { mode, searchQuery };
  },

  componentWillReceiveProps(nextProps) {
    let { mode, searchQuery } = nextProps;
    if(mode !== this.state.mode) {
      this.setState({ mode });
    }
    if(searchQuery !== this.state.searchQuery) {
      this.setState({ searchQuery });
    }
  },

  componentDidUpdate() {
    if(this.state.mode === 'search') {
      this.refs.header.focus();
    }
  },

  getStyles() {
    let { style } = this.props;
    let { muiTheme } = this.context;

    let styles = {
      root: {
        overflow: 'hidden',
        position: 'relative',
      },
      content: {
        height: '100%',
        overflow: 'hidden'
      },
      navigation: {
        height: 'calc(100% - 192px)',
        position: 'relative',
        overflowY: 'auto',
      },
    };

    styles.root = _.merge(styles.root, style);

    return styles;
  },

  renderHeader() {
    const { mode, searchQuery } = this.state;

    return (
      <Header
        ref='header'
        key = 'header'
        mode={mode}
        searchQuery={searchQuery}
        onRequestQuitSearch={this._handleQuitSearch}
        onSearchInputClear={this._handleSearchInputClear}
        onSearchInputChange={this._handleSearchInputChange}
        onSearchInputFocus={this._handleSearchInputFocus}
      />
    );
  },

  renderSearch() {
    const { searchQuery } = this.state;

    return (
      <Search
        key ='search'
        searchQuery={searchQuery}
        onItemTouchTap={this._handleNavItemTouchTap}
      />
    );
  },

  renderNavigation() {
    return (
      <Navigation
        key ='nav'
        style={this.s('navigation')}
        onItemTouchTap={this._handleNavItemTouchTap}
      />
    );
  },

  render() {
    const { open, docked } = this.props;
    const { mode } = this.state;

    const elHeader = this.renderHeader();
    const elContent = mode === 'search' ? this.renderSearch() : this.renderNavigation();

    return (
      <Drawer
        open={open}
        docked={docked}
        style={this.style('root')}
        onRequestChange={this._handleNavChange}
        disableSwipeToOpen={true}
      >
        <Paper style={this.style('content')}>
          {elHeader}
          {elContent}
        </Paper>
      </Drawer>
    );
  },

  _handleNavItemTouchTap(e, reason, ...extra) {
    this._handleNavChange(false, reason);
    if(reason === 'open_ship') {
      debug(`打开船舶页面`, extra[0]);
    } else if(reason === 'open_port') {
      debug(`打开港口页面`, extra[0]);
    } else if(reason === 'register_ship') {
      debug(`打开船舶注册页面`);
    }
  },

  _handleQuitSearch() {
    this.setState({
      searchQuery: null,
      mode: 'navigate'
    });
  },

  _handleSearchInputChange(searchQuery) {
    this.setState({ searchQuery });
  },

  _handleSearchInputFocus() {
    if(this.state.mode === 'search') { return; }
    this.setState({ mode: 'search' });
  },

  _handleSearchInputClear() {
    this.setState({
      searchQuery: '',
      mode: 'navigate',
    });
  },

  _handleNavChange(open, reason) {
    debug(`左侧边栏${open ? '打开' : '关闭'}: ${reason}`);
    this.setState({ searchQuery: '' });
    global.cli.navigation.toggleLeftNav(open);
  }
});

module.exports = LeftNav;
