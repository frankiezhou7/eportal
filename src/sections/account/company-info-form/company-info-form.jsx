const React = require('react');
const _ = require('eplodash');

const RawTextField = require('epui-md/TextField');
const UneditableInfo = require('~/src/shared/uneditable-info');
const DropDownCountries = require('~/src/shared/dropdown-countries');
const DropDownStates = require('~/src/shared/dropdown-states');
const DropDownPorts = require('~/src/shared/dropdown-ports');
const TextFieldWebsite = require('~/src/shared/text-field-website');
const TextFieldContacts = require('~/src/shared/text-field-contacts');
const TextFieldDescription = require('~/src/shared/text-field-description');
const BankInformation = require('./company-bank-information');
const UploadCompanyProfile = require('./upload-company-profile');
const UploadCompanyCertificates = require('./upload-company-certificates');
const OrganizationRoles = require('~/src/shared/organization-roles');
const Label = require('~/src/shared/Label');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const { ComposedForm, use, createComponentPool } = require('epui-composer');

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;

const PropTypes = React.PropTypes;

use(UneditableInfo);
use(DropDownCountries);
use(DropDownStates);
use(DropDownPorts);
use(UploadCompanyProfile);
use(UploadCompanyCertificates);
use(OrganizationRoles);
use(BankInformation);
use(TextField);
use(TextFieldWebsite);
use(TextFieldContacts);
use(TextFieldDescription);
use(Label);

