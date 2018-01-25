const React = require('react');
const _ = require('eplodash');
const BasicDueTable = require('epui-md/ep/CustomizedTable/BasicDueTable');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const HoldTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/HoldTable/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value : PropTypes.array,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      value: [],
    };
  },

  getInitialState(){
    return {

    }
  },

  getStyles() {
    let theme = this.context.muiTheme;
    const marginLeft = 24;
    let styles = {
      root: {
        overflow: 'scroll',
        borderLeft: '1px solid '+theme.tableRow.borderColor,
        borderRight: '1px solid '+theme.tableRow.borderColor,
      },
      header:{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
    };

    return styles;
  },

  getValue(){
    return this.refs.hold.getValue();
  },

  isValid(){
    return this.refs.hold.isValid();
  },

  render() {

    // define table strocutor
    const structor = {
      no: this.t('nTextNo'),
      maxCargoWeight: this.t('nTextMaxCargoWeight'),
      cubicCapacity: this.t('nTextCubicCapacity'),
      maxPermitLoad: this.t('nTextMaxPermitLoad'),
      hatchLength: this.t('nTextHatchLength'),
      hatchBreadth: this.t('nTextHatchBreadth'),
      ballastTanksCapacity: this.t('nTextBallastTanksCapacity')
    };

    // define table validations
    const validations = {
      no: {
        validType: 'string'
      },
      maxCargoWeight: {
        validType: 'number',
      },
      cubicCapacity: {
        validType: 'number'
      },
      maxPermitLoad: {
        validType: 'number'
      },
      hatchLength: {
        validType: 'number'
      },
      hatchBreadth: {
        validType: 'number'
      },
      ballastTanksCapacity: {
        validType: 'number'
      }
    };

    return (
      <div style={this.style('root')}>
        <BasicDueTable
          ref = 'hold'
          structor = {structor}
          validations = {validations}
          data = {this.props.value}
          showHeaderRight = {false}
        />
      </div>
    );
  },
});

module.exports = HoldTable;
