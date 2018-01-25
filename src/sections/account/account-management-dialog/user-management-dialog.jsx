const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Dialog = require('epui-md/ep/Dialog');
const FlatButton = require('epui-md/FlatButton');
const RadioButton = require('epui-md/RadioButton');
const RadioButtonGroup = require('epui-md/RadioButton/RadioButtonGroup');
const RawTextField = require('epui-md/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const TextFieldUserNames = require('~/src/shared/text-field-user-names');
const TextFieldEmail = require('~/src/shared/text-field-email');

const React = require('react');
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;


const UserManagementDialog = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Navigation/${__LOCALE__}`),
    require(`epui-intl/dist/User/${__LOCALE__}`),
    require(`epui-intl/dist/SafeEmailAndMobile/${__LOCALE__}`),
  ],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    mode: PropTypes.oneOf(['EDIT', 'ADD']),
    role: PropTypes.object,
    user: PropTypes.object,
    account: PropTypes.object,
    onFetchUsers: PropTypes.func,
    createUserByUserGroup: PropTypes.func,
    updateUserByUserGroup: PropTypes.func,
    userExists: PropTypes.func,
    open: PropTypes.bool,
    onCloseDialog: PropTypes.func,
  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {
      errorText: null,
      posErrorText: null,
    };
  },

  componentWillReceiveProps(nextProps){
    if(nextProps.mode !== this.props.mode){
      this.setState({errorText: null});
    }
  },

  isValid(isAdd) {
    let valid = true;
    let promises = [
      this.refs.name.isValid().then(val => {
        valid = !!val;
      }),
      this.refs.email.isValid().then(val => {
        valid = !!val;
      }),
      // this.refs.position.isValid().then(val => {
      //   valid = !!val;
      // }),
      isAdd && this.checkUserExists().then(val => {
        valid = !!val;
      })
    ];

    return new Promise((res, rej) => {
      Promise.all(promises).then(() => {
        res(valid);
      }).catch(rej);
    })
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
      name: {
        display: 'block',
        marginTop: -20,
        marginBottom: 20,
      },
      radio: {
        float: 'left',
        width: 180,
        marginBottom: 18,
      },
      radioLabel: {
        fontSize: 16,
        textTransform: 'capitalize',
        width: 'auto',
      },
      radioIcon: {
        marginRight: 10,
        color: '#5A5A5A'
      },
    };

    return styles;
  },

  renderRoleSelections() {
    let { role, user } = this.props;
    return (
      <div style={this.style('content')}>
        <RadioButtonGroup
          ref='rolesGroup'
          name="rolesGroup"
          valueSelected={_.get(role,'id')}
        >
          {/*{_.map(this.props.roles, role => {
            return (*/}
              <RadioButton
                key={_.get(role,'id')}
                label={_.get(role,'name')}
                labelStyle={this.style('radioLabel')}
                iconStyle={this.style('radioIcon')}
                style={this.style('radio')}
                value={_.get(role,'id')}
              />
            {/*)
          })}*/}
        </RadioButtonGroup>
      </div>
    );
  },

  render() {
    let { user, open } = this.props;
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
        ref="user"
        style={this.style('root')}
        title={this.props.mode === 'ADD' ? this.t('nTextAddUser') : this.t('nTextEditUser')}
        actions={actions}
        maxWidth={660}
        setZIndex={1000}
        modal={false}
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        repositionOnUpdate={true}
        open={open}
      >
        <TextFieldUserNames
          ref='name'
          style={this.style('name')}
          defaultValue={_.get(user, 'fullName')}
        />
        <TextFieldEmail
          ref='email'
          style={this.style('name')}
          floatingLabelText={this.t('nLabelLoginEmail')}
          defaultValue={_.get(user, 'email')}
          errorText={this.state.errorText}
          disabled={this.props.mode === 'EDIT'}
        />
        {/*<TextField
          ref='position'
          style={this.style('name')}
          floatingLabelText={this.t('nLabelUserPosition')}
          defaultValue={_.get(user, ['position','title'])}
          errorText={this.state.posErrorText}
        />*/}
      </Dialog>
    );
  },

  show() {
    this.refs.user.show();
  },

  save() {
    let { mode, account, user, role, createUserByUserGroup, onFetchUsers, updateUserByUserGroup, userExists, onCloseDialog } = this.props;
    let roleId = role && role._id;
    let nameVal = this.refs.name.getValue();
    let emailVal = this.refs.email.getValue();
    // let positionVal = this.refs.position.getValue();
    let validLength = {
      maxEmergencyEmailLen: 128,
      minEmergencyEmailLen: 6
    };
    // let validPosLength = {
    //   maxPositionNameLen: 128,
    //   minPositionNameLen: 1
    // };
    if(emailVal.length < 6) { this.setState({errorText:_.template(this.t('nTextErrorEmergencyEmailLength'))(validLength)}); return;}
    // if(positionVal.length < 1) { this.setState({posErrorText:_.template(this.t('nTextErrorPositionNameLength'))(validPosLength)}); return;}

    let accName = _.get(account.toJS(), 'name');
    let pagination = {
      query: {

      },
      cursor: 0,
      size: 10,
      total: 0,
    };
    if(mode === 'ADD' && _.isFunction(createUserByUserGroup)){
      createUserByUserGroup.promise(nameVal, emailVal, roleId, accName)
      .then(res=>{
        if(res.status === 'OK') {
          onFetchUsers(pagination, roleId);
          this.setState({errorText:null, posErrorText: null}, () => {
            onCloseDialog();
          });
        }
      })
      .catch(err=>{
        console.log(err);
      });
    }else if(mode === 'EDIT' && _.isFunction(updateUserByUserGroup)){
      updateUserByUserGroup.promise(user._id, user.position._id, user.__v, nameVal, emailVal)
      .then(res=>{
        if(res.status === 'OK') {
          onFetchUsers(pagination, roleId);
          onCloseDialog();
        }
      })
      .catch(err=>{
        console.log(err);
      });
    }
  },

  checkUserExists(){
    let { userExists } = this.props;
    let emailVal = this.refs.email.getValue();
    return new Promise((resolve, reject) => {
      userExists
        .promise(emailVal)
        .then(res => {
          let response = res.response;
          let exists = response.exists;
          if(emailVal.length === 0) { exists = false; }
          let errorText = exists ? this.t('nTextUserExists') : null;
          this.setState({
            errorText: errorText,
          });
          resolve(!exists);
        })
        .catch(err => {

        });
    });
  },

  _handleCancel() {
    this.setState({errorText: null, posErrorText: null}, () => {
      this.props.onCloseDialog();
    })
  },

  _handleSave() {
    let isAdd = false;
    if(this.props.mode === 'ADD') { isAdd = true; }
    this.isValid(isAdd)
    .then(valid => {
      if(valid){
        this.save();
      }else{
        return;
      }
    });
  },
});

module.exports = UserManagementDialog;
