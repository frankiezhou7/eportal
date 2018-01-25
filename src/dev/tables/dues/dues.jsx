const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const ThemeManager = require('~/src/styles/theme-manager');
const Translatable = require('epui-intl').mixin;
const Tabs = require('epui-md/Tabs/Tabs');
const Tab = require('epui-md/Tabs/Tab');
const Paper = require('epui-md/Paper');
const TonnageDue = require('./tonnage-due');
const TowageDue = require('./towage-due');
const PilotageDue = require('./pilotage-due');
const TallyDue = require('./tally-due');
const Others = require('./others');

const PropTypes = React.PropTypes;

const TAB_VALUE = {
  TONNAGE : 'TONNAGE',
  TOWAGE : 'TOWAGE',
  PILOTAGE: 'PILOTAGE',
  TALLY: 'TALLY',
  OTHERS: 'OTHERS'
};

const Dues = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DueTable/${__LOCALE__}`),
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
      value: TAB_VALUE.TONNAGE
    };
  },

  getTheme() {
    return this.context.muiTheme;
  },

  getStyles() {
    let theme = this.context.muiTheme ? this.context.muiTheme : ThemeManager.getMuiTheme(BlueRawTheme);
    let styles = {
      root: {
        with: '100%',
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
      TONNAGE: <TonnageDue />,
      TOWAGE : <TowageDue />,
      PILOTAGE: <PilotageDue />,
      TALLY: <TallyDue />,
      OTHERS: <Others/>
    }

    console.log(this.t('nLabelTowage'));

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
            {_.map(_.keys(TAB_VALUE),key=>{
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

module.exports = Dues;
