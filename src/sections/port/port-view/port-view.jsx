const React = require('react');
const Paper = require('epui-md/Paper');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const MenuItem = require('epui-md/MenuItem');
const ChineseFlag = require('epui-md/svg-icons/ep/port/ChineseFlag');
const PortDetail = require('./port-detail');
const TerminalDetail = require('./terminal-detail');
const AnchorageDetail = require('./anchorage-detail');
const {Tabs,Tab} = require('epui-md/Tabs');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const TAB_VALUE = {
  PORT : 'PORT',
  TERMINAL: 'TERMINAL',
  ANCHORAGE: 'ANCHORAGE'
};

const PortView = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/RecommendationTable/${__LOCALE__}`),
    require(`epui-intl/dist/RecommendationsDialog/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    port : PropTypes.object.isRequired,
    terminal : PropTypes.object,
    anchorage : PropTypes.object,
    routerMode : PropTypes.bool,
  },

  getDefaultProps() {
    return {
      port: {},
      terminal: {},
      anchorage: {},
      routerMode: false,
    };
  },

  getInitialState(){
    const port = this.props.port;
    const hasTerminal = port && _.isArray(port.terminals) && port.terminals.length > 0;
    const hasAnchorage = port && _.isArray(port.anchorages) && port.anchorages.length > 0;
    const terminalId = hasTerminal && port.terminals[0] ? port.terminals[0]._id : '';
    const anchorageId = hasAnchorage && port.anchorages[0] ? port.anchorages[0]._id : '';
    return {
      isFetching: false,
      value: TAB_VALUE.PORT,
      terminalId: terminalId,
      anchorageId : anchorageId
    };
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    let styles = {
      root:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
      },
      flag:{
        width: 36,
        height: 18,
      },
      header:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: theme.epColor.primaryColor,
        marginBottom: 10,
      },
      name:{
        fontSize: 24,
        fontWeight: 500,
        marginRight: 10,
      },
      title:{
        fontSize: 16,
        fontWeight: 500,
        marginLeft: 10,
        height: 28,
      },
      portInfo:{
        marginTop: 20,
      },
      left:{
        maxWidth: '100%',
        marginRight: 10,
        width: '100%',
      },
      leftContainer:{
        width: '100%',
      },
      recommendation:{

      },
      subTitle:{
        display: 'block',
        color: theme.epColor.fontColor,
        fontSize: 12,
        marginLeft: 10,
      },
      tab:{
        fontSize: 14,
        color: theme.epColor.primaryColor,
      },
      inkBar:theme.inkBar,
      tabItemContainer:{
        backgroundColor: theme.epColor.whiteColor,
      },
      underline:{
        display: 'none',
      },
      label:{
        color: theme.epColor.primaryColor,
      },
      icon:{
        fill: theme.epColor.primaryColor,
      },
      control:{
        cursor: 'pointer',
      },
      card:{
        width: '100%',
      }
    }
    return styles;
  },

  fetchTerminal(terminalId){
    let id = this.props.port._id;
    if(global.api.epds && global.api.epds.findTerminal){
        global.api.epds.findTerminal.promise(id,terminalId).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching :false,
              terminal: res.response
            });
          }else{
            //todo: deal with error
            this.setState({
              isFetching :false,
            });
          }
        }).catch(err=>{
          //todo: deal with err
          this.setState({
            isFetching :false,
          });
        });
    }
  },

  fetchAnchorage(anchorageId){
    let id = this.props.port._id;
    if(global.api.epds && global.api.epds.findAnchorage ){
        global.api.epds.findAnchorage.promise(id,anchorageId).then((res,rej)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching :false,
              anchorage: res.response
            });
          }else{
            //todo: deal with error
            this.setState({
              isFetching :false,
            });
          }
        }).catch(err=>{
          //todo: deal with err
          this.setState({
            isFetching :false,
          });
        });
    }
  },

  handleChange(value){
    let isFetching = false;
    if(this.state.value!==value){
      if(value === TAB_VALUE.TERMINAL){
        if(_.isEmpty(this.props.terminal)){
          isFetching =true;
          this.fetchTerminal(this.state.terminalId);
        }
      }else if(value === TAB_VALUE.ANCHORAGE){
        if(_.isEmpty(this.props.anchorage)){
          isFetching =true;
          this.fetchAnchorage(this.state.anchorageId);
        }
      }
      this.setState({
        value: value,
        isFetching: isFetching,
      });
    }
  },

  handleTeminalChange(event,index,value){
    if(this.state.terminalId !== value){
      this.fetchTerminal(value);
      this.setState({
        terminalId: value,
        isFetching: true
      });
    }
  },

  handleAnchorageChange(event,index,value){
    if(this.state.anchorageId !== value){
      this.fetchAnchorage(value);
      this.setState({
        anchorageId: value,
        isFetching: true
      });
    }
  },

  renderChild(){
    let child = (<PortDetail port = {this.props.port} />);
    switch (this.state.value) {
      case TAB_VALUE.TERMINAL:
        child = (
          <TerminalDetail
            terminal = {this.state.terminal}
            isFetching = {this.state.isFetching}
            portId = {this.props.port && this.props.port._id}
          />
        );
        break;
      case TAB_VALUE.ANCHORAGE:
        child = (
          <AnchorageDetail
            anchorage = {this.state.anchorage}
            isFetching = {this.state.isFetching}
          />
        );
        break;
      default:
    }
    return child;
  },

  render() {
    const headerStyle = this.style('header');
    const nameStyle = this.style('name');
    const titleStyle = this.style('title');
    const recommendationStyle = this.style('recommendation');
    const subTitleStyle = this.style('subTitle');
    const port = this.props.port;
    const {terminalId, anchorageId} = this.state;
    const hasTerminal = port && _.isArray(port.terminals) && port.terminals.length > 0;
    const hasAnchorage = port && _.isArray(port.anchorages) && port.anchorages.length > 0;
    const terminalMenu = hasTerminal ? (
      <DropDownMenu
        ref = 'terminalMenu'
        value={terminalId ? terminalId : port.terminals[0]._id}
        onChange={this.handleTeminalChange}
        labelStyle={this.style('label')}
        iconStyle={this.style('icon')}
        controlStyle ={this.style('control')}
        underlineStyle={this.style('underline')}
        disabled={this.state.value !== TAB_VALUE.TERMINAL}
      >
        {
          _.map(port.terminals,(terminal)=>{
            return (<MenuItem key = {terminal._id} value={terminal._id} primaryText={'terminal: '+terminal.name} />);
          })
        }
      </DropDownMenu>
    ):null;

    const anchorageMenu =   hasAnchorage ? (
      <DropDownMenu
        ref = 'anchorageMenu'
        value={anchorageId ? anchorageId : port.anchorages[0]._id }
        onChange={this.handleAnchorageChange}
        labelStyle={this.style('label')}
        iconStyle={this.style('icon')}
        controlStyle ={this.style('control')}
        underlineStyle={this.style('underline')}
        disabled={this.state.value !== TAB_VALUE.ANCHORAGE}
      >
        {
          _.map(port.anchorages,(anchorage)=>{
            return (<MenuItem key = {anchorage._id} value={anchorage._id} primaryText={anchorage.name} />);
          })
        }
      </DropDownMenu>
    ):null;

    const header = this.props.routerMode ? null : (
      <div style = {headerStyle}>
        <span style = {nameStyle}>{port ? port.name : ' - '}</span>
        <ChineseFlag style = {this.style('flag')} viewBox = {'0 0 36 24'} />
      </div>
    );

    return (
      <div style = {this.style('root')}>
        <div style = {this.style('left')}>
          <div style = {this.style('portInfo')}>
            {header}
            <Paper style = {this.style('leftContainer')} >
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                inkBarStyle = {this.style('inkBar')}
                tabItemContainerStyle = {this.style('tabItemContainer')}
              >
                <Tab label="OVERALL" containerElement='div' value={TAB_VALUE.PORT}  style = {this.style('tab')} />
                <Tab label={terminalMenu} containerElement='div' value={TAB_VALUE.TERMINAL} style = {this.style('tab')} />
                <Tab label={anchorageMenu} containerElement='div' value={TAB_VALUE.ANCHORAGE} style = {this.style('tab')} />
              </Tabs>
              <div>
                {this.renderChild()}
              </div>
            </Paper>
           </div>
         </div>
      </div>
    );
  }
});

module.exports = PortView;
