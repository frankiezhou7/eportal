const React = require('react');
const ReactDOM = require('react-dom');
const AutoStyle = require('epui-auto-style').mixin;
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const SegmentDetails = require('./segment-details');
const SegmentList = require('./segment-list');
const ShipMixin = require('./mixins/ship');
const SvgAdd = require('epui-md/svg-icons/content/add');
const Transitions = require('epui-md/styles/transitions');

const CONTAINER_WIDTH = global.contentWidth;
const DURATION = 800;
const LIST_CLOSE_WIDTH = 80;
const LIST_OPEN_WIDTH = 420;
const LIST_WAITING_TIME = 600;
const SPACING = 6;

const VoyageViewer = React.createClass({
  mixins: [AutoStyle, ShipMixin],

  translations: require(`epui-intl/dist/ShipVoyage/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    details: PropTypes.element,
    appBarHeightPercent: PropTypes.number,
    headerDetails: PropTypes.array,
    nTextCancel: PropTypes.string,
    nTextSave: PropTypes.string,
    nTextSaveAndContinue: PropTypes.string,
    nTitleAddSegment: PropTypes.string,
    params: PropTypes.object,
    ship: PropTypes.object,
    style: PropTypes.object,
    voyageSegments: PropTypes.object,
  },

  getDefaultProps(){
    return {
      appHeight: 100,
      showFabButton: false,
    };
  },

  getInitialState() {
    return {
      openSegList: false,
      addSegment: false,
    };
  },

  componentDidMount() {
    this.mounted = true;
    this.setTitle();
  },

  componentWillUnmount() {
    this.mounted = false;
    clearTimeout(this.timer);
  },

  toggleList(flag) {
    if (!this.mounted) return;

    flag = _.isUndefined(flag) ? !this.state.openSegList : flag;

    if(this.state.openSegList === flag) { return; }

    this.setState({
      openSegList: flag
    });
  },

  openList() {
    this.toggleList(true);
  },

  closeList() {
    this.toggleList(false);
  },

  getStyles() {
    let detailsWidth = this.state.openSegList ?
      (CONTAINER_WIDTH - LIST_OPEN_WIDTH - SPACING * 2) :
      (CONTAINER_WIDTH - LIST_CLOSE_WIDTH - SPACING * 2);
    let themeVariables = this.context.muiTheme.appBar;
    let iconButtonSize = this.context.muiTheme.button.iconButtonSize;
    let flatButtonSize = 36;
    let style = this.props.style;

    return {
      root: _.assign({
        width: CONTAINER_WIDTH,
        margin: 'auto',
        // height: window.innerHeight-146+72,
        height: '100%',
        backgroundColor: '#f0f0f0',
      }, style),
      list: {
        zIndex: 2,
        display: 'inline-block',
        verticalAlign: 'top',
        height: '100%'
      },
      details: {
        position: 'relative',
        display: 'inline-block',
        width: detailsWidth,
        height: '100%',
        left: SPACING,
        verticalAlign: 'top',
        marginLeft: SPACING + 'px',
        //transition: Transitions.easeOut(),
      },
      flatButton: {
        color: themeVariables.textColor,
        backgroundColor: 'transparent',
        marginTop: (iconButtonSize - flatButtonSize) / 2 + 2,
      },
      fabContainer:{
        width: '100%',
        maxWidth: global.contentWidth,
        position: 'fixed',
        marginTop: 72,
        marginLeft: -38,
        zIndex: 10
      },
      fab: {
        marginTop: -28,
        marginLeft: 'auto',
        marginRight: 'auto',
        float: 'right',
      },
      wrapper: {
        width: '100%',
        height: '100%',
      },
      top: {
        width: '100%',
        height: '100px',
        border: '1px solid #CCC',
        color: 'white',
        fontSize: '36px',
        lineHeight: '100px',
        textAlign: 'center',
        backgroundColor: '#2196f3',
      },
      bottom: {
        width: '100%',
        height: '100px',
        border: '1px solid #CCC',
        color: 'white',
        fontSize: '36px',
        lineHeight: '100px',
        textAlign: 'center',
        backgroundColor: '#2196f3',
      }
    };
  },

  render() {
    let {
      params,
      ship,
      style,
    } = this.props;

    let activeSegmentId = params.voyageId;

    let {
      openSegList,
    } = this.state;

    let elDetails = React.cloneElement(this.props.details, {
      ship: ship,
      segment: this._getSegment(activeSegmentId),
      refresh: this._handleRefresh,
      style: this.style('details'),
    });

    return (
      <div style={this.style('wrapper', 'root')}>
        <SegmentList
          {...this.props}
          ref='segList'
          activeSegmentId={activeSegmentId}
          canAddSegment={true}
          closeWidth={LIST_CLOSE_WIDTH}
          open={openSegList}
          openWidth={LIST_OPEN_WIDTH}
          onChange={this._handleSegmentChange}
          onMouseEnter={this._handleListMouseEnter}
          onMouseLeave={this._handleListMouseLeave}
          onTouchTap={this._handleListTouchTap}
          ship={ship}
          style={this.style('list')}
        />
        {elDetails}
      </div>
    );
  },

  _getSegment(activeSegmentId) {
    let {
      voyageSegments,
    } = this.props;

    let entries = voyageSegments && voyageSegments.get('entries');
    let index = entries ? entries.findIndex( s => activeSegmentId === s.get('_id')) : -1;
    let segment = index !== -1 ? entries.get(index) : null;

    return segment;
  },

  _handleRefresh(id) {
    this.refs.segList.afterChangeSegment(id);
  },

  _handleSegmentChange(segmentId) {
    let ship = this.props.ship;
    if(ship && !ship.getSegment(segmentId)) {
      let fn = findVoyageSegmentById;
      if (_.isFunction(fn)) {
        fn(segmentId);
      }
    }
  },

  _handleListTouchTap(e) {
    this.openList();
  },

  _handleListMouseEnter(){
    this.__openID = setTimeout(() => {
      this.openList();
      clearInterval(this.__intvOpen);
    }, LIST_WAITING_TIME);
  },

  _handleListMouseLeave(){
    this.closeList();
    clearTimeout(this.__openID);
  },

  _focusOnList(list) {
    if(!list) { return; }

    this.timer = setTimeout(() => {
      let node = list;
      let wrapper = this.refs.content;
      this._prevScrollTop = wrapper.scrollTop;
      wrapper.scrollTop = node.offsetTop;
      wrapper.style.overflowY = 'hidden';
    }, DURATION);

  },

  _blurFromList(list) {
    let wrapper = this.refs.content;
    wrapper.style.overflowY = 'auto';
    wrapper.scrollTop = this._prevScrollTop || 0;
  },

  _handleFold(list, isFold) {
    if(isFold) { return this._blurFromList(list); }
    this._focusOnList(list);
  },

  _handleSwitch(list, toIdx, fromIdx) {
  },
});

module.exports = VoyageViewer;
