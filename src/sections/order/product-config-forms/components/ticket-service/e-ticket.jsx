const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const ChoosePersons = require('../choose-persons');
const CloseButton = require('epui-md/svg-icons/navigation/close');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const DragDropFiles = require('../../../drag-drop-files');
const MenuItem = require('epui-md/MenuItem');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const Paper = require('epui-md/Paper');
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;

const ETicket = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    textFields: PropTypes.array,
    product :PropTypes.object,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    persons: PropTypes.array,
    personsToChoose: PropTypes.array,
    config :PropTypes.object,
    nLabelEticketPersonsContainerTitle: PropTypes.string,
    nLabelDestination: PropTypes.string,
    nLabelTimeDescription: PropTypes.string,
    nLabelHaveTicket: PropTypes.string,
    nLabelIssueTicket: PropTypes.string,
    nLabelUploadETickets: PropTypes.string,
    nTextEticketAddPersonFirst: PropTypes.string,
    onRemovePerson : PropTypes.func,
    onChoosePerson : PropTypes.func,
    ticketId: PropTypes.number,
    deleteTicket: PropTypes.func,
  },

  getDefaultProps() {
    return {
      config: null,
      persons:[],
      personsToChoose:[],
      textFields: ['orginal', 'destiation', 'sechdule'],
    };
  },

  getInitialState: function() {
    let { config } = this.props;
    return {
      hasTicket : !_.get(config, 'isNeedIssueTicket', 0),
      delete: false,
      show: true,
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
      title:{
        display: 'block',
        fontWeight: 500,
        fontSize: 13,
        marginBottom: padding*3,
      },
      underlineStyle:{
        marginTop: -15,
        marginLeft: 0,
      },
      labelStyle:{
        top: -10,
        paddingLeft: 0,
      },
      iconStyle:{
        top: 8,
      },
      personsContainer:{
        borderBottom: '2px solid #E3E3E3',
        padding: 10,
        backgroundColor: '#edf5fe',
        marginTop: -padding*3,
      },
      personsContainerTitle:{
        display: 'block',
        fontWeight: 500,
        fontSize: 13,
        marginTop: padding*3,
        marginLeft : padding*3,
      },
      choosePersonsWarning:{
        textAlign : 'center',
        padding: padding*10,
      },
      personsToChoose:{
        border: 'none',
        backgroundColor: '#edf5fe',
      },
      eTicketContainer:{
        display: this.state.show ? 'block' : 'none',
        padding: padding*7,
        position: 'relative',
      },
      menu:{
        marginBottom : padding*10,
        marginLeft: padding*3,
      },
      menuUnderlineStyle:{
        marginTop: -15,
        marginLeft: 0,
        bottom:14,
      },
      menuLabelStyle:{
        top: -10,
        paddingLeft: 0,
      },
      menuIconStyle:{
        top: 8,
      },
      chooseBtn:{

      },
      closeBtn:{
        position: 'absolute',
        top: 10,
        right: 10,
        fill:'#dcdcdc',
        cursor: 'pointer',
        width:'',
        height:'',
      },
      dropzoneStyle:{
        height: 100,
      },
      dropzoneTitleStyle:{
        marginLeft: padding*3,
      },
      eTicketsUpload:{
        marginTop : -25,
        textAlign: 'center',
      },
      eTicketInfo:{
        padding: 10,
        backgroundColor: '#edf5fe',
      },
      textField:{
        width: 247,
        margin: padding*3,
        marginBottom : padding*5,
      },
    };
    return styles;
  },

  getFiles() {
    if (this.refs.eTicketsFiles) {
      return this.refs.eTicketsFiles.getFiles();
    }
    return [];
  },

  getIssueTicketInfo(){
    return {
      orginal: this.refs.orginal.getValue(),
      destiation: this.refs.destiation.getValue(),
      sechdule: this.refs.sechdule.getValue(),
    }
  },

  isNeedIssueTicket() {
    return this.refs.eTicketsSwitch.getValue() === 1;
  },

  isDirty() {
    if (this.refs.eTicketsFiles) {
      return this.refs.eTicketsFiles.isDirty();
    }
    return false;
  },

  renderDeleteBtn() {
    if(this.props.ticketId > 0){
      return(
        <CloseButton
          width={30}
          style={this.style('closeBtn')}
          onClick={this._handleDeleteDialogOpen}
        />
      );
    }
  },

  renderDeleteDialog(){
    let addActions = [
      <FlatButton
        key = 'cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        onTouchTap={this._handleDialogCancel.bind(this,'delete')} />,
      <FlatButton
        key = 'submit'
        label={this.t('nTextRemove')}
        primary={true}
        onTouchTap={this._handleDeleteDialogSubmit} />
    ];
    return(
      <Dialog
        ref='shipmentDialog'
        actions={addActions}
        open={this.state.delete}
        title={this.t('nTextAlertTitle')}
      >
        {this.t('nTextDeleteInfoConfirm')}
      </Dialog>
    );
  },

  renderChooseBtn(){
    let config = this.props.config;
    let menuItems = [
      <MenuItem key={0} value={0} primaryText={this.t('nLabelHaveTicket')} />,
      <MenuItem key={1} value={1} primaryText={this.t('nLabelIssueTicket')} />,
    ];

    let chooseBtn = (
      <div style={this.style('chooseBtn')}>
        <DropDownMenu
          ref='eTicketsSwitch'
          key='eTicketsSwitch'
          style={this.style('menu')}
          underlineStyle={this.style('menuUnderlineStyle')}
          labelStyle={this.style('menuLabelStyle')}
          iconStyle={this.style('menuIconStyle')}
          value={this.state.hasTicket ? 0 : 1}
          onChange={this._handleeTicketsSwitched}
          defaultValue={0}
        >
          {menuItems}
        </DropDownMenu>
      </div>
    );

    return chooseBtn;
  },

  renderFile() {
    let config = this.props.config;
    let file = null;
    // if(config && config.eTicketsFiles) {
    file = (
      <DragDropFiles
        key='eTicketsFiles'
        ref='eTicketsFiles'
        dropzoneStyle={this.style('dropzone')}
        field='eTicketsFiles'
        loadedFiles={_.get(config, 'eTicketsFiles', [])}
        order={this.props.order}
        orderEntry={this.props.orderEntry}
        product={this.props.product}
        productConfig={this.props.productConfig}
        style={this.style('eTicketsUpload')}
        title={this.t('nLabelUploadETickets')}
        titleStyle={this.style('dropzoneTitleStyle')}
      />
    );
    // }
    return file;
  },

  renderPersonsList(){
    let personsListElem = (
      <ChoosePersons
        style = {this.style('personsToChoose')}
        onChoosePerson={this._handleChoosePerson}
        onRemovePerson={this._handleRemovePerson}
        personsChoosen={this.props.persons}
        personsToChoose={this.props.personsToChoose}
        showTitle={false}
      />
    );
    let choosePersonWarningElem = (
      <div style = {this.style('choosePersonsWarning')}>
        {this.t('nTextEticketAddPersonFirst')}
      </div>
    );
    let personList = (this.props.persons.length > 0 || this.props.personsToChoose.length > 0) ? personsListElem: choosePersonWarningElem;
    let personsContainer = (
      <Paper
        zDepth={1}
        key='personsContainer'
        style={this.style('personsContainer')}
      >
          <span style={this.style('personsContainerTitle')}>{this.t('nLabelEticketPersonsContainerTitle')}</span>
          {personList}
      </Paper>
    );

    return personsContainer;
  },

  renderETicketInfo() {
    let config = this.props.config;
    let textFields = {};
    let neededtextFields = this.props.textFields;
    textFields.orginal = (
      <TextField
        ref='orginal'
        key='orginal'
        defaultValue={(config && config.issueTicket) ? config.issueTicket.orginal : ''}
        floatingLabelText={this.t('nLabelOrginal')}
        onChange={this._handleChange}
        style={this.style('textField')}
      />
    );
    textFields.destiation = (
      <TextField
        ref='destiation'
        key='destiation'
        style={this.style('textField')}
        defaultValue={(config && config.issueTicket) ? config.issueTicket.destiation : ''}
        floatingLabelText={this.t('nLabelDestination')}
        onChange={this._handleChange}
      />
    );
    textFields.sechdule = (
      <TextField
        ref='sechdule'
        key='sechdule'
        defaultValue={(config && config.issueTicket) ? config.issueTicket.sechdule : ''}
        floatingLabelText={this.t('nLabelTimeDescription')}
        onChange={this._handleChange}
        style={this.style('textField')}
      />
    );
    let items = [];
    items = _.map(neededtextFields, value => textFields[value]);
    return(
      <Paper
        zDepth={1}
        key='eTicketInfo'
        style={this.style('eTicketInfo')}
      >
        {items}
      </Paper>
    );
  },

  render() {
    let file = this.renderFile();
    let personsContainer =[];
    personsContainer.push(this.renderPersonsList());
    personsContainer.push(this.renderETicketInfo());
    let content = this.state.hasTicket ? file : personsContainer;
    return (
      <Paper zDepth={1} style ={this.style('eTicketContainer')}>
        {this.renderChooseBtn()}
        {this.renderDeleteBtn()}
        {this.renderDeleteDialog()}
        {content}
      </Paper>
    );
  },

  _handleRemovePerson(id) {
    if (this.props.onRemovePerson) {
      this.props.onRemovePerson(id);
    }
  },

  _handleChoosePerson(personsChoosen) {
    if (this.props.onChoosePerson) {
      this.props.onChoosePerson(personsChoosen);
    }
  },

  _handleeTicketsSwitched(event, selectedIndex, value) {
    global.notifyOrderDetailsChange(true);
    let hasTicket = value === 0;
    if (this.state.hasTicket !== hasTicket) {
      this.setState({hasTicket: hasTicket});
    }
  },

  _handleDialogCancel(name) {
    this.setState({
      [name]: false,
    });
  },

  _handleDeleteDialogOpen() {
    this.setState({delete:true});
  },

  _handleDeleteDialogSubmit(){
    global.notifyOrderDetailsChange(true);
    let { ticketId, deleteTicket } = this.props;
    deleteTicket(ticketId);
    this.setState({
      delete: false,
      show: false,
    });
  },

   _handleChange() {
     global.notifyOrderDetailsChange(true);
   },
});
module.exports = ETicket;
