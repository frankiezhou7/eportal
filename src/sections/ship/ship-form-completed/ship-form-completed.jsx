const React = require('react');
const _ = require('eplodash');

const ShipBasicInfo = require('./ship-basic-info');
const ShipGeneralInfo = require('./ship-general-info');
const ShipBeam = require('./ship-beam');
const ShipDepth = require('./ship-depth');
const ShipHeight = require('./ship-height');
const ShipLOA = require('./ship-loa');
const ShipTonnage = require('./ship-tonnage');
const ShipDisplacement = require('./ship-displacement');
const ShipEngine = require('./ship-engine');
const ShipSpeed = require('./ship-speed');
const ShipContact = require('./ship-contact');
const ShipManagements = require('~/src/shared/ship-managements');
const LiftingWeight = require('~/src/shared/lifting-weight');
const LoadLineTable = require('~/src/shared/LoadlineTable');
const HoldTable = require('~/src/shared/HoldTable');

const RawTextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const RawTextField = require('epui-md/TextField/TextField');
const RaisedButton = require('epui-md/RaisedButton/RaisedButton');
const Validatable = require('epui-md/HOC/Validatable');

const Dialog = require('epui-md/ep/Dialog/Dialog');
const FlatButton = require('epui-md/FlatButton');
const DragDropFiles = require('~/src/shared/drag-drop-files');
const TextFieldShipName = require('~/src/shared/text-field-ship-name');
const TextFieldImo = require('~/src/shared/text-field-imo');

const ThemeManager = require('~/src/styles/theme-manager');
const BlueRawTheme = require('~/src/styles/raw-themes/blue-raw-theme');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const { ComposedForm, use } = require('epui-composer');

const TextFieldUnit = Validatable(RawTextFieldUnit);
const TextField = Validatable(RawTextField);
const PropTypes = React.PropTypes;

use(ShipBasicInfo);
use(ShipGeneralInfo);
use(ShipBeam);
use(ShipDepth);
use(ShipHeight);
use(ShipLOA);
use(ShipTonnage);
use(ShipDisplacement);
use(ShipEngine);
use(ShipSpeed);
use(ShipContact);
use(ShipManagements);
use(LiftingWeight);
use(TextField);
use(TextFieldUnit);
use(LoadLineTable);
use(HoldTable);
use(FlatButton);

const defs = [{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipBasicInfo',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#basicInfo',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    title: 'Management',
    style:{
      marginTop: 10,
      padding: 20,
    }
  },
  children: [
    {
      component: 'ShipManagements',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#managements',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
      width: '90%',
    }
  },
  children: [
    {
      component: 'ShipGeneralInfo',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#generalInfo',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipBeam',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#breadth',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipDepth',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#depth',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipHeight',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#height',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipLOA',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#length',
      },
    }
 ],
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipTonnage',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#tonnage',
      },
    }
 ],
},
{
  component: 'Section',
  name: '',
  props: {
    title: 'LoadLine',
    style:{
      marginTop: 20,
      padding: 20,
      width: '90%',
    }
  },
  children: [{
    component: 'LoadLineTable',
    props: {
      value:'#loadLines',
    },
  }]
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipDisplacement',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#displacement',
      },
    }
 ],
},
{
  component: 'Section',
  name: '',
  props: {
    title: 'Tons Per Centimeter Immersion',
    style:{
      marginTop: 20,
      padding: 20,
    }
  },
  children: [{
    component: 'TextFieldUnit',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
        width: '300px',
      },
      unitLabelText: 't/cm',
      floatingLabelText:'Tons Per Centimeter Immersion',
      defaultValue : '#tpc',
      validType:'number',
      checkOnBlur: 'true',
    },
  }]
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipEngine',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#engine',
      },
    }
 ],
},
{
  component: 'Section',
  name: '',
  props: {
    title: 'Propeller',
    style:{
      marginTop: 20,
      padding: 20,
    }
  },
  children: [{
    component: 'TextField',
    props: {
      style: {
        marginRight: '10px',
        float: 'left',
      },
      floatingLabelText:'Propeller Type',
      defaultValue:'#propeller'
    },
  }]
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipSpeed',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#speed',
      },
    }
 ],
},
{
  component: 'Section',
  props: {
    title: 'Holds',
    style:{
      marginTop: 20,
      padding: 20,
      width: '90%',
    }
  },
  children: [{
    component: 'HoldTable',
    props: {
      value : '#holds',
    },
  }]
},
{
  component: 'Section',
  name: '',
  props: {
    title: 'Crane',
    style:{
      marginTop: 20,
      padding: 20,
    }
  },
  children: [{
    component: 'LiftingWeight',
    props: {
      value: '#crane',
    },
  }]
},
{
  component: 'Section',
  props:{
    style:{
      marginTop: 20,
    }
  },
  children: [
    {
      component: 'ShipContact',
      props: {
        style: {
          marginRight: '10px',
          float: 'left',
        },
        value: '#contact',
      },
    }
 ],
},
];

