const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Checkbox = require('epui-md/Checkbox');
const Clear = require('epui-md/svg-icons/content/clear');
const Colors = require('epui-md/styles/colors');
const Done = require('epui-md/svg-icons/action/done');
const ModeEdit = require('epui-md/svg-icons/editor/mode-edit');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const SegmentTime = require('./segment-time');
const SegmentTimeEdit = require('./segment-time-edit');
const Status = require('./status');
const BoardTime = require('./board-time');
const Transitions = require('epui-md/styles/transitions');
const Translatable = require('epui-intl').mixin;
const warning = require('fbjs/lib/warning');
const moment = require('moment')

const SegmentStatus = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translatable],

  translations: require(`epui-intl/dist/SegmentStatus/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    editable: PropTypes.bool,
    fold: PropTypes.bool,
    foldHeight: PropTypes.number,
    nHintVoyageTime: PropTypes.string,
    nLabelModifySegment: PropTypes.string,
    nLabelArrivalTime: PropTypes.string,
    nLabelArrivalTimeEst: PropTypes.string,
    nLabelBerthTime: PropTypes.string,
    nLabelBerthTimeEst: PropTypes.string,
    nLabelDepartureTime: PropTypes.string,
    nLabelDepartureTimeEst: PropTypes.string,
    nLabelTimeErrorText: PropTypes.string,
    nLabelEstimateTime: PropTypes.string,
    nLabelVoyageStatusArrived: PropTypes.string,
    nLabelVoyageStatusBerthed: PropTypes.string,
    nLabelVoyageStatusCanceled: PropTypes.string,
    nLabelVoyageStatusDepartured: PropTypes.string,
    nLabelVoyageStatusInAccident: PropTypes.string,
    nLabelVoyageStatusOnTheWay: PropTypes.string,
    nLabelVoyageStatusUnknown: PropTypes.string,
    nLabelVoyageTimePeriodAM: PropTypes.string,
    nLabelVoyageTimePeriodPM: PropTypes.string,
    nLabelVoyageTimePeriodFULLDAY: PropTypes.string,
    nTextVoyageTimeReportedBy: PropTypes.string,
    nMessageNoReporter: PropTypes.string,
    ship: PropTypes.object,
    segment: PropTypes.object,
    style: PropTypes.object,
    params: PropTypes.object,
    updateScheduleBySegmentId: PropTypes.func,
    updateTimingReportsBySegmentId: PropTypes.func,
    refresh: PropTypes.func,
  },

  getDefaultProps() {
    return {
      fold: false,
      foldHeight: 24,
    };
  },

  getInitialState() {
    return {
      isEditing: false,
      showReporter: false,
      arrivalUpdate: false,
      berthUpdate: false,
      departureUpdate: false,
      messageIds: [],
    };
  },

  getStatusTitles() {
    if(this._status_titles) { return this._status_titles; }
    this._status_titles = {
      '0': this.t('nLabelVoyageStatusUnknown'), //UNKNOWN
      '300': this.t('nLabelVoyageStatusOnTheWay'), //ON_THE_WAY
      '700': this.t('nLabelVoyageStatusArrived'), //ARRIVED
      '1000': this.t('nLabelVoyageStatusBerthed'), //BERTHED
      '1500': this.t('nLabelVoyageStatusDepartured'), //DEPARTURED
      '3000': this.t('nLabelVoyageStatusInAccident'), //IN_ACCIDENT
      '-1': this.t('nLabelVoyageStatusCanceled'), //CANCELED
    };
    return this._status_titles;
  },

  getScheduleLabels() {
    if(this._schedule_labels) { return this._schedule_labels; }
    this._schedule_labels = {
      arrival: this.t('nLabelArrivalTime'),
      arrival_est: this.t('nLabelArrivalTimeEst'),
      berth: this.t('nLabelBerthTime'),
      berth_est: this.t('nLabelBerthTimeEst'),
      departure: this.t('nLabelDepartureTime'),
      departure_est: this.t('nLabelDepartureTimeEst'),
      am: this.t('nLabelVoyageTimePeriodAM'),
      pm: this.t('nLabelVoyageTimePeriodPM'),
      fullday: this.t('nLabelVoyageTimePeriodFULLDAY')
    };
    return this._schedule_labels;
  },

  getTheme() {
    let defaults = {
      textColor: '#FFFFFF',
      disabledTextColor: '#727272',
      primaryColor: '#2196f3',
      secondaryColor: '#000000',
      statusColors: {
        UNKNOWN:'#FAFAFA',
        ON_THE_WAY: '#ffd740',
        ARRIVED: '#8bc34a',
        BIRTHED: '#689f38',
        DEPARTURED: '#FAFAFA',
        IN_ACCIDENT: '#ff5722'
      }
    };
    return _.defaultsDeep({},
      this.context.muiTheme.voyageStatusBanner,
      defaults
    );
  },

  componentWillMount(){
    this._fetchVoyageStatus();
  },

  componentWillUpdate(nextProps, nextState){

    let currSegId = _.get(this.props.segment.toJS(), '_id');
    let nextSegId = _.get(nextProps.segment.toJS(), '_id');
    if(currSegId !== nextSegId){
      this._fetchVoyageStatus(nextSegId);
    }
  },

  componentWillReceiveProps(nextProps) {
    let ship = this.props.ship;
    let seg = this.props.segment;
    let nextShip = nextProps.ship;
    let nextSeg = nextProps.segment;
    let isEditing = this.state.isEditing;
    if(isEditing && !nextSeg.schedule.getMeta('loading')) {
      this.setState({
        isEditing: false,
      });
    }
  },

  toggleReporter(open) {
    if (this.state.isEditing) { return; }
    if (this.props.fold) { return; }

    open = _.isUndefined(open) ? !this.state.showReporter : open;

    this.setState({
      showReporter: open,
    });
  },

  getStyles() {
    let style = this.props.style;
    let segment = this.props.segment;
    let theme = this.getTheme();
    let statusColors = theme.statusColors;

    let height = '92px';
    let heightWithReporter = '116px';
    let heightEditing = '154px';
    let heightFold = `${this.props.foldHeight}px`;
    let statusColor = statusColors[segment.status];

    let rootWidth = '99.3%';

    let rootHeight = (
      this.state.isEditing ?
      heightEditing :
      (
        this.props.fold ?
        heightFold :
        (
          this.state.showReporter ?
          heightWithReporter :
          height
        )
      )
    );

    let contentHeight = (
      this.state.isEditing ?
      '0px':
      (
        this.props.fold ?
        heightFold :
        (
          this.state.showReporter ?
          heightWithReporter :
          height
        )
      )
    );

    let styles = {
      root: _.merge({
        padding: '0px',
        width: rootWidth,
        minWidth: '165px',
        border: 'none',
        height: rootHeight,
        transition: null,
        position: 'relative',
      }, style),
      content: {
        width: '100%',
        height: contentHeight,
        backgroundColor: statusColor,
        overflow: 'hidden',
        marginLeft: 0,
      },
      editBoard: {
        position: 'absolute',
        top: 10,
        width: '100%',
        height: this.state.isEditing ? heightEditing : '0',
        overflow: 'hidden',
      },
      titleStyle: {
        canceled: {
          position: 'relative',
          top: '10px',
          color: this.context.muiTheme.palette.disabledTextColor,
        },
      },
      btnWrapper: {
        display: 'inline-block',
        float: 'right',
        margin: '34px 18px',
        width: '24px',
        height: '24px',
        cursor: 'pointer',
      },
      reporter: {
        width: '100%',
        fontSize: '12px',
        padding: '2px 0',
        color: this.context.muiTheme.palette.greyColor,
        textAlign: 'center',
      },
      reporterOrg: {
        color: this.context.muiTheme.palette.disabledColor,
      },
      iconWrapper: {
        float: 'right',
        paddingTop: '20px',
        paddingBottom: '10px',
        width: '42px',
        verticalAlign: 'middle',
        cursor: 'pointer',
        height: rootHeight,
      },
      editStyle: {
        fill: this.context.muiTheme.palette.accent1Color,
      },
      doneStyle: {
        fill: this.context.muiTheme.palette.primary1Color,
      },
      clearStyle: {
        fill: '#B6B6B6',
      },
      viewBoard: {
        status: {
          float: 'left',
          margin: '0 10px 0 0',
          height: '100%',
          minWidth: '165px',
          lineHeight: contentHeight,
          boxSizing: 'border-box',
          color: this.context.muiTheme.palette.accent1Color,
          fontSize: '16px',
          fontWeight: 'bold',
          textAlign: 'center',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          wordBreak: 'keep-all',
          whiteSpace: 'nowrap',
        },
        time: {
          root: {
            float: 'left',
            margin: '0 10px 0 0',
            height: '100%',
            minWidth: '165px',
            lineHeight: contentHeight,
            boxSizing: 'border-box',
            textAlign: 'left',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'keep-all',
            whiteSpace: 'nowrap',
          },
          label: {
            margin: '0 4px',
            color: '#0059AA',
            fontWeight: '500',
          },
          dateLabel: {
            margin: '0 4px',
            color: this.context.muiTheme.statusBar.textArrivalColor,
            fontWeight: '700',
          },
          dateLabelEst: {
            margin: '0 4px',
            color: this.context.muiTheme.statusBar.textEstArrivalColor,
            fontWeight: '700',
          },
          timeLabel: {
            margin: '0 4px',
            color: this.context.muiTheme.statusBar.textArrivalColor,
          },
          timeLabelEst: {
            margin: '0 4px',
            color: this.context.muiTheme.statusBar.textEstArrivalColor,
          },
          timeDateUpdate: {
            margin: '0 4px',
            color: '#e44d3c',
            fontWeight: '700',
          },
        },
      },
    };

    styles.content = _.merge({}, styles.root, styles.content);
    return styles;
  },

  renderReporter() {
    let segment = this.props.segment;
    let schedule = segment.schedule;
    let reporter = false; //schedule && schedule.user;

    if(!reporter) {
      return (
        <div style={this.style('reporter')}>
          {this.t('nMessageNoReporter')}
        </div>
      );
    }
    let user = reporter.fullName;
    let userTitle = reporter.position.name;
    let reportOrg = reporter.orgnization.name;
    let reportDate = new Date(schedule.date);

    let userElement = this.toHTML(this.t('nTextVoyageTimeReportedBy'), {
      reporter: (<span>{user}</span>),
      company: (<span>{reportOrg}</span>),
      date: (<span>{this.toShortDateAndTime(reportDate)}</span>)
    });

    return (
      <div style={this.style('reporter')}>
        {userElement}
      </div>
    );
  },

  render() {
    let {
      editable,
      fold,
      segment,
      ship,
      style,
      params,
      foldHeight
    } = this.props;

    let {
      isEditing,
      showReporter,
      arrivalUpdate,
      berthUpdate,
      departureUpdate,
    } = this.state;

    if(!segment) {
      return null;
    }

    let styles = this.getStyles();
    let isEditable = editable;
    let isLoading = segment.isLoading();

    let status = String(segment.status || 9999);
    let position = segment.position;
    let schedule = segment.schedule || {};
    let timePoints = schedule && schedule.timePoints || {};

    let statusTitle = segment.arrivalPort.name; // this.getStatusTitles()[segment.status];

    let sort = ['arrival', 'berth', 'departure'];

    let labels = this.getScheduleLabels();
    let timeElements = [], boardElementTimes = [];

    for(let t of sort) {
      let tp = timePoints[t] || {
        estimated: true
      };

      let time, period, isEst, label, dateLabel, relativeLabel, timeLabel;

      if(tp.time) {
        time = new Date(tp.time);
        period = tp.period;
        isEst = tp.estimated;

        label = labels[isEst ? `${t}_est` : t];
        dateLabel = time ? moment(time).format('DD/MMM/YYYY') : '--';
        relativeLabel = time && this.toRelative(time);
        timeLabel = period && period !== 'fullday' ? labels[period] : this.toTime(time);
      }

      timeElements.push(
        <SegmentTime
          ref={t}
          key={t}
          type={t}
          title={label}
          date={dateLabel}
          time={timeLabel}
          sub={relativeLabel}
          titleStyle={status === 'CANCELED' ? this.style('titleStyle.canceled') : null}
          isEmphasize={true}
          isEstimate={isEst}
          contentStyle={null}
          arrivalUpdate={arrivalUpdate}
          berthUpdate={berthUpdate}
          departureUpdate={departureUpdate}
        />
      );

      boardElementTimes.push(
        <BoardTime
          key={`board${t}`}
          type={t}
          label={label}
          isEst={isEst}
          dateLabel={dateLabel}
          timeLabel={timeLabel}
          arrivalUpdate={arrivalUpdate}
          berthUpdate={berthUpdate}
          departureUpdate={departureUpdate}
          isEditing={isEditing}
          fold={fold}
          foldHeight={foldHeight}
          showReporter={showReporter}
        />
      );
    }

    let statusElement = (
      <Status
        title={statusTitle}
        position={position}
      />
    );

    let userElement, reporterElement;

    let btnEditElement = isEditable ? (
      <div
        style={this.style('btnWrapper')}
        onTouchTap={this._handleButtonTouchTap.bind(this, 'modeEdit')}
      >
        <ModeEdit style={this.style('editStyle')} />
      </div>
    ) : null;

    let editBoardElement = isEditing ? (
      <div style={this.style('editBoard')}>
        <Status title={''} />
        <SegmentTimeEdit
          ref='editArrival'
          defaultValue={timePoints.arrival}
          title={this.t('nLabelArrivalTime')}
          disabled={isLoading}
          primaryText='A'
        />
        <SegmentTimeEdit
          ref='editBerth'
          defaultValue={timePoints.berth}
          title={this.t('nLabelBerthTime')}
          disabled={isLoading}
          primaryText='B'
        />
        <SegmentTimeEdit
          ref='editDeparture'
          defaultValue={timePoints.departure}
          title={this.t('nLabelDepartureTime')}
          disabled={isLoading}
          primaryText='D'
        />
        <div
          style={this.style('btnWrapper')}
          onTouchTap={this._handleButtonTouchTap.bind(this, 'done')}
        >
          <Done style={this.style('doneStyle')} />
        </div>
        <div
          style={this.style('btnWrapper')}
          onTouchTap={this._handleButtonTouchTap.bind(this, 'clear')}
        >
          <Clear style={this.style('clearStyle')} />
        </div>
      </div>
    ) : null;

    let boardElementStatus = (
      <div style={this.style('viewBoard.status')}>
        {statusTitle}
      </div>
    );

    let viewBoardElement = (
      <div
        key='viewBoard'
        className={"segment-status-content"}
        style={this.style('content')}
        onTouchTap={this._handleTouchTap}
        onMouseEnter={this._handleMouseEnter}
        onMouseLeave={this._handleMouseLeave}
      >
        {fold && boardElementStatus}
        {fold && boardElementTimes}
        {!fold && statusElement}
        {!fold && timeElements}
        {!fold && btnEditElement}
        {!fold && this.renderReporter()}
      </div>
    );

    return (
      <Paper
        className='segment-status-wrapper'
        zDepth={1}
        style={this.style('root')}
      >
        {editBoardElement}
        {viewBoardElement}
      </Paper>
    );
  },

  _fetchVoyageStatus(segId){
    let { segment } = this.props;
    if(_.isFunction(global.api.message.getVoyageUpdateStatus)){
      global.api.message.getVoyageUpdateStatus.promise(segId ? segId : _.get(segment.toJS(),'_id'))
      .then((res)=>{
        if(res.status === 'OK'){
           this.setState({
             arrivalUpdate:res.response.update.arrivalUpdate,
             berthUpdate:res.response.update.berthUpdate,
             departureUpdate:res.response.update.departureUpdate,
           });
           let messageIds = res.response.update.ids;
           if(messageIds && messageIds.length > 0){
             if(_.isFunction(global.api.message.clearUnreadStatusByIds)){
               global.api.message.clearUnreadStatusByIds.promise(messageIds)
               .then((res)=>{
                 if(res.status === 'OK'){

                 }
               })
               .catch((err)=>{
                 console.log(this.t('nTextInitedFailed'));
               })
             }
           }
        }
      })
      .catch((err)=>{
        console.log(this.t('nTextInitedFailed'));
      })
    }
  },

  toggleEdit(open) {
    open = _.isUndefined(open) ? !this.state.isEditing : open;
    this.setState({
      isEditing: open,
    });
  },

  _handleMouseEnter() {
    //this.toggleReporter(true);
  },

  _handleMouseLeave() {
    //this.toggleReporter(false);
  },

  _handleTouchTap() {
    this.toggleReporter();
  },

  _handleButtonTouchTap(iconToken, e) {
    e.stopPropagation();
    let segment = this.props.segment;
    let ship = this.props.ship;
    let refresh = this.props.refresh;
    if(iconToken === 'drop') { return this.toggleEdit(true); }
    if(iconToken === 'modeEdit') {

      let props = {
        title: this.t('nLabelModifySegment'),
        open: true,
        contentStyle: {
          width: '683px',
        },
        modal: true,
      };

      let component = {
        name: 'EditSegment',
        props: {
          segment: segment,
          ship: ship,
          refresh: refresh,
        },
      };
      if (global.register.dialog) {
        global.register.dialog.generate(props, component);
      }
       return;
     }
    if(iconToken === 'clear') { return this.toggleEdit(false); }
    if(iconToken === 'done') {
      let sch = segment && segment.schedule;
      let value = {
        arrival: this.refs.editArrival.getValue(),
        berth: this.refs.editBerth.getValue(),
        departure: this.refs.editDeparture.getValue(),
      };
      let timeArr = [];
      value.arrival && value.arrival.time && timeArr.push(Date.parse(value.arrival.time));
      value.berth && value.berth.time && timeArr.push(Date.parse(value.berth.time));
      value.departure && value.departure.time && timeArr.push(Date.parse(value.departure.time));
      const validatable = _.every(timeArr, (item ,index, arr) => {
        return index === arr.length-1 || item < arr[index+1];
      });
      if(!validatable) {
        alert(this.t('nLabelTimeErrorText'));
        return;
      }
      let fn = this.props.updateScheduleBySegmentId;
      if (_.isFunction(fn)) {
        let segId = segment._id;
        let schedule = _.mapValues(value, (__, key) => {
          return value[key] || sch && sch[key];
        });

        fn(segId, schedule,sch.timePoints);
      }
    }
  },

});


module.exports = SegmentStatus;
