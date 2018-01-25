const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const AddressInfo = require('~/src/shared/address-info');
const ContactInfo = require('~/src/shared/contact-info/contact-info');
const CertificateInfo = require('~/src/shared/certificate-info');
const PropTypes = React.PropTypes;
const OrganizationRoles = require('~/src/shared/organization-roles/organization-roles');
const OrganizationPorts = require('~/src/shared/organization-ports');
const AdvantageInfo = require('~/src/shared/advantage-info');
const DepartmentInfo = require('~/src/shared/department-info');
const RaisedButton = require('epui-md/RaisedButton');
const RawTextField = require('epui-md/TextField');
const Validatable = require('epui-md/HOC/Validatable/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;
const { ComposedForm, use, createComponentPool } = require('epui-composer');

require('epui-intl/lib/locales/' + __LOCALE__);

const pool = createComponentPool(
  AddressInfo,
  AdvantageInfo,
  ContactInfo,
  CertificateInfo,
  DepartmentInfo,
  TextField,
  [OrganizationRoles, 'OrganizationRoles'],
  [OrganizationPorts, 'OrganizationPorts'],
);

const OrganizationView = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.element,
    style: PropTypes.object,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let value = {};
    let formValue = this.form.getValue();
    let certValue = this.certificate.getValue();
    let deptValue = this.department.getValue();
    let stateValue = _.get(formValue,['address','state']);
    if(stateValue){
      delete formValue.address.state;
      value = Object.assign({}, formValue, {state: stateValue}, certValue, deptValue);
    }else{
      value = Object.assign({}, formValue, certValue, deptValue);
    }

    return value;
  },

  isChanged() {
    return this.form.isChanged();
  },

  isValid() {
    return this.form.isValid();
  },

  getUploadComponent(){
    return this.certificate.getComponent();
  },

  getDepartmentValue(){
    return this.department.getDepartmentValue();
  },

  getDepartmentIds(){
    return this.department.getValue().children;
  },

  getPersonValue(){
    return this.department.getPersonsValue();
  },

  getPersonIds(){
    return this.department.getPersonIds();
  },

  getStyles() {
    let styles = {
      root: {
        width: global.contentWidth,
        margin: 'auto',
      },
      title: {
        lineHeight: '24px',
        fontSize: 16,
        width: '100%',
        padding: '4px 10px',
        margin: '0px 0px 15px 10px',
      },
      content: {

      }
    };

    return styles;
  },

  render() {
    const {
      style,
      value,
    } = this.props;

    const styles = this.getStyles();
    const defs = this.getDefs();

    return (
      <div style={Object.assign(styles.root, style)}>
        <ComposedForm
          ref={(ref) => this.form = ref}
          definitions={defs}
          pool={pool}
          translate={this.t}
          value={value || {}}
        />
        <div style={styles.title}>
          Qualification Certificate
        </div>
        <div style={styles.content}>
          <CertificateInfo
            ref={(ref) => this.certificate = ref}
            value={value && value.certificates}
          />
        </div>
        <div style={styles.title}>
          Department Contact Information
        </div>
        <DepartmentInfo
          ref={(ref) => this.department = ref}
          value={value && value.children}
          parentId={value && value._id}
        />
      </div>
    );
  },

  getDefs() {
    const defs = [{
      component: 'Section',
      props: {
        style: {
          marginBottom: '20px',
        },
      },
      children: [{
        component: 'TextField',
        name: 'name',
        props: {
          floatingLabelText: '@nTextOrganizationName',
          style: {
            marginRight: '10px',
          },
          defaultValue: '#name',
        },
      }],
    }, {
      component: 'Section',
      props: {
        style: {
          marginBottom: '20px',
        },
      },
      children: [{
        component: 'TextField',
        name: 'description',
        props: {
          floatingLabelText: '@nTextOrganizationIntroduction',
          multiLine: true,
          style: {
            marginRight: '10px',
            width: '800px',
          },
          defaultValue: '#description',
        },
      }],
    }, {
      component: 'Section',
      props: {
        title: 'Analysis of Advantage',
        style: {
          marginBottom: '20px',
        },
      },
      children: [{
        component: 'AdvantageInfo',
        name: 'advantages',
        props: {
          value: '#advantages',
        },
      }],
    }
    // ,{
    //   component: 'Section',
    //   props: {
    //     title: 'Qualification Certificate',
    //     style: {
    //       position: 'relative',
    //       marginBottom: '20px',
    //     },
    //   },
    //   children: [{
    //     component: 'CertificateInfo',
    //     name: 'certificates',
    //     props: {
    //       value: '#certificates',
    //     },
    //   }],
    // }
    ,{
      component: 'Section',
      props: {
        title: 'Address Information',
        style: {
          marginBottom: '20px',
        },
      },
      children: [{
        component: 'AddressInfo',
        name: 'address',
        props: {
          country: '#country',
          state: '#state',
          value: '#address',
        },
      }],
    }, {
      component: 'Section',
      props: {
        title: 'Contact Information',
        style: {
          marginBottom: '20px',
        },
      },
      children: [{
        component: 'ContactInfo',
        name: 'contactMethods',
        props: {
          value: '#contactMethods',
        },
      }],
    }, {
      component: 'Section',
      props: {
        title: 'Organization Role',
      },
      children: [{
        component: 'OrganizationRoles',
        name: 'roles',
        props: {
          value: '#roles',
        },
      }],
    }, {
      component: 'Section',
      props: {
        title: 'Main Port Service for',
        style: {
          marginTop: '20px',
        },
      },
      children: [{
        component: 'OrganizationPorts',
        name: 'ports',
        props: {
          value: '#ports',
        },
      }],
    }
    // , {
    //   component: 'Section',
    //   props: {
    //     title: 'Department Contact Information',
    //     style: {
    //       marginTop: '20px',
    //     },
    //   },
    //   children: [{
    //     component: 'DepartmentInfo',
    //     name: 'departments',
    //     props: {
    //       value: '#departments',
    //     },
    //   }],
    // }
  ];

    return defs;
  },
});

module.exports = OrganizationView;
