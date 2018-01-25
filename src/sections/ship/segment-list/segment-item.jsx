const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const IconArrival = require('./time-icons/arrival');
const IconArrowDropUp = require('epui-md/svg-icons/navigation/arrow-drop-up');
const NotificationIcon = require('epui-md/svg-icons/notification/red-dot');
const IconBerth = require('./time-icons/berth');
const IconDepature = require('./time-icons/departure');
const ListItem = require('./list-item');
const moment = require('moment');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const PropTypes = React.PropTypes;
const Transitions = require('epui-md/styles/transitions');
const Translatable = require('epui-intl').mixin;
const displayWithLimit = require('~/src/utils').displayWithLimit;

const SEGMENT_STATUS = require('~/src/shared/constants').SEGMENT_STATUS;

const SegmentItem = React.createClass({
  mixins: [AutoStyle, Translatable, PureRenderMixin],

  translations: require(`epui-intl/dist/SegmentStatus/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
    voyageUpdate: PropTypes.bool,
  },

  propTypes: {
    active: PropTypes.bool,
    openWidth: PropTypes.number,
    closeWidth: PropTypes.number,
    height: PropTypes.number,
    open: PropTypes.bool,
    segment: PropTypes.object.isRequired,
    prevSegment: PropTypes.any,
    nextSegment: PropTypes.any,
    onTouchTap: PropTypes.func,
    read: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      active: false,
      openWidth: 300,
      closeWidth: 80,
      height: 60,
      open: false
    };
  },

  getInitialState() {
    return {

    };
  },

  getStyles() {
    let theme = this.context.muiTheme.segmentList;
    let palette = this.context.muiTheme.palette;
    let isDepartured = this.isDepartured();
    let {
      active,
      open,
      closeWidth
    } = this.props;

    let raiseCode = active && !open;

    return {
      autoText: {
        // overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        wordBreak: 'keep-all',
      },
      code: {
        display:'block',
        fontSize: 12,
        position: 'relative'
      },
      name: {
        display:'block',
        marginTop: 0,
        marginLeft: 0,
        fontSize: 14,
      },
      content: {
        base: {
          height: '100%',
          position: 'relative',
        },
        fixer: {
          height: '100%',
          display: 'inline-block',
          verticalAlign: 'middle',
        }
      },
      arrival: {
        port: {
          maxWidth: '30%',
          textOverflow: 'ellipsis',
          minWidth: 80,
          display: 'inline-block',
          verticalAlign: 'middle',
        },
        code: {
          fontWeight: 'bold',
          color: '#B6B6B6'
        },
        name: {
          fontWeight: 'bold',
          color: isDepartured ? palette.grey1Color : palette.accent5Color,
        },
        raised: {
          fontSize: 14,
          fontWeight: 'bold',
          position: 'absolute',
          top: 20,
          left: raiseCode ? - closeWidth : -2 * closeWidth,
          color: isDepartured ? palette.grey1Color : palette.accent5Color,
          width: closeWidth,
          textAlign: 'center',
          opacity: raiseCode ? 1 : 0,
          transition: Transitions.easeOut()
        }
      },
      departure: {
        port: {
          maxWidth: '30%',
          width: '80px',
          position: 'relative',
          display: 'inline-block',
          verticalAlign: 'middle',
          paddingLeft: 10,
          textOverflow: 'ellipsis',
        },
        arrow: {
          display: 'inline-block',
          float: 'left',
          marginTop: '-2px',
          marginLeft: '-4px',
          marginRight: '-4px',
          transform: 'rotate(-90deg)',
          transition: '0ms transform ease-in-out',
          fill: '#B6B6B6',
          position: 'absolute',
          left: 4,
        },
        code: {
          color: '#B6B6B6',
          width: 110,
          height: 20,
          paddingLeft: 10,
        },
        name: {
          position: 'relative',
          color: '#B6B6B6',
          width: 110,
          height: 20,
          paddingLeft: 10,
        }
      },
      icon: {
        borderStyle: 'solid',
        borderColor: active ? isDepartured ? palette.grey1Color : palette.accent5Color : theme.inactiveEdgeColor,
        borderWidth: 2,
        borderRadius: '50%',
        boxSizing: 'border-box',
        width: '100%',
        height: '100%',
      },
      dot: {
        right: 2,
      },
      timePoints: {
        wrapper: {
          width: '35%',
          display: 'inline-block',
          verticalAlign: 'middle',
          position: 'absolute',
          top: 6,
          right: 0,
        },
        icon: {
          display: 'block',
          width: '12px',
          height: '12px',
          fill: 'black',
          margin: '0 auto',
        },
        date: {
          display:'block',
          fontSize: 12,
          textAlign: 'center'
        },
        time: {
          display:'block',
          fontSize: 12,
          textAlign: 'center'
        }
      },
      shipyard: {
        hasValue: {
          top: 10
        },
        noValue: {
          marginTop: 20,
        },
        value: {
          fontWeight: 'normal',
          fontSize: 12,
          color: 'rgba(0,0,0,0.43)',
          display: 'block',
          whiteSpace: 'pre',
        }
      }
    };
  },

  isDepartured(){
    let segment = this.props.segment && this.props.segment.toJS();
    let isDepartured = false;
    if(segment && segment.status === SEGMENT_STATUS.CANCELED) {
      isDepartured = true;
      return isDepartured;
    }
    if(_.has(segment,['schedule','timePoints','departure','time'])){
      let departure = segment.schedule.timePoints.departure;
      if(!departure.estimated){
        let now = moment();
        if(now.isAfter(moment(departure.time))) isDepartured = true;
      }
    }
    return isDepartured;
  },

  isConnectToSegment(segment) {
    if(segment === true || !segment) { return false; }

    let self = this.props.segment;

    let dept = self.departurePort && self.departurePort._id;
    let arrv = self.arrivalPort && self.arrivalPort._id;

    let tDept = segment.departurePort && segment.departurePort._id;
    let tArrv = segment.arrivalPort && segment.arrivalPort._id;

    let ok = false;
    if(dept === tArrv) {
      // TODO: check time span as well;
      ok = true;
    }

    if(arrv === tDept) {
      // TODO: check time span as well;
      ok = true;
    }

    return ok;
  },

  renderIcon() {
    let el = this.props.read ? this.props.active ?
          <div style={this.style('icon')}></div> :
          <NotificationIcon style={this.style('dot')}/> :
          <div style={this.style('icon')}></div>;
    return el;
  },

  renderDepaturePort() {
    let seg = this.props.segment;
    let port = seg.departurePort
    if(!port) {
      return null;
    }

    let code = port.code;
    let name = port.name;

    return (
      <div style={this.style('departure.port')}>
        <IconArrowDropUp style={this.style('departure.arrow')} />
        {/*<span
          style={this.style('autoText', 'code', 'departure.code')}
          title={code}
        >
          {code ? code : '-'}
        </span>*/}
        <span
          style={this.style('autoText', 'name', 'departure.name')}
          title={name}
        >
          {name}
        </span>
      </div>
    );
  },

  renderArrivalPort() {
    let theme = this.context.muiTheme.segmentList;

    let {
      segment,
      active,
      open,
      closeWidth,
    } = this.props;

    let seg = segment;
    let port = seg.arrivalPort
    let code = port.code;
    let name = port.name;
    let shipyardTerminal;
    if(seg.terminal) { shipyardTerminal = seg.terminal.toJS(); }
    if(seg.shipyard) { shipyardTerminal = seg.shipyard.toJS(); }
    let styles = this.getStyles();

    return (
      <div style={this.style('arrival.port')}>
        {/*<span
          style={this.style('autoText', 'code')}
          title={code}
        >
          {code}
        </span>*/}
          <span
            style={this.style('autoText', 'name', 'arrival.name')}
            title={name}
          >
            {name}
            <span style={_.get(styles, ['shipyard', 'value'])}>{_.has(shipyardTerminal,'name') && displayWithLimit(shipyardTerminal.name,14)}</span>
          </span>

          <span
            style={!!shipyardTerminal ? this.style('autoText', 'arrival.raised', 'shipyard.hasValue') : this.style('autoText', 'arrival.raised', 'shipyard.noValue')}
            title={name}
          >
            {name}
            <span style={_.get(styles, ['shipyard', 'value'])}>{_.has(shipyardTerminal,'name') && displayWithLimit(shipyardTerminal.name,14)}</span>
          </span>
      </div>
    );
  },

  renderTimePoints() {
    let segment = this.props.segment;
    let tp = _.get(segment, ['schedule', 'timePoints']);
    if(!tp) { return null; }
    tp = tp && tp.toJS()
    let arrival = tp.arrival;
    let estimated = arrival.estimated;
    let time = arrival.time;
    let topSpan = estimated ? 'ETA' : 'ATA';
    let footerSpan = moment(time).format('DD/MMM/YYYY hh:mm');
    return (
      <div style={this.style('timePoints.wrapper')}>
				<span
          style={this.style('timePoints.date')}
        >
          {topSpan}
        </span>
        <span style={this.style('timePoints.time')}>
          {footerSpan}
        </span>
      </div>
    )
  },

  renderContent() {
    let nextSegment = this.props;

    return (
      <div style={this.style('content.base')}>
        <div style={this.style('content.fixer')} />
        {this.renderArrivalPort()}
        {this.isConnectToSegment(nextSegment) ? null : this.renderDepaturePort()}
        {this.renderTimePoints()}
      </div>
    );
  },

  render() {
    let {
      active,
      openWidth,
      closeWidth,
      height,
      open,
      prevSegment,
      nextSegment,
    } = this.props;

    return (
      <ListItem
        active={active}
        isDepartured = {this.isDepartured()}
        closeWidth={closeWidth}
        height={height}
        open={open}
        openWidth={openWidth}
        icon={this.renderIcon()}
        hideIcon={active && !open}
        hasNext={!!nextSegment}
        hasPrev={!!prevSegment}
        topEdgeType={this.isConnectToSegment(prevSegment) ? 'solid' : 'dashed'}
        bottomEdgeType={this.isConnectToSegment(nextSegment) ? 'solid' : 'dashed'}
        onHover={this._handleHover}
        onTouchTap={this._handleTouchTap}
      >
        {this.renderContent()}
      </ListItem>
    );
  },

  _handleTouchTap(e) {
    let fn = this.props.onTouchTap
    if(_.isFunction(fn)) {
      fn(e, this.props.segment);
    }
  },

  _handleHover(yes) {

  }
});

module.exports = SegmentItem;
