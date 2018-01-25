const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextField = require('epui-md/TextField/TextField');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const ETicket = require('./e-ticket');
const PropTypes = React.PropTypes;

let TicketServiceInnerForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    config: PropTypes.object,
    product :PropTypes.object,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    nLabelDetailRequest: PropTypes.string,
    nLabelSelectPerson: PropTypes.string,
    nLabelpersonsContainerTitle: PropTypes.string,
    nTextAddPersonFirst: PropTypes.string,
    persons: PropTypes.array,
    personsRemoved: PropTypes.array,
    ticketId: PropTypes.number,
    deleteTicket: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    let { config, persons } = this.props;
    return {
      persons: persons ? persons : [],
      personsInETickets: _.get(config, ['issueTicket','persons'], []),
      personsToChoose: [],
    };
  },

  componentDidMount(){
    this._getPersonsToChoose();
  },

  componentWillUpdate(nextProps){
    if(nextProps.personsRemoved !== this.props.personsRemoved){
      let personsInETickets = this.state.personsInETickets;
      let newPersonsArr = [];
      _.forEach(nextProps.personsRemoved, person => {
          newPersonsArr = _.reject(personsInETickets, personsInETicket => {
          return personsInETicket.id == person.id;
        })
      })
      this.setState({personsInETickets:newPersonsArr});
      this._getPersonsToChoose();
    }
  },

  getValue(){
    let eTicket = this.refs.eTicket;
    let issueTicket = {};
    if(this.isNeedIssueTicket()){
      issueTicket = Object.assign({},eTicket.getIssueTicketInfo(), {persons:this.state.personsInETickets});
    }
    return {
      eTicketsFiles: eTicket.getFiles(),
      issueTicket,
      isNeedIssueTicket: this.isNeedIssueTicket(),
    };
  },

  isDirty(){
    return this.refs.eTicket.isDirty();
  },

  isNeedIssueTicket() {
    return this.refs.eTicket.isNeedIssueTicket();
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =10;
    let theme = this.getTheme();
    let styles = {
      root:{
        marginBottom: 20,
      },
    };
    return styles;
  },

  renderETicket(){
    let {
      config,
      order,
      orderEntry,
      product,
      productConfig,
      ticketId,
      deleteTicket
    } = this.props;

    let personsToChoose = this._filterDiffPersons(this.props.persons,this.state.personsInETickets);
    return (
      <ETicket
        ref='eTicket'
        order={order}
        orderEntry={orderEntry}
        product={product}
        productConfig ={productConfig}
        config={config}
        persons={this.state.personsInETickets}
        personsToChoose={personsToChoose}
        onRemovePerson={this._handleRemovePersonFromETickets}
        onChoosePerson={this._handleChoosePersonToETickets}
        deleteTicket={deleteTicket}
        ticketId={ticketId}
      />
    );
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style = {this.style('root')}>
        {this.renderETicket()}
      </div>
    );
   },

   _getPersonsToChoose(){
     let personsToChoose = this._filterDiffPersons(this.props.persons,this.state.personsInETickets);
     this.setState({personsToChoose});
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

  _handleChange(){
     global.notifyOrderDetailsChange(true);
  },

});

module.exports = TicketServiceInnerForm;
