const React = require('react');
const _ = require('lodash');
const StylePropable = require('~/src/mixins/style-propable');
const TextField = require('epui-md/TextField/TextField');
const DropDownRoles = require('./dropdown-roles');
const DropDownCountries = require('./dropdown-countries');
const FlatButton = require('epui-md/FlatButton');
const ClearFix = require('epui-md/internal/ClearFix');
const Loading = require('epui-md/ep/RefreshIndicator');
const { connect } = require('react-redux');
const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

const RegisterOrganization = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/OrganizationDialog/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    close: PropTypes.func,
    refresh: PropTypes.func,
    renderActions: PropTypes.func,
    positionDialog: PropTypes.func,
    organizationId: PropTypes.string,
    isEdit: PropTypes.bool,
    verifyStatus: PropTypes.number,
  },

  getDefaultProps() {
    return {
      organizationId: '',
    };
  },

  getInitialState() {
    return {
      organization: {},
      errorTextEmail: null,
      errorTextCompany: null,
      errorTextAddress: null,
      errorTextTel: null,
      errorTextCountry: null,
      errorTextRole: null,
    };
  },

  getStyles() {
    let styles = {
      root: {

      },
      line:{
        marginBottom: '10px',
        marginTop: '20px',
      },
      textField: {
        float: 'left',
        marginBottom: '15px',
      },
    };

    return styles;
  },

  getValue() {
    let email = this.refs.email.getValue();
    let company = this.refs.company.getValue();
    let address = this.refs.address.getValue();
    let tel = this.refs.tel.getValue();
    let country = this.refs.country.getValue();
    let role =  this.refs.role.getValue();

    let errorTextEmail = null;
    let errorTextCompany = null;
    let errorTextAddress = null;
    let errorTextTel = null;
    let errorTextCountry = null;
    let errorTextRole = null;

    if(!email) {
      errorTextEmail = this.t('nTextErrorTextEmail');
    }
    if(!company) {
      errorTextCompany = this.t('nTextErrorTextCompany');
    }
    if(!address) {
      errorTextAddress = this.t('nTextErrorTextAddress');
    }
    if(!tel) {
      errorTextTel = this.t('nTextErrorTextTel');
    }
    if(!country) {
      errorTextCountry = this.t('nTextErrorTextCountry');
    }
    if(!role) {
      errorTextRole = this.t('nTextErrorTextRole');
    }

    this.setState({
      errorTextEmail: errorTextEmail,
      errorTextCompany: errorTextCompany,
      errorTextAddress: errorTextAddress,
      errorTextTel: errorTextTel,
      errorTextCountry: errorTextCountry,
      errorTextRole: errorTextRole,
    });

    if(!email || !company || !address || !tel || !country ||!role) {return null};

    return {
      country:country,
      email: email,
      name: company,
      address: address,
      tel: tel,
      role:role,
    };
  },

  componentWillMount() {
    if(this.props.organizationId) this.fetchOrganization();
  },

  componentDidMount() {
    let {
      isEdit,
      verifyStatus
    } = this.props;
    let actions = [];

    if(verifyStatus === 0) {
      actions.push(
        <FlatButton
          key="resolve"
          ref={(ref) => this.confirm = ref}
          label= {this.t('nTextResolve')}
          secondary
          onTouchTap={this._handleResolve}
        />,
        <FlatButton
          key="reject"
          ref={(ref) => this.confirm = ref}
          label= {this.t('nTextReject')}
          secondary
          onTouchTap={this._handleReject}
        />
      )
    }
    if(verifyStatus === 1 && isEdit) {
      actions.push(
        <FlatButton
          key="confirm"
          ref={(ref) => this.confirm = ref}
          label= {this.t('nTextSave')}
          secondary
          onTouchTap={this._handleConfirm}
        />,
      )
    }
    actions.push(
      <FlatButton
        key="cancal"
        ref={(ref) => this.cancal = ref}
        label= {this.t('nTextClose')}
        secondary
        onTouchTap={this._handleCancel}
      />
    )

    let { renderActions } = this.props;

    if (_.isFunction(renderActions)) {
      renderActions(actions);
    }
  },
  updateOrganizationById(id, update){
    if(global.api.epds && global.api.epds.updateOrganizationById){
        global.api.epds.updateOrganizationById.promise(id, update).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              organization: res.response
            },()=>{
              if(this.props.positionDialog) this.props.positionDialog();
              if(this.props.refresh) this.props.refresh();
              let { close } = this.props;
              if (_.isFunction(close)) { close(); }
            });
          }else{
            //todo: deal with error
          }
        }).catch(err=>{
          alert(err);
        });
    }
  },

  updateOrganization(id, update){
    if(global.api.epds && global.api.epds.updateOrganization){
        global.api.epds.updateOrganization.promise(id, update).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              organization: res.response
            },()=>{
              if(this.props.positionDialog) this.props.positionDialog();
              if(this.props.refresh) this.props.refresh();
              let { close } = this.props;
              if (_.isFunction(close)) { close(); }
            });
          }else{
            //todo: deal with error
          }
        }).catch(err=>{
            alert(err);
        });
    }
  },

  fetchOrganization(){
    if(global.api.epds && global.api.epds.findOrganizationById){
        global.api.epds.findOrganizationById.promise(this.props.organizationId).then((res)=>{
          if(res.status === 'OK'){
            this.setState({
              isFetching: false,
              organization: res.response
            },()=>{
              if(this.props.positionDialog) this.props.positionDialog();
            });
          }else{
            //todo: deal with error
          }
        }).catch(err=>{
          //todo: deal with err
        });
    }
  },


  render() {
    let {
      isEdit,
      verifyStatus,
    } = this.props;
    let {organization} = this.state;

    let value = {
      email : _.find(organization.contactMethods, {type: 'email'}) ? _.find(organization.contactMethods, {type: 'email'}).value : '',
      name : _.get(organization, 'name'),
      address : _.get(organization, ['address', 'line1'], ''),
      country : _.get(organization, 'country', ''),
      tel : _.find(organization.contactMethods, {type: 'phone'}) ? _.find(organization.contactMethods, {type: 'phone'}).value : '',
      role : _.get(organization, 'role', ''),
    }

    if (!organization.name) return null;
    let email;
    let name;
    let address;
    let country;
    let tel;
    let role;
    if(isEdit) {

      email = (
        <TextField
          ref='email'
          key='email'
          errorText={this.state.errorTextEmail}
          floatingLabelText={this.t('nLabelEmail')}
          fullWidth={true}
          hintText={this.t('nHintEmail')}
          isWarning={true}
          showIcon={true}
          style={this.style('textField')}
          defaultValue={value.email}
        />
      );
      name = (
        <TextField
          ref='company'
          key='company'
          errorText={this.state.errorTextCompany}
          floatingLabelText={this.t('nLabelCompany')}
          fullWidth={true}
          hintText={this.t('nHintCompany')}
          isWarning={true}
          showIcon={true}
          style={this.style('textField')}
          defaultValue={value.name}
        />
      );
      address = (
        <TextField
          ref='address'
          key='address'
          errorText={this.state.errorTextAddress}
          floatingLabelText={this.t('nLabelAddress')}
          fullWidth={true}
          hintText={this.t('nHintAddress')}
          isWarning={true}
          showIcon={true}
          style={this.style('textField')}
          defaultValue={value.address}
        />
      );
      country = (
        <DropDownCountries
          ref='country'
          key='country'
          value={value.country}
          errorText={this.state.errorTextCountry}
        />
      );
      tel = (
        <TextField
          ref='tel'
          key='tel'
          errorText={this.state.errorTextTel}
          floatingLabelText={this.t('nLabelTel')}
          fullWidth={false}
          hintText={this.t('nHintTel')}
          isWarning={true}
          showIcon={true}
          style={this.style('textField')}
          defaultValue={value.tel}
        />
      );
      role = (
        <DropDownRoles
          ref='role'
          key='role'
          value={value.role}
          nTextLabelText={this.t('nTextLabelTextRoles')}
          errorText={this.state.errorTextRole}
        />
      );
    }else {
      email = (
        <div
          style={this.style('line')}
        >
          {`${this.t('nTextOrganizationEmail')}: ${value.email}`}
        </div>
      );
      name = (
        <div
          style={this.style('line')}
        >
          {`${this.t('nTextOrganizationName')}: ${value.name}`}
        </div>
      );
      address = (
        <div
          style={this.style('line')}
        >
          {`${this.t('nTextOrganizationAddress')}: ${value.address}`}
        </div>
      );
      country = (
        <div
          style={this.style('line')}
        >
          {`${this.t('nTextOrganizationCountry')}: ${value.country && value.country.name}`}
        </div>
      );
      tel = (
        <div
          style={this.style('line')}
        >
          {`${this.t('nTextOrganizationTel')}: ${value.tel}`}
        </div>
      );
      role = (
        <div
          style={this.style('line')}
        >
          {`${this.t('nTextOrganizationRole')}: ${value.role}`}
        </div>
      );
    }

    return (
      <div
        style={this.style('root')}
      >
        <ClearFix>
          {email}
          {name}
          {address}
          {country}
          {tel}
          {role}
        </ClearFix>
      </div>
    )
  },

  _handleCancel() {
    let { close } = this.props;
    if (_.isFunction(close)) { close(); }
  },

  _handleConfirm() {
    let {
      isEdit,
      verifyStatus,
      organizationId,
    } = this.props;
    if(!isEdit) {
      this.props.close();
    }else {
      let value = this.getValue();
      if(!value) return;
      this.updateOrganizationById(organizationId, {
        name: value.name,
        contactMethods:[{
          type: 'email',
          value: value.email,
        },{
          type: 'phone',
          value: value.tel,
        }],
        address: {
          line1:value.address,
        },
        country: value.country,
        role: value.role,
        __v:this.state.organization.__v
      });
    }
  },

  _handleResolve() {
    let {
      isEdit,
      verifyStatus,
      organizationId,
    } = this.props;

    if(!isEdit) {
      this.updateOrganization(organizationId, {
        verifyStatus: 1,
        __v:this.state.organization.__v
      })
    }else {
      let value = this.getValue();
      if(!value) return;
      this.updateOrganization(organizationId, {
        name: value.name,
        contactMethods:[{
          type: 'email',
          value: value.email,
        },{
          type: 'phone',
          value: value.tel,
        }],
        address: {
          line1:value.address,
        },
        country: value.country,
        role: value.role,
        __v:this.state.organization.__v,
        verifyStatus: 1,
      });
    }
  },

  _handleReject() {
    let {
      isEdit,
      verifyStatus,
      organizationId,
    } = this.props;
    if(!isEdit) {
      this.updateOrganizationById(organizationId, {
        verifyStatus: 2,
        __v:this.state.organization.__v
      })
    }else {
      let value = this.getValue();
      if(!value) return;
      this.updateOrganizationById(organizationId, {
        name: value.name,
        contactMethods:[{
          type: 'email',
          value: value.email,
        },{
          type: 'phone',
          value: value.tel,
        }],
        address: {
          line1:value.address,
        },
        country: value.country,
        role: value.role,
        __v:this.state.organization.__v,
        verifyStatus: 2,
      });
    }
  },

});

module.exports = connect(
  (state, props) => {
    return {
    };
  }
)(RegisterOrganization);
