const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const BasicDueTable = require('epui-md/ep/CustomizedTable/BasicDueTable');

const PropTypes = React.PropTypes;

const PilotageDue = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/PilotageDueTable/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    data : PropTypes.array,
    nLabelPilotageDues : PropTypes.string,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      data:[
        {
          pilotageRate: 0.077,
          shiftBerthRate: 0.034,
          surchargeRate: 0.077,
          surchargeTimeStart: '06:00',
          surchargeTimeEnd: '22:30',
          holSurchargeRate: 0.138,
          holSurchargeTimeStart:'06:00',
          holSurchargeTimeEnd:'22:30'
        }
      ],
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

    // define table strocutor
    const structor = {
      pilotageRate: this.t('nLabelPilotageRate'),
      shiftBerthRate: this.t('nLabelShiftBerthRate'),
      surchargeRate: this.t('nLabelSurchargeRate'),
      surchargeTimeStart: this.t('nLabelSurchargeTimeStart'),
      surchargeTimeEnd: this.t('nLabelSurchargeTimeEnd'),
      holSurchargeRate: this.t('nLabelHolSurchargeRate'),
      holSurchargeTimeStart: this.t('nLabelHolSurchargeTimeStart'),
      holSurchargeTimeEnd: this.t('nLabelHolSurchargeTimeEnd')
    };

    return (
      <div style={this.style('root')}>
        <div style = {this.style('section')}>
          {this.renderTitle(this.t('nLabelPilotageDues'))}
          <BasicDueTable
            ref = 'pilotageDue'
            structor = {structor}
            data = {this.props.data}
            addable = {false}
          />
        </div>
      </div>
    );
  },
});

module.exports = PilotageDue;
