const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const Paper = require('epui-md/Paper');
const ContactPersonInfo = require('./contact-person-info');
const TextField = require('epui-md/TextField');
const Clear = require('epui-md/svg-icons/content/clear');
const DepartmentItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onRemoveItem: PropTypes.func,
    departmentId: PropTypes.number,
    value: PropTypes.object,
    childId: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let { value } = this.props;
    return {
      show: true,
      __v: value ? value.__v ? value.__v : 0 : 0,
    };
  },

  getStyles() {
    let styles = {
      root: {
        backgroundColor: '#edf5fe',
        width: global.contentWidth,
        padding: '20px 24px 30px',
        position: 'relative',
        display: this.state.show ? 'block' : 'none',
        marginTop: 30,
      },
      department: {
        width: 628,
        marginRight: 20,
      },
      clear:{

      },
      button:{
        position: 'absolute',
        width: 18,
        height: 18,
        fill: '#f5a623',
        top: 13,
        right: 13,
        cursor: 'pointer',
      }
    };

    return styles;
  },

  getValue() {
    return {
      name: this.refs.departmentName.getValue(),
      contactMethods: [{type: 'CMP', value: this.refs.departmentPhone.getValue()}],
      // address: {
      //   line1: this.refs.departmentAddress.getValue(),
      // },
      contactPersons: this.refs.contactPersons.getValue(),
      __v: this.state.__v,
    }
  },

  getPersonIds(){
    return this.refs.contactPersons.getValue();
  },

  getPersonValue(){
    return this.refs.contactPersons.getPersonValue();
  },

  renderTextField(value){
    return (
      <div>
        <div>
          <TextField
            ref='departmentName'
            key='departmentName'
            style={this.style('department')}
            floatingLabelText={this.t('nLabelDepartmentName')}
            defaultValue={value ? value.name : 'Department'}
          />
          <TextField
            ref='departmentPhone'
            key='departmentPhone'
            defaultValue={value ? value.contactMethods ? this.getValueByLabel(value.contactMethods, 'CMP') : '' : ''}
            floatingLabelText={this.t('nLabelTelephone')}
            onBlur={this._handleChange}
          />
        </div>
        {/*<TextField
          ref='departmentAddress'
          key='departmentAddress'
          style={this.style('address')}
          fullWidth={true}
          floatingLabelText={this.t('nLabelDepartmentAddress')}
          defaultValue={value ? value.address ? value.address.line1 : '' : ''}
        />*/}
      </div>
    );
  },

  render() {
    let styles = this.getStyles();
    const {
      value,
      departmentId,
      childId,
    } = this.props;

    return (
      <Paper zDepth={1} style={this.style('root')}>
        <Clear style={this.style('button')} onClick={this._handleRemoveItem.bind(this,departmentId, this.state.__v)}/>
        {this.renderTextField(value)}
        <ContactPersonInfo
          ref='contactPersons'
          value={value && value.contactPersons}
          parentId={childId ? childId : value && value._id}
        />
      </Paper>
    );
  },

  _handleRemoveItem(departmentId, __v) {
    const {
      onRemoveItem,
    } = this.props;
    this.setState({
      show: false,
    });
    onRemoveItem(departmentId, __v);
  },

  _handleChange(){
    let phone = this.refs.departmentPhone;
    if(!_.isInteger(Number(phone.getValue()))) {
      alert(this.t('nErrorTextIntegerIsRequired'));
      phone.clearValue();
    }
  },

  getValueByLabel(methods,label) {
    let value = '';
    _.forEach(methods,(method)=>{
      if(method.type && method.type === label){
        value = method.value;
      }
    });
    return value;
  },
});

module.exports = DepartmentItem;
