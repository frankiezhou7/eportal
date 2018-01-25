const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const FlatButton = require('epui-md/FlatButton');
const FormGenerator = require('~/src/mixins/form-generator');
const Paper = require('epui-md/Paper');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const Berth = React.createClass({

  mixins: [AutoStyle, FormGenerator, Translatable],

  translations: require(`epui-intl/dist/Berth/${__LOCALE__}`),

  propTypes: {
    nTextAddPayloadType: PropTypes.string,
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
    nTextMaxDWT: PropTypes.string,
    nTextMaxLOA: PropTypes.string,
    nTextNightNavigation: PropTypes.string,
    nTextPayloadTypes: PropTypes.string,
    nTextPortAbilities: PropTypes.string,
    nTextPortCode: PropTypes.string,
    nTextSave: PropTypes.string,
    nTextSupplyOil: PropTypes.string,
    nTextSupplyWater: PropTypes.string,
    nTextTide: PropTypes.string,
    nTextTimeZone: PropTypes.string,
    nTextTugs: PropTypes.string,
    nTextTugsAmount: PropTypes.string,
    nTextTugsHp: PropTypes.string,
    nTextUnderwaterWork: PropTypes.string,
    nTextWaterDensity: PropTypes.string,
    port: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {

    };
  },

  componentWillReceiveProps(nextProps) {
    let port = nextProps.port;
    let berth = nextProps.form.get('berth');

    if (port.isLoading() || (berth.get('modes') && berth.get('modes').getMeta('loading'))) { return; }

    let error = port.getMeta('error');

    if ((!!error && this.__saveButtonClicked) || port._id !== this.props.port._id) {
      port.domain.actions.createBerthInMode('edit');
      this.__saveButtonClicked = false;
    } else if (!error && berth.get('modes')) {
      let modes = this._sortModes(berth.get('modes'));

      this.setState({
        modes: modes,
      });
    }
  },

  getStyles() {
    let styles = {
      root: {
        margin: '0 auto',
        padding: '10px 10px',
        width: global.contentWidth,
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

    return this._generateForm(modes);
  },

  render() {
    let styles = this.getStyles();

    return (
      <Paper style={this.style('root')}>
        {this.renderElements()}
        <div style={this.style('saveButtonWrapper')}>
          <FlatButton
            ref='save'
            label={this.t('nTextSave')}
            primary={true}
            style={this.style('saveButton')}
            onTouchTap={this._handleTouchTapSave}
          />
        </div>
      </Paper>
    );
  }

});

module.exports = Berth;
