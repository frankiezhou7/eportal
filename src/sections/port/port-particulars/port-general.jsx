const React = require('react');
const _ = require('eplodash');
const AddAnchorageDialog = require('../add-anchorage-dialog');
const AutoStyle = require('epui-auto-style').mixin;
const FlatButton = require('epui-md/FlatButton');
const FormGenerator = require('~/src/mixins/form-generator');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translatable = require('epui-intl').mixin;
const { Map, List } = require('epimmutable');

const PortGeneral = React.createClass({

  mixins: [AutoStyle, FormGenerator, Translatable],

  translations: require(`epui-intl/dist/PortParticulars/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    findPortByIdInMode: PropTypes.func,
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
    nTextTide: PropTypes.string,
    nTextTimeZone: PropTypes.string,
    nTextTugs: PropTypes.string,
    nTextTugsAmount: PropTypes.string,
    nTextTugsHp: PropTypes.string,
    nTextUnderwaterWork: PropTypes.string,
    nTextWaterDensity: PropTypes.string,
    port: PropTypes.object,
    portId: PropTypes.string,
    update: PropTypes.object,
    updatePortById: PropTypes.func,
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
    let portId = this.props.portId;

    if(!portId) {
      return;
    }

    this.props.findPortByIdInMode(portId, 'edit');
  },

  componentWillReceiveProps(nextProps) {
    let port = nextProps.port;
    let portId = nextProps.portId;
    let viewModes = port.get('viewModes');

    if (viewModes && viewModes.getMeta('loading')) { return; }

    let error = port.getMeta('error');

    if ((!!error && this.__saveButtonClicked) || portId !== this.props.portId) {
      this.props.findPortByIdInMode(port._id, 'edit');
      this.__saveButtonClicked = false;
    } else if (!error &&
      viewModes &&
      (
        !this.state.modes ||
        (this.state.modes && portId !== this.props.portId)
      )
    ) {
      let modes = this._sortModes(viewModes);

      this.setState({
        modes: modes,
      });
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    let port = nextProps.port;
    let update = nextProps.update;
    let uPort = update.get('port');
    let viewModes = port.get('viewModes');

    if (viewModes && viewModes.getMeta('loading')) {
      return false;
    }

    if (uPort && uPort.getMeta('loading')) {
      return false;
    }

    let error = port.getMeta('error') || uPort.getMeta('error');

    if (!error && this.__saveButtonClicked) {
      this.__saveButtonClicked = false;

      return false;
    } else {
      return true;
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
      row: {},
      saveButtonWrapper: {
        display: 'inline-block',
        width: '100%',
      },
      saveButton: {
        float: 'right',
      },
      title: {
        marginBottom: '10px',
        fontStyle: 'normal',
        fontSize: '14px',
        color:'#AEAEAE',
      },
      section: {
        width: '100%',
        margin: '16px 0',
      },
      textField: {
        display: 'inline-block',
        margin: '0 20px',
      },
      selectField: {
        display: 'inline-block',
        marginLeft: '10px',
      }
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
      <div style={this.style('root')}>
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
        <AddAnchorageDialog />
      </div>
    );
  },

  /**
   * 保存按钮对应的处理事件
   * @return {[type]} [description]
   */
  _handleTouchTapSave() {
    let values = [];
    let self = this;
    let port = this.props.port;
    let update = this.props.update;
    let uPort = update.get('port');

    let __v_u = (uPort && uPort.get('__v')) ?
                 uPort.get('__v') : 0;
    let __v_t = port.__v ? port.__v : 0;
    let __v = Math.max(__v_u, __v_t);

    let modifiedPort = {
      'name': port.name
    };
    let portId = this.props.portId;
    let modes = this.state.modes;

    this._getFormValue(modes, modifiedPort);

    delete modifiedPort.internationalAirport;
    delete modifiedPort.domesticAirport;

    modifiedPort.__v = Math.max(__v, modifiedPort.__v);

    this.props.updatePortById(portId, modifiedPort);

    this.__saveButtonClicked = true;
  },

});

module.exports = PortGeneral;
