const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const Translation = require('epui-intl').mixin;
const PropTypes = React.PropTypes;
const CommonRecord = require('./common-record');

const OrderService = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translation],

  translations: require(`epui-intl/dist/SegmentDetails/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    params: PropTypes.object,
    records : PropTypes.array,
    order : PropTypes.object,
  },

  getDefaultProps() {
    return {

    };
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let styles = {
      root: {
        padding: 24,
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    return (
      <div style={this.style('root')}>
        <CommonRecord
          type = 'message'
          order = {this.props.order}
          onTitleTouchTap = {this._handleTitleTouchTap}
        />
      </div>
    );
  },

  _handleTitleTouchTap(){
    if(this.props.order){
      const PAGE = 'VIEW_MESSAGE';
      let voyageId = this.props.params.voyageId;
      let shipId = this.props.params.shipId;
      let orderEntries = this.props.order.orderEntries;
      let orderEntryId = orderEntries.length >0 ? orderEntries[0]._id:null;
      if(orderEntryId) {
        global.tools.toSubPath(`/ship/${shipId}/voyage/${voyageId}/${this.props.order._id}/${orderEntryId}/${PAGE}`, true);
      }
    }
  }

});

module.exports = OrderService;
