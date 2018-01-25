const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const ChoosePersons = require('../choose-persons');
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const MenuItem = require('epui-md/MenuItem');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const CloseButton = require('epui-md/svg-icons/navigation/close');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const TextField = require('epui-md/TextField/TextField');
// const TextFieldDateTime = require('epui-md/TextField/TextFieldDateTime');
const DatePicker = require('epui-md/DateAndTimePicker/DatePicker');
const Translatable = require('epui-intl').mixin;
const INVITATION_LETTER_TYPE_BUSINESS = 'BUSINESS';
const moment = require('moment');
const DATE_FORMAT = 'MM/DD/YYYY';

const InvitationLetter = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

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
    onChoosePerson: PropTypes.func,
    onRemovePerson: PropTypes.func,
    persons: PropTypes.array,
    personsToChoose: PropTypes.array,
    letterId: PropTypes.number,
    deleteLetter: PropTypes.func,
  },

  getDefaultProps() {
    return {
      config: null,
      persons: [],
      personsToChoose: [],
      invitationLetterTypes: [],
      issuingAuthorities: [],
    };
  },

  getInitialState: function() {
    return {
      delete: false,
      show: true,
      date: null,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getValue(name){
    switch(name){
      case 'visaExpiry':
        return this.refs.visaExpiry.getValue();
      break;
      case 'entriesNumber':
        return this.refs.entriesNumber.getValue();
      break;
      case 'longestStay':
        return this.refs.longestStay.getValue();
      break;
      case 'visaApplyPlace':
        return this.refs.visaApplyPlace.getValue();
      break;
      case 'entryDate':
        // return this.refs.entryDate.getUnparsedValue();
        return this.state.date;
      break;
    }
  },

  getStyles() {
    let padding =2;
    let theme = this.getTheme();
    let styles = {
      root:{
        padding: 15,
        backgroundColor: '#edf5fe',
      },
      wrapper: {
        display: this.state.show ? 'block' : 'none',
        position: 'relative',
      },
      title:{
        display: 'block',
        fontWeight: 500,
        fontSize: 16,
        marginBottom: padding*3,
      },
      menu:{
        width: '246px',
      },
      underlineStyle:{
        marginTop: -15,
        marginLeft: 0,
      },
      labelStyle:{
        paddingLeft: 0,
      },
      iconStyle:{
        top: 17,
        right: 17,
        fill: 'rgba(0, 0, 0, 0.870588)'
      },
      detailRequest:{
        width: '100%',
        marginTop: -padding*12,
      },
      textField:{
        marginTop: padding*6,
        width: 226,
      },
      personsContainer:{
        marginTop: padding*3,
      },
      personsContainerTitle:{
        display: 'block',
        fontWeight: 500,
        fontSize: 13,
        marginTop: padding*3,
      },
      choosePersonsWarning:{
        textAlign : 'center',
        padding: padding*10,
      },
      personsToChoose:{
        backgroundColor: 'transparent',
        border: 'none',
      },
      column:{
        display: 'inline-block',
      },
      columnLeft:{
        display: 'inline-block',
        marginRight: 22,
      },
      subTitle:{
        display: 'block',
        fontWeight: 500,
        fontSize: 13,
        marginBottom: -padding*5,
      },
      row:{
        marginTop: -20,
        marginBottom: 20,
      },
      visaMenu:{
        width: '246px',
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
    };
    return styles;
  },

  renderDeleteBtn() {
    if(this.props.letterId > 0){
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

  renderPersonsList(){
    let personsListElem = (
      <ChoosePersons
        style = {this.style('personsToChoose')}
        personsChoosen ={this.props.persons}
        personsToChoose={this.props.personsToChoose}
        onRemovePerson = {this._handleRemovePerson}
        onChoosePerson = {this._handleChoosePerson}
        showTitle = {false}
      />
    );
    let choosePersonWarningElem = (
      <div style = {this.style('choosePersonsWarning')}>
        {this.t('nTextAddPersonFirst')}
      </div>
    );
    let personList = (this.props.persons.length > 0 || this.props.personsToChoose.length > 0 ) ? personsListElem : choosePersonWarningElem;
    let personsContainer = (
      <div style ={this.style('personsContainer')}>
          <span style={this.style('personsContainerTitle')}>{this.t('nLabelpersonsContainerTitle')}</span>
          {personList}
      </div>
    );

    return personsContainer;
  },

  render() {
    let config = this.props.config ? this.props.config : {};
    let {
      invitationLetterTypes,
      issuingAuthorities,
    } = this.props;

    let inviLetterType = invitationLetterTypes[0] && invitationLetterTypes[0].payload;
    _.forEach(invitationLetterTypes, (type, index) => {
      if(type.payload === INVITATION_LETTER_TYPE_BUSINESS) {
        inviLetterType = type.payload;
      }
    });

    let issuAuth = issuingAuthorities[0] && issuingAuthorities[0].payload;
    _.forEach(issuingAuthorities, (type, index) => {
      if(type.payload === (config && config.oragnization)) {
        issuAuth = type.payload;
      }
    });

    let menuItemsAuth = [];
    menuItemsAuth = _.reduce(this.props.issuingAuthorities, (result, v, k) => {
      result.push(
        <MenuItem
          key={k}
          primaryText={v.text}
          value={v.payload}
        />
      );

      return result;
    }, []);

    let menuItemsType = [];
    menuItemsType = _.reduce(this.props.invitationLetterTypes, (result, v, k) => {
      result.push(
        <MenuItem
          key={k}
          primaryText={v.text}
          value={v.payload}
        />
      );

      return result;
    }, []);

    let menuItemsVisaExpiry = [
      <MenuItem key={0} value={0} primaryText={this.t('nLabelVisaExpiryOneMonth')} />,
      <MenuItem key={1} value={1} primaryText={this.t('nLabelVisaExpiryThreeMonths')} />,
      <MenuItem key={2} value={2} primaryText={this.t('nLabelVisaExpiryHalfYear')} />,
      <MenuItem key={3} value={3} primaryText={this.t('nLabelVisaExpiryOneYear')} />,
    ];

    let menuItemsEntriesNumber = [
      <MenuItem key={0} value={0} primaryText={this.t('nLabelSingleEntry')} />,
      <MenuItem key={2} value={2} primaryText={this.t('nLabelTwoEntries')} />,
      <MenuItem key={3} value={3} primaryText={this.t('nLabelMultipleEntries')} />,
    ];

    let menuItemsLongestStay = [
      <MenuItem key={0} value={0} primaryText={this.t('nLabelTenDaysStay')} />,
      <MenuItem key={1} value={1} primaryText={this.t('nLabelThirtyDaysStay')} />,
      <MenuItem key={2} value={2} primaryText={this.t('nLabelSixtyDaysStay')} />,
      <MenuItem key={3} value={3} primaryText={this.t('nLabelNinetyDaysStay')} />,
    ];

    return (
      <Paper zDepth={1} style={this.style('wrapper')}>
        <div style={this.style('root')}>
          <div>
            <span style={this.style('title')}>{this.t('nTextInvitationLetter')}</span>
            <DropDownMenu
              ref='issuingAuthorities'
              key='issuingAuthorities'
              iconStyle={this.style('iconStyle')}
              labelStyle={this.style('labelStyle')}
              maxHeight={200}
              style={this.style('menu')}
              underlineStyle={this.style('underlineStyle')}
              value={issuAuth}
              onChange={this._handleChange}
            >
              {menuItemsAuth}
            </DropDownMenu>
            <DropDownMenu
              ref='invitationLetterTypes'
              key='invitationLetterTypes'
              disabled={true}
              iconStyle={this.style('iconStyle')}
              labelStyle={this.style('labelStyle')}
              maxHeight={200}
              style={this.style('menu')}
              underlineStyle={this.style('underlineStyle')}
              value={inviLetterType}
              onChange={this._handleChange}
            >
              {menuItemsType}
            </DropDownMenu>
          </div>
          <div style={this.style('row')}>
            <div style={this.style('columnLeft')}>
              <TextField
                ref='visaApplyPlace'
                key='visaApplyPlace'
                style={this.style('textField')}
                defaultValue={config ? config.visaApplyPlace : ''}
                floatingLabelText={this.t('nLabelVisaApplyPlace')}
                onChange = {this._handleChange}
              />
            </div>
            <div style={this.style('column')}>
              {/* <TextFieldDateTime
                ref='entryDate'
                showYear={true}
                showTime={false}
                style={this.style('textField')}
                floatingLabelText={this.t('nLabelEntryDate')}
                hintText={this.t('nLabelHintText')}
                defaultValue={config ? config.entryDate : ''}
                onChange = {this._handleChange}
              /> */}
              <DatePicker
                ref='entryDate'
                mode={'portrait'}
                locale={'en-US'}
                container={'dialog'}
                floatingLabelText={this.t('nLabelEntryDate')}
                hintText={this.t('nLabelHintText')}
                onChange={this._handleDateChange}
                style={this.style('textField')}
                defaultDate={_.get(config, 'entryDate', '')}
              />
            </div>
          </div>
          <div>
            <div style={this.style('column')}>
              <span style={this.style('subTitle')}>{this.t('nTextDateOfExpiry')}</span>
              <DropDownMenu
                ref='visaExpiry'
                key='visaExpiry'
                iconStyle={this.style('iconStyle')}
                labelStyle={this.style('labelStyle')}
                maxHeight={200}
                style={this.style('visaMenu')}
                underlineStyle={this.style('underlineStyle')}
                defaultValue={_.get(config, 'visaExpiry', 0)}
                onChange={this._handleChange}
              >
                {menuItemsVisaExpiry}
              </DropDownMenu>
            </div>
            <div style={this.style('column')}>
              <span style={this.style('subTitle')}>{this.t('nTextNumberOfEnties')}</span>
              <DropDownMenu
                ref='entriesNumber'
                key='entriesNumber'
                iconStyle={this.style('iconStyle')}
                labelStyle={this.style('labelStyle')}
                maxHeight={200}
                style={this.style('visaMenu')}
                underlineStyle={this.style('underlineStyle')}
                defaultValue={_.get(config, 'entriesNumber', 0)}
                onChange={this._handleChange}
              >
                {menuItemsEntriesNumber}
              </DropDownMenu>
            </div>
            <div style={this.style('column')}>
              <span style={this.style('subTitle')}>{this.t('nTextLongetStay')}</span>
              <DropDownMenu
                ref='longestStay'
                key='longestStay'
                iconStyle={this.style('iconStyle')}
                labelStyle={this.style('labelStyle')}
                maxHeight={200}
                style={this.style('visaMenu')}
                underlineStyle={this.style('underlineStyle')}
                defaultValue={_.get(config, 'longestStay', 0)}
                onChange={this._handleChange}
              >
                {menuItemsLongestStay}
              </DropDownMenu>
            </div>
          </div>
          {/*<TextField
            ref='detailRequest'
            key='detailRequest'
            style={this.style('detailRequest')}
            defaultValue={config ? config.descriptoin : ''}
            floatingLabelText={this.t('nLabelDetailRequest')}
            onChange = {this._handleChange}
          />*/}
          {this.renderPersonsList()}
        </div>
        {this.renderDeleteBtn()}
        {this.renderDeleteDialog()}
      </Paper>
    );
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
     let { letterId, deleteLetter } = this.props;
     deleteLetter(letterId);
     this.setState({
       delete: false,
       show: false,
     });
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

  _handleChange() {
    global.notifyOrderDetailsChange(true);
  },

  _handleDateChange(oldDate,newDate) {
    global.notifyOrderDetailsChange(true);
    this.setState({date:newDate})
  },
});

module.exports = InvitationLetter;
