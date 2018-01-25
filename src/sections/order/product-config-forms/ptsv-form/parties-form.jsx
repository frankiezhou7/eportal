const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const TextField = require('epui-md/TextField/TextField');
const AddButton = require('epui-md/svg-icons/content/add');

const PropTypes = React.PropTypes;

let PartiesForm = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    config: PropTypes.object,
    productCode: PropTypes.string,
    nLabelParty: PropTypes.string,
    nLabelPartyName: PropTypes.string,
    nTextAddParty: PropTypes.string,
  },

  getDefaultProps() {
    return {
      config: null,
      productCode : null,
    };
  },

  getInitialState: function() {
    let config = this.props.config;
    return {
      parties: (config && config.parties) ? config.parties:[]
    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let padding =10;
    let theme = this.getTheme();
    let styles = {
      root:{
        marginLeft: padding,
        paddingTop :padding,
        paddingBottom :padding,
        marginRight: 12,
      },
      textField:{
        marginRight : 10,
        width : 200,
      },
      title:{
        fontSize: 15,
        fontWeight: 300,
        display: 'block',
      },
      addParty:{

      },
      addBtn:{
        verticalAlign: 'middle',
        fill: theme.primary1Color,
      },
      addBtnLabel:{
        display: 'inline-block',
        marginLeft: 2,
        verticalAlign: 'middle',
        color: theme.primary1Color,
      },
      addPartyBtn:{
        display: 'inline-block',
        cursor: 'pointer',
      },
    };
    return styles;
  },

  getParties(){
    return _.compact(this.state.parties);
  },

  renderAddParty(){
    return(
      <div style = {this.style('addParty')}>
        <div
          style = {this.style('addPartyBtn')}
          onClick = {this._handleAddParty}
        >
          <AddButton style = {this.style('addBtn')}/>
          <span style = {this.style('addBtnLabel')}>{this.t('nTextAddParty')}</span>
        </div>
      </div>
    );
  },

  renderTitle(){
    return <span style = {this.style('title')}>{this.t('nLabelParty')}</span>;
  },

  renderParties(){
    let parties = this.state.parties;
    let partiesElems = _.map(parties,party=>{
      let key = party|| Math.random()*1001;
      return(
        <TextField
            ref = {key}
            key = {key}
            style = {this.style('textField')}
            defaultValue = {party}
            floatingLabelText={this.t('nLabelPartyName')}
        />
      );
    });
    return partiesElems;
  },

  render() {
    let styles = this.getStyles();
    return (
      <div style = {this.style('root')}>
        {this.renderTitle()}
        {this.renderParties()}
        {this.renderAddParty()}
      </div>
    );
   },

  _handleAddParty(){
    let parties = this.state.parties;
    parties.push('');
    this.setState({parties:parties});
  },

});

module.exports = PartiesForm;
