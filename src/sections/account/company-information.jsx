const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const React = require('react');
const Translatable = require('epui-intl').mixin;
const ScreenMixin = require('~/src/mixins/screen');
const RaisedButton = require('epui-md/RaisedButton');
const CompanyInfoForm = require('./company-info-form');

const PropTypes = React.PropTypes;

const CompanyInformation = React.createClass({
  mixins: [AutoStyle, ScreenMixin, Translatable],

  translations: require(`epui-intl/dist/Navigation/${__LOCALE__}`),

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    account: PropTypes.object,
    user: PropTypes.object,
    style: PropTypes.object,
    findOrganizationById: PropTypes.func,
    updateOrganizationById: PropTypes.func,
    updateAccountById: PropTypes.func,
    createPerson: PropTypes.func,
    updatePersonById: PropTypes.func,
    mode: PropTypes.oneOf(['COMPLETE', 'COMPANY']),
  },

  getDefaultProps() {
    return {
      mode: 'COMPANY',
    };
  },

  getInitialState() {
    return {
      isChanged: false,
      value: {},
      organization: {},
    }
  },

  componentWillMount() {
    let { account, findOrganizationById, user, mode } = this.props;
    let orgId = _.get(account.toJS(),['organization','_id']);
    if(_.isFunction(findOrganizationById)){
      findOrganizationById.promise(orgId)
      .then(res => {
        if(res.status == 'OK') {
          let isCreatePerson = false, person = {};
          let persons = _.get(res.response, 'contactPersons', []);
          if(_.compact(persons).length === 0) {
            isCreatePerson = true;
          }else{
            person = persons[0];
          }

          this.setState({organization:res.response, person, isCreatePerson});
        }
      })
      .catch(err => { console.log(err);});
    }
    this.setState({accType:user.getAccountType(),orgId});
  },

  componentDidMount() {
    this.setPageTitle(this.t('nTextCompanyInformation'));
  },

  getStyles() {
    let padding, { mode, style } = this.props;
    if(mode === 'COMPANY') { padding = '20px 0px'; }
    if(mode === 'COMPLETE') { padding = '70px 0px 2Opx'; }
    let styles = {
      root: {
        margin: '0px auto',
        padding: padding,
        width: '100%',
      },
      button: {
        textAlign: 'center',
      },
    };

    styles.root = _.assign({}, styles.root, style);
    return styles;
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style={styles.root}>
        <CompanyInfoForm
          ref='form'
          //onChange={this._handleChange}
          value={this.state.organization}
          mode={this.props.mode}
          accType={this.state.accType}
        />
        <div style={this.style('button')}>
          <RaisedButton
            label={'Complete'}
            //disabled={!this.state.isChanged}
            capitalized='capitalized'
            secondary={true}
            onClick={this._handleSave}
          />
        </div>
      </div>
    );
  },

  // _handleChange(evt, ref, value){
    // console.log(this.form.isChanged());
  // },

  _handleSave() {
    this.refs.form.isValid().then(valid => {
      if(valid){
        let { isCreatePerson, person, orgId } = this.state;
        let { createPerson, updatePersonById } = this.props;
        let value = this.refs.form.form.getValue();

        if(_.isFunction(createPerson)){
          let contactMethods = [
              {type: 'CMP', value: _.get(value, ['person', 'phone'])},
              {type: 'CMM', value: _.get(value, ['person', 'mobile'])},
              {type: 'CMF', value: _.get(value, ['person', 'fax'])},
          ];
          let personVal = {
            fullName: _.get(value, ['person', 'fullName']),
            contactMethods: contactMethods,
            memberOf: orgId,
          };
          if(isCreatePerson) {
            createPerson.promise(personVal)
            .then(res => {
              if(res.status === 'OK'){
                this.setState({
                  person:_.assign({}, {_id: res.response._id }, { __v: res.response.__v}),
                  isCreatePerson: false,
                }, () => {
                  this.saveOrganization(_.assign({},value,{contactPersons:[res.response._id]}));
                });
              }
            })
            .catch(err => {

            });
          }else{
            updatePersonById.promise(person._id, _.assign(personVal, {__v: person.__v}))
            .then(res => {
              if(res.status === 'OK'){
                this.setState({
                  person:_.assign(person, { __v: res.response.__v}),
                }, () => {
                  this.saveOrganization(_.assign({},value,{contactPersons:[person._id]}));
                });
              }
            })
            .catch(err => {

            });
          }
        }
      }
    });
  },

  saveOrganization(value) {
    let { mode, findOrganizationById, updateOrganizationById } = this.props;
    if(_.isFunction(updateOrganizationById)){
      let { accType, orgId, organization, person } = this.state;
      let ports = [];
      _.forEach(organization && organization.ports, port => {
        ports.push(port && port._id);
      });
      let __v = _.get(organization, '__v', 0);
      let contactMethods = organization && organization.contactMethods;
      if(mode === 'COMPANY' && accType === 'AGENCY'){
        value.address = {city: _.get(organization, ['address','city'], ''), line1: _.get(value, ['address','line1'])};
      }
      let webIndex = _.findIndex(contactMethods, {type: 'CMW'});
      if(webIndex !== -1) {contactMethods.splice(webIndex,1);}
      value.contactMethods = contactMethods.concat([{type: 'CMW', value: value.website}]);
      if(_.has(value, 'port')){
        ports.unshift(value.port);
        value.ports = ports;
        delete value.port;
      }
      value.__v = __v;
      if(mode === 'COMPLETE') { value.type = 'ByComplete'; }
      updateOrganizationById.promise(orgId, value)
      .then(res => {
        if(res.status === 'OK' && _.isFunction(findOrganizationById)){
          findOrganizationById.promise(orgId)
          .then(res => {
            if(res.status === 'OK'){
              this.setState({organization: res.response}, () => {
                if(mode === 'COMPLETE') { global.tools.toSubPath('dashboard'); }
              });
            }
          })
        }
      })
      .catch(err => {

      });
    }
  },
});

module.exports = CompanyInformation;
