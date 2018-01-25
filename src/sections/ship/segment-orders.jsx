const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const FlatButton = require('epui-md/FlatButton');
const IconAdd = require('epui-md/svg-icons/content/add');
const IconButton = require('epui-md/IconButton');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const ResizeSensible = require('~/src/mixins/resize-sensible');
const SegmentOrdersConnect = require('~/src/sections/order/segment-orders-connect');
const ShipMixin = require('./mixins/ship');
const Translatable = require('epui-intl').mixin;

const SegmentOrders = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, ResizeSensible, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    fold: PropTypes.bool,
    editable: PropTypes.bool,
    onOrderFold: PropTypes.func,
    params: PropTypes.object,
    ship: PropTypes.object,
    segment: PropTypes.object,
    style: PropTypes.object,
    params: PropTypes.object,
    location: PropTypes.object,
    onFeedbackDialogOpen: PropTypes.func,
  },

  getDefaultProps() {
    return {
      fold: true,
    };
  },

  getInitialState() {
    return {
      fold: this.props.fold,
    };
  },

  fold(flag) {
    let {onOrderFold} = this.props;
    this.setState({
      fold: flag,
    }, () => {
      if (_.isFunction(onOrderFold)) {
        onOrderFold(flag);
      }
    });
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let style = this.props.style;
    let segment = this.props.segment;
    let isLoading = segment && segment.orders && segment.orders.getMeta('loading');

    return {
      root: _.merge({
        position: 'relative',
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        // overflowX: 'hidden',
        display: isLoading ? 'none' : 'block',
        transition: null,
      }, style),
      container: {
        padding: 3,
      }
    };
  },

  componentDidMount(){
    if(this.props.params.orderId) {
      this.setState({fold:false});
    }
  },

  render() {
    let {
      ship,
      segment,
      editable,
      params,
      location,
      onFeedbackDialogOpen,
    } = this.props;
    let {
      fold,
      rootHeight,
    } = this.state;

    if(!segment) { return null; }

    return (
      <div
        ref={(ref) => this.root = ref}
        style={this.style('root')}
        className='segment-orders'
      >
        <div style={this.style('container')}>
          <SegmentOrdersConnect
            ref={(ref) => this.orders = ref}
            params = {params}
            location = {location}
            fold={fold}
            editable={editable}
            ship={ship}
            segment={segment}
            fullHeight={rootHeight}
            onOrderFold={this._handleOrderFold}
            onFeedbackDialogOpen={onFeedbackDialogOpen}
          />
        </div>
      </div>
    );
  },

  _handleOrderFold(orderId, fold, offsetTop) {
    let root = ReactDOM.findDOMNode(this.root); // eslint-disable-line react/no-find-dom-node
    let orders = ReactDOM.findDOMNode(this.orders); // eslint-disable-line react/no-find-dom-node

    if(!fold) {
      this.__scrollTop = root.scrollTop;
    }

    orders.style.marginTop = fold ? '0px' :`-${offsetTop}px`;
    root.style.overflowY = fold ? 'auto' : 'hidden';
    root.scrollTop = fold ? this.__scrollTop : 0;

    let fn = this.props.onOrderFold;
    if (_.isFunction(fn)) {
      fn(fold, orderId);
    }
  },

});

module.exports = SegmentOrders;
