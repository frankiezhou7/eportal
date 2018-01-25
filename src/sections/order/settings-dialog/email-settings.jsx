const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const Section = require('./settings-section');
const TextField = require('epui-md/TextField');
const DateAndTimePicker = require('epui-md/DateAndTimePicker/DateAndTimePicker');
const Translatable = require('epui-intl').mixin;
const moment = require('moment');

const ORDER_MODE = require('~/src/shared/constants').ORDER_MODE;

const PropTypes = React.PropTypes;

const RE = /(?:\"?([^\"]*)\"?\s)?<?((([a-zA-Z]|[0-9])|([-]|[_]|[.]))+[@](([a-zA-Z0-9])|([-])){2,63}([.](([a-zA-Z0-9]){2,63})+)+)>?/;
const DEFAULT = {
  order: {
    to: '',
    cc: '',
  },
  event: {
    to: '',
    cc: '',
  },
  schedule: {
    to: '',
    cc: '',
  },
  receiveTime: null,
  autoSendDay: '',
};

const EmailSettings = React.createClass({
  mixins: [StylePropable, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  translations: [
    require(`epui-intl/dist/OrderSettings/${__LOCALE__}`)
  ],

  propTypes: {
    order: PropTypes.object,
    mode: PropTypes.oneOf(_.values(ORDER_MODE)),
    disabled: PropTypes.bool,
    nTitleOrderSettingsEmailAddressOrderRelated: PropTypes.string,
    nTitleOrderSettingsEmailAddressEventRelated: PropTypes.string,
    nLabelOrderSettingsEmailAddressReceiver: PropTypes.string,
    nLabelOrderSettingsEmailAddressCCer: PropTypes.string,
    nLabelOrderSettingsEmailEdgeHeader: PropTypes.string,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState: function() {
    let order = this.props.order;
    const mode = this.props.mode;
    let settings = order && order.settings;

    const emailing = settings && (mode === ORDER_MODE.CONSIGNER ? settings.get('consignerEmailing') && settings.get('consignerEmailing').toJS() : mode === ORDER_MODE.CONSIGNEE ? settings.get('consigneeEmailing') &&settings.get('consigneeEmailing').toJS() : null);

    let values = _.defaultsDeep({}, emailing, DEFAULT);
    return {
      ordEmailRcvError:null,
      evtEmailRcvError:null,
      receiveTime: _.get(values,'receiveTime'),
    };
  },

  componentWillReceiveProps(nextProps) {

  },

  getValue() {

    let ordEmailRcvError = null;
    let evtEmailRcvError = null;
    if(!this.refs.ordEmailRcv.getValue()){
      ordEmailRcvError = this.t('nTextOrdEmailRcvRequired');
    }
    if(!this.refs.evtEmailRcv.getValue()){
      evtEmailRcvError = this.t('nTextEvtEmailRcvRequired');
    }
    this.setState({
      ordEmailRcvError:ordEmailRcvError,
      evtEmailRcvError:evtEmailRcvError
    });

    if(evtEmailRcvError||ordEmailRcvError) {
      return undefined;
    }

    return {
      emailing: {
        order: {
          to: this.refs.ordEmailRcv.getValue(),
          cc: this.refs.ordEmailCC.getValue(),
        },
        event: {
          to: this.refs.evtEmailRcv.getValue(),
          cc: this.refs.evtEmailCC.getValue(),
        },
        schedule: {
          to: this.refs.scheEmailRcv ? this.refs.scheEmailRcv.getValue() : '',
          cc: this.refs.scheEmailRcv ? this.refs.scheEmailRcv.getValue() : '',
        },
        autoSendDay: this.refs.autoEmailSend.getValue(),
        receiveTime: this.state.receiveTime,
      }
    };
  },

  getStyles() {
    return {
      root: {

      },
      time: {
        marginTop: 20,
        marginRight: 11,
        fontSize: 14,
        color: '#f5a623',
      },
      day: {
        width: 60,

      },
      dayInput: {
        textAlign: 'center',
      },
      note: {
        color: '#9b9b9b',
        fontSize: 14,
        marginBottom: 25,
      },
      timePickerContainer:{
        marginTop: 15,
      },
      timePicker:{
        display: 'inline-block',
      },
      picker: {
        width: 60,
        marginRight: 10,
      }
    };
  },

  renderAutoEmailReceive(styles,values){
    return (
      <div>
        {this.t('nTitleOrderSettingsAutoEmailReceiveTimePartOne')}
        <TextField
          key='autoEmailSend'
          ref='autoEmailSend'
          style={styles.day}
          inputStyle={styles.dayInput}
          defaultValue={values.autoSendDay}
        />
        {this.t('nTitleOrderSettingsAutoEmailReceiveTimePartTwo')}
      </div>
    );
  },

  renderScheduleMail(values, disabled) {
    return this.props.mode === ORDER_MODE.CONSIGNER && (
      <Section
        key='scheEmailSettings'
        title={this.t('nTitleOrderSettingsEmailAddressScheduleRelated')}
        note={this.t('nTextOrderSettingsEmailAddressScheduleRelated')}
      >
        <TextField
          key='scheEmailRcv'
          ref='scheEmailRcv'
          floatingLabelText={this.t('nLabelOrderSettingsEmailAddressReceiver')}
          multiLine={true}
          fullWidth={true}
          onBlur={this._handleEmailBlur}
          defaultValue={values.schedule.to}
          disabled={disabled}
          rowsMax={2}
          errorText = {this.state.ordEmailRcvError}
        />
        <TextField
          key='scheEmailCC'
          ref='scheEmailCC'
          floatingLabelText={this.t('nLabelOrderSettingsEmailAddressCCer')}
          multiLine={true}
          fullWidth={true}
          onBlur={this._handleEmailBlur}
          defaultValue={values.schedule.cc}
          disabled={disabled}
          rowsMax={2}
        />
      </Section>
    )
  },

  render() {
    let styles = this.getStyles();
    let order = this.props.order;
    const mode = this.props.mode;
    let disabled = this.props.disabled;
    let settings = order && order.settings;

    const emailing = settings && (mode === ORDER_MODE.CONSIGNER ? settings.get('consignerEmailing') && settings.get('consignerEmailing').toJS() : mode === ORDER_MODE.CONSIGNEE ? settings.get('consigneeEmailing') &&settings.get('consigneeEmailing').toJS() : null);

    let values = _.defaultsDeep({}, emailing, DEFAULT);
    let { receiveTime } = this.state;
    let receiveTimeEl = _.isDate(receiveTime) || _.isString(receiveTime) ? this.t('nTextOrderSettingsEmailReceiveEmailRelated') + ' ' + moment(receiveTime).format('DD/MMM/YYYY') : '';

    return (
      <div style={styles.root}>
        {this.renderScheduleMail(values, disabled)}
        {/*<Section
          key='scheEmailSettings'
          title={this.t('nTitleOrderSettingsEmailAddressScheduleRelated')}
          note={this.t('nTextOrderSettingsEmailAddressScheduleRelated')}
        >
          <TextField
            key='scheEmailRcv'
            ref='scheEmailRcv'
            floatingLabelText={this.t('nLabelOrderSettingsEmailAddressReceiver')}
            multiLine={true}
            fullWidth={true}
            onBlur={this._handleEmailBlur}
            defaultValue={values.schedule.to}
            disabled={disabled}
            rowsMax={2}
            errorText = {this.state.ordEmailRcvError}
          />
          <TextField
            key='scheEmailCC'
            ref='scheEmailCC'
            floatingLabelText={this.t('nLabelOrderSettingsEmailAddressCCer')}
            multiLine={true}
            fullWidth={true}
            onBlur={this._handleEmailBlur}
            defaultValue={values.schedule.cc}
            disabled={disabled}
            rowsMax={2}
          />
        </Section>*/}
        <Section
          key='ordEmailSettings'
          title={this.t('nTitleOrderSettingsEmailAddressOrderRelated')}
          note={this.t('nTextOrderSettingsEmailAddressOrderRelated')}
        >
          <TextField
            key='ordEmailRcv'
            ref='ordEmailRcv'
            floatingLabelText={this.t('nLabelOrderSettingsEmailAddressReceiver')}
            multiLine={true}
            fullWidth={true}
            onBlur={this._handleEmailBlur}
            defaultValue={values.order.to}
            disabled={disabled}
            rowsMax={2}
            errorText = {this.state.ordEmailRcvError}
          />
          <TextField
            key='ordEmailCC'
            ref='ordEmailCC'
            floatingLabelText={this.t('nLabelOrderSettingsEmailAddressCCer')}
            multiLine={true}
            fullWidth={true}
            onBlur={this._handleEmailBlur}
            defaultValue={values.order.cc}
            disabled={disabled}
            rowsMax={2}
          />
        </Section>
        <Section
          key='evtEmailSettings'
          title={this.t('nTitleOrderSettingsEmailAddressEventRelated')}
          note={this.t('nTextOrderSettingsEmailAddressEventRelated')}
        >
          <TextField
            key='evtEmailRcv'
            ref='evtEmailRcv'
            floatingLabelText={this.t('nLabelOrderSettingsEmailAddressReceiver')}
            multiLine={true}
            fullWidth={true}
            onBlur={this._handleEmailBlur}
            defaultValue={values.event.to}
            disabled={disabled}
            rowsMax={2}
            errorText = {this.state.evtEmailRcvError}
          />
          <TextField
            key='evtEmailCC'
            ref='evtEmailCC'
            floatingLabelText={this.t('nLabelOrderSettingsEmailAddressCCer')}
            multiLine={true}
            fullWidth={true}
            onBlur={this._handleEmailBlur}
            defaultValue={values.event.cc}
            disabled={disabled}
            rowsMax={2}
          />
        </Section>
        <Section
          key='evtEmailSettings'
          title={this.t('nTitleOrderSettingsEmailAddressEventRelated')}
          note={this.t('nTextOrderSettingsEmailAddressEventRelated')}
        >
          <TextField
            key='evtEmailRcv'
            ref='evtEmailRcv'
            floatingLabelText={this.t('nLabelOrderSettingsEmailAddressReceiver')}
            multiLine={true}
            fullWidth={true}
            onBlur={this._handleEmailBlur}
            defaultValue={values.event.to}
            disabled={disabled}
            rowsMax={2}
            errorText = {this.state.evtEmailRcvError}
          />
          <TextField
            key='evtEmailCC'
            ref='evtEmailCC'
            floatingLabelText={this.t('nLabelOrderSettingsEmailAddressCCer')}
            multiLine={true}
            fullWidth={true}
            onBlur={this._handleEmailBlur}
            defaultValue={values.event.cc}
            disabled={disabled}
            rowsMax={2}
          />
        </Section>
        <Section
          key='autoRcvEmailSettings'
          title={this.renderAutoEmailReceive(styles,values)}
        >
          <div style={styles.note}>
            {this.t('nTextOrderSettingsAutoEmailReceiveRelated')}
          </div>
        </Section>
        <Section
          key='rcvEmailTimeSettings'
          title={this.t('nTitleOrderSettingsEmailReceiveTimeRelated')}
          note={this.t('nTextOrderSettingsEmailReceiveTimeRelated')}
        >
          <div style={styles.timePickerContainer}>
            <DateAndTimePicker
              key='rcvEmailTime'
              ref='rcvEmailTime'
              mode={'portrait'}
              format={'24hr'}
              locale={'en-US'}
              autoOk={true}
              container={'dialog'}
              value={receiveTime}
              hintText={'HH:MM'}
              textFieldStyle={styles.picker}
              style={styles.timePicker}
              showDate={false}
              onChange={this._handleSetReceiveTime}
            />
            <span style={styles.time}>{receiveTimeEl}</span>
          </div>
        </Section>
      </div>
    );
  },

  _handleSetReceiveTime(time){
    this.setState({receiveTime:time});
  },

  _handleEmailBlur(evt) {
    evt.target.value = this._formatEmails(evt.target.value);
  },

  _formatEmails(str) {
    if(!str) { return str; }
    let parts = str.split(/[,;\uff0c\uff1b\n]/);
    let found = [];
    let results = _.map(parts, (part) => {
      part = _.trim(part);
      let re = RE.exec(part);

      if(!re || !re[2] || _.includes(found, re[2])) { return undefined; }

      found.push(re[2]);

      let name = re[1] ? `"${re[1]}" ` : '';
      let email = re[1] ? `<${re[2]}>` : re[2];

      return name + email;
    });
    results = _.compact(results);
    return results.join(', ');
  },
});

module.exports = EmailSettings;
