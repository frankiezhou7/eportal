const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const BasicDueTable = require('epui-md/ep/CustomizedTable/BasicDueTable');

const PropTypes = React.PropTypes;

const TonnageDue = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/TonnageDueTable/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    data : PropTypes.array,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      data:[
        {
          nrt: 2000,
          normal30: 0.323,
          normal90: 0.646,
          normal365: 1.939,
          preferential30: 0.231,
          preferential90: 0.462,
          preferential365: 1.385
        },
        {
          nrt: 10000,
          normal30: 0.615,
          normal90: 1.231,
          normal365: 3.692,
          preferential30: 0.446,
          preferential90: 0.892,
          preferential365: 2.677
        },
        {
          nrt: 50000,
          normal30: 0.707,
          normal90: 1.415,
          normal365: 4.246,
          preferential30: 0.508,
          preferential90: 1.015,
          preferential365: 3.046
        },
        {
          nrt: 999999999,
          normal30: 0.815,
          normal90: 1.631,
          normal365: 4.892,
          preferential30: 0.584,
          preferential90: 1.169,
          preferential365: 3.507
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

    // define table strocutor
    const structor = {
      nrt: this.t('nLabelNrt'),
      normal30: this.t('nLabelNormal30'),
      normal90: this.t('nLabelNormal90'),
      normal365: this.t('nLabelNormal365'),
      preferential30: this.t('nLabelPreferential30'),
      preferential90: this.t('nLabelPreferential90'),
      preferential365: this.t('nLabelPreferential365')
    };

    //define table sectional field
    const sectionalField = 'nrt';

    return (
      <div style={this.style('root')}>
        <div style = {this.style('section')}>
          {this.renderTitle(this.t('nLabelTonnageDues'))}
          <BasicDueTable
            ref = 'tonnageDue'
            structor = {structor}
            data = {this.props.data}
            sectionalField = {sectionalField}
          />
        </div>
      </div>
    );
  },
});

module.exports = TonnageDue;
