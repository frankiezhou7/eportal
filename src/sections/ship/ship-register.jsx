const React = require('react');
const Header = require('~/src/app/screens/header');
const ShipFormCompleted = require('./ship-form-completed');
const ShipForm = require('~/src/app/ship-dialog/ship-form');
const DragDropFiles = require('~/src/shared/drag-drop-files');
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;
const { connect } = require('react-redux');
const _ = require('eplodash');
const PropTypes = React.PropTypes;
const APP_BAR_MAX_HEIGHT = 72;

const ShipRegister = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ShipForm/${__LOCALE__}`),
    require(`epui-intl/dist/ShipDialog/${__LOCALE__}`),
  ],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  childContextTypes :{
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.object,
    user: PropTypes.object,
    onReposition: PropTypes.func,
  },

  getDefaultProps() {
    return { };
  },

  getInitialState() {
    return {
      showParticular: false,
      ship: {},
      shipId: null,
      isSwitched: true,
    };
  },

  getStyles() {
    return {
      root: {
        height: '100%',
        // boxSizing: 'border-box',
        // paddingTop: APP_BAR_MAX_HEIGHT,
        // position: 'absolute',
        // top: 0,
        // left: 0,
        // bottom: 0,
        // right: 0,
      },
      appBar: {
        position: 'fixed',
        top: 0,
      },
      form: {
        margin:'-30px auto 0px',
      },
      content: {
        margin: 'auto',
        maxWidth: global.contentWidth,
        height: 485,
        overflowY: 'auto',
      },
      title:{
        marginTop: 10,
        fontSize: 24,
      },
      btn:{
        width: '100%',
        textAlign: 'center',
        marginBottom: -15,
      },
      particular: {
        display: this.state.showParticular ? 'none' : 'inline-block',
        marginRight: 220
      },
      container:{
        width: 808,
        margin: '0px auto',
        paddingBottom: 20,
      },
      uploadTitle:{
        fontSize: 16,
        textAlign: 'left',
        display: 'block',
        marginTop: -10,
        marginBottom: -30,
      },
    };
  },

  createShip(ship){
    if(global.api.epds && global.api.epds.createShip){
        let user = this.props.user;
        user = user && user.toJS();
        ship.userCreate = user && user._id;
        global.api.epds.createShip.promise(ship).then((res)=>{
          if(res.status === 'OK'){
              this.setState({shipId: res.response._id});
              if(this.state.isSwitched){
                global.tools.toSubPath(`/ship/${res.response._id}/voyage`);
              }
          }else{
            alert(this.t('nTextCreateFailed'));
          }
        }).catch(err=>{
          alert(this.t('nTextCreateFailed'));
        });
    }
  },

  handleRegister(){
    let particular = this.refs.shipParticular;
    let files = particular.getFiles();
    if(particular.isDirty()) {
      if(!particular.checkRemovedStatus()){
        alert(this.t('nTextRequireUpload'));
        return;
      }
    }

    this.setState({files});
    this.refs.form.isValid()
      .then((valid)=>{
        if(valid){
          let ship = this.refs.form.getValue();
          ship.shipParticular = this.state.files;
            this.createShip(ship);
        }else{
          alert(this.t('nTextValidationError'));
        }
      });
  },

  handleUpdate(){
    this.refs.completedForm.isValid()
      .then((valid)=>{
        if(valid){
          let ship = this.refs.completedForm.getValue();
          if(global.api.epds && global.api.epds.updateShipById){
            global.api.epds.updateShipById.promise(this.state.shipId, ship).then((res)=>{
              if(res.status === 'OK'){
                global.tools.toSubPath(`/ship/${this.state.shipId}/voyage`);
              }
            }).catch(err=>{
              alert(this.t('nTextUpdateFailed'));
            });
          }
        }else{
          alert(this.t('nTextValidationError'));
        }
      });
  },

  handleCompleteParticular(){
    let particular = this.refs.shipParticular;
    let files = particular.getFiles();
    if(particular.isDirty()) {
      if(!particular.checkRemovedStatus()){
        alert(this.t('nTextRequireUpload'));
        return;
      }
    }
    this.setState({
      files,
      isSwitched: false,
    });

    this.refs.form.isValid()
      .then((valid)=>{
        if(valid){
          let ship = this.refs.form.getValue();
          ship.shipParticular = this.state.files;
            this.createShip(ship);
            this.setState({
              ship,
              showParticular: !this.state.showParticular,
            });
            this.props.onReposition(this.state.showParticular)
        }else{
          alert(this.t('nTextValidationError'));
        }
      });
  },

  renderShipForm(){
    if(this.state.showParticular){
      return (
        <div style = {this.s('content')}>
          <ShipFormCompleted ref = 'completedForm' ship={this.state.ship}/>
        </div>
      );
    }else {
      return (
        <div style={this.s('form')}>
          <ShipForm ref='form' />
          <div style = {this.s('container')}>
            <span style = {this.s('uploadTitle')}>{this.t('nLabelUploadShipParticular')}</span>
            <DragDropFiles
              dropzoneStyle={this.style('dropzone')}
              ref='shipParticular'
              field='shipParticular'
              loadedFiles={[]}
              view={false}
              acceptVideo = {false}
              usage={'registerShip'}
            />
          </div>
        </div>
      )
    }
  },

  render() {
    let { showParticular } = this.state;
    return (
      <div style={this.s('root')}>
        {this.renderShipForm()}
        <div style = {this.s('btn')}>
          <RaisedButton
            label= {this.t('nTextCompleteParticular')}
            backgroundColor = {this.context.muiTheme.epColor.primaryColor}
            labelColor = {'#fff'}
            capitalized='capitalize'
            onTouchTap = {this.handleCompleteParticular}
            style={this.s('particular')}
          />
          <RaisedButton
            label= {this.t('nTextRegisterShip')}
            backgroundColor = {this.context.muiTheme.epColor.orangeColor}
            labelColor = {'#fff'}
            capitalized='capitalize'
            onTouchTap = {showParticular ? this.handleUpdate : this.handleRegister}
          />
        </div>
      </div>
    );
  },
});

module.exports = connect(
  (state, props) => {
    return {
      user: state.getIn(['session', 'user']),
    };
  }
)(ShipRegister);
