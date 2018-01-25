const React = require('react');
const AddButton = require('epui-md/svg-icons/content/add');
const AutoStyle = require('epui-auto-style').mixin;
const Checkbox = require('epui-md/Checkbox');
const DivButton = require('../components/div-button');
const DragDropFiles = require('../../drag-drop-files');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const DropDownCountries = require('~/src/shared/dropdown-countries');
const FlightList = require('../components/flight-list');
const InvitationLetterForm = require('../components/invitation-letter/invitation-letter-form');
const TicketServiceForm = require('../components/ticket-service/ticket-service-form');
const MenuItem = require('epui-md/MenuItem');
const PersonList = require('../components/person-list');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Translatable = require('epui-intl').mixin;
const TECHNICAL_SUPPORT_CODE = 'PTTSA';
const OPEN_FILES_PASSPORT = 'passports';
const OPEN_FILES_VISA = 'visa';
const OPEN_FILES_SEA_MAN_PAPER = 'seaManPapers';
const OPEN_FILES_INVITATION_LETTER = 'invitationLetters';
const MAX_INIT_PERSONS =50;

const OnSigner = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
    require(`epui-intl/dist/DropDownCountries/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    product: PropTypes.object,
    productConfigImmu: PropTypes.object,
    productConfig: PropTypes.object,
    seaManClasses: PropTypes.object,
    invitationLetterTypes: PropTypes.object,
    issuingAuthorities: PropTypes.object,
    nLabelSimpleConfig: PropTypes.string,
    nLabelDetailConfig: PropTypes.string,
    nTextInvitationLetter: PropTypes.string,
    nLabelUploadPassports: PropTypes.string,
    nLabelUploadSeaManPapers: PropTypes.string,
    nLabelUploadVisas: PropTypes.string,
    nLabelPersonName: PropTypes.string,
    nLabelSelectPerson: PropTypes.string,
    nLabelNeedInviLetter: PropTypes.string,
    nLabelSeaManPapers: PropTypes.string,
    nLabelVisas: PropTypes.string,
    nLabelPassports: PropTypes.string,
    nLabelFileTitle: PropTypes.string,
    nLabelUploadInvitationLetters: PropTypes.string,
    nLabelETickets: PropTypes.string,
    nLabelOnSignerPersonsCount: PropTypes.string,
    nLabelPersonUnit: PropTypes.string,
    nLabelFeedBackFiles: PropTypes.string,
    nTextInitPersonUnit: PropTypes.string,
  },

  getDefaultProps() {
    return {
      mode: '',
      order: null,
      productConfig: null,
      seaManClasses : null,
      invitationLetterTypes : null,
      issuingAuthorities: null,
    };
  },

  getInitialState: function() {
    let config = this._getConfig();
    return {
      simpleMode: false,
      fileOpened: OPEN_FILES_VISA,
      editPerson: null,
      flightsInfos: _.get(config, 'flightsInfos', []),
      persons: _.get(config, 'persons', []),
      personsRemoved: [],
      isInviLetterChoosen: _.get(config, 'isNeedInvitationLetter', false),
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
    let visasTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_VISA ? theme.primary1Color : 'initial',
    },fileTitle);
    let passportsTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_PASSPORT ? theme.primary1Color : 'initial',
    },fileTitle);
    let seaManPapersTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_SEA_MAN_PAPER ? theme.primary1Color : 'initial',
    },fileTitle);
    let invitationLettersTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_INVITATION_LETTER ? theme.primary1Color : 'initial',
    },fileTitle);

    let styles = {
      root:{
        paddingBottom :padding*5,
        margin: '0px -10px',
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
      fileHeader:{
        textAlign: 'left',
      },
      fileHeaderTitle:{
        display: 'inline-block',
        paddingLeft: padding*3,
        paddingRight: padding*3,
        marginRight: padding*5,
        marginBottom: padding*5,
        fontSize: 16,
      },
      visasTitle:visasTitle,
      passportsTitle:passportsTitle,
      seaManPapersTitle:seaManPapersTitle,
      invitationLettersTitle:invitationLettersTitle,
      visaUpload:{
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_VISA) ? 'block': 'none',
      },
      passportsUpload:{
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_PASSPORT) ? 'block': 'none',
      },
      seaManPapersUpload:{
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_SEA_MAN_PAPER) ? 'block': 'none',
      },
      invitationLettersUpload:{
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_INVITATION_LETTER) ? 'block': 'none',
      },
      uploader:{
        //margin: this.state.simpleMode ?'auto' : padding*5,
        padding: padding*7,
        textAlign: 'center',
        //border: this.state.simpleMode ? 'none' : '1px solid #E2E2E2',
      },
      person:{
        padding : padding*7,
        paddingTop : 0,
      },
      inviLetter:{
        padding: padding*7,
        //margin: this.state.simpleMode ? 0 :10,
      },
      needInviLetterTitle:{
        display:  'inline-block',
        verticalAlign: 'middle',
        fontSize: 15,
        cursor: 'pointer',
      },
      checkbox:{
        width: 24,
        padding: padding,
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      iconStyle:{
        fill : 'rgb(0, 89, 154)',
      },
      inviLetterForm:{
        marginTop: padding*3,
      },
      menu:{
        display: 'inline-block',
        width: 200,
        verticalAlign: 'bottom',
        textAlign: 'left',
      },
      underlineStyle:{
        bottom: '7px',
        marginTop: -15,
        marginLeft: 0,
      },
      labelStyle:{
        top: -8,
        paddingLeft: 0,
      },
      menuIconStyle:{
        top: 7,
      },
      flightsInfos:{
        display: this.state.simpleMode ? 'none': 'block',
        minHeight: padding*10,
        padding: padding*7,
      },
      addFlights:{
        color: theme.accent1Color,
        cursor: 'pointer',
        display: 'inline-block',
        marginBottom: 20,
      },
      addFlightsBtn:{
        fill: theme.accent1Color,
        verticalAlign: 'middle',
      },
      addFlightsLabel:{
        display: 'inline-block',
        verticalAlign: 'middle',
        padding: padding,
        fontSize: 14,
        fontWeight: 500,
      },
      addFlightsHintLabel: {
        display: 'inline-block',
        verticalAlign: 'middle',
        padding: padding,
        fontSize: 14,
        color: '#9b9b9b',
        marginLeft: 18,
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
        margin: '-40px auto 0px',
      },
      noteTitle: {
        fontSize: 15,
      },
      textFieldUnit:{
        marginBottom: 20,
        marginLeft: 5,
      },
      eTicket:{
        padding: 14,
      }
    };
    return styles;
  },

  childContextTypes: {
    hasCompanyName: React.PropTypes.bool
  },
  getChildContext: function() {
    return {hasCompanyName: true};
  },

  componentDidMount() {
    let config = this._getConfig();
    if (config && config.isNeedInvitationLetter) {
      this.refs.checkbox.setChecked(true);
    }
  },

  isNotReadyToSave(){
    return  (this.refs.ticketService && this.refs.ticketService.isDirty()) ||
            (this.refs.passportsFiles && this.refs.passportsFiles.isDirty()) ||
            (this.refs.visaFiles && this.refs.visaFiles.isDirty()) ||
            (this.refs.seaManPaperFiles && this.refs.seaManPaperFiles.isDirty()) ||
            (this.refs.invitationLettersFiles && this.refs.invitationLettersFiles.isDirty());
  },

  getDirtyFiles(){
    let dirtyFiles = [];
    if(this.refs.ticketService && this.refs.ticketService.isDirty()){
      dirtyFiles.push(this.t('nLabelETickets'));
    }
    if(this.refs.passportsFiles && this.refs.passportsFiles.isDirty()){
      dirtyFiles.push(this.t('nLabelPassports'));
    }
    if(this.refs.visaFiles && this.refs.visaFiles.isDirty()){
      dirtyFiles.push(this.t('nLabelVisas'));
    }
    if(this.refs.seaManPaperFiles && this.refs.seaManPaperFiles.isDirty()){
      dirtyFiles.push(this.t('nLabelSeaManPapers'));
    }
    if(this.refs.invitationLettersFiles && this.refs.invitationLettersFiles.isDirty()){
      dirtyFiles.push(this.t('nTextInvitationLetter'));
    }
    return dirtyFiles;
  },

  getValue(){
    return {
      eTicketsFiles:this.refs.eTickets.getFiles(),
      passportsFiles:this.refs.passportsFiles.getFiles(),
      visaFiles:this.refs.visaFiles.getFiles(),
      seaManPaperFiles: this.refs.seaManPaperFiles.getFiles(),
      invitationLettersFiles: this.refs.invitationLettersFiles.getFiles(),
      remark: this.refs.note.getValue(),
    };
  },

  getProductConfig(){
    let config = this.props.productConfig;
    if(config.eTicketsFiles && this.refs.eTickets){
      config.eTicketsFiles = this.refs.eTickets.getFiles();
    }
    if(config.passportsFiles && this.refs.passportsFiles){
      config.passportsFiles = this.refs.passportsFiles.getFiles();
    }
    if(config.visaFiles && this.refs.visaFiles){
      config.visaFiles = this.refs.visaFiles.getFiles();
    }
    if(config.seaManPaperFiles && this.refs.seaManPaperFiles){
      config.seaManPaperFiles = this.refs.seaManPaperFiles.getFiles();
    }
    if(config.invitationLettersFiles && this.refs.invitationLettersFiles){
      config.invitationLettersFiles = this.refs.invitationLettersFiles.getFiles();
    }
    if(config.persons){
      config.persons = this.state.persons;
    }
    if(config.flightsInfos && this.refs.flightsList){
      config.flightsInfos = this.refs.flightsList.getFlightsInfos();
    }
    config.isNeedInvitationLetter = this.state.isInviLetterChoosen;
    if(this.state.isInviLetterChoosen){
      let invitationLetter = this.refs.invitationLetter;
      config.invitationLetters = invitationLetter.getValue();
    }
    // config.isNeedIssueTicket = this.refs.eTickets.isNeedIssueTicket();
    // if(config.isNeedIssueTicket){
    let ticketService = this.refs.ticketService;
    config.ticketServices = ticketService.getValue();

    if(this.refs.note){
      let noteValue = this.refs.note.getValue();
      config.remark = noteValue;
    }

    return config;
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
            value={this.state.simpleMode ? 0 : 1}
            onChange={this._handleActionChange}
            defaultValue={0}
          >
            {menuItems}
          </DropDownMenu>
        </div>
      </div>
    );
  },

  renderPersonsInfos() {
    let dialogChild = null;
    let selectedIndex = 0;
    let editPerson = this.state.editPerson ? this.state.editPerson : null;
    const personCount = this.state.persons.length;
    const showAddPerson = personCount < MAX_INIT_PERSONS;
    if(this.props.seaManClasses) {
      let seaManClasses = [];
      let seaManClassesBySort=this.props.seaManClasses.sort(this._compare('index'));
      seaManClassesBySort.forEach((seaManClass,index) => {
        if(editPerson && editPerson.seaManClass === seaManClass.get('code')){
          selectedIndex = index;
        }
        seaManClasses.push(
          <MenuItem key={index} value={seaManClass.get('code')} primaryText={seaManClass.get('name')} />
        );
      });
      dialogChild = (
        <div style ={this.style('dialogChild')}>
          <DropDownMenu
            ref='seaManClass'
            key='seaManClass'
            style={this.style('menu')}
            underlineStyle ={this.style('underlineStyle')}
            labelStyle={this.style('labelStyle')}
            iconStyle={this.style('menuIconStyle')}
            defaultValue={seaManClassesBySort.get(selectedIndex).get('code')}
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
        />
      </div>
    );
  },

  renderInitPersons(){
    return (
      <TextFieldUnit
        ref = 'initPersons'
        key = 'initPersons'
        style= {this.style('textFieldUnit')}
        value= {this.state.persons.length > 0 ? this.state.persons.length : ''}
        floatingLabelText= {this.t('nLabelOnSignerPersonsCount')}
        unitLabelText={this.t('nTextInitPersonUnit')}
        onChange = {this._handleInitPersons}
      />
    );
  },

  renderInvitationLetter(){
    let invitationLetterElem =null;
    if(this.state.isInviLetterChoosen && this.props.invitationLetterTypes && this.props.issuingAuthorities){
      let invitationLetterTypes =[],issuingAuthorities=[];
      this.props.invitationLetterTypes.forEach(invitationLetterType=>{
        invitationLetterTypes.push({
          payload:invitationLetterType.get('code'),
          text: invitationLetterType.get('name')
        });
      });
      this.props.issuingAuthorities.forEach(issuingAuthority=>{
        issuingAuthorities.push({
          payload:issuingAuthority.get('code'),
          text: issuingAuthority.get('name')
        });
      });
      invitationLetterElem = (invitationLetterTypes && issuingAuthorities)?(
        <div style = {this.style('inviLetterForm')}>
          <InvitationLetterForm
            ref = 'invitationLetter'
            config = {this._getConfig().invitationLetters}
            persons={this.state.persons}
            invitationLetterTypes = {invitationLetterTypes}
            issuingAuthorities = {issuingAuthorities}
            personsRemoved={this.state.personsRemoved}
            nTextInvitationLetter = {this.props.nTextInvitationLetter}
            nLabelSelectPerson = {this.props.nLabelSelectPerson}
          />
        </div>
      ):null;
    }
    return(
      <div style = {this.style('inviLetter')}>
        <div style ={this.style('needInviLetter')}>
          <Checkbox
            ref = 'checkbox'
            iconStyle = {this.style('iconStyle')}
            style ={this.style('checkbox')}
            onCheck = {this._handleCheck}
            enableTransition = {true}
          />
          <span
            style = {this.style('needInviLetterTitle')}
            onClick = {this._hanldeInviLetterTitleClick}
          >
              {this.t('nLabelNeedInviLetter')}
          </span>
        </div>
        {invitationLetterElem}
      </div>
    );
  },

  renderETickets(){
    let theme = this.getTheme();
    let config =this._getConfig();
    let files =null;
    return (
      <div style = {this.style('eTicket')}>
        <TicketServiceForm
          ref = 'ticketService'
          config = {config.ticketServices}
          order={this.props.order}
          orderEntry={this.props.orderEntry}
          product={this.props.product}
          productConfig ={this.props.productConfigImmu}
          persons={this.state.persons}
          personsRemoved={this.state.personsRemoved}
        />
      </div>
    );
  },

  renderFiles(){
    let theme = this.getTheme();
    let config =this._getConfig();
    let fileContainer =[];
    let fileHeader =null;
    if(!this.state.simpleMode){
      fileHeader =[];
      fileHeader.push(
        <div style = {this.style('fileHeader')}>
          <span style = {this.style('fileHeaderTitle')}>
            {this.t('nLabelFileTitle')}
          </span>
          <DivButton
            style ={this.style('visasTitle')}
            onClick = {this._handleFilesTitleClick.bind(this,OPEN_FILES_VISA)}
            labelButton ={this.t('nLabelVisas')}
            hoverColor= {theme.primary1Color}
          />
          <DivButton
            style ={this.style('passportsTitle')}
            onClick = {this._handleFilesTitleClick.bind(this,OPEN_FILES_PASSPORT)}
            labelButton ={this.t('nLabelPassports')}
            hoverColor= {theme.primary1Color}
          />
          <DivButton
            style ={this.style('seaManPapersTitle')}
            onClick = {this._handleFilesTitleClick.bind(this,OPEN_FILES_SEA_MAN_PAPER)}
            labelButton ={this.t('nLabelSeaManPapers')}
            hoverColor= {theme.primary1Color}
          />
          <DivButton
            style ={this.style('invitationLettersTitle')}
            onClick = {this._handleFilesTitleClick.bind(this,OPEN_FILES_INVITATION_LETTER)}
            labelButton ={this.t('nTextInvitationLetter')}
            hoverColor= {theme.primary1Color}
          />
        </div>
      );
    }
    let files = [];
    if(config && config.visaFiles){
      files.push(<DragDropFiles
        key = 'visaFiles'
        ref = 'visaFiles'
        dropzoneStyle = {this.style('dropzone')}
        title = {this.t('nLabelUploadVisas')}
        style = {this.style('visaUpload')}
        loadedFiles={config.visaFiles}
        order ={this.props.order}
        orderEntry ={this.props.orderEntry}
        product = {this.props.product}
        productConfig = {this.props.productConfigImmu}
        field ='visaFiles'
      />);
    }
    if(config && config.passportsFiles){
      files.push(<DragDropFiles
        key = 'passportsFiles'
        ref = 'passportsFiles'
        dropzoneStyle = {this.style('dropzone')}
        title = {this.t('nLabelUploadPassports')}
        style = {this.style('passportsUpload')}
        loadedFiles={config.passportsFiles}
        order ={this.props.order}
        orderEntry ={this.props.orderEntry}
        product = {this.props.product}
        productConfig = {this.props.productConfigImmu}
        field ='passportsFiles'
      />);
    }
    if(config && config.seaManPaperFiles){
      files.push(<DragDropFiles
        key = 'seaManPaperFiles'
        ref = 'seaManPaperFiles'
        style = {this.style('seaManPapersUpload')}
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
    if(config && config.invitationLettersFiles){
      files.push(<DragDropFiles
        key = 'invitationLettersFiles'
        ref = 'invitationLettersFiles'
        style = {this.style('invitationLettersUpload')}
        dropzoneStyle = {this.style('dropzone')}
        title = {this.t('nLabelUploadInvitationLetters')}
        loadedFiles={config.invitationLettersFiles}
        order ={this.props.order}
        orderEntry ={this.props.orderEntry}
        product = {this.props.product}
        productConfig = {this.props.productConfigImmu}
        field ='invitationLettersFiles'
      />);
    }
    fileContainer.push(fileHeader);
    fileContainer.push(files);
    return(
      <div style = {this.style('uploader')}>
        {fileContainer}
      </div>
    );
  },

  renderFlightsInfos(){
    let personsToChoose =this._getPersonsToChoose();
    let addBtn = personsToChoose.length > 0 ? (
      <div>
        <div
          style = {this.style('addFlights')}
          onClick = {this._handleAddFlightInfo}
        >
          <AddButton
            style = {this.style('addFlightsBtn')}
          />
          <span style = {this.style('addFlightsLabel')}>
            {this.t('nTextFlightItinerary')}
          </span>
        </div>
        <span style = {this.style('addFlightsHintLabel')}>
          {this.t('nTextHintAddFlightItinerary')}
        </span>
      </div>
    ) : null;

    let flightList = (
      <FlightList
        ref = 'flightsList'
        personsToChoose ={personsToChoose}
        flightsInfos ={this.state.flightsInfos}
        onAddFlight = {this._handleAddFlight}
        onRemoveFlight={this._handleRemoveFlight}
        onRemoveFlightInfo={this._handleRemoveFlightInfo}
        onRemovePerson={this._handleFlightPersonsChange}
        onChoosePerson={this._handleFlightPersonsChange}
      />
    );
    let flightsInfos =(
      <div style = {this.style('flightsInfos')}>
        {flightList}
        {addBtn}
      </div>
    );
    return flightsInfos;
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
      <div style = {this.style('root')}>
        {this.renderPersonsInfos()}
        {this.renderInvitationLetter()}
        {this.renderETickets()}
        {this.renderFiles()}
        {this.renderFlightsInfos()}
        {this.renderNote()}
      </div>
    );
   },

   _filterDiffPersons(allPersons,partPersons){
     let diffPersons =[];
     _.forEach(allPersons,person=>{
       let include = false;
       _.forEach(partPersons,personPart=>{
         if(personPart.id === person.id) include =true;
       });
       if(!include){
         diffPersons.push(person);
       }
     });
     return diffPersons;
   },

   _getPersonsToChoose(){
     let allPersons = this.state.persons;
     let flightsInfos = this.state.flightsInfos;
     let personsChoosen = [];
     _.forEach(flightsInfos,flightInfo=>{
       _.forEach(flightInfo.persons,person=>{
         personsChoosen.push(person);
       });
     });
     return this._filterDiffPersons(allPersons,personsChoosen);
   },

  _getConfig(){
    return this.props.productConfig;
  },

  _handleAddPerson(showDialog){
      if(this.state.editPerson){
        this.setState({editPerson: null},()=>{showDialog()});
      }else{
        showDialog();
      }
  },

  _handleRemovePerson(id){
    let persons = this.state.persons;
    let flightsInfos = this.state.flightsInfos;
    let personsRemoved = [];
    personsRemoved = _.filter(persons,person=>{
      return person.id == id;
    });
    persons = _.reject(persons,person=>{
      return person.id == id;
    });
    // let personsToChoose = this._getPersonsToChoose();
    // let personsInInviLetters = this.state.personsInInviLetters;
    // _.remove(personsInInviLetters,person=>{
    //   return person.id ==id;
    // });
    // let personsInETickets = this.state.personsInETickets;
    // _.remove(personsInETickets,person=>{
    //   return person.id ==id;
    // });
    // this.refs.initPersons.setValue(persons.length ==0 ? '':persons.length);
    _.forEach(flightsInfos, flightInfo => {
      let personsChoosen = flightInfo.persons;
      _.remove(personsChoosen, ['id', id]);
    });

    this.setState({
      persons,
      personsRemoved,
      flightsInfos,
    });
  },

  _handleAddDialogSubmit(){
    let name = this.refs.personName.getValue();
    let country = this.refs.personCountry.getCountryValue();
    let seaManClass = this.refs.seaManClass.getValue();
    let persons = this.state.persons;
    if(this.state.editPerson){
      _.forEach(persons,(person)=>{
        if(person.id === this.state.editPerson.id){
          person.name=name;
          person.seaManClass = seaManClass;
          person.country = country ? country : person.country;
        }
      });
    }else{
      let person = {
        id: Math.random()*1001,
        name: name,
        seaManClass: seaManClass,
        country: country,
      };
      persons.push(person);
    }
    // this.refs.initPersons.setValue(persons.length);
    this.setState({persons:persons,editPerson:null});
  },


  _handleCheck(e, checked){
    this.setState({
      isInviLetterChoosen: checked
    });
  },

  _hanldeInviLetterTitleClick(){
    if(this.refs.checkbox){
      this.refs.checkbox.setChecked(!this.state.isInviLetterChoosen);
      this.setState({
        isInviLetterChoosen: !this.state.isInviLetterChoosen
      });
    }
  },

  _handleChange(){
    global.notifyOrderDetailsChange(true);
  },

  _handleModifyPerson(id,fn){
    this.setState({editPerson: id},()=>{fn();});
  },

  _handleFilesTitleClick(fileOpened){
    if(this.state.fileOpened !== fileOpened) this.setState({fileOpened: fileOpened});
  },

  _handleActionChange(event, index, value){
    let simpleMode = value === 0;
    if(this.state.simpleMode !== simpleMode){
      this.setState({
        simpleMode: simpleMode,
        fileOpened: simpleMode ? '' : OPEN_FILES_VISA,
      });
    }
  },

  _handleAddFlightInfo(){
   let flightInfo ={
      id: Math.random()*10001,
      persons:[],
      flights:[{
        id: Math.random()*10001,
        number: '',
        depaAirPort: '',
        arriAirPort: '',
        depaEstTime: '',
        arriEstTime: '',
      }],
    };
    let flightsInfos = this.state.flightsInfos;
    flightsInfos.push(flightInfo);
    this.setState({
      flightsInfos:flightsInfos,
    });
  },

  _handleRemoveFlight(flightInfoId,flightId){
    let flightsInfos = this.state.flightsInfos;
    _.map(flightsInfos,flightInfo=>{
      if(flightInfo.id ===flightInfoId){
        let flights= flightInfo.flights;
        _.remove(flights,flight=>{
          return flight.id == flightId;
        });
      }
      return flightInfo;
    });
    this.setState({
      flightsInfos: flightsInfos,
    });
  },

  _handleRemoveFlightInfo(flightInfoId){
    let flightsInfos = this.state.flightsInfos;
    _.remove(flightsInfos,flightInfo=>{
      return flightInfo.id ==flightInfoId;
    });
    this.setState({
      flightsInfos:flightsInfos
    });
  },

  _handleAddFlight(flightInfoId){
    let flightsInfos = this.state.flightsInfos;
    _.map(flightsInfos,flightInfo=>{
      if(flightInfo.id ===flightInfoId){
        flightInfo.flights.push({
          id: Math.random()*10001,
          number: '',
          depaAirPort: '',
          arriAirPort: '',
          depaEstTime: '',
          arriEstTime: '',
        });
      }
      return flightInfo;
    });
    this.setState({
      flightsInfos: flightsInfos,
    });
  },


  _handleFlightPersonsChange(flightInfoChanged){
    let flightsInfos = this.state.flightsInfos;
    _.forEach(flightsInfos,flightInfo=>{
      if(flightInfo.id === flightInfoChanged.id){
        flightInfo=flightInfoChanged;
      }
    });
    this.setState({
      flightsInfos:flightsInfos,
    });
  },

  _handleInitPersons(){
    global.notifyOrderDetailsChange(true);
    let personCount = parseInt(this.refs.initPersons.getValue());
    personCount = personCount >MAX_INIT_PERSONS ? MAX_INIT_PERSONS :personCount;
    let persons = this.state.persons;
    if(personCount){
      let personsInited = _.filter(persons,(person)=>{
        return person.name == undefined;
      });
      let diffPersonCount = personCount-persons.length;
      if(diffPersonCount>0){
        for(let i =0; i<diffPersonCount; i++){
          let person = {
            id: Math.random()*1001,
            name: undefined,
            seaManClass: null,
            country: '',
          };
          persons.push(person);
        }
      }else if(diffPersonCount<0){
        let restPresonCount = personsInited.length+diffPersonCount>0 ? personsInited.length+diffPersonCount: 0;
        persons = _.reject(persons,(person)=>{
          return person.name == undefined;
        });
        if(restPresonCount>0){
          for(let j =0; j<restPresonCount; j++){
            let person = {id: Math.random()*1001,};
            persons.push(person);
          }
        }
      }
    }
    else{
      persons = _.reject(persons,(person)=>{
        return person.name == undefined;
      });
    }
    this.setState({persons:persons});
  },

  _compare(property){
    return function (a,b) {
      var value1=a[property];
      var value2=b[property];
      return value1-value2;
    }
  },

});

module.exports = OnSigner;
