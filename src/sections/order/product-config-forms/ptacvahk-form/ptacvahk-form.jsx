const React = require('react');
const AddButton = require('epui-md/svg-icons/content/add');
const AutoStyle = require('epui-auto-style').mixin;
const DivButton = require('../components/div-button');
const DragDropFiles = require('../../drag-drop-files');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const ETicket = require('../components/ticket-service/e-ticket');
const FlightList = require('../components/flight-list');
const MenuItem = require('epui-md/MenuItem');
const TextField = require('epui-md/TextField/TextField');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PersonList = require('../components/person-list');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const APPLY_VISA_CODE = 'PTACVAHK';
const OPEN_FILES_E_TICKETS = 'eTickets';
const OPEN_FILES_INVITATION_LETTER = 'invitationLetters';
const OPEN_FILES_PASSPORT = 'passports';

const PTACVAHKConfigForm = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    mode: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    nLabelSimpleConfig: PropTypes.string,
    nLabelDetailConfig: PropTypes.string,
    nLabelUploadETickets: PropTypes.string,
    nLabelUploadPassports: PropTypes.string,
    nLabelUploadInvitationLetters: PropTypes.string,
    nLabelETickets: PropTypes.string,
    nLabelPassports: PropTypes.string,
    nTextInvitationLetter: PropTypes.string,
    nLabelFileTitle: PropTypes.string,
    nLabelPersonName: PropTypes.string,
    nTextAddFlights: PropTypes.string,
    nLabelFeedBackFiles: PropTypes.string
  },

  getDefaultProps() {
    return {
      orderEntry: null,
      productConfig: null,
    };
  },

  getInitialState() {
    let config = this._getConfig();

    return {
      fileOpened: OPEN_FILES_E_TICKETS,
      flightsInfos: config ? config.flightsInfos : [],
      persons: config ? config.persons : [],
      personsInETickets: _.get(config, ['issueTicket', 'persons'], []),
      personsToChoose: [],
      simpleMode: false,
      value: 0,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding = 2;
    let theme = this.getTheme();
    let fileTitle = {
      display: 'inline-block',
      paddingLeft: padding * 3,
      paddingRight: padding * 3,
      cursor: 'pointer',
    };
    let eTicketsTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_E_TICKETS
        ? theme.primary1Color
        : 'initial'
    }, fileTitle);
    let passportsTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_PASSPORT
        ? theme.primary1Color
        : 'initial'
    }, fileTitle);
    let invitationLettersTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_INVITATION_LETTER
        ? theme.primary1Color
        : 'initial'
    }, fileTitle);

    let styles = {
      root: {
        // marginLeft: padding*5,
        // paddingTop: padding*5,
        // paddingBottom: padding*5,
        // marginRight: padding*6,
      },
      dropzoneStyle: {
        height: 100,
      },
      header: {
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
        margin: this.state.simpleMode ?'auto' : padding * 5,
        padding: padding * 7,
      },
      fileHeader: {
        textAlign: 'left',
      },
      fileHeaderTitle: {
        display: 'inline-block',
        paddingLeft: padding * 3,
        paddingRight: padding * 3,
        marginRight: padding * 5,
        marginBottom: padding * 5,
        fontSize: 16,
      },
      eTicketsTitle: eTicketsTitle,
      passportsTitle: passportsTitle,
      invitationLettersTitle: invitationLettersTitle,
      eTicketsUpload: {
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_E_TICKETS) ? 'block': 'none',
      },
      passportsUpload: {
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_PASSPORT) ? 'block': 'none',
      },
      invitationLettersUpload: {
        display: (this.state.fileOpened === '' || this.state.fileOpened === OPEN_FILES_INVITATION_LETTER) ? 'block': 'none',
      },
      person: {
        padding : padding * 7,
        display: this.state.simpleMode ? 'none': 'block',
        margin: padding * 5,
      },
      flightsInfos: {
        display: this.state.simpleMode ? 'none': 'block',
        margin: padding * 5,
        minHeight: padding * 10,
        padding: padding * 7,
      },
      addFlights: {
        color: theme.accent1Color,
        cursor: 'pointer',
        display: 'inline-block',
      },
      addFlightsBtn: {
        fill: theme.accent1Color,
        verticalAlign: 'middle',
      },
      addFlightsLabel: {
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
      menu: {
        marginLeft: '15px',
        minWidth: '100px',
      },
      noteContainer: {
        width: 815,
        margin: '0px auto',
      },
      noteTitle: {
        fontSize: 16,
      },
    };

    return styles;
  },

  isNotReadyToSave() {
    return this.eTicketsFiles.isDirty() ||
      this.passportsFiles.isDirty();
  },

  getDirtyFiles() {
    let dirtyFiles = [];
    if (this.eTicketsFiles.isDirty()) {
      dirtyFiles.push(this.t('nLabelETickets'));
    }
    if (this.passportsFiles.isDirty()) {
      dirtyFiles.push(this.t('nLabelPassports'));
    }
    return dirtyFiles;
  },

  getValue() {
    return {
      eTicketsFiles: this.eTicketsFiles.getFiles(),
      passportsFiles: this.passportsFiles.getFiles(),
      remark: this.note.getValue(),
    };
  },

  getProductConfig() {
    let persons = this.state.persons;
    let flightsInfos = this.flightsList.getFlightsInfos();
    let productConfig = this._getProductConfig();
    let products = _.map(productConfig.products, product => {
      product.product = product.product._id;
      if (product.costTypes) {
        delete product.costTypes;
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  getCalculateConfig() {
    let productConfig = this._getProductConfig();
    let selectedSubProductConfigs = _.filter(productConfig.products, ['select', true]);

    return this._generateCalculateConfig(selectedSubProductConfigs);
  },

  renderHeader() {
    return(
      <div style={this.style('header')}>
        <div style={this.style('actions')}>
          <DropDownMenu
            ref='actions'
            key='actions'
            autoWidth={true}
            onChange={this._handleActionChange}
            style={this.style('menu')}
            value={this.state.value}
            defaultValue={0}
          >
            <MenuItem value={0} primaryText={this.t('nLabelSimpleConfig')} />
            <MenuItem value={1} primaryText={this.t('nLabelDetailConfig')} />
          </DropDownMenu>
        </div>
      </div>
    );
  },

  renderPersonsInfos() {
    let dialogChild = (
      <TextField
        ref={(ref) => this.personName = ref}
        key='personName'
        style={this.style('personName')}
        floatingLabelText={this.t('nLabelPersonName')}
        defaultValue = {this.state.editPerson ? this.state.editPerson.name : ''}
      />
    );

    return (
      <div style = {this.style('person')}>
        <PersonList
          title={this.state.editPerson ? this.t('nTextEditPerson') :this.t('nTextAddPersonInfo')}
          confirmedLabel={this.state.editPerson ? this.t('nTextEditPerson'):this.t('nLabelButton')}
          persons={this.state.persons}
          dialogChild={dialogChild}
          onRemove={this._handleRemovePerson}
          onPersonModify={this._handleModifyPerson}
          onAddPerson={this._handleAddPerson}
          onDialogSubmit={this._handleAddDialogSubmit}
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
            style ={this.style('eTicketsTitle')}
            onClick = {this._handleFilesTitleClick.bind(this,OPEN_FILES_E_TICKETS)}
            labelButton ={this.t('nLabelETickets')}
            hoverColor= {theme.primary1Color}
          />
          <DivButton
            style ={this.style('passportsTitle')}
            onClick = {this._handleFilesTitleClick.bind(this,OPEN_FILES_PASSPORT)}
            labelButton ={this.t('nLabelPassports')}
            hoverColor= {theme.primary1Color}
          />
        </div>
      );
    }
    let files = [];
    if(config && config['eTicketsFiles']){
      let personsToChoose = this._filterDiffPersons(this.state.persons,this.state.personsInETickets);
      let textFields = ['destiation'];
      files.push(
        <div style = {this.style('eTicketsUpload')}>
          <ETicket
            ref={(ref) => this.eTicketsFiles = ref}
            order={this.props.order}
            orderEntry={this.props.orderEntry}
            product={this.props.orderEntry.product}
            productConfig ={this.props.productConfig}
            config={config}
            persons={this.state.personsInETickets}
            personsToChoose={personsToChoose}
            onRemovePerson={this._handleRemovePersonFromETickets}
            onChoosePerson={this._handleChoosePersonToETickets}
            textFields={textFields}
          />
        </div>
      );
    }

    if(config && config['passportsFiles']){
      files.push(<DragDropFiles
        key='passportsFiles'
        ref={(ref) => this.passportsFiles = ref}
        dropzoneStyle={this.style('dropzone')}
        field='passportsFiles'
        loadedFiles={config['passportsFiles']}
        order={this.props.order}
        orderEntry={this.props.orderEntry}
        product={this.props.orderEntry.product}
        productConfig={this.props.productConfig}
        style={this.style('passportsUpload')}
        title={this.t('nLabelUploadPassports')}
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
        ref={(ref) => this.flightsList = ref}
        flightsInfos={this.state.flightsInfos}
        onAddFlight={this._handleAddFlight}
        onChoosePerson={this._handleFlightPersonsChange}
        onRemoveFlight={this._handleRemoveFlight}
        onRemoveFlightInfo={this._handleRemoveFlightInfo}
        onRemovePerson={this._handleFlightPersonsChange}
        personsToChoose={personsToChoose}
      />
    );
    let flightsInfos = (
      <div style={this.style('flightsInfos')}>
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
    let styles = this.getStyles();
    return (
      <div style = {this.style('root')}>
        {this.renderPersonsInfos()}
        {this.renderFiles()}
        {this.renderFlightsInfos()}
        {this.renderNote()}
      </div>
    );
   },

   _getPersonsToChoose(){
     let allPersons = this.state.persons;
     let flightsInfos = this.state.flightsInfos;
     let personsChoosen = [];
     let personsToChoose = [];
     _.forEach(flightsInfos,flightInfo=>{
       _.forEach(flightInfo.persons,person=>{
         personsChoosen.push(person);
       });
     });
     _.forEach(allPersons,person=>{
        let contains = false;
        _.forEach(personsChoosen,personChoosen=>{
          if(personChoosen.id ===person.id){
            contains=true;
          }
        });
        if(!contains){
          personsToChoose.push(person);
        }
     });
     return personsToChoose;
   },

  _getProductConfig(){
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products,product=>{
      let config = product.config;
      let productCode = product.product.code;
      if(APPLY_VISA_CODE===productCode){
        if(config['eTicketsFiles'] && this.eTicketsFiles){
          config['eTicketsFiles'] = this.eTicketsFiles.getFiles();
        }
        config.isNeedIssueTicket = this.eTicketsFiles.isNeedIssueTicket();
        if(config.isNeedIssueTicket){
          let eTicket = this.eTicketsFiles;
          config.issueTicket = config.issueTicket || {};
          config.issueTicket.destiation = eTicket.refs.destiation.getValue();
          config.issueTicket.persons = this.state.personsInETickets;
        }
        if(config['passportsFiles'] && this.passportsFiles){
          config['passportsFiles'] = this.passportsFiles.getFiles();
        }
        if(config.persons){
          config.persons = this.state.persons;
        }
        if(config.flightsInfos && this.flightsList){
          config.flightsInfos = this.flightsList.getFlightsInfos();
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

  _generateCalculateConfig(selectedSubProductConfigs){
    let products = _.map(selectedSubProductConfigs,productConfig=>{
      let product = productConfig.product;
      let costTypes = [];
      _.forEach(product.costTypes,costType=>{
        let variables = {};
        costTypes.push({
          _id: costType.costType._id,
          code: costType.costType.code,
          variables: variables,
        });
      });
      return {
        _id: product._id,
        code: product.code,
        name: product.name,
        costTypes: costTypes
      };
    });
    return products;
  },

  _handleActionChange(event, index, value) {
    let simpleMode = value === 0;
    if(this.state.simpleMode !== simpleMode){
      this.setState({
        simpleMode: simpleMode,
        fileOpened: simpleMode ? '' : OPEN_FILES_E_TICKETS,
        value: value,
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

  _handleFilesTitleClick(fileOpened){
    if(this.state.fileOpened !== fileOpened) this.setState({fileOpened: fileOpened});
  },

  _handleRemovePerson(id) {
    let persons = this.state.persons;
    let flightsInfos = this.state.flightsInfos;
    persons = _.reject(persons, ['id', id]);
    let personsToChoose = this._getPersonsToChoose();
    _.forEach(flightsInfos, flightInfo => {
      let personsChoosen = flightInfo.persons;
      _.remove(personsChoosen, ['id', id]);
    });

    this.setState({
      persons: persons,
      flightsInfos: flightsInfos,
    });
  },

  _handleAddFlight(flightInfoId) {
    let flightsInfos = this.state.flightsInfos;
    _.map(flightsInfos, flightInfo => {
      if (flightInfo.id === flightInfoId) {
        flightInfo.flights.push({
          id: Math.random() * 10001,
          number: '',
          depaAirPort: '',
          arriAirPort: '',
          depaEstTime: '',
          arriEstTime: ''
        });
      }
      return flightInfo;
    });

    this.setState({
      flightsInfos: flightsInfos,
    });
  },

  _handleRemoveFlight(flightInfoId, flightId) {
    let flightsInfos = this.state.flightsInfos;
    _.map(flightsInfos, flightInfo => {
      if (flightInfo.id === flightInfoId) {
        let flights = flightInfo.flights;
        _.remove(flights, ['id', flightId]);
      }
      return flightInfo;
    });

    this.setState({
      flightsInfos: flightsInfos,
    });
  },

  _handleRemoveFlightInfo(flightInfoId) {
    let flightsInfos = this.state.flightsInfos;
    _.remove(flightsInfos, ['id', flightInfoId]);

    this.setState({
      flightsInfos: flightsInfos,
    });
  },

  _handleAddFlightInfo() {
    let flightInfo = {
      id: Math.random() * 10001,
      persons: [],
      flights: [
        {
          id: Math.random() * 10001,
          number: '',
          depaAirPort: '',
          arriAirPort: '',
          depaEstTime: '',
          arriEstTime: ''
        }
      ]
    };
    let flightsInfos = this.state.flightsInfos;
    flightsInfos.push(flightInfo);
    this.setState({flightsInfos: flightsInfos});
  },

  _handleFlightPersonsChange(flightInfoChanged) {
    let flightsInfos = this.state.flightsInfos;
    _.forEach(flightsInfos, flightInfo => {
      if (flightInfo.id === flightInfoChanged.id) {
        flightInfo = flightInfoChanged;
      }
    });

    this.setState({
      flightsInfos: flightsInfos,
    });
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },

  _handleAddDialogSubmit() {
    let name = this.personName.getValue();
    let persons = this.state.persons;
    if (this.state.editPerson) {
      _.forEach(persons, (person) => {
        if (person.id === this.state.editPerson.id) {
          person.name = name;
        }
      });
    } else {
      let person = {
        id: Math.random() * 1001,
        name: name
      };
      persons.push(person);
    }
    this.setState({
      editPerson: null,
      persons: persons,
    });
  },

  _handleAddPerson(showDialog) {
    if (this.state.editPerson) {
      this.setState({
        editPerson: null
      }, () => {
        showDialog();
      });
    } else {
      showDialog();
    }
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

  _handleModifyPerson(id, fn) {
    this.setState({
      editPerson: id
    }, () => {
      fn();
    });
  },

  _handleRemovePersonFromETickets(id){
    let personsInETickets = this.state.personsInETickets;
    _.remove(personsInETickets,person=>{
      return person.id ==id;
    });
    this.setState({
      personsInETickets:personsInETickets
    });
  },

  _handleChoosePersonToETickets(personsChoosen){
    let personsInETickets = this.state.personsInETickets;
    _.forEach(personsChoosen,personChoosen=>{
      personsInETickets.push(personChoosen);
    });
    this.setState({
      personsInETickets:personsInETickets
    });
  },
});

module.exports = PTACVAHKConfigForm;
