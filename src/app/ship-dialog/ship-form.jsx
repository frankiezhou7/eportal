const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownCountries = require('~/src/shared/dropdown-countries');
const DropDownShipTypes = require('~/src/shared/dropdown-ship-types');
const FlatButton = require('epui-md/FlatButton');
const Loading = require('epui-md/ep/RefreshIndicator');
const TextFieldImo = require('~/src/shared/text-field-imo');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const RawTextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const { ComposedForm, use } = require('epui-composer');
const PropTypes = React.PropTypes;
const IMO_REGEX = /^\d{7}$/;

use(DropDownCountries);
use(DropDownShipTypes);
use(TextFieldImo);
use(TextField, 'TextField');

const ShipForm = React.createClass({
  mixins: [AutoStyle, PureRenderMixin, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  translations: require(`epui-intl/dist/ShipParticulars/${__LOCALE__}`),

  propTypes: {
    checkImoExists: PropTypes.func,
    loading: PropTypes.bool,
    nErrorTextIntegerIsRequired: PropTypes.string,
    nTextBaseInfo: PropTypes.string,
    nTextBreadth: PropTypes.string,
    nTextBreadthExtreme: PropTypes.string,
    nTextBreadthMoulded: PropTypes.string,
    nTextCubeMeter: PropTypes.string,
    nTextDWT: PropTypes.string,
    nTextDepth: PropTypes.string,
    nTextDepthExtreme: PropTypes.string,
    nTextDepthMoulded: PropTypes.string,
    nTextDisplacement: PropTypes.string,
    nTextDraft: PropTypes.string,
    nTextFeeBoard: PropTypes.string,
    nTextGrtIctm69: PropTypes.string,
    nTextGrtSuez: PropTypes.string,
    nTextHeight: PropTypes.string,
    nTextHeightToTopMast: PropTypes.string,
    nTextHeightToTopOfHatch: PropTypes.string,
    nTextHolds: PropTypes.string,
    nTextHoldsBallastTanksCapacity: PropTypes.string,
    nTextHoldsCubicCapacity: PropTypes.string,
    nTextHoldsHatchBreadth: PropTypes.string,
    nTextHoldsHatchLength: PropTypes.string,
    nTextHoldsMaxCargoWeight: PropTypes.string,
    nTextHoldsMaxPermitLoad: PropTypes.string,
    nTextHoldsNo: PropTypes.string,
    nTextIMO: PropTypes.string,
    nTextImoExists: PropTypes.string,
    nTextImoIsRequired: PropTypes.string,
    nTextKnot: PropTypes.string,
    nTextLength: PropTypes.string,
    nTextLengthAtWaterLine: PropTypes.string,
    nTextLengthBetweenPerpendiculars: PropTypes.string,
    nTextLengthBowToBridge: PropTypes.string,
    nTextLengthBridgeToAft: PropTypes.string,
    nTextLengthOverall: PropTypes.string,
    nTextLengthRegistered: PropTypes.string,
    nTextLightFWA: PropTypes.string,
    nTextLightFullLoad: PropTypes.string,
    nTextLightShip: PropTypes.string,
    nTextLoadLines: PropTypes.string,
    nTextMark: PropTypes.string,
    nTextMeter: PropTypes.string,
    nTextNrtIctm69: PropTypes.string,
    nTextNrtSuez: PropTypes.string,
    nTextSaveButton: PropTypes.string,
    nTextShipName: PropTypes.string,
    nTextShipNameIsRequired: PropTypes.string,
    nTextShipNationalityIsRequired: PropTypes.string,
    nTextShipType: PropTypes.string,
    nTextSpeedAvarage: PropTypes.string,
    nTextSpeedMax: PropTypes.string,
    nTextTon: PropTypes.string,
    nTextTonPerCM: PropTypes.string,
    nTextTonPerSquareMeter: PropTypes.string,
    nTextTpc: PropTypes.string,
    ship: PropTypes.object,
    shipId: PropTypes.string,
  },

  getDefaultProps() {
    return {
      loading: false,
      ship: {},
    };
  },

  getInitialState() {
    return {
      modes: null,
    };
  },

  getStyles() {
    let styles = {
      root: {
        margin: '0 auto',
        padding: '10px 10px',
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
      },
      loading: {
        margin: '0 auto',
      },
    };

    return styles;
  },

  isValid() {
    return this.form.isValid();
  },

  getValue() {
    return this.form.getValue();
  },

  _renderLoading() {
    let styles = this.getStyles();
    return (
      <div style={this.style('loading')}>
        <Loading />
      </div>
    );
  },

  _renderForm(loading, ship) {
    let defs = this._getDefs(loading, ship);

    return (
      <ComposedForm
        ref={(ref) => this.form = ref}
        definitions={defs}
        value={ship || {}}
      />
    );
  },

  render() {
    let {
      loading,
      ship,
    } = this.props;

    return (
      <div style={this.style('root')}>
        {this._renderForm(loading, ship)}
        {loading && this._renderLoading()}
      </div>
    );
  },

  _validate(ship) {
    let name = ship && ship.name;
    let imo = ship && ship.imo;
    if (!name || !imo) { return null; }

    ship.imo = _.trim(imo);
    ship.name = _.trim(name);

    return ship;
  },

  _getDefs(disabled, ship) {
    const defs = [
      {
        component: 'TextField',
        name: 'name',
        props: {
          checkOnBlur: true,
          disabled: disabled || !!ship.name,
          floatingLabelText: this.t('nTextShipName'),
          maxLength: 128,
          required: true,
          style: {
            float: 'left',
            margin: '0px 8px',
          },
          validError: (val, opts) => {
            if (!val) {
              return this.t('nTextShipNameIsRequired');
            } else if (val.length > opts.maxLength) {
              return this.t('nTextShipNameLength');
            }
          },
          defaultValue: '#name',
        }
      }, {
        component: 'TextFieldImo',
        name: 'imo',
        props: {
          disabled: disabled || !!ship.imo,
          floatingLabelText: this.t('nTextIMO'),
          style: {
            float: 'left',
            margin: '0px 8px',
          },
          value: '#imo',
        }
      }, {
        component: 'DropDownShipTypes',
        name: 'type',
        props: {
          disabled: disabled,
          floatingLabelText: this.t('nTextShipType'),
          style: {
            float: 'left',
            margin: '0px 8px',
          },
          value: '#type',
        }
      }, {
        component: 'DropDownCountries',
        name: 'nationality',
        props: {
          disabled: disabled,
          floatingLabelText: this.t('nTextShipNationalityIsRequired'),
          style: {
            float: 'left',
            margin: '0px 12px 0px 4px',
          },
          value: '#nationality',
        }
      }, {
        component: 'TextField',
        name: 'length.overall',
        props: {
          checkOnBlur: true,
          disabled: disabled,
          floatingLabelText: this.t('nTextLengthOverall'),
          style: {
            float: 'left',
            margin: '0px 8px',
          },
          validError: this.t('nErrorTextIntegerIsRequired'),
          validType: 'number',
          defaultValue: '#length.overall',
        }
      }, {
        component: 'TextField',
        name: 'breadth.moulded',
        props: {
          checkOnBlur: true,
          disabled: disabled,
          floatingLabelText: this.t('nTextBreadthMoulded'),
          style: {
            float: 'left',
            margin: '0px 8px',
          },
          validError: this.t('nErrorTextIntegerIsRequired'),
          validType: 'number',
          defaultValue: '#breadth.moulded',
        }
      }, {
        component: 'TextField',
        name: 'grt.ictm69',
        props: {
          checkOnBlur: true,
          disabled: disabled,
          floatingLabelText: this.t('nTextGrtIctm69'),
          style: {
            float: 'left',
            margin: '0px 8px',
          },
          validError: this.t('nErrorTextIntegerIsRequired'),
          validType: 'number',
          defaultValue: '#grt.ictm69',
        }
      }, {
        component: 'TextField',
        name: 'nrt.ictm69',
        props: {
          checkOnBlur: true,
          disabled: disabled,
          floatingLabelText: this.t('nTextNrtIctm69'),
          style: {
            float: 'left',
            margin: '0px 8px',
          },
          checkOnBlur: true,
          validError: this.t('nErrorTextIntegerIsRequired'),
          validType: 'number',
          defaultValue: '#nrt.ictm69',
        },
      }, {
        component: 'TextField',
        name: 'dwt',
        props: {
          checkOnBlur: true,
          disabled: disabled,
          floatingLabelText: this.t('nTextDWT'),
          style: {
            float: 'left',
            margin: '0px 8px',
          },
          validError: this.t('nErrorTextIntegerIsRequired'),
          validType: 'number',
          defaultValue: '#dwt',
        },
      },
    ];

    return defs;
  },
});

module.exports = ShipForm;
