const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const RaisedButton = require('epui-md/RaisedButton');
const Transitions = require('epui-md/styles/transitions');
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;


const DashboardSearch = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Dashboard/${__LOCALE__}`),

  propTypes: {
    nTextPlaceholder: PropTypes.string,
    nTextSearch: PropTypes.string,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getStyles() {
    let styles = {
      root: {
        position: 'relative',
        margin: '100px auto',
        maxWidth: '500px',
        height: '48px',
      },
      input: {
        display: 'inline-block',
        float: 'left',
        border: 'none',
        outline: 0,
        width: '100%',
        height: '34px',
        fontSize: '15px',
        backgroundColor: 'transparent',
        transition: Transitions.easeOut('450ms', 'width'),
        verticalAlign: 'middle',
      },
      inputWrapper: {
        position: 'relative',
        padding: '0px 6px',
        height: '36px',
        borderRadius: '2px',
        borderBottom: '1px solid transparent',
        boxSizing: 'border-box',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2),0 -1px 0px rgba(0,0,0,0.02)',
        backgroundColor: '#ffffff',
      },
      search: {},
    };

    return styles;
  },

  renderInput() {
    let el = (
      <div
        style={this.style('inputWrapper')}
      >
        <input
          ref='input'
          onChange={this._handleChange}
          onFocus={this._handleFocus}
          placeholder={this.t('nTextPlaceholder')}
          style={this.style('input')}
        />
      </div>
    );

    return el;
  },

  renderButton() {
    let el = (
      <RaisedButton
        ref='search'
        label={this.t('nTextSearch')}
        style={this.style('search')}
      />
    );

    return el;
  },

  render() {
    let styles = this.getStyles();

    return (
      <div
        ref='root'
        style={this.style('root')}
      >
        {this.renderInput()}
      </div>
    );
  },

  _handleChange(e) {
    let fn = this.props.onChange;
    if (_.isFunction(fn)) {
      fn(e);
    }
  },

  _handleFocus(e) {
    let fn = this.props.onFocus;
    if (_.isFunction(fn)) {
      fn(e);
    }
  },

});

module.exports = DashboardSearch;
