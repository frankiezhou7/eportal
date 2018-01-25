const React = require('react');
const _ = require('eplodash');
const BasicDueTable = require('epui-md/ep/CustomizedTable/BasicDueTable');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const LoadLineTable = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/LoadLineTable/${__LOCALE__}`),
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
    return this.refs.loadLine.getValue();
  },

  isValid(){
    return this.refs.loadLine.isValid();
  },

  render() {

    // define table strocutor
    const structor = {
      mark: this.t('nLabelMark'),
      freeBoard: this.t('nLabelFreeBoard'),
      draft: this.t('nLabelDraft'),
      dwt: this.t('nLabelDeadWeight'),
      displacement: this.t('nLabelDisplacement')
    };

    // define table strocutor
    const validations = {
      mark: {
        validType: 'string'
      },
      freeBoard: {
        validType: 'number',
      },
      draft: {
        validType: 'number'
      },
      dwt: {
        validType: 'number'
      },
      displacement: {
        validType: 'number'
      }
    };

    return (
      <div style={this.style('root')}>
        <BasicDueTable
          ref = 'loadLine'
          structor = {structor}
          validations = {validations}
          data = {this.props.value}
          showHeaderRight = {false}
        />
      </div>
    );
  },
});

module.exports = LoadLineTable;
