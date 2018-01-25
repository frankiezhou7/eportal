const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const AddButton = require('epui-md/svg-icons/content/add');
const Checkbox = require('epui-md/Checkbox');
const DivButton = require('../components/div-button');
const DragDropFiles = require('../../drag-drop-files');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const TicketServiceForm = require('../components/ticket-service/ticket-service-form');
const FlightList = require('../components/flight-list');
const InvitationLetterForm = require('../components/invitation-letter/invitation-letter-form');
const MenuItem = require('epui-md/MenuItem');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const PersonList = require('../components/person-list');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;
const OPEN_FILES_E_TICKETS = 'eTickets';
const OPEN_FILES_PASSPORT = 'passports';
const TECHNICAL_SUPPORT_CODE = 'PTTSA';

const Form = React.createClass({
  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    invitationLetterTypes: PropTypes.object,
    issuingAuthorities: PropTypes.object,
    mode: PropTypes.string,
    nLabelArticleList: PropTypes.string,
    nLabelDetailConfig: PropTypes.string,
    nLabelETickets: PropTypes.string,
    nLabelNeedInviLetter: PropTypes.string,
    nLabelPassports: PropTypes.string,
    nLabelPersonName: PropTypes.string,
    nLabelSelectPerson: PropTypes.string,
    nLabelSimpleConfig: PropTypes.string,
    nLabelUploadInvitationLetters: PropTypes.string,
    nLabelUploadPassports: PropTypes.string,
    nTextAddFlights: PropTypes.string,
    nTextInvitationLetter: PropTypes.string,
    nTextInvitationLetter: PropTypes.string,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    seaManClasses: PropTypes.object,
    productConfigImmu: PropTypes.object,
    product: PropTypes.object,
  },

  getDefaultProps() {
    return {
      orderEntry: null,
      productConfig: null,
      seaManClasses: null,
      invitationLetterTypes: null,
      issuingAuthorities: null,
    };
  },

  getInitialState() {
    let config = this._getConfig();

    return {
      checked: config && config.isNeedInvitationLetter ? true : false,
      fileOpened: '',
      flightsInfos: config ? config.flightsInfos : [],
      personsRemoved: [],
      isInviLetterChoosen: config ? config.isNeedInvitationLetter : false,
      persons: config ? config.persons : [],
      simpleMode: false,
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
      color: this.state.fileOpened === OPEN_FILES_E_TICKETS ? theme.primary1Color : 'initial',
    }, fileTitle);
    let passportsTitle = _.merge({
      color: this.state.fileOpened === OPEN_FILES_PASSPORT ? theme.primary1Color : 'initial',
    }, fileTitle);

    let styles = {
      root: {
        paddingBottom: padding * 5,
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
        padding: padding * 7,
        textAlign: 'center',
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
      passportsUpload: {},
      person: {
        padding: padding * 7,
      },
      flightsInfos: {
        display: this.state.simpleMode ? 'none': 'block',
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
      inviLetter: {
        padding: padding * 7,
      },
      needInviLetterTitle: {
        display:  'inline-block',
        verticalAlign: 'middle',
        fontSize: 15,
        cursor: 'pointer',
      },
      checkbox: {
        width: 24,
        padding: padding,
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      iconStyle: {
        fill : 'rgb(0, 89, 154)',
      },
      inviLetterForm: {
        marginTop: padding * 3,
      },
      eTicket: {
        margin: '0px 14px',
      },
      noteContainer: {
        width: 830,
        margin: '0px auto',
      },
      noteTitle: {
        fontSize: 15,
      },
    };

    return styles;
  },

  isNotReadyToSave() {
    return  this.refs.ticketService.isDirty() ||
            this.refs.passportsFiles.isDirty() ||
            this.refs.invitationLettersFiles.isDirty();
  },

  getDirtyFiles() {
    let dirtyFiles = [];

    if(this.refs.ticketService.isDirty()) {
      dirtyFiles.push(this.t('nLabelETickets'));
    }
    if(this.refs.passportsFiles.isDirty()) {
      dirtyFiles.push(this.t('nLabelPassports'));
    }
    if(this.refs.invitationLettersFiles && this.refs.invitationLettersFiles.isDirty()) {
      dirtyFiles.push(this.t('nTextInvitationLetter'));
    }

    return dirtyFiles;
  },

  getValue() {
    return {
      ticketServices: this.refs.ticketService.getValue(),
      invitationLettersFiles: this.refs.invitationLettersFiles.getFiles(),
      invitationLetters: this.refs.invitationLetters.getValue(),
      passportsFiles: this.refs.passportsFiles.getFiles(),
    };
  },

  getProductConfig() {
    let persons = this.state.persons;
    let flightsInfos = this.refs.flightsList.getFlightsInfos();
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
            autoWidth={true}
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
    let dialogChild = (
      <TextField
        ref='personName'
        key='personName'
        defaultValue={this.state.editPerson ? this.state.editPerson.name : ''}
        floatingLabelText={this.t('nLabelPersonName')}
        style={this.style('personName')}
      />
    );

    return (
      <div style={this.style('person')}>
        <PersonList
          confirmedLabel={this.state.editPerson ? this.t('nTextEditPerson'):this.t('nLabelButton')}
          dialogChild={dialogChild}
          onAddPerson={this._handleAddPerson}
          onDialogSubmit={this._handleAddDialogSubmit}
          onPersonModify={this._handleModifyPerson}
          onRemove={this._handleRemovePerson}
          persons={this.state.persons}
          title={this.state.editPerson ? this.t('nTextEditPerson') :this.t('nTextAddPersonInfo')}
        />
      </div>
    );
  },

  renderInvitationLetter() {
    let invitationLetterElem = null;
    if (this.state.isInviLetterChoosen && this.props.invitationLetterTypes && this.props.issuingAuthorities) {
      let invitationLetterTypes = [],
        issuingAuthorities = [];
      this.props.invitationLetterTypes.forEach(invitationLetterType => {
        invitationLetterTypes.push({payload: invitationLetterType.get('code'), text: invitationLetterType.get('name')});
      });
      this.props.issuingAuthorities.forEach(issuingAuthority => {
        issuingAuthorities.push({payload: issuingAuthority.get('code'), text: issuingAuthority.get('name')});
      });
      invitationLetterElem = (invitationLetterTypes && issuingAuthorities) ? (
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
      ) : null;
    }

    return(
      <div style = {this.style('inviLetter')}>
        <div style ={this.style('needInviLetter')}>
          <Checkbox
            ref='checkbox'
            checked={this.state.checked}
            enableTransition={true}
            iconStyle={this.style('iconStyle')}
            onCheck={this._handleCheck}
            style={this.style('checkbox')}
          />
          <span
            style={this.style('needInviLetterTitle')}
            onClic={this._hanldeInviLetterTitleClick}
          >
            {this.t('nLabelNeedInviLetter')}
          </span>
        </div>
        {invitationLetterElem}
      </div>
    );
  },

  renderETickets() {
    let theme = this.getTheme();
    let config = this._getConfig();
    let files = null;
    let {
      order,
      orderEntry,
      productConfig,
      product
    } = this.props;

    return (
      <div style={this.style('eTicket')}>
        <TicketServiceForm
          ref='ticketService'
          config={config.ticketServices}
          order={order}
          orderEntry={orderEntry}
          product={orderEntry.product}
          productConfig={productConfig}
          persons={this.state.persons}
          personsRemoved={this.state.personsRemoved}
        />
      </div>
    );
  },

  renderPassport() {
    let theme = this.getTheme();
    let config = this._getConfig();
    let files = null;

    if(config && config.passportsFiles) {
      files = <DragDropFiles
        key='passportsFiles'
        ref='passportsFiles'
        dropzoneStyle={this.style('dropzone')}
        field='passportsFiles'
        loadedFiles={config.passportsFiles}
        order={this.props.order}
        orderEntry={this.props.orderEntry}
        product={this.props.orderEntry.product}
        productConfig={this.props.productConfig}
        style={this.style('passportsUpload')}
        title={this.t('nLabelUploadPassports')}
      />;
    }

    return <div style={this.style('uploader')}>{files}</div>;
  },

  renderInvitationLetterFiles() {
    let theme = this.getTheme();
    let config = this._getConfig();
    let files = null;
    if(config && config.invitationLettersFiles) {
      files = <DragDropFiles
        key='invitationLettersFiles'
        ref='invitationLettersFiles'
        dropzoneStyle={this.style('dropzone')}
        field='invitationLettersFiles'
        loadedFiles={config.invitationLettersFiles}
        order={this.props.order}
        orderEntry={this.props.orderEntry}
        product={this.props.orderEntry.product}
        productConfig={this.props.productConfig}
        style={this.style('invitationLettersUpload')}
        title={this.t('nLabelUploadInvitationLetters')}
      />;
    }

    return <div style={this.style('uploader')}>{files}</div>;
  },

  renderFlightsInfos() {
    let personsToChoose = this._getPersonsToChoose();
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
        ref='flightsList'
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
      <div style={this.style('root')}>
        {this.renderPersonsInfos()}
        {this.renderInvitationLetter()}
        {this.renderETickets()}
        {this.renderPassport()}
        {this.renderInvitationLetterFiles()}
        {this.renderFlightsInfos()}
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

  _getProductConfig() {
    let productConfig = this.props.productConfig.toJS();
    let products = _.map(productConfig.products, product => {
      let config = product.config;
      let productCode = product.product.code;
      if (TECHNICAL_SUPPORT_CODE === productCode) {
        if (config.eTicketsFiles && this.refs.eTickets) {
          config.eTicketsFiles = this.refs.eTickets.getFiles();
        }
        if (config.passportsFiles && this.refs.passportsFiles) {
          config.passportsFiles = this.refs.passportsFiles.getFiles();
        }
        if (config.invitationLettersFiles && this.refs.invitationLettersFiles) {
          config.invitationLettersFiles = this.refs.invitationLettersFiles.getFiles();
        }
        if (config.persons) {
          config.persons = this.state.persons;
        }
        if (config.flightsInfos && this.refs.flightsList) {
          config.flightsInfos = this.refs.flightsList.getFlightsInfos();
        }
        config.isNeedInvitationLetter = this.state.isInviLetterChoosen;
        if (this.state.isInviLetterChoosen) {
          let invitationLetter = this.refs.invitationLetter;
          config.invitationLetters = invitationLetter.getValue();
        }

        let ticketService = this.refs.ticketService;
        config.ticketServices = ticketService.getValue();

        if(this.note){
          let noteValue = this.note.getValue();
          config.remark = noteValue;
        }
      }
      return product;
    });
    productConfig.products = products;
    return productConfig;
  },

  _generateCalculateConfig(selectedSubProductConfigs) {
    let products = _.map(selectedSubProductConfigs, productConfig => {
      let product = productConfig.product;
      let costTypes = [];
      _.forEach(product.costTypes, costType => {
        let variables = {};
        costTypes.push({
          _id: costType.costType._id,
          code: costType.costType.code,
          variables: variables
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

  _handleActionChange(event, selectedIndex, value) {
    let simpleMode = value === 0;
    if (this.state.simpleMode !== simpleMode) {
      this.setState({
        simpleMode: simpleMode,
        fileOpened: simpleMode
          ? ''
          : OPEN_FILES_E_TICKETS
      });
    }
  },

  _getConfig() {
    let config = {};
    if (this.props.productConfig) {
      let productConfig = this.props.productConfig.toJS();
      _.forEach(productConfig.products, product => {
        if (product.product._id === this.props.orderEntry.product._id) {
          config = product.config;
        }
      });
    }

    return config;
  },

  _handleETicketsTitleClick() {
    if (this.state.fileOpened !== OPEN_FILES_E_TICKETS) {
      this.setState({
        fileOpened: OPEN_FILES_E_TICKETS,
      });
    }
  },

  _handlePassportsTitleClick() {
    if (this.state.fileOpened !== OPEN_FILES_PASSPORT) {
      this.setState({
        fileOpened: OPEN_FILES_PASSPORT,
      });
    }
  },

  _handleRemovePerson(id) {
    let persons = this.state.persons;
    let flightsInfos = this.state.flightsInfos;
    let personsRemoved = [];
    personsRemoved = _.filter(persons,person=>{
      return person.id == id;
    });

    persons = _.reject(persons, person => {
      return person.id == id;
    });

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

    this.setState({
      flightsInfos: flightsInfos,
    });
  },

  _handleAddDialogSubmit() {
    let name = this.refs.personName.getValue();
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

  _handleCheck(e, checked) {
    this.setState({
      checked: checked,
      isInviLetterChoosen: checked,
    });
  },

  _hanldeInviLetterTitleClick() {
    if (this.refs.checkbox) {
      this.refs.checkbox.setChecked(!this.state.isInviLetterChoosen);

      this.setState({
        isInviLetterChoosen: !this.state.isInviLetterChoosen
      });
    }
  },

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },
});

module.exports = Form;
