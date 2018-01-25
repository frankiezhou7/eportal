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
    records : PropTypes.array,
    params : PropTypes.object,
    order : PropTypes.object,
  },

  getDefaultProps() {
    return {
      records:[],
      nLabelNoRecord: 'No Record',
    };
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let styles = {
      root: {
        padding: 24,
      },
      empty:{
        paddingTop: 50,
        paddingBottom: 50,
        width: '100%',
        textAlign: 'center',
      },
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();
    let {records, order} = this.props;
    return (
      <div style={this.style('root')}>
        {_.isEmpty(records) ? (
            <div style = {this.style('empty')}>{this.t('nLabelNoRecord')}</div>
          ):_.map(records,record=>{
            return (
              <CommonRecord
                key = {record._id}
                record = {record}
                type = 'service'
                onTitleTouchTap = {this._handleTitleTouchTap}
                order = {this.props.order}
              />
            );
        })}
      </div>
    );
  },

  _handleTitleTouchTap(record){
    if(record && record.order && record.orderEntry){
      let page = 'CONFIG_PAGE';
      let voyageId = this.props.params.voyageId;
      let shipId = this.props.params.shipId;
      global.tools.toSubPath(`/ship/${shipId}/voyage/${voyageId}/${record.order}/${record.orderEntry}/${page}`, true);
    }
  }

});

module.exports = OrderService;
