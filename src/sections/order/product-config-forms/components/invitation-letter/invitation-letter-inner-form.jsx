const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextField = require('epui-md/TextField/TextField');
const OrderEntryMixin = require('~/src/mixins/order-entry');
const InvitationLetter = require('./invitation-letter');
const PropTypes = React.PropTypes;

let InvitationLetterForm = React.createClass({

  mixins: [AutoStyle, Translatable, OrderEntryMixin],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    config: PropTypes.object,
    invitationLetterTypes: PropTypes.array,
    issuingAuthorities: PropTypes.array,
    nLabelDetailRequest: PropTypes.string,
    nLabelSelectPerson: PropTypes.string,
    nLabelpersonsContainerTitle: PropTypes.string,
    nTextAddPersonFirst: PropTypes.string,
    nTextInvitationLetter: PropTypes.string,
    persons: PropTypes.array,
    personsRemoved: PropTypes.array,
    letterId: PropTypes.number,
    deleteLetter: PropTypes.func,
  },

  getDefaultProps() {
    return {
      invitationLetterTypes: null,
      issuingAuthorities:  null,
    };
  },

  getInitialState() {
    let { config, persons } = this.props;
    return {
      persons: persons ? persons : [],
      personsInInviLetters: _.get(config, 'persons', []),
      personsToChoose: [],
    };
  },

  componentDidMount(){
    this._getPersonsToChoose();
  },

  componentWillUpdate(nextProps){
    if(nextProps.personsRemoved !== this.props.personsRemoved){
      let personsInInviLetters = this.state.personsInInviLetters;
      let newPersonsArr = [];
      _.forEach(nextProps.personsRemoved, person => {
          newPersonsArr = _.reject(personsInInviLetters, personsInInviLetter => {
          return personsInInviLetter.id == person.id;
        })
      })
      this.setState({personsInInviLetters:newPersonsArr});
      this._getPersonsToChoose();
    }
  },

  getValue(){
    let invitationLetter = this.refs.invitationLetter;

    return {
      oragnization:invitationLetter.refs.issuingAuthorities.getValue(),
      type:invitationLetter.refs.invitationLetterTypes.getValue(),
      persons:this.state.personsInInviLetters,
      visaExpiry:this.refs.invitationLetter.getValue('visaExpiry'),
      entriesNumber:this.refs.invitationLetter.getValue('entriesNumber'),
      longestStay:this.refs.invitationLetter.getValue('longestStay'),
      visaApplyPlace:this.refs.invitationLetter.getValue('visaApplyPlace'),
      entryDate:this.refs.invitationLetter.getValue('entryDate'),
    };
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

  renderInvitationLetter(){
    let {
      config,
      invitationLetterTypes,
      issuingAuthorities,
      nTextInvitationLetter,
      nLabelSelectPerson,
      letterId,
      deleteLetter,
    } = this.props;

    let personsToChoose = this._filterDiffPersons(this.props.persons,this.state.personsInInviLetters);
    return (
      <InvitationLetter
        ref = 'invitationLetter'
        config = {config && config}
        persons={this.state.personsInInviLetters}
        personsToChoose={personsToChoose}
        invitationLetterTypes = {invitationLetterTypes}
        issuingAuthorities = {issuingAuthorities}
        nTextInvitationLetter = {this.props.nTextInvitationLetter}
        nLabelSelectPerson = {this.props.nLabelSelectPerson}
        onRemovePerson = {this._handleRemovePersonFromInviLetter}
        onChoosePerson = {this._handleChoosePersonToInviLetter}
        letterId={letterId}
        deleteLetter={deleteLetter}
      />
    );
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style = {this.style('root')}>
        {this.renderInvitationLetter()}
      </div>
    );
   },

   _getPersonsToChoose(){
     let personsToChoose = this._filterDiffPersons(this.props.persons,this.state.personsInInviLetters);
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

   _handleRemovePersonFromInviLetter(id){
     let personsInInviLetters = this.state.personsInInviLetters;
     _.remove(personsInInviLetters,person=>{
       return person.id ==id;
     });
     this.setState({
       personsInInviLetters:personsInInviLetters
     });
   },

   _handleChoosePersonToInviLetter(personsChoosen){
     let personsInInviLetters = this.state.personsInInviLetters;
     _.forEach(personsChoosen,personChoosen=>{
       personsInInviLetters.push(personChoosen);
     });
     this.setState({
       personsInInviLetters:personsInInviLetters
     });
   },

  _handleChange(){
     global.notifyOrderDetailsChange(true);
  },

});

module.exports = InvitationLetterForm;
