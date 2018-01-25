const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const OrderStatus = require('./order-status');
const OrderReport = require('./order-report');
const OrderService = require('./order-service');
const OrderMessage = require('./order-message');
const Translation = require('epui-intl').mixin;
const Flexible = require('epui-md/ep/Flexible');
const RecordContainer = require('./record-container');
const PropTypes = React.PropTypes;


const OrderRecord = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, Translation],

  translations: require(`epui-intl/dist/SegmentDetails/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    records : PropTypes.array,
    params : PropTypes.object,
    order : PropTypes.object,
    nLabelOrderStatus: PropTypes.string,
    nLabelReport: PropTypes.string,
    nLabelService: PropTypes.string,
    nLabelMessage: PropTypes.string,
  },

  getDefaultProps() {
    return {
      nLabelOrderStatus: 'Order Status',
      nLabelReport: 'Report',
      nLabelService: 'Service',
      nLabelMessage: 'Message',
      records:[]
    };
  },

  getInitialState() {
    return {
      records : {
        Change:[],
        FeedBack: [],
        Event: [],
        OPState: []
      },
      loading : false
    };
  },

  componentDidMount(){
    let { getOrderRecords } = global.api.message;
    getOrderRecords
      .promise(this.props.order._id)
      .then((res) => {
        let records = res.response.records;
        records = _.groupBy(records,'subtype');
        this.setState({
          loading:false,
          records: records
        });
      })
      .catch(err=>{
        alert('Error',err);
      });
  },

  componentWillReceiveProps(nextProps) {

  },

  getStyles() {
    let theme = this.context.muiTheme;
    let colors = theme.epColor;
    let styles = {
      root: {
        marginTop: 15,
      },
      header:{
        backgroundColor: ' #00599A',
        borderRadius: 0,
      },
      title:{
        color: colors.whiteColor,
        marginLeft: 24,
        fontSize: 16,
        fontWeight: 500,
      },
      openConfig:{
        marginRight: 12,
      },
      btn:{
        fill: colors.whiteColor,
      },
      child:{
        padding: 0,
        paddingBottom:20,
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();
    let { params, order } = this.props;
    let {records} = this.state;
    return (
      <Flexible
        ref = {'order_'+order._id}
        title = {`${order.type.name} (${order.orderNumber})`}
        style = {this.style('root')}
        expandable ={true}
        showCheckBox = {false}
        headerStyle = {this.style('header')}
        titleStyle = {this.style('title')}
        btnStyle = {this.style('btn')}
        openConfigStyle = {this.style('openConfig')}
        childStyle = {this.style('child')}
      >
        <RecordContainer title = {this.t('nLabelOrderStatus')}>
          <OrderStatus order = {order} records = {_.sortBy(records.OPState,o=>o.date)} />
        </RecordContainer>
        <RecordContainer title = {this.t('nLabelReport')}>
          <OrderReport params = {params} order = {order} records = {records.Event} />
        </RecordContainer>
        <RecordContainer title = {this.t('nLabelService')}>
          <OrderService params = {params} order = {order} records = {records.Change} />
        </RecordContainer>
        <RecordContainer title = {this.t('nLabelMessage')}>
          <OrderMessage params = {params} order = {order} records = {records.FeedBack} />
        </RecordContainer>
      </Flexible>
    );
  },

});

module.exports = OrderRecord;
