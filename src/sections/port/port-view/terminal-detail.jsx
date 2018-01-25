const React = require('react');
const Divider= require('epui-md/Divider');
const PortFunction= require('epui-md/ep/port/PortFunction');
const Berths= require('./berths');
const MainlyCargo= require('epui-md/ep/port/MainlyCargo');
const ShipLimit= require('epui-md/ep/port/ShipLimit');
const Loading= require('epui-md/ep/RefreshIndicator');
const { getShipRestrictions } = require('./methods');
const { displayWithLimit } = require('epui-md/utils/methods');
const _ = require('eplodash');

const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const TerminalDetail = React.createClass({

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
    portId : PropTypes.string.isRequired,
    terminal : PropTypes.object.isRequired,
  },

  getDefaultProps() {
    return {
      terminal: {},
      portId: '',
    };
  },

  getInitialState(){
    let payloadTypes = this.props.terminal && this.props.terminal.payloadTypes;
    return {
      isShipLimitDataFetching:false,
      shipLimitDatas:{},
      cargoType: '',
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
    }
    if(this.props.style){
      styles.root = Object.assign(styles.root,this.props.style);
    }
    return styles;
  },

  componentWillReceiveProps(nextProps) {
    if( (_.isEmpty(this.props.terminal) && !_.isEmpty(nextProps.terminal)) ||
      this.props.terminal._id !== nextProps.terminal._id || _.isEmpty(this.state.shipLimitDatas)){
        let payloadTypes = nextProps.terminal && nextProps.terminal.payloadTypes;
        let cargoType = payloadTypes && payloadTypes.length > 0 ?
            payloadTypes[0].payloadType && payloadTypes[0].payloadType._id : '';
        this.setState({
          cargoType: cargoType,
        });
        this.fetchShipLimitDatas(cargoType,nextProps.terminal._id);
    }
  },

  fetchShipLimitDatas(cargoType,terminalId){
    let id = this.props.portId;
    if(global.api.epds && global.api.epds.getTerminalShipRestrictions ){
        global.api.epds.getTerminalShipRestrictions.promise(id,terminalId,cargoType).then((res,rej)=>{
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
      this.fetchShipLimitDatas(value,this.props.terminal._id);
    }
  },

  render() {
    const terminal =  this.props.terminal;
    const dividerStyle = this.style('divider');
    const loadingElem = (<Loading />);
    const menuItems = _.map(terminal.payloadTypes,payloadType=>{
      return _.pick(payloadType.payloadType,'_id','code','name');
    });
    const terminalElem = this.props.isFetching ===true ? loadingElem : _.isEmpty(terminal) ? null : (
      <div>
        <ShipLimit
          item = {terminal}
          menuItems = {menuItems}
          description= {this.t('nLabelTerminalShipLimitDescription') + ' : '+ terminal.port.name + ' - '+terminal.name}
          isFetching = {this.state.isShipLimitDataFetching}
          datas = {this.state.shipLimitDatas}
          onCargoChange = {this.handleCargoChange}
        />
        <Divider style = {dividerStyle} />
        <PortFunction abilities = {terminal.abilities} />
        <Divider style = {dividerStyle} />
        <MainlyCargo payloadTypes = {terminal.payloadTypes} />
        <Divider style = {dividerStyle} />
        <Berths
          berths = {terminal.berths}
          portId = {this.props.portId}
          terminalId = {this.props.terminal && this.props.terminal._id}
        />
      </div>
    );
    return (
      <div style = {this.style('root')}>
        {terminalElem}
      </div>
    );
  }
});

module.exports = TerminalDetail;
