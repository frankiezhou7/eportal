const React = require('react');
const BerthItem = require('epui-md/ep/port/BerthItem');
const { display } = require('epui-md/utils/methods');
const _ = require('eplodash');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const Berth = require('epui-md/ep/port/Berth');

const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;

const Berths = React.createClass({

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
    nLabelBerth : PropTypes.string,
    style: PropTypes.object,
    berths : PropTypes.array.isRequired,
    isFetching : PropTypes.bool,
    portId : PropTypes.string.isRequired,
    terminalId : PropTypes.string.isRequired,
  },

  getDefaultProps() {
    return {
      nLabelBerth : 'Berth',
      berths: [],
      portId: '',
      terminalId: '',
      isFetching: false,
    };
  },

  getInitialState(){
    return {
      isFetching: false,
      open : false,
      berth: null,
    };
  },

  getStyles() {
    const theme = this.context.muiTheme;
    let styles = {
      root:{

      },
      header:{
        marginBottom: 20,
        fontSize: 20,
      },
      itemContainer:{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexWrap: 'wrap',
      },
      button:{
        margin :'5px 10px 5px 0px',
        flex: '1 1 162px',
      },
      icon:{
        fill: theme.epColor.secondaryColor,
      },
      label:{
        color: theme.epColor.fontColor,
      },
      dialogBody:{
        padding: 0,
      },
      dialogTitle:{
        color: theme.epColor.primaryColor,
        padding: '12px 12px 10px 24px',
      },
      content:{
        maxWidth: global.contentWidth,
      }
    }
    if(this.props.style){
      styles.root = Object.assign(styles.root,this.props.style);
    }
    return styles;
  },

  fetchBerth(berthId){
    let id = this.props.portId;
    let terminalId = this.props.terminalId;
    if(global.api.epds && global.api.epds.findBerth){
        global.api.epds.findBerth.promise(id,terminalId,berthId).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching :false,
              berth: res.response
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

  handleShowBerth(berth){
    if(!this.state.berth || this.state.berth._id !== berth._id){
      this.setState({
        isFetching: true,
        open: true
      },()=>{
        this.fetchBerth(berth._id);
      });
    }else if(this.state.berth && this.state.berth._id === berth._id){
      this.setState({open: true});
    }
  },

  handleClose(){
    this.setState({
      open: false
    });
  },

  render() {
    const berths = this.props.berths;
    const actions = [
      <FlatButton
        label={this.t('nTextClose')}
        primary={true}
        onTouchTap={this.handleClose}
      />,
    ];

    const berthsElem = _.isArray(berths) && berths.length > 0 ?(
      <div style = {this.style('itemContainer')}>
        {
          _.map(this.props.berths,berth=>{
            return(
              <BerthItem
                key = {berth._id}
                berth = {berth}
                onTouchTap = {this.handleShowBerth}
              />
            );
          })
        }
      </div>
    ): (<div> - </div>);

    return (
      <div style = {this.style('root')}>
        <div style = {this.style('header')}>{this.props.nLabelBerth}</div>
        {berthsElem}
        <Dialog
           title={this.state.isFetching ? '' : this.state.berth ? this.state.berth.name : ''}
           titleStyle = {this.style('dialogTitle')}
           bodyStyle = {this.style('dialogBody')}
           actions={actions}
           modal={false}
           open={this.state.open}
           onRequestClose={this.handleClose}
           autoScrollBodyContent={true}
           repositionOnUpdate= {true}
           contentStyle={this.style('content')}
         >
          <Berth
            isFetching ={this.state.isFetching}
            berth = {this.state.berth || {}}
          />
         </Dialog>
      </div>
    );
  }
});

module.exports = Berths;
