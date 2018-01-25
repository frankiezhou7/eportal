const React = require('react')
const { ListItem } = require('epui-md/List')
const RaisedButton = require('epui-md/RaisedButton')
const RawTextFieldUnit = require('epui-md/TextField/TextFieldUnit')
const RawTextField = require('epui-md/TextField/TextField')
const Validatable = require('epui-md/HOC/Validatable')
const AutoStyle = require('epui-auto-style').mixin
const Translatable = require('epui-intl').mixin
const _ = require('eplodash')
const TextFieldUnit = Validatable(RawTextFieldUnit)
const TextField = Validatable(RawTextField)

const PropTypes = React.PropTypes

const {
  findSettingByName,
  updateSettingsById,
} = global.api.epds

const ShipVerify = React.createClass({
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
    isView: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      isView:false
    }
  },

  getInitialState(){
    return {
      email: null,
      changed: false,
      isFetching:false
    }
  },

  componentWillMount() {
    this.setState({ isFetching: true })
    this.getEmail()
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
    }
  },

  checkStatus(response) {
    if (response.status !== 'OK')
      throw new Error(`invalid res.status value: ${response.status}`)
    else
      return response
  },

  getEmail() {
    if (!_.isFunction(findSettingByName)) {
      throw new Error('API:findSettingByName is undefined')
    }
    findSettingByName
    .promise('shipVerifyEmail')
    .then(this.checkStatus)
    .then(r => this.setState({ email: r.response, isFetching: false }))
    .catch(e => {
      alert(this.t('nTextIinitFailed') + e)
    })
  },

  updateEmail(newAddr) {
    if (!_.isFunction(updateSettingsById)) {
      throw new Error('API:updateSettingsById is undefined')
    }
    updateSettingsById
    .promise(this.state.email._id, { value: newAddr, __v: this.state.email.__v })
    .then(this.checkStatus)
    .catch(e => {
      alert(this.t('nTextIinitFailed') + e)
    })
  },

  handleChange(event) {
    // check state first, avoid unnecessary React update
    if(!this.state.changed){
      this.setState({ changed: true })
    }
  },


  handleSubmit() {
    let addr = this.refs.emailAddr
    // do nothing when the Email-Address input is empty
    if (!addr)
      return

    // check valid before updating email address.
    addr.isValid()
    .then(valid => {
      if (valid) {
        this.setState({ changed: false })
        this.updateEmail(addr.getValue())
      }
    })
  },

  renderBtn() {
    return this.props.isView ? null: (
      <div style = {this.s('footer')}>
        <RaisedButton
          label = {this.t('nTextSave')}
          primary = {true}
          onClick = {this.handleSubmit}
          disabled = {!this.state.changed}
        />
      </div>
    )
  },

  renderShipVerifyEmail() {
    return (
      <div style = {this.s('content')}>
        <div style={{ fontSize: 16 }}>{this.t('nLabelShipVerifyEmailInfo')}</div>
        <div>{ this.state.email.value }</div>
      </div>
    )
  },

  renderEditShipVerifyEmail() {
    return (
      <div style = {this.s('content')}>
        <div style={{ fontSize: 16 }}>{this.t('nLabelShipVerifyEmailInfo')}</div>
        <TextField
          ref = 'emailAddr'
          style = { _.assign({}, this.s('textField'), { width: 750 }) }
          validType='string'
          onChange = {this.handleChange}
          hintText = { this.state.email.value }
          disabled = {this.props.isView}
          required
        />
      </div>
    )
  },

  render() {
    return this.state.isFetching ? null: (
      <div style={ this.s('root') }>
        <div style = { this.s('header') }>
          {this.props.isView ? this.t('nShipVerifyEmail') : this.t('nChangeShipVerifyEmail')}
        </div>
        {this.props.isView ? this.renderShipVerifyEmail() : this.renderEditShipVerifyEmail()}
        {this.renderBtn()}
      </div>
    )
  },

})

module.exports = ShipVerify
