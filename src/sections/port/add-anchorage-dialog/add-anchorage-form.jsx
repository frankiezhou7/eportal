const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const FlatButton = require('epui-md/FlatButton');
const FormGenerator = require('~/src/mixins/form-generator');
const Paper = require('epui-md/Paper');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const AddAnchorageForm = React.createClass({

  mixins: [AutoStyle, FormGenerator, PureRenderMixin, Translatable],

  translations: require(`epui-intl/dist/Anchorage/${__LOCALE__}`),

  propTypes: {
    berth: PropTypes.array,
    modes: PropTypes.array,
    nTextAddPayloadType: PropTypes.string,
    nTextAnchorageName: PropTypes.string,
    nTextAverageHighTide: PropTypes.string,
    nTextAverageMargin: PropTypes.string,
    nTextAverageLowTide: PropTypes.string,
    nTextBerthDraft: PropTypes.string,
    nTextBerthInfo: PropTypes.string,
    nTextBerthLimits: PropTypes.string,
    nTextBerthName: PropTypes.string,
    nTextChannelDraft: PropTypes.string,
    nTextCraneInfo: PropTypes.string,
    nTextCraneMaxLoad: PropTypes.string,
    nTextCraneAmount: PropTypes.string,
    nTextCountry: PropTypes.string,
    nTextDischargeRate: PropTypes.string,
    nTextDomesticAirport: PropTypes.string,
    nTextFireWork: PropTypes.string,
    nTextFulldayWork: PropTypes.string,
    nTextInternationalAirport: PropTypes.string,
    nTextHighestTide: PropTypes.string,
    nTextLowestTide: PropTypes.string,
    nTextMaintenance: PropTypes.string,
    nTextMaxAirDraft: PropTypes.string,
    nTextMaxBeam: PropTypes.string,
    nTextMaxDraft: PropTypes.string,
    nTextMaxDWT: PropTypes.string,
    nTextMaxGRT: PropTypes.string,
    nTextMaxLOA: PropTypes.string,
    nTextNightNavigation: PropTypes.string,
    nTextPayloadTypes: PropTypes.string,
    nTextPortAbilities: PropTypes.string,
    nTextPortCode: PropTypes.string,
    nTextSave: PropTypes.string,
    nTextSupplyOil: PropTypes.string,
    nTextSupplyQuarantine: PropTypes.string,
    nTextSupplyWater: PropTypes.string,
    nTextTide: PropTypes.string,
    nTextTimeZone: PropTypes.string,
    nTextTugs: PropTypes.string,
    nTextTugsAmount: PropTypes.string,
    nTextTugsHp: PropTypes.string,
    nTextUnderwaterWork: PropTypes.string,
    nTextWaterDensity: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      modes: this._sortModes(this.props.modes),
    };
  },

  componentWillReceiveProps(nextProps) {
    let modes = nextProps.modes;

    if (!modes || modes.isEmpty() || modes.getMeta('loading')) { return; }

    let sortedModes = this._sortModes(modes);

    this.setState({
      modes: sortedModes,
    });
  },

  getValue() {
    let modes = this.state.modes;
    let value = {};

    value = this._getFormValue(modes, value);

    return value;
  },

  getStyles() {
    let styles = {
      root: {
        margin: '0 auto',
        padding: '10px 10px',
        width:global.contentWidth,
        minHeight: '100%',
        overflow: 'hidden',
      },
      saveButtonWrapper: {
        display: 'inline-block',
        width: '100%',
      },
      saveButton: {
        float: 'right',
      },
    };

    return styles;
  },

  renderElements() {
    let modes = this.state.modes;
    let values = this.props.berth;

    return modes ? this._generateForm(modes, values) : null;
  },

  render() {
    let styles = this.getStyles();

    return (
      <div style={this.style('root')}>
        {this.renderElements()}
      </div>
    );
  }

});

module.exports = AddAnchorageForm;
