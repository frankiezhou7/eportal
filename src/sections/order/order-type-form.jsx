const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const ClearFix = require('epui-md/internal/ClearFix');
const Colors = require('epui-md/styles/colors');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const ToggleButton = require('epui-md/ep/ToggleButton');

const OrderTypeForm = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/CreateOrder/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    ship: PropTypes.object,
    segment: PropTypes.object,
    disabled: PropTypes.bool,
    onChange: PropTypes.func,
    nButtonLoad: PropTypes.string,
    nButtonDischarge: PropTypes.string,
    nButtonReceive: PropTypes.string,
    nButtonDeliver: PropTypes.string,
    nButtonDrydocking: PropTypes.string,
    nButtonNewBuilding: PropTypes.string,
    nButtonBunkering: PropTypes.string,
    nButtonOwnersAgent: PropTypes.string,
    nLabelOrderTypeDescOwnersHusbandryAgency: PropTypes.string,
    nLabelOrderTypeDescOwnersAgency: PropTypes.string,
    nLabelOrderTypeDescFullAgency: PropTypes.string,
    nLabelOrderTypeDescProtectingAgency: PropTypes.string,
    nLabelOrderTypeDescOthers: PropTypes.string,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {};
  },

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.disabled !== this.props.disabled;
  },

  getValue() {
    return this.orderType;
  },

  clearValue() {
    if(this._toggled) { this._toggled.toggle(); }
    this.orderType = null;
    this._toggled = null;
  },

  getStyles() {
    let props = this.props;
    let { paper } = this.context.muiTheme;

    let styles = {
      root: {
        minHeight: '100%',
      },
      header: {
        color: Colors.indigo700,
        backgroundColor: '#C5CAE9',
      },
      body: {
        height: '448px',
      },
      content: {
        root: {
          margin: '30px auto',
        },
        card: {
          x1: {
            width: 202,
          },
          x15: {
            width: 305,
          },
          x2: {
            width: 404,
          },
          x3: {
            width: 606,
          },
          x4: {
            width: 156,
          },
          root: {
            display: 'inline-block',
            marginRight: '1px',
            marginBottom: '1px',
            cursor: 'default',
          },
          content: {
            width: '100%',
            height: '75px',
            lineHeight: '75px',
            textAlign: 'center'
          },
          bar: {
            width: '156px',
            height: 90
          },
          fullButton: {
            width:'100%',
            height: 90,
            backgroundColor: '#ecf5fe',
            color: '#4a4a4a',
            toggledColor: '#f9dbaa',
            textTransform: 'initial',
            fontWeight: 'normal',
          },
          title:{
            display: 'block',
            fontSize:16,
          },
          titleX1:{
            display: 'block',
            top: -8,
            fontSize:16,
            padding: 0,
            paddingLeft: 0,
          },
          subtitle:{
            fontStyle: 'italic',
            position: 'absolute',
            left: 48,
            top: 18,
            fontSize: 14,
          },
          subTitleX1:{
            left: 35,
            fontSize: 14,
          },
          subTitleX2:{
            position: 'absolute',
            left: 56,
            top: 18,
          },
          subTitleX3:{
            position: 'absolute',
            left: 45,
            top: 18,
            fontSize: 16,
          },
          halfButton: {
            width:'100px',
            marginRight:'1px',
          },
        },
        row: {
          width: '100%',
          maxWidth: 628,
          margin: '0px auto',
          textAlign: 'center',
        },
        title: {
          fontSize: 16,
          fontWeight: 500,
          backgroundColor: this.context.muiTheme.palette.primary1Color,
          color: '#fff',
          textAlign: 'center',
          lineHeight: '42px',
          width: 630,
          height: 42,
          margin: '0 auto',
          boxShadow: paper.zDepthShadows[0],
        },
      },
      footer: {
        button: {
          width: '82px',
        },
        buttonBig: {
          width: '120px',
        }
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      ship,
      segment,
      disabled,
      ...other,
    } = this.props;

    return (
      <div>
        <div style={this.style('content.root')}>
          <div style={this.style('content.title')}>
            {this.t('nLabelOrderTypeDescOwnersAgentAppointment')}
          </div>
          <div style={this.style('content.row')}>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerHM'
                  key='OwnerHM'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonHusbandry')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonMatter')}
                  subLabelStyle={this.style('content.card.subTitleX2')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTOPA')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerNB'
                  key='OwnerNB'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonNewBuilding')}
                  labelStyle={this.style('content.card.title')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTNB')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerDD'
                  key='OwnerDD'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonDrydocking')}
                  labelStyle={this.style('content.card.title')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTDD')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerBK'
                  key='OwnerBK'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonBunkering')}
                  labelStyle={this.style('content.card.title')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTBK')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerLAL'
                  key='OwnerLAL'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonLocalAgency')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonLoading')}
                  subLabelStyle={this.style('content.card.subtitle')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTCL')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerLAD'
                  key='OwnerLAD'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonLocalAgency')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonDischarging')}
                  subLabelStyle={this.style('content.card.subtitle','content.card.subTitleX1')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTCD')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerPAL'
                  key='OwnerPAL'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonProtectingAgency')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonLoading')}
                  subLabelStyle={this.style('content.card.subtitle')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTPCL')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerPAD'
                  key='OwnerPAD'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonProtectingAgency')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonDischarging')}
                  subLabelStyle={this.style('content.card.subtitle','content.card.subTitleX1')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTPCD')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerPV'
                  key='OwnerPV'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonReceive')}
                  labelStyle={this.style('content.card.title')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTRV')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerDV'
                  key='OwnerDV'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonDeliver')}
                  labelStyle={this.style('content.card.title')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTDV')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerMVS'
                  key='OwnerMVS'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonMonitorVsl')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonSchedule')}
                  subLabelStyle={this.style('content.card.subTitleX3')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTMVS')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='OwnerOT'
                  key='OwnerOT'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonOther')}
                  labelStyle={this.style('content.card.title')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTOT')}
                />
              </div>
            </Paper>
          </div>
        </div>

        <div style={this.style('content.root')}>
          <div style={this.style('content.title')}>
            {this.t('nLabelOrderTypeDescCharterersAgentAppointment')}
          </div>
          <div style={this.style('content.row')}>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='CharLAL'
                  key='CharLAL'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonLocalAgency')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonLoading')}
                  subLabelStyle={this.style('content.card.subtitle')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTCL')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='CharLAD'
                  key='CharLAD'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonLocalAgency')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonDischarging')}
                  subLabelStyle={this.style('content.card.subtitle','content.card.subTitleX1')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTCD')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='CharPAL'
                  key='CharPAL'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonProtectingAgency')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonLoading')}
                  subLabelStyle={this.style('content.card.subtitle')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTPCL')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='CharPAD'
                  key='CharPAD'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonProtectingAgency')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonDischarging')}
                  subLabelStyle={this.style('content.card.subtitle','content.card.subTitleX1')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTPCD')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='CharMVS'
                  key='CharMVS'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonMonitorVsl')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonSchedule')}
                  subLabelStyle={this.style('content.card.subTitleX3')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTMVS')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='CharBK'
                  key='CharBK'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonBunkering')}
                  labelStyle={this.style('content.card.title')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTBK')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='CharHM'
                  key='CharHM'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonHusbandry')}
                  labelStyle={this.style('content.card.titleX1')}
                  clearLeft={true}
                  subLabel={this.t('nButtonMatter')}
                  subLabelStyle={this.style('content.card.subTitleX2')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTOPA')}
                />
              </div>
            </Paper>
            <Paper zDepth={1} style={this.style('content.card.root', 'content.card.x4')}>
              <div style={this.style('content.card.bar')}>
                <ToggleButton
                  ref='CharOT'
                  key='CharOT'
                  disabled={disabled}
                  style={this.style('content.card.fullButton')}
                  label={this.t('nButtonOther')}
                  labelStyle={this.style('content.card.title')}
                  onChange={this._handleOrderTypeToggle.bind(this, 'OTOT')}
                />
              </div>
            </Paper>
          </div>
        </div>
      </div>
    );
  },

  _handleOrderTypeToggle(code, button, flag) {
    if(flag === true) {
      this.orderType = code;
      if(this._toggled) { this._toggled.toggle(); }
      this._toggled = button;
    } else {
      if(this._toggled && this.orderType === code) {
        this.orderType = null;
        this._toggled = null;
      }
    }
    if(this.props.onChange) { this.props.onChange(this.orderType); }
  }
});

module.exports = OrderTypeForm;
