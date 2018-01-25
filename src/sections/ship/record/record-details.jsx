const React = require('react');
const IconReport = require('epui-md/svg-icons/content/report');
const PureRenderMixin = require('react-addons-pure-render-mixin');
const ResizeSensible = require('~/src/mixins/resize-sensible');
const Paper = require('epui-md/Paper');
const ShipMixin = require('../mixins/ship');
const VoyageRecord = require('./voyage-record');
const OrderRecordListConnect = require('./order-record-list-connect');
const Loading = require('epui-md/ep/RefreshIndicator');
const Translation = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;

const RecordDetails = React.createClass({

  mixins: [AutoStyle, PureRenderMixin, ResizeSensible, Translation],

  translations: [
    require(`epui-intl/dist/SegmentDetails/${__LOCALE__}`),
    require(`epui-intl/dist/Global/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    ship: PropTypes.object,
    segment: PropTypes.object,
    style: PropTypes.object,
    params: PropTypes.object,
    updateTimingReportsBySegmentId: PropTypes.func,
    nTextNoSegmentSelected: PropTypes.string,
    refresh: PropTypes.func,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      voyageLoading: false,
      voyageRecords: []
    };
  },

  componentDidMount(){
    this.setState({ voyageLoading:true });
    this.fetchVoyageRecord(this.props.params.voyageId);
  },

  componentWillReceiveProps(nextProps) {
    let {
      ship,
      segment,
    } = this.props;

    let nextShip = nextProps.ship;
    let nextSeg = nextProps.segment;

    if(!nextSeg) { return; }

    if(segment !== nextSeg ) {
      this.fetchVoyageRecord(nextSeg._id);
    }
  },

  fetchVoyageRecord(voyageId){
    let { getVoyageRecords } = global.api.message;
    if(voyageId){
      getVoyageRecords
        .promise(voyageId)
        .then((res) => {
          this.setState({
            voyageLoading:false,
            voyageRecords: res.response.data
          });
        })
        .catch(err=>{
          console.log('Error',err);
        });
    }
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let style = this.props.style;
    let styles = {
      root: style,
      noContent: {
        width: '100%',
        textAlign: 'center',
      },
      noContentIcon: {
        marginTop: '48px',
        width: '32px',
        height: '32px',
        fill: theme.palette.primary1Color,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
      scroll:{
        overflow: 'scroll',
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();
    let {
      ship,
      segment,
      style,
      params
    } = this.props;

    if(!segment) {
      return (
        <div style={this.style('noContent', 'root')}>
          <IconReport style={this.style('noContentIcon')} />
          {this.t('nTextNoSegmentSelected')}
        </div>
      );
    }

    return (
      <Paper style={this.style('root','scroll')}>
        {this.state.voyageLoading ? <Loading /> : <VoyageRecord records = {this.state.voyageRecords}/>}
        <OrderRecordListConnect params = {params} segment = {segment}/>
      </Paper>
    );
  },

});

module.exports = RecordDetails;
