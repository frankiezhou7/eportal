const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Button = require('../button');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PersonItem = require('./person-item');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const TextField = require('epui-md/TextField/TextField');
const Translatable = require('epui-intl').mixin;

const PersonList = React.createClass({
  mixins: [AutoStyle, Translatable,PureRenderMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    style :PropTypes.object,
    persons: PropTypes.array,
    open: PropTypes.bool,
    onRemove: PropTypes.func,
    onPersonModify: PropTypes.func,
    onAddPerson: PropTypes.func,
    nTextAddPersonInfo : PropTypes.string,
    nTextCancel: PropTypes.string,
    nLabelPersonListTitle: PropTypes.string,
    iconHeight : PropTypes.number,
    dialogChild : PropTypes.element,
    onDialogSubmit: PropTypes.func,
    title :PropTypes.string,
    confirmedLabel : PropTypes.string,
    showAddPerson : PropTypes.bool,
    hasCompanyName: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      open: false,
      persons : [],
      iconHeight: 24,
    };
  },

  getInitialState(){
    return {
      editId: null,
      open: this.props.open,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let padding = 2;
    let iconLength = this.props.iconHeight;
    let personListStyle = {};
    if(this.props.style){
      _.merge(personListStyle,this.props.style);
    }
    return {
      personList :personListStyle,
      buttonContainer:{
        marginTop: padding*11,
        marginLeft: padding*6,
      },
      button:{
        padding: 7,
      },
      addIcon:{
        position: 'absolute',
        fill: theme.canvasColor,
        height: iconLength,
        width: iconLength,
      },
      buttonLabel:{
        textAlign: 'center',
        maxWidth: iconLength*3,
      },
      personInfosTitle:{
        fontSize: 16,
        fontWeight: 300,
        marginBottom: padding*5,
        display: 'block',
        paddingLeft: padding*3,
      }
    };
  },

  show() {
    this.setState({
      open: true,
    });
  },

  renderPersonListTitle(){
    return(
      <span style = {this.style('personInfosTitle')}>{this.t('nLabelPersonListTitle')}</span>
    );
  },

  renderPersonInfos(){
    let personElems = [];
    let persons = this.props.persons;
    _.forEach(persons,person=>{
      personElems.push(
        <PersonItem
          key = {person.id}
          person = {person}
          onRemove = {this._handleRemove}
          onPersonClick= {this._handleModifyPerson}
          hasCompanyName={this.props.hasCompanyName}
        />
      );
    });
    return personElems;
  },

  renderAddButton(show) {
    if(show === false) {
      return;
    }
    return(
      <Button
        style = {this.style('buttonContainer')}
        buttonStyle = {this.style('button')}
        onClick={this._handleAddPersonAction}
        nLabelButton={this.t('nTextAddPersonInfo')}
        iconHeight={37}
      />
    );
  },

  renderAddDialog() {
    let addActions = [
      <FlatButton
        key = 'cancel'
        label={this.t('nTextCancel')}
        secondary={true}
        onTouchTap={this._handleDialogCancel} />,
      <FlatButton
        key = 'submit'
        label={this.props.confirmedLabel}
        primary={true}
        onTouchTap={this._handleDialogSubmit} />
    ];
    return(
      <Dialog
        ref='addPersonDialog'
        actions={addActions}
        title={this.props.title}
        open={this.state.open}
        onRequestClose={this._handleRequestClose}>
          {this.props.dialogChild}
      </Dialog>
    );
  },


  render() {
    let styles = this.getStyles();
    const showAddButton = this.props.showAddPerson;
    return (
      <div style = {this.style('personList')}>
        {this.renderPersonListTitle()}
        {this.renderPersonInfos()}
        {this.renderAddButton(showAddButton)}
        {this.renderAddDialog()}
      </div>
    );
  },

  _handleRemove(id){
    if(this.props.onRemove){
      this.props.onRemove(id);
    }
  },

  _handleModifyPerson(person,fn){
    if(this.props.onPersonModify) this.props.onPersonModify(person, this.show);
  },

  _handleAddPersonAction(){
    if(this.props.onAddPerson) this.props.onAddPerson(this.show);
  },

 _handleDialogCancel(){
   this.setState({
     open: false,
   });
 },

 _handleDialogSubmit(){
   global.notifyOrderDetailsChange(true);
   if(this.props.onDialogSubmit){
     this.props.onDialogSubmit();
   }
   this.setState({
     open: false,
   });
 },

});
module.exports = PersonList;
