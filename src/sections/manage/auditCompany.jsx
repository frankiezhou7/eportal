const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;
const Tabs = require('epui-md/Tabs/Tabs');
const Tab = require('epui-md/Tabs/Tab');
const Paper = require('epui-md/Paper');
const CompanyTable= require('~/src/sections/manage/company-table');

const PropTypes = React.PropTypes;

const TAB_NAMES = [ 'WAITED', 'VERIFIED', 'UNVERIFIED'];

const TAB_CODES = {
  'WAITED': 0,
  'VERIFIED': 1,
  'UNVERIFIED': 2,
};

const AuditCompany = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/AuditCompany/${__LOCALE__}`),
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
      verifyStatusString: 'WAITED'
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
        boxShadow: '0px 1px 3px 0px rgba(0,0,0,0.20)',
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
    this.setState({ verifyStatusString: value });
  },


  render() {
    let verifyStatusString = this.state.verifyStatusString;
    return (
      <div style={this.style('root')}>
        <Paper zDepth = {1}>
          <Tabs
            tabItemContainerStyle = {this.style('tabItemContainer')}
            value={ this.state.verifyStatusString }
            onChange={ this.handleChange }
            style = { this.style('tabs') }
            inkBarStyle = {this.style('inkBar')}
          >
            {_.map(TAB_NAMES, name => {
              return (
                <Tab
                  style = {this.style('tab')}
                  key = { name }
                  label= { this.t('nLabel' + _.capitalize(name) + 'Organization') }
                  value={ name }
                />
              )
            })}
          </Tabs>
          <div>
            <CompanyTable
              verifyStatus={TAB_CODES[verifyStatusString]}
             />
          </div>
        </Paper>
      </div>
    );
  },
});

module.exports = AuditCompany;
