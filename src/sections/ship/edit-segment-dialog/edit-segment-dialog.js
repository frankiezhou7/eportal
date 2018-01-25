const React = require('react');
const _ = require('eplodash');
const FlatButton = require('epui-md/FlatButton');
const RaisedButton = require('epui-md/RaisedButton');
const DropDownMenu = require('epui-md/DropDownMenu/DropDownMenu');
const MenuItem = require('epui-md/MenuItem/MenuItem');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const moment = require('moment');
const DATE_FORMAT = 'MM/DD/YYYY HH:mm';
const DropDownPorts = require('~/src/shared/dropdown-ports');
const SegmentTimeEdit = require('~/src/sections/ship/segment-status/segment-time-edit');
const DropDownTerminalShipYard = require('~/src/shared/dropdown-terminal-shipyard');
const Checkbox = require('epui-md/Checkbox');

const PropTypes = React.PropTypes;


const EditSegmentDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/SegmentStatus/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    nLabelPortErrorText: PropTypes.string,
    nLabelTimeValidErrorText: PropTypes.string,
    nLabelTimeErrorText: PropTypes.string,
    nTitleMergeSegment: PropTypes.string,
    nTitleChangeSegment: PropTypes.string,
    nTextNotShowArrPort: PropTypes.string,
    nTextShowArrPort: PropTypes.string,
    nErrorTextPortToIsRequired: PropTypes.string,
    nErrorTextArrivalDateIsRequired: PropTypes.string,
    updateVoyageSegmentById: PropTypes.func,
    renderActions: PropTypes.func,
    refresh: PropTypes.func,
    close: PropTypes.func,
    style: PropTypes.object,
    segment: PropTypes.object,
    ship: PropTypes.object,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    let voyage = this.props.segment ? this.props.segment.toJS() : {};
    let STVal = null, STSelection = 0;
    if(!!_.get(voyage, 'terminal')) { STVal = _.get(voyage, 'terminal'); }
    if(!!_.get(voyage, 'shipyard')) {
      STVal = _.get(voyage, 'shipyard');
      STSelection = 1;
    }
    return {
      showArrPort: false,
      nErrorTextPortToIsRequired: null,
      nErrorTextArrivalDateIsRequired: null,
      nLabelTimeValidErrorText: null,
      nLabelTimeErrorText: null,
      shipyardTerminalSelection: STSelection,
      shipyardTerminalVal: STVal,
      portId: _.get(voyage, ['arrivalPort', '_id']),
    };
  },

  getValue() {
    let arrivalPort = this.refs.arrivalPort;
    let lastPort = this.refs.lastPort;
    let nextPort = this.refs.nextPort;
    let portTo = arrivalPort.getFullValue();
    let portFrom = lastPort.getFullValue();
    let portNext = nextPort.getFullValue();
    let timeArrival = this.refs.editArrival.getValue();
    let timeBerth = this.refs.editBerth.getValue();
    let timeDept = this.refs.editDeparture.getValue();
    let shipyardTerminal = this.refs.STValue.getValue();
    let nErrorTextPortToIsRequired = null;
    let nErrorTextArrivalDateIsRequired = null;

    let val = {};
    let { segment } = this.props;
    let defaultArrPort = segment && segment.arrivalPort;
    let defaultValueA = defaultArrPort && defaultArrPort._id;
    if(!this.state.showArrPort) {
      if(portTo && portTo.value !== defaultValueA) {
        val.arrivalPort = portTo.value;
      } else {
        nErrorTextPortToIsRequired = this.t('nLabelPortErrorText');
      }

    }
    // else {
    //   if(portTo) {
    //     val.arrivalPort = portTo.value;
    //   } else {
    //     nErrorTextPortToIsRequired = this.t('nErrorTextPortToIsRequired');
    //   }
    // }

    if(this.state.shipyardTerminalSelection) {
      val.shipyard = shipyardTerminal;
      val.terminal = null;
    }else {
      val.terminal = shipyardTerminal;
      val.shipyard = null;
    }

    if(portFrom) {
      val.departurePort = portFrom.value;
    }

    if(portNext) {
      val.nextPort = portNext.value;
    }

    if(!timeArrival) {
      nErrorTextArrivalDateIsRequired = this.t('nErrorTextArrivalDateIsRequired');
    }else {
      val.schedule = {
        timePoints: {},
      };

      let times = val.schedule.timePoints;

      if(timeArrival) {
        if(timeArrival.estimated){
          timeArrival.tag = 'ETA';
        }else {
          timeArrival.tag = 'ATA';
        }
        times.arrival = timeArrival;
      }

      if(timeBerth) {
        if(timeBerth.estimated){
          timeBerth.tag = 'ETB';
        }else {
          timeBerth.tag = 'Berthed';
        }
        times.berth = timeBerth;
      }else {
        times.berth = {
          tag: 'ETB',
        };
      }

      if(timeDept) {
        if(timeDept.estimated){
          timeDept.tag = 'ETD';
          val.status = 0;
        }else {
          timeDept.tag = 'Sailed';
          val.status = 1500;
        }
        times.departure = timeDept;
      }else {
        times.departure = {
          tag: 'ETD',
        };
        val.status = 0;
      }
    }

    this.setState({
      nErrorTextPortToIsRequired: nErrorTextPortToIsRequired,
      nErrorTextArrivalDateIsRequired: nErrorTextArrivalDateIsRequired,
      nLabelTimeErrorText: null,
      nLabelTimeValidErrorText: null,
    });

    return (nErrorTextPortToIsRequired === null && nErrorTextArrivalDateIsRequired === null) ? val : null;

  },

  getStyles() {
    let style = this.props.style;

    let styles = {
      root: {
        width: '100%',
      },
      title: {
        fontSize: '16px',
        color: '#9B9B9B',
        lineHeight: '16px',

      },
      editBoard: {
      },
      tips:{
        paddingTop: '10px',
        color: 'red',
        fontSize: '12px',
        lineHeight: '16px',
      },
      button: {
        marginLeft: '16px',
        position: 'relative',
        top: '10px',
      },
      typeSelection: {
        verticalAlign: 'middle',
        margin: '10px 0px 0px -23px',
      },
      shipyard: {
        width: '425px',
      },
    };

    return styles;
  },

  componentDidMount() {
    let actions = [
      <FlatButton
        key="cancal"
        ref={(ref) => this.cancal = ref}
        label= {this.t('nTextClose')}
        secondary
        onTouchTap={this._handleCancel}
      />,
      <FlatButton
        key="confirm"
        ref={(ref) => this.confirm = ref}
        label= {this.t('nTextSave')}
        secondary
        onTouchTap={this._handleConfirm}
      />,
    ];

    let { renderActions } = this.props;

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },

  componentDidUpdate() {
    // if(this.props.positionDialog) {this.props.positionDialog()};
  },


  render() {
    let { segment } = this.props;
    let isLoading = segment.isLoading();
    segment = segment && segment.toJS();
    let arrivalPort = segment && segment.arrivalPort;
    let departurePort = segment && segment.departurePort;
    let nextPort = segment && segment.nextPort;
    let defaultValueA = arrivalPort && {
      name: arrivalPort.name,
      _id: arrivalPort._id,
    };
    let defaultValueB = departurePort && {
      name: departurePort.name,
      _id: departurePort._id,
    };
    let defaultValueD = nextPort && {
      name: nextPort.name,
      _id: nextPort._id,
    };
    let {
      nErrorTextPortToIsRequired,
      nErrorTextArrivalDateIsRequired,
      shipyardTerminalSelection,
      shipyardTerminalVal,
      portId,
    } = this.state;

    let schedule = segment.schedule || {};
    let timePoints = schedule && schedule.timePoints || {};
    let modifyLabel = this.state.showArrPort ? this.t('nTextNotShowArrPort') : this.t('nTextShowArrPort');
    let title = this.state.showArrPort ? this.t('nTitleChangeSegment') : this.t('nTitleMergeSegment');
    let errorTips = `${this.state.nLabelTimeValidErrorText ? this.state.nLabelTimeValidErrorText : ''}${this.state.nLabelTimeErrorText ?  this.state.nLabelTimeErrorText: ''}`;

    let editBoardElement = (
      <div>
        <div>
          <div style={this.style('row')}>
            <DropDownPorts
              ref='arrivalPort'
              disabled={isLoading}
              value={defaultValueA}
              errorText={nErrorTextPortToIsRequired}
              onChange={this._handleChooseArrivalPort}
              label={`${this.t('nLabelArrivalPort')}(${this.t('nLabelRequired')})`}
            />
            {/*<RaisedButton
              ref="modify"
              zDepth={1}
              style={this.style('button')}
              primary={true}
              label= {modifyLabel}
              onTouchTap={this._handleClickModify}
            />*/}
          </div>
          <div style={this.style('row')}>
            <DropDownMenu
              ref='STSelection'
              value={shipyardTerminalSelection}
              style={this.style('typeSelection')}
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
              style={this.style('shipyard')}
            />
          </div>
          <div style={this.style('row')}>
            <DropDownPorts
              ref='lastPort'
              disabled={isLoading}
              style={{marginRight: 20}}
              value={defaultValueB}
              label={this.t('nLabelLastPort')}
            />
            <DropDownPorts
              ref='nextPort'
              disabled={isLoading}
              value={defaultValueD}
              label={this.t('nLabelNextPort')}
            />
          </div>
        </div>
        <div style={this.style('editBoard')}>
          <SegmentTimeEdit
            ref='editArrival'
            defaultValue={timePoints.arrival}
            primaryText='A'
            errorText={nErrorTextArrivalDateIsRequired}
            disabled={isLoading}
            tips={this.t('nLabelRequired')}
          />
          <SegmentTimeEdit
            ref='editBerth'
            defaultValue={timePoints.berth}
            primaryText='B'
            disabled={isLoading}
          />
          <SegmentTimeEdit
            ref='editDeparture'
            defaultValue={timePoints.departure}
            primaryText='D'
            disabled={isLoading}
          />
        </div>
        <div style={this.style('tips')}>
          {errorTips}
        </div>
      </div>
    );

    return(
      <div
        style={this.style('root')}
      >
        <div style={this.style('title')}>
        </div>
        {editBoardElement}

      </div>
    )
  },

  _handleClickModify() {
    this.setState({
      showArrPort: !this.state.showArrPort,
    })
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

  _handleConfirm() {
    let value = this.getValue();
    if(!value) return;

    value.ship = this.props.ship._id;

    let times = value.schedule.timePoints;
    let timeArr = [];

    if(times.arrival && times.arrival.time) {
       timeArr.push(times.arrival)
    }

    if(times.berth && times.berth.time) {
      timeArr.push(times.berth)
    }

    if(times.departure && times.departure.time) {
      timeArr.push(times.departure)
    }
    let valid;
    valid = _.every(timeArr, (item ,index) => {
      return item.estimated ? moment(item.time).isAfter(moment(new Date())) : moment(item.time).isBefore(moment(new Date()));
    });

    if(!valid) {
      this.setState({
        nLabelTimeValidErrorText: this.t('nLabelTimeValidErrorText'),
        nLabelTimeErrorText: null,
      });
      return;
    }

    valid = _.every(timeArr, (item ,index, arr) => {
      return index === arr.length-1 || item.time < arr[index+1].time;
    });

    if(!valid) {
      this.setState({
        nLabelTimeErrorText: this.t('nLabelTimeErrorText'),
        nLabelTimeValidErrorText: null,
      });
      return;
    }

    if(!this.state.showArrPort) {
      // delete value.arrivalPort;
      let {segment} = this.props;
      let fn = this.props.updateVoyageSegmentById;
      let segId = segment && segment._id;
      if (_.isFunction(fn)) {
        value.__v = segment && segment.__v;
        fn(segId, value, true, segment && segment.schedule.timePoints);
      }
      if(this.props.close) {
        this.props.close();
      }
      return;
    }

    let createVoyageSegment = global.api.epds && global.api.epds.createVoyageSegment;
    let copyOrdersToSegment = global.api.order && global.api.order.copyOrdersToSegment;
    let newId;
    let oldId;
    if(createVoyageSegment && copyOrdersToSegment) {
      createVoyageSegment.promise(value).then((res)=>{
        if(res.status === 'OK'){
          let response = res.response;
          newId = response._id;
          oldId = this.props.segment && this.props.segment._id;
          return copyOrdersToSegment.promise(oldId, newId);
        }else{
          //todo: deal with error
        }
      }).then(res => {
        if(res.status === 'OK'){
          let response = res.response;
          if(response) {
            if(this.props.close) {
              this.props.close();
              this.props.refresh(newId);
            }
          }
        }else{
          //todo: deal with error
        }
      }).catch(err=>{
        //todo: deal with err
      });
    }
  },

  _handleChooseArrivalPort(item, value){
    this.setState({portId:value});
  },

  _handleSTChange(e, index, value){
    this.setState({shipyardTerminalSelection: value});
  },

});

module.exports = EditSegmentDialog;
