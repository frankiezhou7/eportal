const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const BasicDueTable = require('epui-md/ep/CustomizedTable/BasicDueTable');

const PropTypes = React.PropTypes;

const TallyDue = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/TallyDueTable/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    tallyFeeData : PropTypes.array,
    tallySurchargeData : PropTypes.array,
    tallyPaperFeeData : PropTypes.array,
    tallyTransportationFeeData : PropTypes.array,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      tallyFeeData:[
        {
          code:'tally_1',
          type:'tally_type_1',
          rate: 0.48,
        },
        {
          code:'tally_2',
          type:'tally_type_2',
          rate: 1.48,
        },
        {
          code:'tally_3',
          type:'tally_type_3',
          rate: 2.48,
        },
        {
          code:'tally_4',
          type:'tally_type_4',
          rate: 3.48,
        },
        {
          code:'tally_5',
          type:'tally_type_5',
          rate: 4.48,
        },
        {
          code:'tally_6',
          type:'tally_type_6',
          rate: 5.48,
        },
        {
          code:'tally_7',
          type:'tally_type_7',
          rate: 6.48,
        }
      ],
      tallySurchargeData: [
        {
          nightSurcharge: 0.5,
          holidayDaySurcharge: 1,
          holidayNightSurcharge: 1.5,
        }
      ],
      tallyPaperFeeData:[
        {
          nrt:2000,
          fee: 300
        },
        {
          nrt:4000,
          fee: 400
        },
        {
          nrt:6000,
          fee: 500
        },
        {
          nrt:8000,
          fee: 600
        },
        {
          nrt:10000,
          fee: 700
        },
        {
          nrt:999999999,
          fee: 900
        }
      ],
      tallyTransportationFeeData:[
        {
          landFee: 2000,
          oceanFee: 3500
        }
      ]
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
    const tallyDueStructor = {
      code: this.t('nLabelCode'),
      type: this.t('nLabelType'),
      rate: this.t('nLabelRate')
    };

    //define towage due tug config table structor
    const tallySurchargeStructor = {
      nightSurcharge: this.t('nLabelNightSurcharge'),
      holidayDaySurcharge: this.t('nLabelHolidayDaySurcharge'),
      holidayNightSurcharge: this.t('nLabelHolidayNightSurcharge')
    };

    //define towage due tug config table structor
    const tallyPaperStructor = {
      nrt: this.t('nLabelNrt'),
      fee: this.t('nLabelFee')
    };

    const tallyPaperSectionalField = 'nrt';

    //define towage due tug config table structor
    const tallyTransportationStructor = {
      landFee: this.t('nLabelLandFee'),
      oceanFee: this.t('nLabelOceanFee')
    };

    return (
      <div style={this.style('root')}>
        <div style = {this.style('section')}>
          {this.renderTitle(this.t('nLabelTallyFee'))}
          <BasicDueTable
            ref = 'tallyFee'
            structor = {tallyDueStructor}
            data = {this.props.tallyFeeData}
          />
        </div>
        <div style = {this.style('section')}>
          {this.renderTitle(this.t('nLabelTallySurcharge'))}
          <BasicDueTable
            ref = 'tallySurcharge'
            structor = {tallySurchargeStructor}
            data = {this.props.tallySurchargeData}
            addable = {false}
          />
        </div>
        <div style = {this.style('section')}>
          {this.renderTitle(this.t('nLabelTallyPaperFee'))}
          <BasicDueTable
            ref = 'tallyPaperFee'
            structor = {tallyPaperStructor}
            data = {this.props.tallyPaperFeeData}
            sectionalField = { tallyPaperSectionalField}
          />
        </div>
        <div style = {this.style('section')}>
          {this.renderTitle(this.t('nLabelTallyTransporationFee'))}
          <BasicDueTable
            ref = 'tallyTransportationFee'
            structor = {tallyTransportationStructor}
            data = {this.props.tallyTransportationFeeData}
            addable = {false}
          />
        </div>
      </div>
    );
  },
});

module.exports = TallyDue;
