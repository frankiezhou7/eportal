const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const FlatButton = require('epui-md/FlatButton');
const FormGenerator = require('~/src/mixins/form-generator');
const Paper = require('epui-md/Paper');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const TerminalForm = React.createClass({

  mixins: [AutoStyle, FormGenerator, Translatable],

  translations: require(`epui-intl/dist/Terminal/${__LOCALE__}`),

  propTypes: {
    actions: PropTypes.object,
    nTextAddPayloadType: PropTypes.string,
    nTextAverageHighTide: PropTypes.string,
    nTextAverageMargin: PropTypes.string,
    nTextAverageLowTide: PropTypes.string,
    nTextBerthDraft: PropTypes.string,
    nTextBerthInfo: PropTypes.string,
    nTextBerthLimits: PropTypes.string,
    nTextChannelDraft: PropTypes.string,
    nTextCountry: PropTypes.string,
    nTextDischargeRate: PropTypes.string,
    nTextDomesticAirport: PropTypes.string,
    nTextFireWork: PropTypes.string,
    nTextFulldayWork: PropTypes.string,
    nTextInternationalAirport: PropTypes.string,
    nTextHighestTide: PropTypes.string,
    nTextLowestTide: PropTypes.string,
    nTextMaintenance: PropTypes.string,
    nTextNightNavigation: PropTypes.string,
    nTextPayloadTypes: PropTypes.string,
    nTextPortAbilities: PropTypes.string,
    nTextPortCode: PropTypes.string,
    nTextSave: PropTypes.string,
    nTextSupplyOil: PropTypes.string,
    nTextSupplyWater: PropTypes.string,
    nTextTerminalName: PropTypes.string,
    nTextTide: PropTypes.string,
    nTextTimeZone: PropTypes.string,
    nTextTugs: PropTypes.string,
    nTextTugsAmount: PropTypes.string,
    nTextTugsHp: PropTypes.string,
    nTextUnderwaterWork: PropTypes.string,
    nTextWaterDensity: PropTypes.string,
    portId: PropTypes.string,
    terminal: PropTypes.object,
    update: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      modes: null,
    };
  },

  componentWillMount() {
    let actions = this.props.actions;
    let portId = this.props.portId;
    let terminal = this.props.terminal;
    let terminalId = terminal ? terminal._id : undefined;

    if (terminalId) {
      actions.findTerminalByIdInMode(terminalId, 'edit');
    } else {
      actions.createTerminalInMode('edit');
      this.__initialize = true;
    }
  },

  componentWillReceiveProps(nextProps) {
    let actions = this.props.actions;
    let baseModes = this.state.baseModes;
    let currentTerminalId = this.props.terminal ? this.props.terminal._id : undefined;
    let term = nextProps.terminal;
    let terminalId = term ? term._id : undefined;
    let terminal = nextProps.form.get('terminal');

    if (terminal.get('modes') && terminal.get('modes').getMeta('loading')) { return; }

    let modes = terminal.get('modes');
    let error = modes ? modes.getMeta('error') : false;

    if (!terminalId && terminalId !== currentTerminalId) {
      if (baseModes && baseModes.size) {
        this.setState({
          modes: baseModes,
        });
      } else {
        actions.createTerminalInMode('edit');
      }
      this.__update = false;
      return;
    } else if (terminalId && (terminalId !== currentTerminalId || this.__initialize)) {
      actions.findTerminalByIdInMode(terminalId, 'edit');
      this.__initialize = false;
      this.__update = false;
      return;
    }

    if(!error && terminal.get('modes')) {
      let modes = this._sortModes(terminal.get('modes'));

      if ((!currentTerminalId || !terminalId) && !baseModes) {
        this.setState({
          baseModes: modes,
          modes: modes,
        });
      } else {
        this.setState({
          modes: modes,
        });
      }
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    return !this.__update;
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
      <div>
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
      </div>
    );
  },

  /**
   * 保存按钮对应的处理事件
   * @return {[type]} [description]
   */
  _handleTouchTapSave() {
    let self = this;
    let portId = this.props.portId;
    let terminal = this.props.terminal;
    let terminalId = terminal ? terminal._id : undefined;
    let update = this.props.update;
    let uTerminal = update.get('terminal');
    let __v_m = (uTerminal && uTerminal.get('__v')) ?
               uTerminal.get('__v') : 0;
    let __v_t = terminal.__v ? terminal.__v : 0;
    let __v = Math.max(__v_m, __v_t);
    let mTerminal = {};
    let modes = this.state.modes;
    let actions = this.props.actions;

    this._getFormValue(modes, mTerminal);

    mTerminal.port = portId;
    mTerminal.__v = Math.max(__v, mTerminal.__v);

    if (!terminalId) {
      actions.createTerminal(mTerminal, { autoLink: true });
    } else {
      actions.updateTerminalById(terminalId, mTerminal);
      this.__update = true;
    }
  },

});

module.exports = TerminalForm;
