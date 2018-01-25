const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const Checkbox = require('epui-md/Checkbox');
const TextField = require('epui-md/TextField/TextField');
const PropTypes = React.PropTypes;

let CompanyForm = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    notifyChanged :  PropTypes.bool,
    showTitle : PropTypes.bool,
    companyInfos: PropTypes.object,
    syncCompanyInfos:PropTypes.object,
    style: PropTypes.object,
    title : PropTypes.string,
    hasChecked : PropTypes.bool,
    nLabelCompanyName:PropTypes.string,
    nLabelCompanyAddress:PropTypes.string,
    nLabelCompanyPhone:PropTypes.string,
    nLabelPersonName:PropTypes.string,
    nLabelPersonPhone:PropTypes.string,
    nLabelPersonEmail:PropTypes.string,
    showSync:PropTypes.bool,
    onSaveChecked: PropTypes.func,
  },

  getDefaultProps() {
    return {
      companyInfos: {},
      showTitle:true,
      notifyChanged: true,
      showSync: false,
      changed: false,
    };
  },

  getInitialState() {
    let { hasChecked } = this.props;
    let companyInfos = this.props.companyInfos ? this.props.companyInfos : {};
    let syncCompanyInfos = this.props.syncCompanyInfos ? this.props.syncCompanyInfos : {};
    let checked = hasChecked === undefined ? false : hasChecked;

    return {
      companyName: checked ? syncCompanyInfos.companyName : companyInfos.companyName,
      companyAddress: checked ? syncCompanyInfos.companyAddress : companyInfos.companyAddress,
      companyPhone: checked ? syncCompanyInfos.companyPhone : companyInfos.companyPhone,
      personName: checked ? syncCompanyInfos.personName : companyInfos.personName,
      personPhone: checked ? syncCompanyInfos.personPhone : companyInfos.personPhone,
      personEmail: checked ? syncCompanyInfos.personEmail : companyInfos.personEmail,
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let theme = this.getTheme();
    let padding = 2;
    return {
      textField:{
        marginRight: padding*6,
      },
      container:{
      },
      title:{
      },
      checkbox:{
        width: 24,
        padding: padding,
        display: 'inline-block',
        verticalAlign: 'middle',
      },
      iconStyle:{
        fill : theme.primary1Color,
      },
      form:{
        textAlign : 'left',
        marginTop : padding*3,
      },
      hasSync:{
        display: this.props.showSync ? 'block' : 'none',
        marginTop : padding*12,
      },
      syncLabel:{
        verticalAlign: 'middle',
        fontSize : 15,
        fontWeight: 500,
      },
    };
  },

  getValue(){
    return {
      companyName:this.refs.companyName.getValue(),
      companyAddress:this.refs.companyAddress.getValue(),
      companyPhone:this.refs.companyPhone.getValue(),
      personName:this.refs.personName.getValue(),
      personPhone:this.refs.personPhone.getValue(),
      personEmail:this.refs.personEmail.getValue(),
    };
  },

  _handleGetCheckedState(){
    let syncCompanyInfo = this.props.syncCompanyInfos ? this.props.syncCompanyInfos : null;
    let { hasChecked } = this.props;
    let {
      companyName,
      companyAddress,
      companyPhone,
      personName,
      personPhone,
      personEmail,
      changed
    } = this.state;

    if(hasChecked) {
      if(changed){
        return false;
      }
      return true;
    }

    if (syncCompanyInfo && syncCompanyInfo.companyName === companyName &&
        syncCompanyInfo.companyAddress === companyAddress &&
        syncCompanyInfo.companyPhone === companyPhone &&
        syncCompanyInfo.personName === personName &&
        syncCompanyInfo.personPhone === personPhone &&
        syncCompanyInfo.personEmail === personEmail) {
      return true;
    }
    return false;
  },

  render() {
    let {
      companyName,
      companyAddress,
      companyPhone,
      personName,
      personPhone,
      personEmail
    } = this.state;

    let titleElem = this.props.showTitle ? <div style = {this.style('title')}>{this.props.title}</div> : null;
    return(
      <div style = {this.style('container')}>
        {titleElem}
        <div style ={this.style('hasSync')}>
          <Checkbox
            ref = 'checkbox'
            iconStyle = {this.style('iconStyle')}
            style ={this.style('checkbox')}
            onCheck = {this._handleCheck}
            enableTransition = {true}
            defaultChecked = {this._handleGetCheckedState()}
          />
          <span
            style = {this.style('syncLabel')}
          >
            {this.t('nLabelSyncScheduleReport')}
          </span>
        </div>
        <div style = {this.style('form')}>
          <TextField
            ref = 'companyName'
            key= 'companyName'
            fullWidth={true}
            style= {this.style('textField')}
            value = {companyName}
            floatingLabelText={this.t('nLabelCompanyName')}
            onChange = {this._handleChange.bind(this,'companyName')}
          />
          <TextField
            ref = 'companyAddress'
            key= 'companyAddress'
            fullWidth={true}
            style= {this.style('textField')}
            value = {companyAddress}
            floatingLabelText={this.t('nLabelCompanyAddress')}
            onChange = {this._handleChange.bind(this,'companyAddress')}
          />
          <TextField
            ref = 'companyPhone'
            key= 'companyPhone'
            fullWidth={true}
            style= {this.style('textField')}
            value = {companyPhone}
            floatingLabelText={this.t('nLabelCompanyPhone')}
            onChange = {this._handleChange.bind(this,'companyPhone')}
          />
          <TextField
            ref = 'personName'
            key= 'personName'
            style= {this.style('textField')}
            value = {personName}
            floatingLabelText={this.t('nLabelPersonName')}
            onChange = {this._handleChange.bind(this,'personName')}
          />
          <TextField
            ref = 'personEmail'
            key= 'personEmail'
            style= {this.style('textField')}
            value = {personEmail}
            floatingLabelText={this.t('nLabelPersonEmail')}
            onChange = {this._handleChange.bind(this,'personEmail')}
          />
          <TextField
            ref = 'personPhone'
            key= 'personPhone'
            style= {this.style('textField')}
            value = {personPhone}
            floatingLabelText={this.t('nLabelPersonPhone')}
            onChange = {this._handleChange.bind(this,'personPhone')}
          />
        </div>
      </div>
    );
  },

  _handleChange(name){
    if(this.props.notifyChanged) global.notifyOrderDetailsChange(true);
    let value = this.refs[name].getValue();
    this.setState({
      [name]:value,
      changed: true,
    });
  },

  _handleCheck(e, checked){
    global.notifyOrderDetailsChange(true);
    let {
      companyName,
      companyAddress,
      companyPhone,
      personName,
      personPhone,
      personEmail
    } = this.state;

    let newCompanyInfos = this.props.syncCompanyInfos ? this.props.syncCompanyInfos : {};

    if(checked){
      this.setState({
        companyName: newCompanyInfos.companyName,
        companyAddress: newCompanyInfos.companyAddress,
        companyPhone: newCompanyInfos.companyPhone,
        personName: newCompanyInfos.personName,
        personPhone: newCompanyInfos.personPhone,
        personEmail: newCompanyInfos.personEmail,
      });
      this.props.onSaveChecked && this.props.onSaveChecked(true);
    }else if(!checked){
      this.setState({
        companyName: companyName === newCompanyInfos.companyName ? '' : companyName,
        companyAddress: companyAddress === newCompanyInfos.companyAddress ? '' : companyAddress,
        companyPhone: companyPhone === newCompanyInfos.companyPhone ? '' : companyPhone,
        personName: personName === newCompanyInfos.personName ? '' : personName,
        personPhone: personPhone === newCompanyInfos.personPhone ? '' : personPhone,
        personEmail: personEmail === newCompanyInfos.personEmail ? '' : personEmail,
      });
      this.props.onSaveChecked && this.props.onSaveChecked(false);
    }
  },
});
module.exports = CompanyForm;
