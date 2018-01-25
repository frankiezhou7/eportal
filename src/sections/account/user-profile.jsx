const React = require('react');
const _ = require('eplodash');
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const RaisedButton = require('epui-md/RaisedButton');
const AvatarUploader = require('~/src/sections/user/avatarUploader');
const TextFieldUserNames = require('~/src/shared/text-field-user-names');
const TextFieldPosition = require('~/src/shared/text-field-position');
const TextFieldMobile = require('~/src/shared/text-field-mobile');
const TextFieldPhone = require('~/src/shared/text-field-phone');
const Snackbar = require('epui-md/Snackbar');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const PropTypes = React.PropTypes;
const TextField = Validatable(RawTextField);

const UserProfile = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/User/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  childContextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    user : PropTypes.object,
    account : PropTypes.object,
    nTextEdit : PropTypes.string,
    nTextDescriptionEditAvatar : PropTypes.string,
    nTextSuperAdmin: PropTypes.string,
    nTextUpdateProfileSuccess: PropTypes.string,
    nTextUpdateProfileFailed: PropTypes.string,
    updateUserProfile: PropTypes.func,
    percent: PropTypes.number,
  },

  getDefaultProps() {
    return {
      user:{}
    };
  },
  getInitialState() {
    return {
      avatar:null,
      percent: 0,
      open : false,
      message: null,
      isChanged: false,
    };
  },

  getStyles() {
    const theme = this.context.muiTheme;
    const padding = 24;
    const WIDHT = 400;
    let styles = {
      root:{
        paddingTop: 30,
      },
      textField:{
        marginTop: 10,
      },
      editor:{
        width: '100%',
        marginTop: 10,
        boxShadow: 'none',
      },
      avatar:{
        display: 'inline-block',
        marginRight: 20,
      },
      avatarDesc:{
        display: 'inline-block',
        verticalAlign: 'super',
      },
      edit:{
        fontFamily: 'Roboto-Medium',
        fontSize: 16,
        color: this.context.muiTheme.palette.accent1Color,
        letterSpacing: 0,
        textTransform: 'capitalize',
        textDecoration: 'underline',
        cursor: 'pointer',
      },
      desc:{
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        color: this.context.muiTheme.palette.grey1Color,
        letterSpacing: 0,
      },
      title: {
        color: this.context.muiTheme.palette.grey1Color,
        fontFamily: 'Roboto-Regular',
      },
      input:{
        width: WIDHT,
        marginRight: 16,
        marginBottom: 10,
        verticalAlign: 'middle',
      },
      info:{
        marginTop: 30,
        marginBottom: 40,
      },
      label:{
        color: this.context.muiTheme.palette.grey1Color,
        fontFamily: 'Roboto-Regular',
        display: 'block',
        fontSize: 12,
      },
      value:{
        display: 'block',
        fontFamily: 'Roboto-Regular',
        fontSize: 16,
      },
      item: {
        display: 'inline-block',
        width: WIDHT,
        marginRight: 16,
      },
    }
    return styles;
  },

  getValue(){
    let result = {};
    let position = '';
    _.forEach(this.refs,(value,key)=>{
      if(this.refs[key].getValue){
        if(key === 'position'){
          position = this.refs[key].getValue();
        }else{
          result[key] = this.refs[key].getValue();
        }
      }
    });
    return {user:result,position:position};
  },

  componentWillReceiveProps(nextProps){
    let nextUser = nextProps.user;
    let user = this.props.user;
    let preLoading = user.getMeta('loading');
    let nextLoading = nextUser.getMeta('loading');
    let err = user.getMeta('error');
    if(preLoading === false && !nextLoading){
      this.setState({
        open :true,
        message: err ? this.t('nTextUpdateProfileFailed'):this.t('nTextUpdateProfileSuccess')
      });
    }
  },

  renderAvatar(){
    return (
      <div>
        <AvatarUploader
          ref = 'avatarUploader'
          showNotice = {false}
          size = {80}
          src = {this.props.user.photoURL}
          style = {this.style('avatar')}
          file={this.state.avatar}
          percent={this.state.percent}
          uploadAvatar={this._onUploadAvatar}
        />
        <div style = {this.style('avatarDesc')}>
          <div
            style = {this.style('edit')}
            onTouchTap = {this._handleEditAvatar}
          >
            {this.t('nTextEdit')}
          </div>
          <div style = {this.style('desc')}>{this.t('nTextDescriptionEditAvatar')}</div>
        </div>
      </div>
    );
  },

  renderUserNames(){
    let { user } = this.props;
    let isSuperAdmin = user && user.isSuperAdmin;
    let { organization } = this.props.account;
    return isSuperAdmin ? (
      <div style = {Object.assign({},this.style('item'),{width: 'initial',marginBottom: 16})}>
        <span style = {this.style('label')}>{this.t('nLabelCompanyName')}</span>
        <span style = {this.style('value')}>{organization && organization.name}</span>
      </div>
    ):(
      <TextFieldUserNames
        ref = 'name'
        floatingLabelStyle = {this.style('title')}
        rootStyle = {Object.assign({},this.style('input'),{marginLeft: 0})}
        defaultValue = {user.name && user.name.toJS()}
        required = {true}
        onChange = {this._handleChange}
      />
    );
  },

  renderMailRole(){
    let { user} = this.props;
    let group = _.get(user,['position','group']);
    return (
      <div>
        <div style = {this.style('item')}>
          <span style = {this.style('label')}>{this.t('nLabelEmail')}</span>
          <span style = {this.style('value')}>{user.username}</span>
        </div>
        <div style = {this.style('item')}>
          <span style = {this.style('label')}>{this.t('nLabelRole')}</span>
          <span style = {this.style('value')}>{user.isSuperAdmin ? this.t('nTextSuperAdmin') :group && group.name}</span>
        </div>
      </div>
    );
  },

  renderPosition(){
    let { user } = this.props;
    if (user && user.isSuperAdmin) return null;
    return (
      <TextFieldPosition
        ref = 'position'
        floatingLabelStyle = {this.style('title')}
        style = {this.style('input')}
        defaultValue = {user.position && user.position.title}
        onChange = {this._handleChange}
      />
    );
  },

  renderMobilePhone(){
    let { user } = this.props;
    return (
      <div>
        <TextFieldMobile
          ref = 'emergencyMobile'
          floatingLabelStyle = {this.style('title')}
          style = {this.style('input')}
          defaultValue = {user.emergencyMobile}
          onChange = {this._handleChange}
        />
        <TextFieldPhone
          ref = 'emergencyPhone'
          style = {this.style('input')}
          floatingLabelStyle = {this.style('title')}
          defaultValue = {user.emergencyPhone}
          onChange = {this._handleChange}
        />
      </div>
    );
  },

  render() {
    return (
      <div style = {this.style('root')}>
        {this.renderAvatar()}
        <div style = {this.style('info')}>
          {this.renderUserNames()}
          {this.renderMailRole()}
          {this.renderPosition()}
          {this.renderMobilePhone()}
        </div>
        <RaisedButton
          ref='save'
          label={this.t('nTextSave')}
          style={this.style('save')}
          secondary = {true}
          capitalized = {'Capitalize'}
          onTouchTap = {this._handleSave}
          disabled = {!this.state.isChanged}
        />
        <Snackbar
          open={this.state.open}
          message={this.state.message}
          autoHideDuration={3000}
          onRequestClose={this._handleRequestClose}
        />
      </div>
    );
  },

  _onUploadAvatar(file) {
    this.setState({
      avatar: file,
      isChanged: true,
    });
  },

  _handleEditAvatar(){
    let uploader = this.refs.avatarUploader;
    if(uploader) uploader.chooseFile();
  },

  _handleUpdateAvatar(precent){
    this.setState({precent:precent});
  },

  _handleRequestClose(){
    this.setState({
      open:false,
      message: null
    });
  },

  _handleChange(){
    if(!this.state.isChanged) this.setState({isChanged: true});
  },

  _handleSave(){
    let arr = [];
    _.forEach(this.refs,(value,key)=>{
      if(this.refs[key].isValid){
        arr.push(this.refs[key].isValid());
      }
    })
    return Promise.all(arr).then(val=>{
      let valide = _.reduce(_.flatten(val),(init,val)=>{return init && val;},true);
      if(valide){
        let value = this.getValue();
        if(this.props.updateUserProfile) this.props.updateUserProfile(this.props.user.username, value,this.state.avatar,this._handleUpdateAvatar);
      }
    })
  },

});

module.exports = UserProfile;
