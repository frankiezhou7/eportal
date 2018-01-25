const React = require('react');
const Divider = require('epui-md/Divider');
const PortInfo = require('epui-md/ep/port/PortInfo');
const PortFunction = require('epui-md/ep/port/PortFunction');
const Tug = require('epui-md/ep/port/Tug');
const Tide = require('epui-md/ep/port/Tide');
const PilotStation = require('epui-md/ep/port/PilotStation');
const MainlyCargo = require('epui-md/ep/port/MainlyCargo');
const ShipLimit = require('epui-md/ep/port/ShipLimit');
const Loading = require('epui-md/ep/RefreshIndicator');
const _ = require('eplodash');
const { getShipRestrictions } = require('./methods');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const PortDetail = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/PortView/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style : PropTypes.object,
    isFetching : PropTypes.bool,
    nLabelPortShipLimitDescription:PropTypes.string,
    port : PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      port: {},
      isFetching:false,
    };
  },

  getInitialState(){
    let payloadTypes = this.props.port && this.props.port.payloadTypes;
    return {
      isShipLimitDataFetching: false,
      shipLimitDatas:{},
      cargoType: payloadTypes && payloadTypes.length > 0 ?
                 payloadTypes[0].payloadType && payloadTypes[0].payloadType._id : '',
    };
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    let styles = {
      root:{
        padding: padding,
      },
      divider:{
        marginTop: padding,
        marginLeft: -padding,
        marginRight: -padding,
        marginBottom: padding,
      },
      loading:{
        fontSize: 16,
        textAlign: 'center',
        color: theme.epColor.primaryColor,
      }
    }
    if(this.props.style){
      styles.root = Object.assign(styles.root,this.props.style);
    }
    return styles;
  },

  componentDidMount() {
    if(_.isEmpty(this.state.shipLimitDatas)){
      this.fetchShipLimitDatas(this.state.cargoType);
    }
  },

  fetchShipLimitDatas(cargoType){
    let id = this.props.port && this.props.port._id;
    if(global.api.epds && global.api.epds.getPortShipRestrictions ){
        global.api.epds.getPortShipRestrictions.promise(id,cargoType).then((res,rej)=>{
          if(res.status === 'OK'){
            this.setState({
              isShipLimitDataFetching :false,
              shipLimitDatas: getShipRestrictions(res.response)
            });
          }else{
            //todo: deal with error
            this.setState({
              isShipLimitDataFetching :false,
            });
          }
        }).catch(err=>{
          //todo: deal with err
          this.setState({
            isShipLimitDataFetching :false,
          });
        });
    }
  },

  handleCargoChange(index,value){
    if(this.state.cargoType !== value){
      this.setState({
        isShipLimitDataFetching: true,
        cargoType:value
      });
      this.fetchShipLimitDatas(value);
    }
  },

  render() {
    const port = this.props.port;
    const dividerStyle = this.style('divider');
    const loadingElem = (<Loading />);
    const menuItems = _.map(port.payloadTypes,payloadType=>{
      return _.pick(payloadType.payloadType,'_id','code','name');
    });
    const portElem = this.props.isFetching ===true ? loadingElem : _.isEmpty(port) ? null : (
      <div>
        <PortInfo port = {port} />
        <Divider style = {this.style('divider')} />
        <ShipLimit
          item = {port}
          menuItems ={menuItems}
          description= {this.t('nLabelPortShipLimitDescription') + ' : ' + port.name}
          isFetching = {this.state.isShipLimitDataFetching}
          datas = {this.state.shipLimitDatas}
          onCargoChange = {this.handleCargoChange}
        />
        <Divider style = {dividerStyle} />
        <PortFunction abilities = {port.abilities} />
        <Divider style = {dividerStyle} />
        <MainlyCargo payloadTypes = {port.payloadTypes} />
        <Divider style = {dividerStyle} />
        <Tide tide = {port.tide} waterDensity={port.waterDensity}/>
        {/* <Divider style = {dividerStyle} />
        <Tug tugs = {port.tugs} />
        <Divider style = {dividerStyle} />
        <PilotStation pilotStations = {port.pilotStations} /> */}
      </div>
    );
    return (
      <div style = {this.style('root')}>
        {portElem}
      </div>
    );
  }
});

module.exports = PortDetail;
