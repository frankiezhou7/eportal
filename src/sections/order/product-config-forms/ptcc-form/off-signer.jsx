const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const DragDropFiles = require('../../drag-drop-files');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const DropDownCountries = require('~/src/shared/dropdown-countries');
const MenuItem = require('epui-md/MenuItem');
const PersonList = require('../components/person-list');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField');
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Translatable = require('epui-intl').mixin;
const MAX_INIT_PERSONS = 50;

const OffSigner = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    require(`epui-intl/dist/DropDownCountries/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    mode: PropTypes.string,
    order:PropTypes.object,
    orderEntry :PropTypes.object,
    product:PropTypes.object,
    productConfigImmu : PropTypes.object,
    productConfig: PropTypes.object,
    seaManClasses : PropTypes.object,
    invitationLetterTypes: PropTypes.object,
    issuingAuthorities: PropTypes.object,
    nTextSavingProductConfig: PropTypes.string,
    nLabelUploadETickets: PropTypes.string,
    nLabelUploadPassports : PropTypes.string,
    nLabelUploadSeaManPapers : PropTypes.string,
    nLabelUploadVisas : PropTypes.string,
    nLabelUploadIdPhotos: PropTypes.string,
    nLabelIdPhotos: PropTypes.string,
    nLabelPersonName: PropTypes.string,
    nLabelETickets: PropTypes.string,
    nLabelPassports: PropTypes.string,
    nLabelVisas: PropTypes.string,
    nLabelSeaManPapers: PropTypes.string,
    nLabelOffSignerPersonsCount: PropTypes.string,
    nLabelPersonUnit: PropTypes.string,
    nTextInitPersonUnit: PropTypes.string,
  },

  getDefaultProps() {
    return {
      invitationLetterTypes: null,
      issuingAuthorities: null,
      mode: '',
      order: null,
      productConfig: null,
      seaManClasses: null,
    };
  },

  getInitialState() {
    let config = this._getConfig();
    return {
      editPerson: null,
      persons: config ? config.persons: [],
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    let fileTitle = {
      display: 'inline-block',
      paddingLeft: padding * 3,
      paddingRight: padding * 3,
      cursor: 'pointer',
    };
    let styles = {
      root:{
        paddingBottom :padding * 5,
        margin: '0px -10px',
      },
      dropzoneStyle: {
        height: 100,
      },
      header:{
        marginBottom: padding,
      },
      spanSubTitle: {
        fontWeight: 300,
        fontSize: 12,
        display: 'block',
      },
      actions: {
        marginBottom: padding * 5,
      },
      uploader: {
        padding: padding * 7,
        textAlign: 'center',
      },
      person: {
        padding: padding * 7,
        paddingTop : 0,
      },
      menu: {
        display: 'inline-block',
        width: 200,
        verticalAlign: 'bottom',
        textAlign: 'left',
      },
      underlineStyle: {
        bottom: '7px',
        marginTop: -15,
        marginLeft: 0,
      },
      labelStyle: {
        top: -10,
        paddingLeft: 0,
      },
      menuIconStyle: {
        top: 7,
      },
      personName: {
        marginLeft: '10px',
        width: 230,
      },
      countryName: {
        width: 220,
        float: 'right',
        left: -16,
        bottom: 0,
      },
      noteContainer: {
        width: 825,
        margin: '-20px auto 0px',
      },
      noteTitle: {
        fontSize: 15,
      },
      textFieldUnit:{
        marginBottom: 20,
        marginLeft: 5,
      }
    };

    return styles;
  },

  isNotReadyToSave() {
    return  (this.refs.eTicketsFiles && this.refs.eTicketsFiles.isDirty()) ||
            (this.refs.passportsFiles && this.refs.passportsFiles.isDirty()) ||
            (this.refs.visaFiles && this.refs.visaFiles.isDirty()) ||
            (this.refs.seaManPaperFiles && this.refs.seaManPaperFiles.isDirty()) ||
            (this.refs.idPhotos && this.refs.idPhotos.isDirty());
  },

  getDirtyFiles() {
    let dirtyFiles = [];
    if (this.refs.eTicketsFiles && this.refs.eTicketsFiles.isDirty()) {
      dirtyFiles.push(this.t('nLabelETickets'));
    }
    if (this.refs.passportsFiles && this.refs.passportsFiles.isDirty()) {
      dirtyFiles.push(this.t('nLabelPassports'));
    }
    if (this.refs.visaFiles && this.refs.visaFiles.isDirty()) {
      dirtyFiles.push(this.t('nLabelVisas'));
    }
    if (this.refs.seaManPaperFiles && this.refs.seaManPaperFiles.isDirty()) {
      dirtyFiles.push(this.t('nLabelSeaManPapers'));
    }
    if (this.refs.idPhotos && this.refs.idPhotos.isDirty()) {
      dirtyFiles.push(this.t('nLabelIdPhotos'));
    }
    return dirtyFiles;
  },

  getValue() {
    return {
      eTicketsFiles: this.refs.eTicketsFiles.getFiles(),
      idPhotos: this.refs.idPhotos.getFiles(),
      passportsFiles: this.refs.passportsFiles.getFiles(),
      seaManPaperFiles: this.refs.seaManPaperFiles.getFiles(),
      visaFiles: this.refs.visaFiles.getFiles(),
      remark: this.refs.note.getValue(),
    };
  },

  getProductConfig() {
    let config = this._getConfig();
    if (config.eTicketsFiles && this.refs.eTicketsFiles) {
      config.eTicketsFiles = this.refs.eTicketsFiles.getFiles();
    }
    if (config.passportsFiles && this.refs.passportsFiles) {
      config.passportsFiles = this.refs.passportsFiles.getFiles();
    }
    if (config.visaFiles && this.refs.visaFiles) {
      config.visaFiles = this.refs.visaFiles.getFiles();
    }
    if (config.seaManPaperFiles && this.refs.seaManPaperFiles) {
      config.seaManPaperFiles = this.refs.seaManPaperFiles.getFiles();
    }
    if (config.idPhotos && this.refs.idPhotos) {
      config.idPhotos = this.refs.idPhotos.getFiles();
    }
    if (config.persons) {
      config.persons = this.state.persons;
    }
    if(this.refs.note){
      let noteValue = this.refs.note.getValue();
      config.remark = noteValue;
    }

    return config;
  },

  renderInitPersons(){
    return (
      <TextFieldUnit
        ref = 'initPersons'
        key = 'initPersons'
        style= {this.style('textFieldUnit')}
        value= {this.state.persons.length > 0 ? this.state.persons.length : ''}
        floatingLabelText= {this.t('nLabelOffSignerPersonsCount')}
        unitLabelText={this.t('nTextInitPersonUnit')}
        onChange = {this._handleInitPersons}
      />
    );
  },

  renderPersonsInfos() {
    let dialogChild = null;
    const personCount = this.state.persons.length;
    const showAddPerson = personCount < MAX_INIT_PERSONS;
    if (this.props.seaManClasses) {
      let editPerson = this.state.editPerson ? this.state.editPerson :null;
      let seaManClasses = [];
      let seaManClassesBySort=this.props.seaManClasses.sort(this._compare('index'));
      let value = editPerson && editPerson.seaManClass ? editPerson.seaManClass :
                  this.props.seaManClasses.size > 0 ? seaManClassesBySort.get(0).get('code') : null;

      seaManClassesBySort.forEach((seaManClass,index) => {
        seaManClasses.push(
          <MenuItem
            key={index}
            value={seaManClass.get('code')}
            primaryText={seaManClass.get('name')}
          />
        );
      });

      dialogChild = (
        <div style={this.style('dialogChild')}>
          <DropDownMenu
            ref='seaManClass'
            key='seaManClass'
            defaultValue={value}
            style={this.style('menu')}
            underlineStyle={this.style('underlineStyle')}
          >
            {seaManClasses}
          </DropDownMenu>
          <TextField
            ref='personName'
            key='personName'
            defaultValue={editPerson ? editPerson.name : ''}
            floatingLabelText={this.t('nLabelPersonName')}
            style={this.style('personName')}
          />
          <DropDownCountries
            ref='personCountry'
            key='personCountry'
            value={editPerson ? editPerson.country : ''}
            floatingLabelText={this.t('nTextNationality')}
            style={this.style('countryName')}
          />
        </div>
      );
    }
    return (
      <div style = {this.style('person')}>
        {this.renderInitPersons()}
        <PersonList
          title={this.state.editPerson ? this.t('nTextEditPerson') :this.t('nTextAddPersonInfo')}
          confirmedLabel={this.state.editPerson ? this.t('nTextEditPerson'):this.t('nLabelButton')}
          persons={this.state.persons}
          dialogChild={dialogChild}
          onRemove={this._handleRemovePerson}
          onPersonModify={this._handleModifyPerson}
          onAddPerson={this._handleAddPerson}
          onDialogSubmit={this._handleAddDialogSubmit}
          showAddPerson={showAddPerson}
          hasCompanyName={true}
        />
      </div>
    );
  },

  renderETickets(){
    let theme = this.getTheme();
    let config =this._getConfig();
    let files = null;
    if(config && config.eTicketsFiles){
      files =(<DragDropFiles
        key='eTicketsFiles'
        ref='eTicketsFiles'
        dropzoneStyle={this.style('dropzone')}
        title={this.t('nLabelUploadETickets')}
        loadedFiles={config.eTicketsFiles}
        order={this.props.order}
        orderEntry={this.props.orderEntry}
        product={this.props.product}
        productConfig={this.props.productConfigImmu}
        field='eTicketsFiles'
      />);
    }
    return(
      <div style = {this.style('uploader')}>
        {files}
      </div>
    );
  },

  renderPassport(){
    let theme = this.getTheme();
    let config =this._getConfig();
    let files = null;
    if(config && config.passportsFiles){
      files =(<DragDropFiles
        key='passportsFiles'
        ref='passportsFiles'
        dropzoneStyle={this.style('dropzone')}
        title={this.t('nLabelUploadPassports')}
        loadedFiles={config.passportsFiles}
        order={this.props.order}
        orderEntry={this.props.orderEntry}
        product={this.props.product}
        productConfig={this.props.productConfigImmu}
        field='passportsFiles'
      />);
    }
    return(
      <div style = {this.style('uploader')}>
        {files}
      </div>
    );
  },

  renderSeaManPaper(){
    let theme = this.getTheme();
    let config =this._getConfig();
    let files = null;
    if(config && config.seaManPaperFiles){
      files =(<DragDropFiles
        key = 'seaManPaperFiles'
        ref = 'seaManPaperFiles'
        dropzoneStyle = {this.style('dropzone')}
        title = {this.t('nLabelUploadSeaManPapers')}
        loadedFiles={config.seaManPaperFiles}
        order ={this.props.order}
        orderEntry ={this.props.orderEntry}
        product = {this.props.product}
        productConfig = {this.props.productConfigImmu}
        field ='seaManPaperFiles'
      />);
    }
    return(
      <div style = {this.style('uploader')}>
        {files}
      </div>
    );
  },

  renderVisa(){
    let theme = this.getTheme();
    let config =this._getConfig();
    let files = null;
    if(config && config.visaFiles){
      files =(<DragDropFiles
        key = 'visaFiles'
        ref = 'visaFiles'
        dropzoneStyle = {this.style('dropzone')}
        title = {this.t('nLabelUploadVisas')}
        loadedFiles={config.visaFiles}
        order ={this.props.order}
        orderEntry ={this.props.orderEntry}
        product = {this.props.product}
        productConfig = {this.props.productConfigImmu}
        field ='visaFiles'
      />);
    }
    return(
      <div style = {this.style('uploader')}>
        {files}
      </div>
    );
  },

  renderIdPhoto() {
    let theme = this.getTheme();
    let config = this._getConfig();
    let files = null;
    if (config && config.visaFiles) {
      files = (
        <DragDropFiles
          key='idPhotos'
          ref='idPhotos'
          dropzoneStyle={this.style('dropzone')}
          field='idPhotos'
          loadedFiles={config.idPhotos}
          order={this.props.order}
          orderEntry={this.props.orderEntry}
          product={this.props.product}
          productConfig={this.props.productConfigImmu}
          title={this.t('nLabelUploadIdPhotos')}
        />
      );
    }

    return (
      <div style={this.style('uploader')}>
        {files}
      </div>
    );
  },

  renderNote(){
    let config =this._getConfig();
    return(
      <div style={this.style('noteContainer')}>
        <TextField
          ref = 'note'
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
    let styles = this.getStyles();

    return (
      <div style={this.style('root')}>
        {this.renderPersonsInfos()}
        {this.renderETickets()}
        {this.renderVisa()}
        {this.renderPassport()}
        {this.renderSeaManPaper()}
        {this.renderIdPhoto()}
        {this.renderNote()}
      </div>
    );
   },

  _filterDiffPersons(allPersons, partPersons) {
    let diffPersons = [];
    _.forEach(allPersons, person => {
      let include = false;
      _.forEach(partPersons, personPart => {
        if (personPart.id === person.id)
          include = true;
        }
      );
      if (!include) {
        diffPersons.push(person);
      }
    });

    return diffPersons;
  },

  _getPersonsToChoose() {
    let allPersons = this.state.persons;
    let flightsInfos = this.state.flightsInfos;
    let personsChoosen = [];
    _.forEach(flightsInfos, flightInfo => {
      _.forEach(flightInfo.persons, person => {
        personsChoosen.push(person);
      });
    });
    return this._filterDiffPersons(allPersons, personsChoosen);
  },

_getConfig() {
  return this.props.productConfig;
},

  _handleRemovePerson(id) {
    let persons = this.state.persons;
    persons = _.reject(persons, (person) => {
      return person.id == id;
    });
    let personsToChoose = this._getPersonsToChoose();
    let personsInInviLetters = this.state.personsInInviLetters;
    _.remove(personsInInviLetters, person => {
      return person.id == id;
    });
    let personsInETickets = this.state.personsInETickets;
    _.remove(personsInETickets, person => {
      return person.id == id;
    });

    this.setState({
      persons: persons,
      personsInInviLetters: personsInInviLetters,
      personsInETickets: personsInETickets,
    });
  },

  _handleAddDialogSubmit() {
    let name = this.refs.personName.getValue();
    let country = this.refs.personCountry.getCountryValue();
    let seaManClass = this.refs.seaManClass.getValue();
    let persons = this.state.persons;
    if (this.state.editPerson) {
      _.forEach(persons, (person) => {
        if (person.id === this.state.editPerson.id) {
          person.name = name;
          person.seaManClass = seaManClass;
          person.country = country ? country : person.country;
        }
      });
    } else {
      let person = {
        id: Math.random() * 1001,
        name: name,
        seaManClass: seaManClass,
        country: country,
      };
      persons.push(person);
    }

    this.setState({
      persons: persons,
      editPerson: null,
    });
  },

  _handleAddPerson(showDialog) {
    if (this.state.editPerson) {
      this.setState({
        editPerson: null
      }, () => {
        showDialog()
      });
    } else {
      showDialog();
    }
  },

  _handleModifyPerson(id, fn) {
    this.setState({
      editPerson: id
    }, () => {
      fn();
    });
  },

  _handleInitPersons() {
    global.notifyOrderDetailsChange(true);
    let personCount = parseInt(this.refs.initPersons.getValue());
    personCount = personCount > MAX_INIT_PERSONS
      ? MAX_INIT_PERSONS
      : personCount;
    let persons = this.state.persons;
    if (personCount) {
      let personsInited = _.filter(persons, (person) => {
        return person.name == undefined;
      });
      let diffPersonCount = personCount - persons.length;
      if (diffPersonCount > 0) {
        for (let i = 0; i < diffPersonCount; i++) {
          let person = {
            id: Math.random() * 1001,
            name: undefined,
            seaManClass: null,
            country: '',
          };
          persons.push(person);
        }
      } else if(diffPersonCount < 0) {
        let restPresonCount = personsInited.length + diffPersonCount > 0
          ? personsInited.length + diffPersonCount
          : 0;
        persons = _.reject(persons, (person) => {
          return person.name == undefined;
        });
        if (restPresonCount > 0) {
          for (let j = 0; j < restPresonCount; j++) {
            let person = {
              id: Math.random() * 1001
            };
            persons.push(person);
          }
        }
      }
    }else {
      persons = _.reject(persons,(person)=>{
        return person.name == undefined;
      });
    }

    this.setState({
      persons: persons,
    });
  },

  _compare(property){
    return function (a,b) {
      var value1=a[property];
      var value2=b[property];
      return value1-value2;
    }
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },
});

module.exports = OffSigner;
