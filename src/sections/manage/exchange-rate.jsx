const React = require('react');
const { ListItem } = require('epui-md/List');
const RaisedButton = require('epui-md/RaisedButton');
const RawTextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const Validatable = require('epui-md/HOC/Validatable');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const _ = require('eplodash');
const TextFieldUnit = Validatable(RawTextFieldUnit);

const PropTypes = React.PropTypes;

const {
  getExchanges,
  updateExchangeById,
  findExchangeByCurrencyCode
} = global.api.epds;

const ExchangeRate = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Global/${__LOCALE__}`),
    require(`epui-intl/dist/Common/${__LOCALE__}`),
    require(`epui-intl/dist/ExchangeRate/${__LOCALE__}`),
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
    };
  },

  getInitialState(){
    return {
      exchange: null,
      changed: false,
      isFetching:false
    }
  },

  componentWillMount() {
    this.setState({isFetching:true});
    this.getExchanges();
  },

  getStyles() {
    return {
      root: {
        minHeight: 100,
        border: '1px solid #eaeaea'
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
    };
  },

  getExchanges() {
    if(_.isFunction(findExchangeByCurrencyCode)) {
      findExchangeByCurrencyCode
        .promise('USD')
        .then((res) => {
          if (res.status === 'OK') {
              this.setState({
                exchange: res.response,
                isFetching: false
              });
          } else {
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err => {
          alert(this.t('nTextIinitFailed') + err);
          //todo: deal with err
        });
    }
  },

  updateExchange(rate) {
    if (_.isFunction(updateExchangeById)) {
      updateExchangeById
        .promise(this.state.exchange._id,{rate:rate,__v:this.state.exchange.__v})
        .then((res) => {
          if (res.status !== 'OK') {
            alert(this.t('nTextIinitFailed'));
            //todo: deal with error
          }
        }).catch(err => {
          alert(this.t('nTextIinitFailed') + err);
          //todo: deal with err
        });
    }
  },

  handleChange(event){
    if(!this.state.changed){
      this.setState({changed: true});
    }
  },

  handleSubmit(){
    let usd = this.refs.usd;
    if(usd) {
      usd.isValid().then((res)=>{
        if(res){
          this.setState({changed:false});
          this.updateExchange(usd.getValue());
        }
      });
    }
  },

  renderBtn(){
    return this.props.isView ? null: (
      <div style = {this.s('footer')}>
        <RaisedButton
          label = {this.t('nTextSave')}
          primary = {true}
          onClick = {this.handleSubmit}
          disabled = {!this.state.changed}
        />
      </div>
    );
  },

  renderViewRate(){
    return (
      <div style = {this.s('content')}>
        <span>{this.t('nLabelOneDollar')}</span>
        <span style = {this.s('rate')}>{this.state.exchange.rate}</span>
        <span>{this.t('nLabelRMB')}</span>
      </div>
    )
  },

  renderEditRate(){
    return (
      <div style = {this.s('content')}>
        <TextFieldUnit
          ref = 'usd'
          style = {this.s('textField')}
          floatingLabelText= {this.t('nLabelOneDollar')}
          unitLabelText = {this.t('nLabelRMB')}
          validType='number'
          onChange = {this.handleChange}
          defaultValue = {this.state.exchange.rate}
          disabled = {this.props.isView}
          required
        />
      </div>
    )
  },

  render() {
    return this.state.isFetching ? null:(
      <div style={this.s('root')}>
        <div style = {this.s('header')}>
          {this.props.isView ? this.t('nTextRate'):this.t('nTextChangeRate')}
        </div>
        {this.props.isView ? this.renderViewRate():this.renderEditRate()}
        {this.renderBtn()}
      </div>
    );
  },

});

module.exports = ExchangeRate;
