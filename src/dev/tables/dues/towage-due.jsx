const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const BasicDueTable = require('epui-md/ep/CustomizedTable/BasicDueTable');

const PropTypes = React.PropTypes;

const TowageDue = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/TowageDueTable/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    towageDuesData : PropTypes.array,
    towageDueConfigData : PropTypes.array,
    nLabelTowageDues : PropTypes.string,
    nLabelTowageDuesConfig : PropTypes.string,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      towageDuesData:[
        {
          towageRate: 0,
          normalSurcharge: 0,
          holidaySurcharge: 0,
          workHoursIn: 0,
          workHoursOut: 0,
          workHoursShiftBerth: 0
        }
      ],
      towageDueConfigData: [
        {
          shipLength: 50,
          tugInPower: 4000,
          tugOutPower:5000
        },
        {
          shipLength:80,
          tugInPower:6000,
          tugOutPower:8000
        },
        {
          shipLength: 100,
          tugInPower:8000,
          tugOutPower:10000
        },
        {
          shipLength: 999999999,
          tugInPower:8000,
          tugOutPower:10000
        }
      ],
      nLabelTowageDues: 'towage_dues',
      nLabelTowageDuesConfig: 'towage_dues_tug_configs',
    };
  },

  getStyles() {
    let styles = {
      root: {
        with: '100%',
        height: '100%',
        overflow: 'scroll',
      },
      title:{
        marginTop: 30,
        marginBottom:30,
        fontSize: 20,
        fontWeight: 500,
        marginLeft: 24,
        textTransform: 'uppercase',
      },
      section:{
        marginBottom: 50,
      }
    };

    return styles;
  },

  renderTitle(title){
    return (
      <div style = {this.style('title')}>{title}</div>
    );
  },

  render() {
    // define towage due table strocutor
    const towageDuesStructor = {
      towageRate : this.t('nLabelTowageRate'),
      normalSurcharge : this.t('nLabelNormalSurcharge'),
      holidaySurcharge : this.t('nLabelHolidaySurcharge'),
      workHoursIn : this.t('nLabelWorkHoursIn'),
      workHoursOut : this.t('nLabelWorkHoursOut'),
      workHoursShiftBerth : this.t('nLabelWorkHoursShiftBerth')
    };

    //define towage due tug config table sectional field
    const towageDueConfigSectionalField = 'shipLength';

    //define towage due tug config table structor
    const towageDueConfigStructor = {
      shipLength: this.t('nLabelShipLength'),
      tugInPower: this.t('nLabelTugInPower'),
      tugOutPower: this.t('nLabelTugOutPower')
    };

    return (
      <div style={this.style('root')}>
        <div style = {this.style('section')}>
          {this.renderTitle(this.props.nLabelTowageDues)}
          <BasicDueTable
            ref = 'towageDue'
            structor = {towageDuesStructor}
            data = {this.props.towageDuesData}
            addable = {false}
          />
        </div>
        <div style = {this.style('section')}>
          {this.renderTitle(this.props.nLabelTowageDuesConfig)}
          <BasicDueTable
            ref = 'towageDueConfig'
            structor = {towageDueConfigStructor}
            data = {this.props.towageDueConfigData}
            sectionalField = {towageDueConfigSectionalField}
          />
        </div>
      </div>
    );
  },
});

module.exports = TowageDue;
