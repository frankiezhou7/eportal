const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;
const Tabs = require('epui-md/Tabs/Tabs');
const Tab = require('epui-md/Tabs/Tab');
const Paper = require('epui-md/Paper');
const PortRecommendation = require('./port-recommendation');
const OrganizationRecommendation = require('./organization-recommendation');
const NewsRecommendation = require('./news-recommendation');

const PropTypes = React.PropTypes;

const TAB_VALUE = {
  PORT : 'PORT',
  ORGANIZATION : 'ORGANIZATION',
  NEWS: 'NEWS',
};

const Recommendations = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationTable/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  getInitialState() {
    return {
      value: TAB_VALUE.PORT
    };
  },

  getTheme() {
    return this.context.muiTheme;
  },

  getStyles() {
    let theme = this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(BlueRawTheme);
    let styles = {
      root: {
        height: '100%',
        overflow: 'scroll',
      },
      tabs:{
        boxShadow: 'rgba(0, 0, 0, 0.317647) 0px 3px 6px',
      },
      tab:{
        fontSize: 14,
        color: theme.epColor.primaryColor,
      },
      inkBar:{
        backgroundColor: theme.epColor.primaryColor,
      },
      tabItemContainer:{
        backgroundColor: theme.epColor.whiteColor,
      },
    };

    return styles;
  },

  handleChange(value){
    this.setState({value:value});
  },

  render() {

    const TAB_CONTENT = {
      PORT: <PortRecommendation />,
      ORGANIZATION : <OrganizationRecommendation />,
      NEWS: <NewsRecommendation />,
    };

    return (
      <div style={this.style('root')}>
        <Paper zDepth = {1}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            style = {this.style('tabs')}
            inkBarStyle = {this.style('inkBar')}
            tabItemContainerStyle = {this.style('tabItemContainer')}
          >
            {_.map(_.keys(TAB_VALUE),key => {
                return (
                  <Tab
                    key = { key }
                    label= { this.t('nLabel'+_.capitalize(key)) }
                    value={TAB_VALUE[key]}
                    style = {this.style('tab')}
                  />
                );
              })}
          </Tabs>
          <div>
            {TAB_CONTENT[this.state.value]}
          </div>
        </Paper>
      </div>
    );
  },
});

module.exports = Recommendations;
