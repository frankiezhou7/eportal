const _ = require('eplodash');
const React = require('react');
const ReactDOM = require('react-dom');
const IconClear = require('epui-md/svg-icons/content/clear');
const IconSearch = require('epui-md/svg-icons/action/search');
const Transitions = require('epui-md/styles/transitions');

const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const Logo = require('./logo');
const HeaderImage = require('./background.svg');

const PropTypes = React.PropTypes;

const INPUT_HEIGHT = 48;
const HEADER_FULL_HEIGHT = 144 + INPUT_HEIGHT; // graphic part + input part
const HEADER_MIN_HEIGHT = 75 + INPUT_HEIGHT;
const TRANSITION_DURATION = '800ms';

const LeftNavHeader = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Navigation/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    loading: PropTypes.bool,
    searchQuery: PropTypes.string,
    mode: PropTypes.oneOf(['navigate', 'search']),
    onRequestQuitSearch: PropTypes.func,
    onSearchInputClear: PropTypes.func,
    onSearchInputChange: PropTypes.func,
    onSearchInputFocus: PropTypes.func,
  },

  getDefaultProps() {
    return {
      mode: 'navigate',
      loading: false,
      searchQuery: '',
    };
  },

  getInitialState() {
    return {  };
  },

  componentWillReceiveProps(nextProps) {
  },

  focus() {
    let el = this.refs.searchInput;
    el && el.focus();
  },

  blur() {
    let el = this.refs.searchInput;
    el && el.blur();
  },

  getInputValue() {
    return this.props.searchQuery;
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let config = theme.leftNav;

    let { loading, mode } = this.props;
    let search = mode === 'search';

    let height = search ? HEADER_MIN_HEIGHT : HEADER_FULL_HEIGHT;
    let topHeight = (search ? HEADER_MIN_HEIGHT : HEADER_FULL_HEIGHT) - INPUT_HEIGHT;
    let topBackgroundColor = search ? null : theme.appBar.color;
    let topBackgroundOpacity = search ? 0 : 1;
    let logoBottom = (HEADER_MIN_HEIGHT - INPUT_HEIGHT - 21) / 2; // 垂直居中

    let styles = {
      root: {
        userSelect: 'none',
        overflow: 'hidden',
        height: height,
        transition: Transitions.easeOut(TRANSITION_DURATION, 'height'),
      },
      top: {
        position: 'relative',
        height: topHeight,
        backgroundColor: topBackgroundColor,
        transition: Transitions.easeOut(TRANSITION_DURATION, 'height'),
        borderBottom: '1px solid #EAEAEA',
      },
      background: {
        overflow: 'hidden',
        opacity: topBackgroundOpacity,
        height: topHeight,
        transition: Transitions.easeOut(TRANSITION_DURATION, 'height'),
      },
      logo: {
        position: 'absolute',
        left: 20,
        bottom: logoBottom,
      },
      search: {
        root: {
          position: 'relative',
          height: 48,
          overflow: 'hidden',
          margin: '6px 12px',
          height: 36,
          borderRadius: '2px',
          boxSizing: 'border-box',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02)',
          background: '#FFFFFF',
          cursor: search ? null : 'pointer',
        },
        clear: {
          display: search ? 'inline-block' : 'none',
          margin: '6px 10px',
          fill: '#727272',
          cursor: 'pointer',
        },
        icon: {
          float: 'left',
          margin: '6px',
          fill: '#727272',
        },
        input: {
          display: 'inline-block',
          float: 'left',
          border: 'none',
          outline: 0,
          width: 148,
          height: 34,
          fontSize: 14,
          backgroundColor: 'transparent',
          verticalAlign: 'middle',
          cursor: search ? null : 'pointer',
        },
      },
      clear: {
        clear: 'both',
      }
    };

    return styles;
  },

  render() {
    const { mode, searchQuery } = this.props;
    const searchMode = mode === 'search';

    return (
      <div ref='root' style ={this.s('root')}>
        <div ref='top' style={this.s('top')}>
          <Logo style={this.s('logo')} colorful={mode === 'search'}/>
          <div style={this.s('background')}><img src={HeaderImage} /></div>
        </div>
        <div ref='bottom' style={this.s('search.root')} onTouchTap={this._handleTouchTap}>
          <IconSearch
            style={this.s('search.icon')}
          />
          <input
            ref='searchInput'
            placeholder={this.t('nHintTextSearchPortsOrShips')}
            style={this.s('search.input')}
            onFocus={this._handleInputFocus}
            onKeyUp={this._handleInputKeyUp}
            onChange={this._handleInputChange}
            value={searchQuery}
          />
          <IconClear
            style={this.s('search.clear')}
            onTouchTap={this._handleTouchTapClear}
          />
        </div>
        <div style ={this.s('clear')}></div>
      </div>
    );
  },

  _clearInput() {
    this.setState({ searchQuery: '' });
  },

  _handleTouchTap() {
    const { mode } = this.props;
    if(mode === 'search') { return; }
    this.focus();
  },

  _handleInputKeyUp(e) {
    let code = e.keycode || e.which;
    if(code === 27 && this.props.onRequestQuitSearch) {
      debug(`响应ESC，退出搜索`);
      this._clearInput();
      this.blur();
      this.props.onRequestQuitSearch(this);
    }
  },

  _handleInputFocus() {
    let fn = this.props.onSearchInputFocus;
    if(_.isFunction(fn)) { fn(); }
  },

  _handleInputChange(e) {
    const searchQuery = e.target.value;
    let fn = this.props.onSearchInputChange;
    if (_.isFunction(fn)) { fn(searchQuery); }
  },

  _handleTouchTapClear() {
    this._clearInput();
    let fn = this.props.onSearchInputClear;
    if(_.isFunction(fn)) { fn(); }
  }
});

module.exports = LeftNavHeader;
