const React = require('react');
const AddButton = require('epui-md/svg-icons/content/add');
const ArticleList = require('../components/article-list');
const AutoStyle = require('epui-auto-style').mixin;
const Dialog = require('epui-md/Dialog');
const DragDropFiles = require('../../drag-drop-files');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const FlatButton = require('epui-md/FlatButton');
const FloatingActionButton = require('epui-md/FloatingActionButton');
const TextField = require('epui-md/TextField/TextField');
const MenuItem = require('epui-md/MenuItem');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const VISIT_DOCTOR_CODE = 'PTCVD';

const PTCVDForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode: PropTypes.string,
    open: PropTypes.bool,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    subProducts: PropTypes.object,
    productConfig: PropTypes.object,
    nLabelSimpleConfig: PropTypes.string,
    nLabelDetailConfig: PropTypes.string,
    nLabelUploadVisitFiles: PropTypes.string,
    nLabelVisitFiles: PropTypes.string,
    nLabelPersonsInfos: PropTypes.string,
    nTextAddPersonsInfos: PropTypes.string,
    nLabelPersonName: PropTypes.string,
    nLabelPersonPhone: PropTypes.string,
    nLabelIllDescription: PropTypes.string,
    nTextCancel: PropTypes.string,
    nTextAdd: PropTypes.string,
    nLabelEdit: PropTypes.string,
    nTextAddPersonInfo: PropTypes.string,
    nTextEditPersonInfo: PropTypes.string,
  },

  getDefaultProps() {
    return {
      orderEntry: null,
      subProducts: null,
      productConfig: null,
    };
  },

  getInitialState() {
    let config = this._getConfig();
    let persons = config ? config.persons : [];
    return {
      editPerson: {},
      open: false,
      persons: persons,
      simpleMode: false,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    let styles = {
      root:{
        marginLeft: padding*5,
        paddingTop :padding*5,
        paddingBottom :padding*5,
        marginRight: padding*6,
      },
      dropzoneStyle:{
        height: 100,
      },
      header:{
        marginBottom: padding,
      },
      spanSubTitle:{
        fontWeight:300,
        fontSize: 12,
        display: 'block',
      },
      actions:{
        marginBottom: padding*5,
      },
      visitFiles:{
        padding: padding*7,
        textAlign: 'center',
      },
      addBtn:{
        width: 120,
        textAlign: 'center',
        margin: 'auto',
      },
      addBtnLabel:{
        marginLeft: padding*5,
        fontSize: 16,
        color: '#f5a623',
        verticalAlign: 'middle',
      },
      personsInfos:{
        padding :padding*7,
      },
      personChild:{
        width: '40%',
        display: 'inline-block',
        marginBottom: padding*5,
        marginRight : padding,
        wordBreak: 'break-word',
      },
      personChildTitle:{
        fontSize: 14,
        fontWeight: 500,
        marginRight: padding*5,
      },
      personChildDescription:{
        display: 'inline-block',
        wordBreak: 'break-word',
      },
      dialogPerson:{
        marginRight: padding*5,
        display: 'inline-block',
        width: '30%',
        verticalAlign: 'bottom',
      },
      dialogIllDescription:{
        marginRight: padding*5,
        display: 'inline-block',
        width: '100%',
        verticalAlign: 'middle',
      },
      personListTitle:{
        fontSize: 15,
        fontWeight: 300,
        display: 'block',
        marginBottom: padding*3,
      },
      noteContainer: {
        width: 818,
        margin: '0px auto',
      },
      noteTitle: {
        fontSize: 15,
      },
      button: {
        width: 18,
        height: 18,
        verticalAlign: 4,
        fill: '#fff',
      },
      circle: {
        width: 18,
        height: 18,
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '50%',
        backgroundColor: '#f5a623',
      }
    };
    return styles;
  },

  isNotReadyToSave(){
    return this.refs.visitFiles.isDirty();
  },

  getDirtyFiles(){
    let dirtyFiles =[];
    if(this.refs.visitFiles.isDirty()){
      dirtyFiles.push(this.t('nLabelVisitFiles'));
    }
    return dirtyFiles;
  },

  getProductConfig(){
    let productConfig = this._getProductConfig();
    let products = _.map(productConfig.products,product=>{
      product.product = product.product._id;
      if(product.costTypes){
        delete product.costTypes;
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  getCalculateConfig() {
    let productConfig = this._getProductConfig();
    let selectedSubProductConfigs = _.filter(productConfig.products, product => {
      return product.select == true;
    });

    return this._generateCalculateConfig(selectedSubProductConfigs);
  },

  renderHeader() {
    let menuItems = [
      <MenuItem key={0} value={0} primaryText={this.t('nLabelSimpleConfig')} />,
      <MenuItem key={1} value={1} primaryText={this.t('nLabelDetailConfig')} />,
    ];

    return(
      <div style={this.style('header')}>
        <div style={this.style('actions')}>
          <DropDownMenu
            ref='actions'
            key='actions'
            style={this.style('menu')}
            onChange={this._handleActionChange}
            value={this.state.simpleMode ? 0 : 1}
            defaultValue={0}
          >
            {menuItems}
          </DropDownMenu>
        </div>
      </div>
    );
  },

  renderVisitFiles(){
    let config = this._getConfig();
    let visitFiles =config ? config.visitFiles:[];
    return (
      <div style = {this.style('visitFiles')}>
        <DragDropFiles
          key = 'visitFiles'
          ref = 'visitFiles'
          dropzoneStyle = {this.style('dropzone')}
          title = {this.t('nLabelUploadVisitFiles')}
          loadedFiles={visitFiles}
          order ={this.props.order}
          orderEntry ={this.props.orderEntry}
          product = {this.props.orderEntry.product}
          productConfig = {this.props.productConfig}
          field ='visitFiles'
        />
      </div>
    );
  },

  renderAddBtn(){
    return(
      <div style = {this.style('addBtn')}>
        <FlatButton
          onTouchTap={this._handleAddTouch}
          backgroundColor={'rgba(0,0,0,0)'}
          >
          <span style={this.style('circle')}>
            <AddButton style={this.style('button')}/>
          </span>
          <span style = {this.style('addBtnLabel')}>{this.t('nTextAddPersonsInfos')}</span>
        </FlatButton>
      </div>
    );
  },

  renderPersonChild(person){
    return (
      <div>
        <div style = {this.style('personChild')}>
          <span style = {this.style('personChildTitle')}>{this.t('nLabelPersonName')+': '}</span>
          <span>{person.name}</span>
        </div>
        <div style = {this.style('personChild')}>
          <span style = {this.style('personChildTitle')}>{this.t('nLabelPersonPhone')+': '}</span>
          <span>{person.phone}</span>
        </div>
        <div >
          <span style = {this.style('personChildTitle')}>{this.t('nLabelIllDescription')+': '}</span>
          <div style = {this.style('personChildDescription')}>{person.illDescription}</div>
        </div>
      </div>
    );
  },

  renderPersonListTitle(){
    return (
      <span style ={this.style('personListTitle')}>
        {this.t('nLabelPersonsInfos')}
      </span>
    );
  },

  renderPersonList(){
    return(
      <ArticleList
        ref = 'personList'
        onEdit={this._handleEditPerson}
        onRemove={this._handleRemovePerson}
        articles = {this.state.persons}
        renderArticleChild = {this.renderPersonChild}
      />
    );
  },

  renderPersonsInfos() {
    if(this.state.simpleMode) return null;
    return (
      <div style={this.style('personsInfos')}>
        {this.renderPersonListTitle()}
        {this.renderPersonList()}
        {this.renderAddBtn()}
      </div>
    );
  },

  renderAddDialog(person) {
    let isAdd = true;
    let persons = this.state.persons;
    _.forEach(persons, p=>{
      if(p.id === person.id){
        isAdd =false;
      }
    });
    let name = person ? person.name : '';
    let phone = person ? person.phone : '';
    let illDescription = person ? person.illDescription : '';
    let addActions = [
      <FlatButton
        key = 'cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        onTouchTap={this._handlePersonDialogCancel} />,
      <FlatButton
        key = 'submit'
        label={isAdd ? this.t('nTextSave'): this.t('nLabelEdit')}
        primary={true}
        onTouchTap={this._handlePersonDialogSubmit} />
    ];
    return(
      <Dialog
        ref='personDialog'
        open={this.state.open}
        title={isAdd ? this.t('nTextAddPersonInfo') : this.t('nTextEditPersonInfo')}
        actions={addActions}
      >
        <TextField
          ref = 'personName'
          key= 'personName'
          style= {this.style('dialogPerson')}
          defaultValue={name}
          floatingLabelText={this.t('nLabelPersonName')}
        />
        <TextField
          ref = 'personPhone'
          key= 'personPhone'
          style= {this.style('dialogPerson')}
          defaultValue ={phone}
          floatingLabelText={this.t('nLabelPersonPhone')}
        />
        <TextField
          ref = 'personIllDescription'
          key= 'personIllDescription'
          style= {this.style('dialogIllDescription')}
          defaultValue = {illDescription}
          floatingLabelText={this.t('nLabelIllDescription')}
        />
      </Dialog>
    );
  },

  renderNote(){
    let config =this._getConfig();
    return(
      <div style={this.style('noteContainer')}>
        <TextField
          ref = {(ref) => this.note = ref}
          key = 'note'
          floatingLabelText={this.t('nLabelNote')}
          defaultValue = {config && config.remark}
          fullWidth = {true}
          onChange = {this._handleChange}
        />
      </div>
    );
  },

  render() {
    return (
      <div style={this.style('root')}>
        {this.renderVisitFiles()}
        {this.renderPersonsInfos()}
        {this.renderNote()}
        {this.renderAddDialog(this.state.editPerson)}
      </div>
    );
  },

  _getProductConfig() {
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product => {
      let productCode = product.product.code;
      if(VISIT_DOCTOR_CODE === productCode) {
        if(product.config.visitFiles && this.refs.visitFiles) {
          product.config.visitFiles = this.refs.visitFiles.getFiles();
        }
        if(product.config.persons){
          product.config.persons = this.state.persons;
        }
        if(this.note){
          let noteValue = this.note.getValue();
          product.config.remark = noteValue;
        }
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  _handleActionChange(event, index, value){
    let simpleMode = value === 0;
    if(this.state.simpleMode !== simpleMode){
      this.setState({
        simpleMode: simpleMode
      });
    }
  },

  _getConfig(){
    let config ={};
    if(this.props.productConfig){
      let productConfig = this.props.productConfig.toJS();
      _.forEach(productConfig.products,product=>{
        if(product.product._id === this.props.orderEntry.product._id){
          config =product.config;
        }
      });
    }
    return config;
  },

  _handleAddTouch(){
    let newPerson = {
      id: Math.random() * 10001,
    };

    this.setState({
      editPerson: newPerson,
      open: true,
    });
  },

  _handlePersonDialogCancel(){
    this.setState({
      open: false,
    });
  },

  _getPersonsFromDialog(){
    let editPerson = this.state.editPerson;
    if(this.refs.personName){
      editPerson.name = this.refs.personName.getValue();
    }
    if(this.refs.personPhone){
      editPerson.phone = this.refs.personPhone.getValue();
    }
    if(this.refs.personIllDescription){
      editPerson.illDescription = this.refs.personIllDescription.getValue();
    }
    return editPerson;
  },

  _handlePersonDialogSubmit(){
    global.notifyOrderDetailsChange(true);
    let editPerson =this._getPersonsFromDialog();
    let persons = this.state.persons;
    let isAdd = true;
    persons=_.map(persons,person=>{
      if(person.id === editPerson.id){
        isAdd=false;
        person=editPerson;
      }
      return person;
    });
    if(isAdd){
      persons.push(editPerson);
    }
    this.setState({
      persons: persons,
      editPersons: {},
      open: false,
    });
  },

  _handleEditPerson(id){
    let eidtPerson = null;
    let persons = this.state.persons;
    _.forEach(persons, person => {
      if(person.id ===id){
        eidtPerson=person;
      }
    });
    this.setState({
      editPerson: eidtPerson,
      open: true,
    });
  },

  _handleRemovePerson(id){
    let persons = this.state.persons;
    persons = _.reject(persons, ['id', id]);

    this.setState({
      persons:persons,
    });
  },

  _handleChange(){
    global.notifyOrderDetailsChange(true);
  },

});

module.exports = PTCVDForm;
