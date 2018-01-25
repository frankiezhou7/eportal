const React = require('react');
const ClearFix = require('epui-md/internal/ClearFix');
const Colors = require('epui-md/styles/colors');
const DropDownPorts = require('~/src/shared/dropdown-ports');
const DropDownTerminalShipYard = require('~/src/shared/dropdown-terminal-shipyard');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const DropDownMenu = require('epui-md/DropDownMenu/DropDownMenu');
const MenuItem = require('epui-md/MenuItem/MenuItem');
const TextFieldDateTime = require('epui-md/TextField/TextFieldDateTime');
const DateAndTimePicker = require('epui-md/DateAndTimePicker/DateAndTimePicker');
const Translatable = require('epui-intl').mixin;

const AddSegmentForm = React.createClass({
  mixins: [StylePropable, Translatable],

  translations: require(`epui-intl/dist/SegmentDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    ship: PropTypes.object,
    disabled: PropTypes.bool,
    showTipsTime: PropTypes.bool,
    showTipsNow: PropTypes.bool,
    nErrorTextPortToIsRequired: PropTypes.string,
    nErrorTextArrivalDateIsRequired: PropTypes.string,
    nTextAddSegmentForShip: PropTypes.string,
    nLabelLastPort: PropTypes.string,
    nLabelNextPort: PropTypes.string,
    nLabelArrivalPort: PropTypes.string,
    nLabelInterestingPorts: PropTypes.string,
    nLabelTimeErrorText: PropTypes.string,
    nLabelTimeNowErrorText: PropTypes.string,
    nLabelEstimateArrivalTime: PropTypes.string,
    nLabelEstimateDockTime: PropTypes.string,
    nLabelEstimateDepartureTime: PropTypes.string,
    nLabelHintText: PropTypes.string,
    nLabelRequired: PropTypes.string,
    contentStyle: PropTypes.object,
    newTip: PropTypes.bool,
    newVoyage: PropTypes.object,
    disableInit: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    let voyage = this.props.newVoyage ? this.props.newVoyage : {};
    let STVal = null, STSelection = 0;
    if(!!_.get(voyage, 'terminal')) { STVal = _.get(voyage, 'terminal'); }
    if(!!_.get(voyage, 'shipyard')) {
      STVal = _.get(voyage, 'shipyard');
      STSelection = 1;
    }
    return {
      nErrorTextPortToIsRequired: null,
      nErrorTextArrivalDateIsRequired: null,
      shipyardTerminalSelection: STSelection,
      shipyardTerminalVal: STVal,
      portId: _.get(voyage, 'arrivalPort'),
    };
  },

  clearValue() {
    this.refs.arrivalPort.clearValue();
    this.refs.lastPort.clearValue();
    this.refs.nextPort.clearValue();
    this.refs.time1.clearValue();
    this.refs.time2.clearValue();
    this.refs.time3.clearValue();
  },

  getValue() {
    let arrivalPort = this.refs.arrivalPort;
    let lastPort = this.refs.lastPort;
    let nextPort = this.refs.nextPort;
    let portTo = arrivalPort.getFullValue();
    let portFrom = lastPort.getFullValue();
    let portNext = nextPort.getFullValue();
    let timeArrival = this.refs.time1.getValue();
    let timeBerth = this.refs.time2.getValue();
    let timeDept = this.refs.time3.getValue();
    let shipyardTerminal = this.refs.STValue.getValue();
    // let timeArrivalUnparsed = this.refs.time1.getUnparsedValue();
    // let timeBerthUnparsed = this.refs.time2.getUnparsedValue();
    // let timeDeptUnparsed = this.refs.time3.getUnparsedValue();
    let nErrorTextPortToIsRequired = null;
    let nErrorTextArrivalDateIsRequired = null;

    let val = {};

    if(this.state.shipyardTerminalSelection) {
      val.shipyard = shipyardTerminal;
    }else { val.terminal = shipyardTerminal; }

    if(portTo) {
      val.arrivalPort = portTo.value;
    } else {
      nErrorTextPortToIsRequired = this.t('nErrorTextPortToIsRequired');
    }

    if(portFrom) {
      val.departurePort = portFrom.value;
    }

    if(portNext) {
      val.nextPort = portNext.value;
    }

    if(timeArrival || timeBerth || timeDept) {
      val.schedule = {
        timePoints: {},
      };

      let times = val.schedule.timePoints;

      if(timeArrival) {
        times.arrival = {
          time: timeArrival,
          // unparsedTime: timeArrivalUnparsed,
          estimated: true,
          tag: 'ETA',
        };
      }else{
        times.arrival = {
          tag: 'ETA',
        };
      }

      if(timeBerth) {
        times.berth = {
          time: timeBerth,
          // unparsedTime:timeBerthUnparsed,
          estimated: true,
          tag: 'ETB',
        };
      }else{
        times.berth = {
          tag: 'ETB',
        };
      }

      if(timeDept) {
        times.departure = {
          time: timeDept,
          // unparsedTime: timeDeptUnparsed,
          estimated: true,
          tag: 'ETD',
        };
      }else{
        times.departure = {
          tag: 'ETD',
        };
      }
    } else if(!timeArrival) {
      nErrorTextArrivalDateIsRequired = this.t('nErrorTextArrivalDateIsRequired');
    }

    this.setState({
      nErrorTextPortToIsRequired: nErrorTextPortToIsRequired,
      nErrorTextArrivalDateIsRequired: nErrorTextArrivalDateIsRequired,
    });

    return (nErrorTextPortToIsRequired === null && nErrorTextArrivalDateIsRequired === null) ? val : null;
  },

  getStyles() {
    let props = this.props;
    let theme = this.context.muiTheme;

    let styles = {
      root: {
        minHeight: '100%',
      },
      headerStyle: {
        color: Colors.indigo700,
        backgroundColor: '#C5CAE9',
      },
      bodyStyle: {
        height: '448px',
      },
      contentStyle: {
        root: {
          margin: '30px 40px',
        },
        tip: {
          marginBottom: '23px',
          fontSize: '16px',
          color: '#B6B6B6',
        },
        newTip:{
          fontSize: '16px',
        },
        port: {
          marginLeft: '-25px',
          fontSize: '14px',
          width: '100%',
          maxWidth: 256,
        },
        row: {
          root: {
            width: '100%',
            height: '72px',
          },
          item: {
            display: 'inline-block',
            marginRight: '20px',
            width: '164px',
            verticalAlign: 'top'
          },
          bottom: {
            boxSizing: 'border-box',
          },
          tips: {
            fontSize: '12px',
            color: 'rgb(244, 67, 54)',
          }
        }
      },
      requiredSpan: {
        color: theme.epColor.orangeColor,
        fontSize: '12px',
        lineHeight: '16px',
        marginLeft: '16px',
        position: 'relative',
        top: '18px',
      },
      footer: {
        button: {
          width: '82px',
        },
        buttonBig: {
          width: '120px',
        }
      },
      textField: {
        width: '164px',
      },
      keyLabel: {
        fontSize: '14px',
        color: '#F5A623',
        marginLeft: '8px',
      },
      typeSelection: {
        verticalAlign: 'middle',
        margin: '10px 0px 0px -23px',
      },
      shipyard: {
        width: '425px',
      }
    };

    return styles;
  },

  renderTips(showTipsTime, showTipsNow) {
    let styles = this.getStyles();
    return showTipsTime ? (
      <div style={styles.contentStyle.row.tips}>{this.t('nLabelTimeErrorText')}</div>
    ) : showTipsNow ? (
      <div style={styles.contentStyle.row.tips}>{this.t('nLabelTimeNowErrorText')}</div>
    ): null;
  },

  render() {
    let styles = this.getStyles();

    let {
      ship,
      disabled,
      showTipsTime,
      showTipsNow,
      contentStyle,
      newTip,
      newVoyage,
      disableInit,
      ...other
    } = this.props;

    let {
      nErrorTextPortToIsRequired,
      nErrorTextArrivalDateIsRequired,
      shipyardTerminalSelection,
      shipyardTerminalVal,
      portId,
    } = this.state;

    let voyage = newVoyage ? newVoyage : {};
    let shipName = ship && ship.name;

    return (
      <div style={contentStyle ? contentStyle : styles.contentStyle.root}>
        <div style={newTip ? styles.contentStyle.newTip : styles.contentStyle.tip}>
         {newTip ? this.t('nTextRegisterSegmentForShip', {shipName: shipName}) : this.t('nTextAddSegmentForShip', {shipName: shipName})}
        </div>
        <div style={this.mergeAndPrefix(styles.contentStyle.row.root, styles.contentStyle.row.bottom)}>
          <DropDownPorts
            ref='arrivalPort'
            disabled={disabled}
            errorText={nErrorTextPortToIsRequired}
            label={this.t('nLabelArrivalPort')}
            value={voyage.arrivalPort ? voyage.arrivalPort : ''}
            keyLabel={`(${this.t('nLabelRequired')})`}
            keyLabelStyle={styles.keyLabel}
            onChange={this._handleChooseArrivalPort}
            disableInit={disableInit}
          />
        </div>
        <div style={styles.contentStyle.row.root}>
          <DropDownMenu
            ref='STSelection'
            value={shipyardTerminalSelection}
            style={styles.typeSelection}
            onChange={this._handleSTChange}
          >
            <MenuItem value={0} primaryText={this.t('nLabelTerminal')} />
            <MenuItem value={1} primaryText={this.t('nLabelShipyard')} />
          </DropDownMenu>
          <DropDownTerminalShipYard
            ref='STValue'
            value={shipyardTerminalVal}
            type={shipyardTerminalSelection ? 'shipyard' : 'terminal'}
            portId={portId}
            style={styles.shipyard}
          />
        </div>
        <div style={styles.contentStyle.row.root}>
          <DropDownPorts
            ref='lastPort'
            disabled={disabled}
            label={this.t('nLabelLastPort')}
            value={voyage.departurePort ? voyage.departurePort : ''}
            style={{marginRight: 20}}
            disableInit={disableInit}
          />
          <DropDownPorts
            ref='nextPort'
            disabled={disabled}
            label={this.t('nLabelNextPort')}
            value={voyage.nextPort ? voyage.nextPort : ''}
            disableInit={disableInit}
          />
        </div>
        <div style={styles.contentStyle.row.root}>
          <div style={styles.contentStyle.row.item}>
            <DateAndTimePicker
              ref='time1'
              mode={'portrait'}
              format={'24hr'}
              value={_.get(voyage, ['schedule', 'timePoints', 'arrival', 'time'],'')}
              locale={'en-US'}
              autoOk={true}
              container={'dialog'}
              floatingLabelText={this.t('nLabelEstimateArrivalTime')}
              disabled={disabled}
              keyLabel={`(${this.t('nLabelRequired')})`}
              keyLabelStyle={styles.keyLabel}
              textFieldStyle={styles.textField}
            />
            {/*<TextFieldDateTime
              ref='time1'
              disabled={disabled}
              errorText={nErrorTextArrivalDateIsRequired}
              showYear={true}
              floatingLabelText={this.t('nLabelEstimateArrivalTime')}
              infoText={this.t('nLabelRequired')}
              hintText={this.t('nLabelHintText')}
              defaultValue={voyage.schedule ? voyage.schedule.timePoints ?  voyage.schedule.timePoints.arrival ? voyage.schedule.timePoints.arrival.unparsedTime : '' : '' : ''}
              fullWidth={true} />*/}
          </div>
          <div style={styles.contentStyle.row.item}>
            <DateAndTimePicker
              ref='time2'
              mode={'portrait'}
              format={'24hr'}
              value={_.get(voyage, ['schedule', 'timePoints', 'berth', 'time'],'')}
              locale={'en-US'}
              autoOk={true}
              container={'dialog'}
              floatingLabelText={this.t('nLabelEstimateDockTime')}
              disabled={disabled}
              textFieldStyle={styles.textField}
            />
            {/*<TextFieldDateTime
              ref='time2'
              disabled={disabled}
              showYear={true}
              floatingLabelText={this.t('nLabelEstimateDockTime')}
              hintText={this.t('nLabelHintText')}
              defaultValue={voyage.schedule ? voyage.schedule.timePoints ?  voyage.schedule.timePoints.berth ? voyage.schedule.timePoints.berth.unparsedTime : '' : '' : ''}
              fullWidth={true} />*/}
          </div>
          <div style={styles.contentStyle.row.item}>
            <DateAndTimePicker
              ref='time3'
              mode={'portrait'}
              format={'24hr'}
              value={_.get(voyage, ['schedule', 'timePoints', 'departure', 'time'],'')}
              locale={'en-US'}
              autoOk={true}
              container={'dialog'}
              floatingLabelText={this.t('nLabelEstimateDepartureTime')}
              disabled={disabled}
              textFieldStyle={styles.textField}
            />
            {/*<TextFieldDateTime
              ref='time3'
              disabled={disabled}
              showYear={true}
              floatingLabelText={this.t('nLabelEstimateDepartureTime')}
              hintText={this.t('nLabelHintText')}
              defaultValue={voyage.schedule ? voyage.schedule.timePoints ?  voyage.schedule.timePoints.departure ? voyage.schedule.timePoints.departure.unparsedTime : '' : '' : ''}
              fullWidth={true} />*/}
          </div>
          {this.renderTips(showTipsTime,showTipsNow)}
        </div>
      </div>
    );
  },

  _handleChooseArrivalPort(item, value){
    this.setState({portId:value});
  },

  _handleSTChange(e, index, value){
    this.setState({shipyardTerminalSelection: value});
  },
});

module.exports = AddSegmentForm;