const CompanyInfoForm = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.object,
    onChange: PropTypes.func,
    mode: PropTypes.string.isRequired,
    accType: PropTypes.string.isRequired,
  },

  getInitialState() {
    return {

    }
  },

  getDefaultProps(){
    return{
      // mode: 'COMPANY',
      // mode: 'COMPLETE',
      // accType: 'AGENCY',
      // accType: 'PRINCIPAL',
    };
  },

  getStyles() {
    let styles = {
      root: {
        width: '100%',
        overflowX: 'hidden',
      },
    };
    return styles;
  },

  getValue(){
    return this.form.getValue();
  },

  isValid(){
    return this.form.isValid();
  },

  isChanged() {
    return this.form && this.form.isChanged();
  },

  render() {
    return (
      <div style={this.style('root')}>
        <ComposedForm
          ref={(ref) => this.form = ref}
          definitions={this.getDefs()}
          value={this.props.value}
          onChange={this.props.onChange}
        />
      </div>
    );
  },

  getDefs() {
    const { accType, mode } = this.props;
    let isComplete = mode === 'COMPLETE';
    const sectionProfile = [
      {
        component: 'Section',
        props: {
          style: {

          }
        },
        children: [
          {
            component: 'TextFieldContacts',
            name: 'website',
            props: {
              style: {
                width: global.contentWidth,
                float: 'left',
              },
              floatingLabelText: 'Company Website',
              isUnderlineFocused: true,
              defaultValue: '#contactMethods',
              contactType: 'web',
              valuePath: 'website',
            },
          },
          {
            component: 'TextFieldDescription',
            name: 'profile',
            props: {
              style: {
                width: global.contentWidth,
                float: 'left',
              },
              floatingLabelText: 'Company Profile',
              isUnderlineFocused: true,
              defaultValue: '#description',
              valuePath: 'description',
            },
          },

          {
            component: 'UploadCompanyProfile',
            name: 'profileFiles',
            props: {
              style: {

              },
            },
            value: '#profiles',
            valuePath: 'profiles'
          },

          {
            component: 'TextFieldWebsite',
            name: 'contactPerson',
            props: {
              style: {
                width: '475px',
                float: 'left',
                marginRight: '10px',
              },
              floatingLabelText: 'Contact Person',
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              required: true,
              checkOnBlur: true,
              isUnderlineFocused: true,
              defaultValue: '#contactPersons[0].fullName',
              valuePath: 'person.fullName'
            },
          },
          {
            component: 'TextFieldContacts',
            name: 'mobile',
            props: {
              style: {
                width: '475px',
                float: 'left',
              },
              floatingLabelText: 'Mobile',
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              required: true,
              isUnderlineFocused: true,
              defaultValue: '#contactPersons[0].contactMethods',
              contactType: 'mobile',
              valuePath: 'person.mobile'
            },
          },
          {
            component: 'TextFieldContacts',
            name: 'phone',
            props: {
              style: {
                width: '475px',
                float: 'left',
                marginTop: '-10px',
                marginRight: '10px',
              },
              required: true,
              floatingLabelText: 'Company Tel.',
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              isUnderlineFocused: true,
              defaultValue: '#contactPersons[0].contactMethods',
              contactType: 'phone',
              valuePath: 'person.phone'
            },
          },
          {
            component: 'TextFieldContacts',
            name: 'fax',
            props: {
              style: {
                width: '475px',
                float: 'left',
                marginTop: '-10px',
              },
              required: true,
              floatingLabelText: 'Fax',
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              isUnderlineFocused: true,
              defaultValue: '#contactPersons[0].contactMethods',
              contactType: 'fax',
              valuePath: 'person.fax'
            },
          }
        ],
      }
    ];
    let sectionCerts = sectionProfile.concat([{
      component: 'Section',
      props: {
        style: {
          marginTop: '30px',
        }
      },
      children: [
        {
        component: 'UploadCompanyCertificates',
        name: 'registerCertificates',
        props: {
          style: {

          },
        },
        value: '#registerCertificates',
        valuePath: 'registerCertificates',
      },
      {
        component: 'TextFieldWebsite',
        name: 'association',
        props: {
          style: {
            width: '470px',
            float: 'left',
            marginTop: '-10px',
            marginRight: '20px',
          },
          floatingLabelText: 'Joined Association',
          defaultValue: '#association',
          valuePath: 'association',
          isUnderlineFocused: true,
        },
      },{
        component: 'TextFieldWebsite',
        name: 'awards',
        props: {
          style: {
            width: '470px',
            float: 'left',
            marginTop: '-10px',
          },
          defaultValue: '#awards',
          valuePath: 'awards',
          floatingLabelText: 'Honors & Awards',
          isUnderlineFocused: true,
        },
      },
    ]},

    {
      component: 'Section',
      props: {

      },
      children: [{
        component: 'BankInformation',
        name: 'bank',
        props: {
          style: {
            width: global.contentWidth,
          },
          value: '#bank',
        },
      }],
    }]);

    let agencyDefs = [
      {
        component: 'Section',
        props: {
          title: isComplete ? 'Complete Information' : '',
          titleStyle:{
            marginTop: 20,
            fontSize: 20,
            color: 'rgba(0,0,0,0.87)',
            fontWeight: 500,
          },
          style: {
            overflow: 'hidden',
          },
        },
        children: [
          isComplete ? {
            component: 'TextFieldWebsite',
            name: 'name',
            props: {
              style: {
                width: global.contentWidth,
                marginBottom: '15px',
                float: 'left',
              },
              floatingLabelText:'Company',
              isUnderlineFocused: true,
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              required: true,
              checkOnBlur: true,
              defaultValue: '#name',
              valuePath: 'name',
            },
          } : {
            component: 'UneditableInfo',
            name: 'name',
            props: {
              style: {
                width: global.contentWidth,
                marginBottom: '15px',
                marginRight: '10px',
                float: 'left',
              },
              title: 'Company',
              value: '#name',
            },
          },
          {
            component: 'UneditableInfo',
            name: 'type',
            props: {
              style: {
                float: 'left',
                minWidth: '130px',
                marginRight: '60px',
                marginTop: isComplete ? '-6px' : '0px',
                marginBottom: '10px',
              },
              title: 'Type',
              value: '#role',
              accountType: true,
            },
          },
          {
            component: 'UneditableInfo',
            name: 'email',
            props: {
              style: {
                minWidth: '700px',
                marginTop: isComplete ? '-6px' : '0px',
                marginBottom: '10px',
                float: 'left',
              },
              title: 'Registered Email',
              value: '#contactMethods',
              contactType: 'email',
            },
          },
          {
            component: 'OrganizationRoles',
            name: 'roles',
            props: {
              style: {
                width: global.contentWidth,
                float: 'left',
              },
              title: 'Organization Roles',
              value: '#roles',
              accType: 'AGENCY',
            },
          },
          isComplete ? {
          component: 'DropDownCountries',
          name: 'country',
          props: {
            style: {
              width: '240px',
              marginRight: '10px',
              float: 'left',
              // marginTop: isComplete ? '-11px' : '0px',
            },
            menuStyle: {
              width:'270px',
            },
            floatingLabelText: 'Countries',
            keyLabel: '(Required)',
            keyLabelStyle: {
              fontSize: '14px',
              color: '#F5A623',
              marginLeft: '8px',
            },
            value: '#country',
            valuePath: 'country',
            required: true,
          },
        } : {
            component: 'UneditableInfo',
            name: 'country',
            props: {
              style: {
                minWidth: '150px',
                maxWidth: '300px',
                marginTop: '15px',
                marginRight: '10px',
                float: 'left',
              },
              title: 'Country',
              value: '#country.name',
            },
          },
          isComplete ? {
          component: 'DropDownStates',
          name: 'province',
          props: {
            style: {
              width: '240px',
              marginRight: '10px',
              float: 'left',
              // marginTop: isComplete ? '-11px' : '0px',
            },
            menuStyle: {
              width:'270px',
            },
            floatingLabelText: 'Province',
            keyLabel: '(Required)',
            keyLabelStyle: {
              fontSize: '14px',
              color: '#F5A623',
              marginLeft: '8px',
            },
            value: '#state',
            valuePath: 'state',
            required: true,
          }
        } : {
            component: 'UneditableInfo',
            name: 'province',
            props: {
              style: {
                minWidth: '180px',
                maxWidth: '300px',
                marginTop: '15px',
                marginRight: '10px',
                float: 'left',
              },
              title: 'Province',
              value: '#state.name',
            },
          },
          isComplete ? {
          component: 'TextFieldWebsite',
          name: 'city',
          props: {
            style: {
              width: '240px',
              marginRight: '10px',
              float: 'left',
            },
            floatingLabelText: 'City',
            keyLabel: '(Required)',
            keyLabelStyle: {
              fontSize: '14px',
              color: '#F5A623',
              marginLeft: '8px',
            },
            defaultValue: '#address.city',
            valuePath: 'address.city',
          },
        } : {
            component: 'UneditableInfo',
            name: 'city',
            props: {
              style: {
                minWidth: '180px',
                maxWidth: '300px',
                marginTop: '15px',
                float: 'left',
              },
              title: 'City',
              value: '#address.city',
            },
          },
          isComplete && {
            component: 'Label',
            name: 'label',
            props: {
              style: {
                float: 'left',
                marginTop: '-35px',
              },
              value: '(Only for Agency in China)',
            },
          },
          {
            component: 'TextFieldWebsite',
            name: 'address',
            props: {
              style: {
                width: '710px',
                marginRight: '10px',
                float: 'left',
              },
              floatingLabelText: 'Address',
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              required: true,
              checkOnBlur: true,
              isUnderlineFocused: true,
              defaultValue: '#address.line1',
              valuePath: 'address.line1',
            },
          },
          isComplete ? {
            component: 'DropDownPorts',
            name: 'port',
            props: {
              style: {
                width: '240px',
                float: 'left',
                marginTop: '0px',
              },
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              value: '#ports[0]',
              valuePath: 'port',
              required: true,
            },
          } :{
            component: 'UneditableInfo',
            name: 'port',
            props: {
              style: {
                width: '240px',
                float: 'left',
                marginTop: '-53px',
              },
              title: 'Port',
              value: '#ports[0].name',
            },
          },
        ],
      },
    ].concat(sectionCerts);

    let principalDefs = [
      {
        component: 'Section',
        props: {
          title: isComplete ? 'Complete Information' : '',
          titleStyle:{
            marginTop: 20,
            fontSize: 20,
            color: 'rgba(0,0,0,0.87)',
            fontWeight: 500,
          },
          style: {
            overflow: 'hidden',
          },
        },
        children: [
          isComplete ? {
            component: 'TextFieldWebsite',
            name: 'name',
            props: {
              style: {
                width: global.contentWidth,
                marginRight: '10px',
                float: 'left',
              },
              floatingLabelText:'Company',
              isUnderlineFocused: true,
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              required: true,
              checkOnBlur: true,
              defaultValue: '#name',
              valuePath: 'name',
            },
          } : {
            component: 'UneditableInfo',
            name: 'name',
            props: {
              style: {
                width: global.contentWidth,
                marginBottom: '15px',
                marginRight: '10px',
                float: 'left',
              },
              title: 'Company',
              value: '#name',
            },
          },
          {
            component: 'UneditableInfo',
            name: 'type',
            props: {
              style: {
                float: 'left',
                minWidth: '130px',
                marginRight: '60px',
                marginBottom: '10px',
              },
              title: 'Type',
              value: '#role',
              accountType: true,
            },
          },
          {
            component: 'UneditableInfo',
            name: 'email',
            props: {
              style: {
                maxWidth: '690px',
                minWidth: '180px',
                marginRight: '60px',
                marginBottom: '10px',
                float: 'left',
              },
              title: 'Registered Email',
              value: '#contactMethods',
              contactType: 'email',
            },
          },
          isComplete ? {
            component: 'DropDownCountries',
            name: 'country',
            props: {
              style: {
                width: '240px',
                float: 'left',
              },
              menuStyle: {
                width:'270px',
              },
              floatingLabelText: 'Countries',
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              value: '#country',
              valuePath: 'country',
              required: true,
            },
          } : {
              component: 'UneditableInfo',
              name: 'country',
              props: {
                style: {
                  minWidth: '300px',
                  marginBottom: '11px',
                  float: 'left',
                },
                title: 'Country',
                value: '#country.name',
              },
            },
          {
            component: 'OrganizationRoles',
            name: 'roles',
            props: {
              style: {
                width: global.contentWidth,
                float: 'left',
                marginTop: '5px',
              },
              title: 'Organization Roles',
              value: '#roles',
              accType: 'PRINCIPAL',
            },
          },
          {
            component: 'TextFieldWebsite',
            name: 'address',
            props: {
              style: {
                width: global.contentWidth,
                float: 'left',
              },
              floatingLabelText: 'Address',
              keyLabel: '(Required)',
              keyLabelStyle: {
                fontSize: '14px',
                color: '#F5A623',
                marginLeft: '8px',
              },
              required: true,
              checkOnBlur: true,
              isUnderlineFocused: true,
              defaultValue: '#address.line1',
              valuePath: 'address.line1',
            },
          }
        ],
      },

      {
        component: 'Section',
        props: {
          style: {

          }
        },
        children: [
          {
          component: 'UploadCompanyCertificates',
          name: 'registerCertificates',
          props: {
            style: {

            },
            showSpecialCert: false,
            showOtherCert: false,
          },
          value: '#registerCertificates',
          valuePath: 'registerCertificates',
        }
      ].concat(sectionProfile),
      },
    ];
    if(accType === 'PRINCIPAL') { return principalDefs };
    if(accType === 'AGENCY') { return agencyDefs };
  },


});

module.exports = CompanyInfoForm;
