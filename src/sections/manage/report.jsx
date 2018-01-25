const React = require('react');
const _ = require('eplodash');
const Loading = require('epui-md/ep/RefreshIndicator');
const Paper = require('epui-md/Paper');
const {Card, CardHeader, CardMedia, CardTitle, CardText} = require('epui-md/Card');
const { Line, Bar, Radar, Pie, Polar, Bubble} = require('react-chartjs-2');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const Report = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    data : PropTypes.array,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps(){
    return {};
  },

  getInitialState(){
    return {
      isFetchingOCPBM :false,
      OCPBMData : [],
      isFetchingOCPBT :false,
      OCPBTData : [],
      isFetchingPSOS :false,
      PSOSData : [],
      isFetchingMRUC :false,
      MRUCData : [],
      isFetchingMEPO :false,
      MEPOData : [],
      isFetchingPOP :false,
      POPData : [],
      isFetchingPOC :false,
      POCData : [],
    };
  },

  getStyles() {
    let styles = {
      root: {
      },
      section:{
        paddingTop: 20,
        paddingBottom: 20,
        marginBottom: 20,
      },
      chart:{

      },
      chartContainer:{
        display: 'block',
        textAlign: 'center',
        width: 800,
        margin: 'auto'
      },
    };

    return styles;
  },

  componentWillMount() {
    this.getOrderCountPriceByMonth();
    this.getOrderCountPriceByType();
    this.getMonthlyRegisterUserCount();
    this.getPortShipOrgStats();
    this.getPortOrdersPrices();
    this.getPortOrdersCount();
    this.setState({
      isFetchingOCPBM:true,
      isFetchingOCPBT:true,
      isFetchingMRUC:true,
      isFetchingPSOS:true,
      isFetchingPOP:true,
      isFetchingPOC:true,
    });
  },

  getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },

  getOrderCountPriceByMonth(){
    if(global.api.order && global.api.order.getOrderCountPriceByMonth){
        global.api.order.getOrderCountPriceByMonth.promise().then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetchingOCPBM: false,
              OCPBMData: res.response
            });
          }else{
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
          //todo: deal with err
        });
    }
  },

  getOrderCountPriceByType(){
    if(global.api.order && global.api.order.getOrderCountPriceByType){
        global.api.order.getOrderCountPriceByType.promise().then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetchingOCPBT: false,
              OCPBTData: res.response
            });
          }else{
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
          //todo: deal with err
        });
    }
  },

  getMonthlyRegisterUserCount(){
    if(global.api.user && global.api.user.getMonthlyRegisterUserCount){
        global.api.user.getMonthlyRegisterUserCount.promise().then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetchingMRUC: false,
              MRUCData: res.response
            });
          }else{
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
          //todo: deal with err
        });
    }
  },

  getPortShipOrgStats(){
    if(global.api.epds && global.api.epds.getPortShipOrgStats){
        global.api.epds.getPortShipOrgStats.promise().then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetchingPSOS: false,
              PSOSData: res.response
            });
          }else{
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
          //todo: deal with err
        });
    }
  },

  getPortOrdersPrices(){
    if(global.api.order && global.api.order.getPortOrdersPrices){
        global.api.order.getPortOrdersPrices.promise().then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetchingPOP: false,
              POPData: res.response
            });
          }else{
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
          //todo: deal with err
        });
    }
  },

  getPortOrdersCount(){
    if(global.api.order && global.api.order.getPortOrdersCount){
        global.api.order.getPortOrdersCount.promise().then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetchingPOC: false,
              POCData: res.response
            });
          }else{
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
          //todo: deal with err
        });
    }
  },

  getMonthlyEachPortOrders(){
    if(global.api.order && global.api.order.getMonthlyEachPortOrders){
        global.api.order.getMonthlyEachPortOrders.promise().then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetchingMEPO: false,
              MEPOData: res.response
            });
          }else{
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err=>{
          alert(this.t('nTextIinitFailed')+err);
          //todo: deal with err
        });
    }
  },

  getLineData(labels,data,label){
    let color = this.getRandomColor();
    return {
      labels: labels,
      datasets: [
        {
          label: label,
          fill: false,
          lineTension: 0.1,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: color,
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor: color,
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: color,
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 2,
          pointRadius: 1,
          pointHitRadius: 10,
          data: data
        }
      ]
    };
    return lineData;
  },


  getBarData(labels,data,label){
    let color = this.getRandomColor();
    return {
      labels: labels,
      datasets: [
        {
          label: label,
          backgroundColor: color,
          borderColor: color,
          borderWidth: 1,
          hoverBackgroundColor: color,
          hoverBorderColor: color,
          data: data
        }
      ]
    };
  },

  getPolarData(labels,labelColors,data,label){
    return {
      datasets: [{
          data: data,
          backgroundColor: labelColors,
          label: label
      }],
      labels: labels
    };
  },

  getPieData(labels,labelColors,data,label){
    return {
      datasets: [{
          data: data,
          backgroundColor: labelColors,
          hoverBackgroundColor: labelColors,
          label: label
      }],
      labels: labels
    };
  },

  getBubbleData(labels,data,label){
    return {
      datasets: [
        {
          label: label,
          backgroundColor:this.getRandomColor(),
          hoverBackgroundColor: this.getRandomColor(),
          data: data
        }
      ]
    };
  },

  renderChart(data,title,loading,component){
    return(
      <Card style = {this.style('section')}>
        <CardHeader title={title} />
        {
           loading ? <Loading />:
           <div style = {this.style('chartContainer')}>
            {
              React.createElement(component,{
                width: 800,
                height: 300,
                style :this.style('chart'),
                data: data
              })
            }
           </div>
        }
      </Card>
    );
  },

  renderOrderCountByOrderType(){
    let OCPBTData = this.state.OCPBTData;
    let labels = _.map(OCPBTData,dt=> _.get(dt,['type','0','name']));
    let labelColors = _.times(labels.length, this.getRandomColor);
    let data = _.map(OCPBTData,'count');
    let inputData = this.getPolarData(labels,labelColors,data,'平台各订单类型订单量');
    return this.renderChart(inputData,'平台各订单类型订单量',this.state.isFetchingOCPBT,Polar);
  },

  renderOrderPriceByOrderType(){
    let OCPBTData = this.state.OCPBTData;
    let labels = _.map(OCPBTData,dt=> _.get(dt,['type','0','name']));
    let data = _.map(OCPBTData,dt=>dt.totalPrice.toFixed(2));
    let inputData = this.getBarData(labels,data,'平台各订单类型订单总额$');
    return this.renderChart(inputData,'平台各订单类型订单总额$',this.state.isFetchingOCPBT,Bar);
  },

  renderOrderCountByMonth(){
    let OCPBMData = this.state.OCPBMData;
    let labels = _.map(OCPBMData,dt=> dt && dt._id && (dt._id.year+'-'+dt._id.month));
    let data = _.map(OCPBMData,'count');
    let inputData = this.getBarData(labels,data,'平台月订单量');
    return this.renderChart(inputData,'平台月订单量',this.state.isFetchingOCPBM,Bar);
  },

  renderOrderPriceByMonth(){
    let OCPBMData = this.state.OCPBMData;
    let labels = _.map(OCPBMData,dt=>dt && dt._id && (dt._id.year+'-'+dt._id.month));
    let data = _.map(OCPBMData,dt=>dt.totalPrice.toFixed(2));
    let inputData = this.getLineData(labels,data,'平台月订单总额');
    return this.renderChart(inputData,'平台月订单总额$',this.state.isFetchingOCPBM,Line);
  },

  renderPortShipOrgStats(){
    let PSOSData = this.state.PSOSData;
    let labels = _.keys(PSOSData);
    let labelColors = _.times(labels.length, this.getRandomColor);
    let data = _.values(PSOSData);
    let inputData = this.getPieData(labels,labelColors,data,'港口，船舶，组织分布');
    return this.renderChart(inputData,'港口，船舶，组织分布',this.state.isFetchingPSOS,Pie);
  },

  renderMonthlyRegisterUserCount(){
    let MRUCData = this.state.MRUCData;
    let labels = _.map(MRUCData,dt=>dt && dt._id && (dt._id.year+'-'+dt._id.month));
    let data = _.map(MRUCData,'count');
    let inputData = this.getLineData(labels,data,'月用户注册数');
    return this.renderChart(inputData,'月用户注册数',this.state.isFetchingMRUCD,Line);
  },

  renderPortOrdersCount(){
    let POCData = this.state.POCData;
    let labels = _.map(POCData,dt=> dt && dt._id);
    let data = _.map(POCData,'count');
    let inputData = this.getBarData(labels,data,'港口订单量排行');
    return this.renderChart(inputData,'港口订单量排行',this.state.isFetchingPOC,Bar);
  },

  renderPortOrdersPrices(){
    let POPData = this.state.POPData;
    let labels = _.map(POPData,dt=>dt && dt._id);
    let data = _.map(POPData,dt=>dt.count.toFixed(2));
    let inputData = this.getLineData(labels,data,'港口订单总额排行');
    return this.renderChart(inputData,'港口订单总额排行$',this.state.isFetchingPOP,Line);
  },


  render() {

    return (
      <Paper style={this.style('root')}>
        {this.renderOrderCountByMonth()}
        {this.renderOrderPriceByMonth()}
        {this.renderOrderCountByOrderType()}
        {this.renderOrderPriceByOrderType()}
        {this.renderPortShipOrgStats()}
        {this.renderMonthlyRegisterUserCount()}
        {this.renderPortOrdersCount()}
        {this.renderPortOrdersPrices()}
      </Paper>
    );
  },

});

module.exports = Report;
