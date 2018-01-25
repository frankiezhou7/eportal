const React = require('react')
const RaisedButton = require('epui-md/RaisedButton')
const DropDownAccounts = require('~/src/shared/dropdown-accounts')
const AutoStyle = require('epui-auto-style').mixin
const Translatable = require('epui-intl').mixin
const _ = require('eplodash')
const TYPES = require('~/src/shared/constants').ACCOUNT_TYPE

const PropTypes = React.PropTypes

const {
  findSettingByName,
  updateSettingsById,
  removeSettingsById,
} = global.api.epds

const DefaultConsignee = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/Settings/${__LOCALE__}`),
  ],

  contextTypes: {
    router: PropTypes.object,
    muiTheme: PropTypes.object,
  },

  propTypes: {

  },

  getDefaultProps() {
    return {

    }
  },

  getInitialState(){
    return {
      account: null,
      changed: false,
      isFetching:false,
      removed: true,
    }
  },

  componentWillMount() {
    this.setState({isFetching:true})
    this.getDefaultCosignee()
  },

  getStyles() {
    return {
      root: {
        minHeight: 100,
        border: '1px solid #eaeaea',
        backgroundColor: 'white',
        marginTop: 20
      },
      header:{
        borderBottom: '1px solid #eaeaea',
        height: 50,
        fontSize: 20,
        lineHeight: '50px',
        paddingLeft: 10
      },
      content:{
        padding: 20,
      },
      textField:{
        width: 100,
      },
      footer:{
        margin: 20,
        textAlign: 'right'
      },
      rate:{
        marginLeft: 5,
        marginRight: 5,
      },
      button: {
        marginRight: 15,
      }
    }
  },

  checkStatus(response) {
    if (response.status !== 'OK')
      throw new Error(`invalid res.status value: ${response.status}`)
    else
      return response
  },

  getDefaultCosignee() {
    if (!_.isFunction(findSettingByName)) {
      throw new Error('API:findSettingByName is undefined')
    }
    findSettingByName
    .promise('defaultConsignee')
    .then(this.checkStatus)
    .then((r) => {
      if (r.status === 'OK') {
        this.setState({ consignee: r.response, isFetching: false })
        if(r.response.value) this.setState({ removed: false });
      } else {

      }
    })
    .catch(e => {
      alert(this.t('nTextIinitFailed') + e);
    })
  },

  updateDefaultCosignee(consignee) {
    if (!_.isFunction(updateSettingsById)) {
      throw new Error('API:updateSettingsById is undefined')
    }
    updateSettingsById
    .promise(this.state.consignee._id, { value: consignee, __v: this.state.consignee.__v })
    .then(this.checkStatus)
    .then((r) => {
      if (r.status === 'OK') {
        if(r.response.value) this.setState({ removed: false });
      } else {

      }
    })
    .catch(e => {
      alert(this.t('nTextIinitFailed') + e)
    })
  },

  removeDefaultCosignee() {
    if (!_.isFunction(removeSettingsById)) {
      throw new Error('API:removeSettingsById is undefined')
    }
    removeSettingsById
    .promise(this.state.consignee._id, this.state.consignee.__v)
    .then(this.checkStatus)
    .then((r) => {
      if (r.status === 'OK') {
        this.setState({ removed: true, isFetching: true });
        this.getDefaultCosignee();
        alert('success removed');
      } else {

      }
    })
    .catch(e => {
      alert(this.t('nTextRemoveFailed') + e)
    })
  },


  handleChange(event) {
    if(!this.state.changed){
      this.setState({ changed: true })
    }
  },


  handleSubmit() {
    let accout = this.refs.account
    if (!accout) {
      return
    }

    this.setState({ changed: false });
    this.updateDefaultCosignee(accout.getValue());
  },

  handleRemove() {
    this.removeDefaultCosignee();
  },

  renderBtn() {
    return (
      <div style = {this.s('footer')}>
        {/*<RaisedButton
          label = { this.t('nTextRemove') }
          secondary = { true }
          onClick = { this.handleRemove }
          disabled = { this.state.removed }
          style={this.s('button')}
        />*/}
        <RaisedButton
          label = { this.t('nTextSave') }
          primary = { true }
          onClick = { this.handleSubmit }
          disabled = { !this.state.changed }
        />
      </div>
    )
  },

  renderDefaultAccount() {
    let prevAgency = (this.state.consignee && this.state.consignee.value) ?
                          this.state.consignee.value.text : ''
    let label = this.t('nLabelConsignee') + prevAgency
    return (
      <div style = { this.s('content') }>
        <DropDownAccounts
          ref='account'
          type='consignee'
          onChange={ this.handleChange }
          label={ label }
          value={this.state.consignee && this.state.consignee.value}
        />
      </div>
    )
  },

  render() {
    return (
      <div style={ this.s('root') }>
        <div style = { this.s('header') }>
          {this.t('nSetDefaultConsignee')}
        </div>
        {this.renderDefaultAccount()}
        {this.renderBtn()}
      </div>
    )
  },
})

module.exports = DefaultConsignee
