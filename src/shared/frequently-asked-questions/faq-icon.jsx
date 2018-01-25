const React = require('react');
const Help = require('epui-md/svg-icons/ep/help');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const { Component } = React;
const PropTypes = React.PropTypes;

const FaqIcon = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Faq/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
  },

  getStyles() {
    let color = this.context.muiTheme.helpIcon.color;
    return {
      fillColor: color,
      name:{
        color: color,
        position: 'absolute',
        right: '-1px',
        fontSize: '12px',
        fontWeight:500
      }
    };
  },

  render() {
    let styles = this.getStyles();
    return (
      <div>
        <Help color = {styles.fillColor} />
        <div style={this.s('name')}>{this.t('nTextHelp')}</div>
      </div>
    );
  }

});

module.exports = FaqIcon;
