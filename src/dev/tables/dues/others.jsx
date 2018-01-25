const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const RawTextField = require('epui-md/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const { ComposedForm, use } = require('epui-composer');

const TextField = Validatable(RawTextField);
const PropTypes = React.PropTypes;

use(TextField);

const OthersDue = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/OtherDueTable/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    berthageRate: PropTypes.number,
    anchorageRate: PropTypes.number,
    shipDisinfectionRate: PropTypes.number,
    quarantineFee: PropTypes.number,
    garbageFee: PropTypes.number,
    immigrationCharge: PropTypes.number,
    escortingTugBoatFee: PropTypes.number,
    jointInspectionFee: PropTypes.number,
    surchargeForOverRestrictionVSLFee: PropTypes.number,
    fumigantsFee: PropTypes.number,
    despatchCharge: PropTypes.number,
    oilFenseFee: PropTypes.number,
    mSAMeetingFee: PropTypes.number,
    mSAEscortingFee:PropTypes.number
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps() {
    return {
      berthageRate : 0 ,
      anchorageRate : 0 ,
      shipDisinfectionRate : 0 ,
      quarantineFee : 0 ,
      garbageFee : 0 ,
      immigrationCharge : 0 ,
      escortingTugBoatFee : 0 ,
      jointInspectionFee : 0 ,
      surchargeForOverRestrictionVSLFee : 0 ,
      fumigantsFee : 0 ,
      despatchCharge : 0 ,
      oilFenseFee : 0 ,
      mSAMeetingFee : 0 ,
      mSAEscortingFee : 0
    };
  },

  getStyles() {
    let styles = {
      root: {
        padding: 24,
        with: '100%',
        height: '100%',
        overflow: 'scroll',
      },
    };

    return styles;
  },


  render() {

    const defs = _.map(_.keys(this.props),key=>{
      return {
        component: 'TextField',
        name: 'bbc',
        props: {
          style: {
            marginRight: 20,
          },
          floatingLabelText: this.t('nLabel'+_.upperFirst(key)),
        }
      };
    });

    return (
      <div style={this.style('root')}>
        <ComposedForm
          ref="form"
          definitions={defs}
        />
      </div>
    );
  },
});

module.exports = OthersDue;
