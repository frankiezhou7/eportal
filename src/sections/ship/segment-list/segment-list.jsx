const React = require('react');
const AddItem = require('./add-item');
const AddSegmentDialog = require('../add-segment-dialog');
const AutoStyle = require('epui-auto-style').mixin;
const FooterItem = require('./footer-item');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const SegmentItem = require('./segment-item');
const SEGMENT_STATUS = require('~/src/shared/constants').SEGMENT_STATUS;

const PAGE_SIZE = 5;
const PAGE_SORT = {
  'schedule.timePoints.arrival.time': -1,
};


const SegmentList = React.createClass({
  mixins: [AutoStyle, PureRenderMixin],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    activeSegmentId: PropTypes.string,
    ship: PropTypes.object,
    canAddSegment: PropTypes.bool,
    closeWidth: PropTypes.number,
    findVoyageSegmentsByShipId: PropTypes.func,
    itemHeight: PropTypes.number,
    location: PropTypes.object,
    onChange: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    onTouchTap: PropTypes.func,
    ontItemTouchTap: PropTypes.func,
    open: PropTypes.bool,
    openWidth: PropTypes.number,
    params: PropTypes.object,
    style: PropTypes.object,
    voyageSegments: PropTypes.object,
    unselectDefault: PropTypes.bool,
    zDepth: PropTypes.number,
    onItemTouchTap: PropTypes.func,
    hideCancellation: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      canAddSegment: true,
      closeWidth: 80,
      itemHeight: 60,
      open: true,
      openWidth: 300,
    };
  },

  getInitialState() {
    return {
      activeIndex: -1,
      activeSegmentId: null,
      lock: false,
      voyageUpdate: [],
    };
  },

  componentWillMount() {
    let {
      ship,
      voyageSegments,
    } = this.props;

    if(!ship || !ship._id) { return; }

    this.refresh();
  },


  componentDidUpdate(prevProps,prevState) {
    if(this.props.unselectDefault) return;
    this.selectDefault();
    if(this.state.activeSegmentId !== prevState.activeSegmentId){
      this.setState({segmentUpdate: true});
    }
  },

  componentWillReceiveProps(nextProps) {
    let oldId = this.props.ship && this.props.ship._id;
    let newId = nextProps.ship && nextProps.ship._id;
    let voyageId = this.props.params && this.props.params.voyageId;
    let nextVoyageId = nextProps.params && nextProps.params.voyageId;

    if(newId && oldId !== newId) {
      this.refresh(newId);
      return;
    }

    if(voyageId!=nextVoyageId){
      let hasSeg = false;
      let segments = nextProps.voyageSegments.get('entries');
      segments && segments.forEach((seg, idx) => {
        if(nextVoyageId == seg._id.toString()){
          hasSeg =true;
        }
      });
      if(!hasSeg){
        this.refresh(newId);
        return;
      }
    }

    if(this.state.lock) {
      this.refresh(newId);
      this.setState({
        lock: false,
      });
      return;
    }
    if(nextProps.voyageSegments !== this.props.voyageSegments){
      let segments = nextProps.voyageSegments.get('entries');
      let segIds = [];
      segments && segments.forEach((seg, idx) => {
        segIds.push(seg._id);
      });
      if(segIds.length > 0 && _.isFunction(global.api.message.getVoyageSegmentsUpdateStatus)){
        global.api.message.getVoyageSegmentsUpdateStatus.promise(segIds)
        .then((res)=>{
          if(res.status === 'OK'){
            this.setState({voyageUpdate: res.response.update});
          }
        })
        .catch((err)=>{
          console.log(this.t('nTextInitedFailed'));
        })
      }
    };
  },

  afterChangeSegment(id) {
    this.setState({
      lock: true,
    },() => {
      global.tools.toSubPath(this.getNewPath(id));
    })
  },

  refresh(shipId) {
    let ship = this.props.ship;
    let id = shipId || ship && ship._id;
    if(!id) { return; }

    let fn = this.props.findVoyageSegmentsByShipId;
    if (_.isFunction(fn)) {
      fn(id, {
        size: PAGE_SIZE,
        sortby: PAGE_SORT,
      });
    }
  },

  loadMore(shipId) {
    let {
      findVoyageSegmentsByShipId,
      ship,
      voyageSegments,
    } = this.props;
    let pagination = voyageSegments && voyageSegments.pagination;

    if(!ship || !ship._id || !pagination || !pagination.get('hasNext')) { return; }

    if (_.isFunction(findVoyageSegmentsByShipId)) {
      findVoyageSegmentsByShipId(ship._id, {
        size: PAGE_SIZE,
        sortby: PAGE_SORT,
        cursor: pagination.get('cursor')
      });
    }
  },

  selectDefault() {
    let segments = this.props.voyageSegments;
    const loading = segments && segments.getMeta('loading');
    let location = this.props.location;
    let pathname = location.pathname;
    let entries = segments && segments.get('entries');
    segments = segments && segments.toJS();

    let pagination = segments && segments.pagination;
    let query = pagination && pagination.query;
    let shipId = query && query.ship;
    if(shipId && shipId !== this.props.ship._id) return;

    let voyageId = this.props.params.voyageId;

    if(entries && !voyageId) {
      let segId = entries.get(0) && entries.get(0)._id;
      if(segId){
        pathname = `${pathname}/${segId}`;
        global.tools.toSubPath(pathname);
      }
    }else if(entries && voyageId) {
      if (loading) return;
      let activeId= this.props.activeSegmentId;
      let found = _.find(entries.toJS(), {'_id':activeId});
      if(!found) this.loadMore();
    }
  },

  getNewPath(segId){
    let pathname = this.props.location.pathname;
    let paths = pathname.split('/');
    //get paths after removing id of voyage or record
    paths.length = 5;
    paths.push(segId);
    return paths.join('/');
  },

  clearValue() {
    let { onChange } = this.props;
    if(_.isFunction(onChange)) {
      onChange(segment);
    }
  },

  getValue() {
    return this.state.activeSegmentId;
  },

  getStyles() {
    let {
      style,
      open,
      openWidth,
      closeWidth,
    } = this.props;

    let width = open ? openWidth : closeWidth;

    return {
      root: _.merge({
        width: width,
        overflow: 'hidden',
        height: '100%',
        transition: 'none',
      }, style),
      list: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden'
      }
    };
  },

  renderSegmentItem(segment, prevSegment, nextSegment) {
    let {
      ship,
      open,
      openWidth,
      closeWidth,
      itemHeight,
      hideCancellation,
    } = this.props;

    let { voyageUpdate } = this.state;
    let read = false;
    let status = segment && segment.toJS().status;

    if(hideCancellation){
      if(status === SEGMENT_STATUS.CANCELED || status === SEGMENT_STATUS.DEPARTURED) return;
    }

    for(let update of voyageUpdate){
      if(segment._id === update.id){
        read = update.update;
      }
    }

    let activeSegmentId = this.props.activeSegmentId;
    return (
      <SegmentItem
        key={segment._id}
        height={itemHeight}
        segment={segment}
        prevSegment={prevSegment}
        nextSegment={nextSegment}
        active={activeSegmentId === segment._id}
        open={open}
        openWidth={openWidth}
        closeWidth={closeWidth}
        onTouchTap={this._handleItemTouchTap}
        segmentUpdate={this.state.segmentUpdate}
        read={read}
      />
    );
  },

  renderAddItem() {
    let {
      ship,
      open,
      openWidth,
      closeWidth,
      itemHeight,
      voyageSegments,
    } = this.props;

    let entries = voyageSegments && voyageSegments.entries;
    let len = entries ? entries.size : 0;

    return (
      <AddItem
        key='add-segment'
        open={open}
        height={itemHeight}
        closeWidth={closeWidth}
        openWidth={openWidth}
        showEdge={len > 0}
        onTouchTap={this._handleAddTouchTap}
      />
    );
  },

  renderFooter() {
    let {
      ship,
      open,
      openWidth,
      closeWidth,
      itemHeight,
      voyageSegments,
    } = this.props;

    let loading = voyageSegments && !!voyageSegments.getMeta('loading');
    let pagination = voyageSegments && voyageSegments.pagination;
    let hasMore = pagination && pagination.get('hasNext');
    let len = voyageSegments ? voyageSegments.size : 0;

    return (
      <FooterItem
        key='no-more-segment'
        open={open}
        height={itemHeight}
        hasMore={hasMore}
        closeWidth={closeWidth}
        openWidth={openWidth}
        loading={loading}
        onTouchTap={this._handleFooterTouchTap}
      />
    );
  },

  renderSegmentItems() {
    let {
      ship,
      canAddSegment,
    } = this.props;

    let segments = this.props.voyageSegments;
    if(!segments || !segments.entries) { return this.renderFooter(); }
    let entries = segments.get('entries');
    let page = segments.get('pagination');
    let hasMore = page && page.get('hasNext');
    let len = entries ? entries.size : 0;
    let elements = [];
    if(canAddSegment) {
      elements.push(this.renderAddItem());
    }

    entries && entries.forEach((curr, idx) => {
      let prevIdx = idx - 1;
      let nextIdx = idx + 1;
      let prev = prevIdx < 0 ? null : entries.get(prevIdx);
      let next = nextIdx >= len ? null : entries.get(nextIdx);

      if(entries.first() == curr && canAddSegment) {
        prev = true;
      }

      if(entries.last() === curr && hasMore) {
        next = true;
      }

      elements.push(
        this.renderSegmentItem(curr, prev, next)
      );
    });

    elements.push(this.renderFooter());

    return elements;
  },

  render() {
    let {
      style,
      ship,
      canAddSegment,
      voyageSegments,
      zDepth
    } = this.props;

    let elDialog = canAddSegment ? (
      <AddSegmentDialog
        {...this.props}
        ref='dialog'
        ship={ship}
        disableInit={true}
      />
    ) : null;

    return (
      <Paper
        zDepth={zDepth ? zDepth : 2}
        style={this.style('root')}
      >
        <div
          style={this.style('list')}
          onMouseEnter={this._handleMouseEnter}
          onMouseLeave={this._handleMouseLeave}
          onTouchTap={this._handleTouchTap}
        >
          {this.renderSegmentItems()}
        </div>
        {elDialog}
      </Paper>
    );
  },

  _handleItemTouchTap(e, segment) {
    let segId = segment.get('_id');
    if(this.props.unselectDefault) {
      this.props.onItemTouchTap(e, segId, this.props.voyageSegments);
      return;
    }
    if(this.props.voyageSegments){
      let segments = this.props.voyageSegments.get('entries');
      let segIds = [];
      segments && segments.forEach((seg, idx) => {
        segIds.push(seg._id);
      });
      if(segIds.length > 0 && _.isFunction(global.api.message.getVoyageSegmentsUpdateStatus)){
        global.api.message.getVoyageSegmentsUpdateStatus.promise(segIds)
        .then((res)=>{
          if(res.status === 'OK'){
            this.setState({voyageUpdate: res.response.update});
          }
        })
        .catch((err)=>{
          console.log(this.t('nTextInitedFailed'));
        })
      }
    };
    if(!this.props.open) { return; }
    global.tools.toSubPath(this.getNewPath(segId), true);
  },

  _handleAddTouchTap(e, segment) {
    if(!this.props.open) { return; }

    let dialog = this.refs.dialog;
    dialog.clearValue();
    dialog.show();
  },

  _handleFooterTouchTap(e, segment) {
    let {
      open,
      ship,
      voyageSegments,
    } = this.props;

    if(!open) { return; }

    let pagination = voyageSegments && voyageSegments.pagination;
    if(!pagination || !pagination.get('hasNext')) { return; }
    this.loadMore();
  },

  _handleTouchTap(e) {
    let fn = this.props.onTouchTap;
    if(_.isFunction(fn)) { fn(e); }
  },

  _handleMouseEnter(e) {
    let fn = this.props.onMouseEnter;
    if(_.isFunction(fn)) { fn(e); }
  },

  _handleMouseLeave(e) {
    let fn = this.props.onMouseLeave;
    if(_.isFunction(fn)) { fn(e); }
  },
});

module.exports = SegmentList;