const ShipFormCompleted = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    children: PropTypes.element,
    renderActions: PropTypes.func,
    ship: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  getDefaultProps(){
    return {
      ship:{}
    }
  },

  getInitialState() {
    let { ship: {
        shipParticular,
      }
    } = this.props;
    return {
      open: false,
      name: '',
      imo: '',
      files: shipParticular ? shipParticular : [],
      disabled: false,
    };
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getMuiTheme(BlueRawTheme),
    };
  },

  getStyles() {
    let { files } = this.state;
    let styles = {
      root: {
        width: '100%',
        maxWidth: global.contentWidth,
        margin: 'auto',
        position: 'relative',
      },
      hint: {
        color: '#0000f8',
        fontSize: 16,
        marginTop: 40,
        marginLeft: 40,
      },
      shipParticularHint:{
        width: 400,
        textAlign: files && files.length > 0 ? 'right' : 'left',
        marginRight: 10,
        color: '#f5a623',
      },
      label:{
        color: '#f5a623',
      },
      textContainer: {
        marginBottom: 90,
      },
      textFormContainer: {
        position: 'absolute',
        left: 40,
        top: 65,
      },
      formContainer: {
        marginTop: 85,
      },
      textfield:{
        marginRight: 20,
        float: 'left',
      },
      update: {
        display: 'flex',
        alignItems: 'center',
        marginLeft: 250,
      },
      dropzone: {
        textAlign: 'center',
      },
      errorText: {
        color: 'rgb(244, 67, 54)',
      }
    };
    return styles;
  },

  getValue(){
    let name = this.refs.name.getValue();
    let imo = this.refs.imo.getValue();
    return this.revertShipData(this.refs.form.getValue(), name, imo);
  },

  isValid(){
    return this.refs.form.isValid();
  },

  translateManagements(managements){
    let mngmnts = [];
    _.forEach(managements,management=>{
      if(_.isArray(management.organization)){
        _.forEach(management.organization,org=>{
          if(org){
            mngmnts.push({
              role: management.role,
              organization: {
                text: org.name,
                value: org._id
              }
            });
          }
        });
      }
    });
    return mngmnts;
  },

  getMethodValueByType(methods,type){
    let value = '';
    if(methods && methods.length>0){
      for(let i =0, len = methods.length; i<len; i++){
        if(methods[i].type===type){
          value =methods[i].value;
        }
      }
    }
    return value;
  },

  translateShipData(){
    let ship = this.props.ship || {};
    let { imo, name } = this.state;
    let basicInfo = _.pick(ship,'name','imo','type','size','status');
    let managements = this.translateManagements(ship.managements);
    let generalInfo = {
      officialNo: ship.officialNo,
      callNo: this.getMethodValueByType(ship.contactMethods,'CMCS'),
      mmSINo: this.getMethodValueByType(ship.contactMethods,'CMMM'),
      nationality: ship.nationality,
      portOfRegistry: {
        text: ship.portOfRegistry && ship.portOfRegistry.name,
        value: ship.portOfRegistry && ship.portOfRegistry._id
      },
      classNotation: ship.classNotation,
      piClub: ship.piClub
    };
    let contact = {
      satfb: this.getMethodValueByType(ship.contactMethods,'CMIPFB'),
      satc: this.getMethodValueByType(ship.contactMethods,'CMIPFC'),
      email: this.getMethodValueByType(ship.contactMethods,'CME')
    };
    let tonnage = {
      grtIctm69: ship.grt && ship.grt.ictm69,
      nrtIctm69: ship.nrt && ship.nrt.ictm69,
      grtSuez: ship.grt && ship.grt.suez,
      nrtSuez: ship.nrt && ship.nrt.suez
    };
    let engine = {
      mainEngineType: ship.mainEngine && ship.mainEngine.type,
      mainEnginePower: ship.mainEngine && ship.mainEngine.power,
      auxEngineType: ship.auxEngines && ship.auxEngines.type,
      auxEnginePower: ship.auxEngines && ship.auxEngines.power
    };

    if(imo) basicInfo.imo = imo;
    if(name) basicInfo.name = name;
    ship.basicInfo = basicInfo;
    ship.generalInfo = generalInfo;
    ship.engine = engine;
    ship.tonnage = tonnage;
    ship.managements = managements;
    ship.contact = contact;
    return ship;
  },

  revertManagements(managements){
    let mngmnts = [];
    _.forEach(managements,management=>{
        let exist = false;
        for(let i = 0, len = mngmnts.length ; i<len; i++){
          if(mngmnts[i].role === management.role ){
            exist =true;
            if(management.organization && management.organization.value){
              mngmnts[i].organization.push(
                {
                  _id: management.organization.value,
                  name: management.organization.text
                }
              );
            }
            break;
          }
        }
        if(!exist && management.organization && management.organization.value){
          mngmnts.push({
            role: management.role,
            organization: [{
              _id: management.organization.value,
              name: management.organization.text
            }]
          });
        }
    });
    return mngmnts;
  },

  addShipKeyValue(ship,key,value){
    if(value) ship[key]=value;
    return ship;
  },

  addContactMethod(ship,type,value){
    if(value){
      ship.contactMethods.push(
        {
          type: type,
          value: value
        }
      );
    }
    return ship;
  },

  revertShipData(data, name, imo){
    let ship = data;
    let basicInfo = ship.basicInfo;
    if(imo) basicInfo.imo = imo;
    if(name) basicInfo.name = name;

    let generalInfo = ship.generalInfo;
    let engine = ship.engine;
    let tonnage = ship.tonnage;
    let managements = ship.managements;
    let contact = ship.contact;
    ship.contactMethods = [];


    ship = this.addShipKeyValue(ship,'name',basicInfo.name);
    ship = this.addShipKeyValue(ship,'size',basicInfo.size);
    ship = this.addShipKeyValue(ship,'type',basicInfo.type);
    ship = this.addShipKeyValue(ship,'imo',basicInfo.imo);
    ship = this.addShipKeyValue(ship,'status',basicInfo.status);

    ship.managements = this.revertManagements(ship.managements);

    ship = this.addShipKeyValue(ship,'officialNo',generalInfo.officialNo);
    ship = this.addShipKeyValue(ship,'nationality',generalInfo.nationality);
    ship = this.addShipKeyValue(ship,'portOfRegistry',generalInfo.portOfRegistry && generalInfo.portOfRegistry.value);
    ship = this.addShipKeyValue(ship,'classNotation',generalInfo.classNotation);
    ship = this.addShipKeyValue(ship,'piClub',generalInfo.piClub);
    ship = this.addContactMethod(ship,'CMCS',generalInfo.callNo);
    ship = this.addContactMethod(ship,'CMMM',generalInfo.mmSINo);

    ship = this.addContactMethod(ship,'CMIPFB',contact.satfb);
    ship = this.addContactMethod(ship,'CMIPFC',contact.satc);
    ship = this.addContactMethod(ship,'CME',contact.email);

    ship.grt = {
      ictm69 : tonnage.grtIctm69 || 0,
      suez : tonnage.grtSuez || 0
    }
    ship.nrt = {
      ictm69 : tonnage.nrtIctm69 || 0,
      suez : tonnage.nrtSuez || 0
    }

    ship.mainEngine = {
      type : ship.engine && ship.engine.mainEngineType || '',
      power : ship.engine && ship.engine.mainEnginePower || 0
    }

    ship.auxEngines = {
      type :  ship.engine && ship.engine.auxEngineType || '',
      power :  ship.engine && ship.engine.auxEnginePower || 0
    }

    if(this.props.ship){
      ship.__v = this.props.ship.__v || 0;
    }

    ship.shipParticular = this.state.files;

    return ship;
  },

  renderUploadShipParticular(){
    let { open, files, disabled, name, imo } = this.state;

    let actions = [
      <FlatButton
        label= {this.t('nButtonCancel')}
        onTouchTap={this._handleCloseDialog}
      />,
      <FlatButton
        label= {this.t('nButtonSave')}
        labelStyle={this.style('label')}
        onTouchTap={this._handleUploadShipParticular}
        //disabled = {disabled}
      />
    ];

    return (
      <Dialog
        ref="dialog"
        title={this.t('nLabelUploadShipParticular')}
        actions={actions}
        maxWidth={850}
        modal={true}
        open={open}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={false}
        repositionOnUpdate={true}
      >
        <div style={this.style('textContainer')}>
          <TextFieldImo
            ref='shipImo'
            style={this.style('textfield')}
            value={imo}
          />
          <TextFieldShipName
            ref='shipName'
            style={this.style('textfield')}
            value={name}
          />
        </div>
        <DragDropFiles
          dropzoneStyle={this.style('dropzone')}
          ref='shipParticular'
          field='shipParticular'
          loadedFiles={files ? files : []}
          view={false}
          acceptVideo = {false}
          usage={'registerShip'}
        />
        <div style={this.style('errorText')}>
          {/*{disabled ? this.t('nTextRequireUpload') : ''}*/}
        </div>
      </Dialog>
    );
  },

  render() {
    let ship = this.translateShipData();
    let disabled = ship.basicInfo.imo ?  true : false ;
    let isUploaded = this.state.files.length > 0 ? true : false;
    return (
      <div style={this.style('root')}>
        <div style={this.style('update')}>
          <div style={this.style('shipParticularHint')}>
            {isUploaded ? this.t('nTextHintShipParticularUploaded') : this.t('nTextHintUploadShipParticular')}
          </div>
          <div style={this.style('button')}>
            <RaisedButton
              primary={true}
              backgroundColor={'#f5a623'}
              label={isUploaded ? this.t('nLabelReplaceShipParticular') : this.t('nLabelUploadShipParticular')}
              capitalized='none'
              onTouchTap={this._handleOpenDialog}
            />
          </div>
        </div>
        <div style={this.style('textFormContainer')}>
          <TextFieldImo
            ref='imo'
            style={this.style('textfield')}
            onChange={this._handleInputChange}
            value={ship.basicInfo.imo}
            disabled={disabled}
          />
          <TextFieldShipName
            ref='name'
            style={this.style('textfield')}
            onChange={this._handleInputChange}
            value={ship.basicInfo.name}
          />
        </div>
        <div style={this.style('formContainer')}>
          <ComposedForm
            ref="form"
            definitions={defs}
            value = {ship}
          />
        </div>
        {this.renderUploadShipParticular()}
      </div>
    );
  },

  _handleUploadShipParticular(){
    let name = this.refs.shipName && this.refs.shipName.getValue();
    let imo = this.refs.shipImo && this.refs.shipImo.getValue();
    let particular = this.refs.shipParticular;
    let files = particular.getFiles();
    if(particular.isDirty() || files.length === 0) {
      if(!particular.checkRemovedStatus()){
        alert(this.t('nTextRequireUpload'));
        return;
      }
    }
    if(name !== '' || imo !== '')
    this.setState({
      files,
      name,
      imo,
      open: false,
    });
  },

  _handleOpenDialog() {
    let name = this.refs.name && this.refs.name.getValue();
    let imo = this.refs.imo && this.refs.imo.getValue();
    this.setState({
      open: true,
      name,
      imo,
    });
  },

  _handleCloseDialog() {
    this.setState({
      open: false,
    });
  },
});

module.exports = ShipFormCompleted;
