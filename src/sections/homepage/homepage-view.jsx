const React = require('react');
const Paper = require('epui-md/Paper');
const moment = require ('moment');
const _ = require('eplodash');
const { FILES_URL } = require('~/src/gateway-urls');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const HomepageView = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Homepage/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    homepageItem : PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
    };
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    let styles = {
      root:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
    }
    return styles;
  },

  render() {
    return (
      <div style = {this.style('root')}>
        <div style = {this.style('left')}>
        </div>
      </div>
    );
  }

});

module.exports = HomepageView;
