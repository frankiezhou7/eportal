const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Dialog = require('epui-md/ep/Dialog');
const FlatButton = require('epui-md/FlatButton');
const CheckboxGroup = require('epui-md/Checkbox/CheckboxGroup');
const RawTextField = require('epui-md/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const constants = require('~/src/shared/constants');
const ACCOUNT_MANAGEMENT = constants.ACCOUNT_MANAGEMENT;
const ORDER_PERMISSION_AGENCY = constants.ORDER_PERMISSION_AGENCY;
const ORDER_PERMISSION_PRINCIPAL = constants.ORDER_PERMISSION_PRINCIPAL;

const React = require('react');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;


const RoleManagementDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Navigation/${__LOCALE__}`),
    require(`epui-intl/dist/Account/${__LOCALE__}`),
  ],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    user: PropTypes.object,
    value: PropTypes.object,
    account: PropTypes.object,
    style: PropTypes.object,
    mode: PropTypes.oneOf(['EDIT', 'ADD']),
    createUserGroup: PropTypes.func,
    updateUserGroupById: PropTypes.func,
    onFetchUserGroups: PropTypes.func,
    onClearActive: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    let { account } = this.props;
    let accType = '';
    if(account.isConsigner()) {accType = 'PRINCIPAL'}
    if(account.isConsignee()) {accType = 'AGENCY'}
    return {
      accType:accType
    };
  },

  getStyles() {
    let styles = {
      root: _.assign({

      }, this.props.style),
      content: {
        marginTop: 15,
      },
      title: {

      },
      group: {
        width: 580,
        overflow: 'hidden',
      },
      name: {
        width: 330,
        marginTop: -20,
        marginBottom: 20,
      },
    };

    return styles;
  },

  isValid() {
    let valid = true;
    let promises = [
      this.refs.name.isValid().then(val => {
        valid = !!val;
      }),
    ];

    return new Promise((res, rej) => {
      Promise.all(promises).then(() => {
        res(valid);
      }).catch(rej);
    })
  },

  renderAccountMangement() {
    let { value } = this.props;
    let options = [];
    _.forEach(ACCOUNT_MANAGEMENT, accMngt => {
      options.push({ref:accMngt, label: _.startCase(accMngt)});
    });

    return (
      <div style={this.style('content')}>
        <CheckboxGroup
          ref='accMngt'
          title={this.t('nTextAccountManagement')}
          titleStyle={this.style('title')}
          style={this.style('group')}
          options={options}
          value={value && value.accountManagement}
        />
      </div>
    );
  },

  renderOrderPermission() {
    let { value } = this.props;
    let options = [];
    if(this.state.accType === 'AGENCY'){
      _.forEach(ORDER_PERMISSION_AGENCY, agency => {
        options.push({ref:agency, label: _.startCase(agency)});
      });
    }

    if(this.state.accType === 'PRINCIPAL'){
      _.forEach(ORDER_PERMISSION_PRINCIPAL, principal => {
        options.push({ref:principal, label: _.startCase(principal)});
      });
    }

    return (
      <div style={this.style('content')}>
        <CheckboxGroup
          ref='orderPerm'
          title={this.t('nTextOrderPermissions')}
          titleStyle={this.style('title')}
          style={this.style('group')}
          options={options}
          value={value && value.orderPermission}
        />
      </div>
    );
  },

  render() {
    let { value } = this.props;
    let actions = [
      <div>
        <FlatButton
          label= {this.t('nButtonCancel')}
          onTouchTap={this._handleCancel}
        />
        <FlatButton
          label= {this.t('nButtonSave')}
          onTouchTap={this._handleSave}
        />
      </div>
    ];

    return (
      <Dialog
        ref="role"
        style={this.style('root')}
        title={this.props.mode === 'ADD' ? this.t('nTextAddRole') : this.t('nTextEditRole')}
        actions={actions}
        maxWidth={660}
        setZIndex={1000}
        modal={true}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        repositionOnUpdate={true}
      >
        <TextField
          ref='name'
          style={this.style('name')}
          floatingLabelText={this.t('nLabelRoleName')}
          defaultValue={value && value.name}
          required={true}
          minLength={1}
          maxLength={128}
        />
        {/*{this.renderAccountMangement()}*/}
        {this.renderOrderPermission()}
      </Dialog>
    );
  },

  show() {
    this.refs.role.show();
  },

  _handleCancel() {
    this.refs.role.close();
    this.props.onClearActive();
  },

  _handleSave() {
    this.isValid()
    .then(valid => {
      if(valid){
        this.save();
      }else{
        return;
      }
    });
  },

  save() {
    let {
      mode,
      createUserGroup,
      onFetchUserGroups,
      updateUserGroupById,
      account,
      value,
      ...other
    } = this.props;
    if(mode === 'ADD' && _.isFunction(createUserGroup)){
      let account = this.props.account.getId();
      let body = {
          name: this.refs.name.getValue(),
          accountManagement: '',
          orderPermission: this.refs.orderPerm.getBinaryValue(),
          account,
      };
      createUserGroup(body);
    }
    if(mode === 'EDIT' && _.isFunction(updateUserGroupById)){
      let id = _.get(value, '_id');
      let body = {
          name: this.refs.name.getValue(),
          // accountManagement: this.refs.accMngt.getBinaryValue(),
          orderPermission: this.refs.orderPerm.getBinaryValue(),
          __v: _.get(value, '__v', 0),
      };
      updateUserGroupById.promise(id,body).then(res=>{
        if(res.status == 'OK'){
          onFetchUserGroups();
        }
      });
    }
  },
});

module.exports = RoleManagementDialog;
