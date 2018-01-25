const React = require('react');
const SelectField = require('epui-md/SelectField');
const MenuItem = require('epui-md/MenuItem');
const _ = require('eplodash');
const PropTypes = React.PropTypes;

const Translatable = require('epui-intl').mixin;
const AutoStyle = require('epui-auto-style').mixin;


const DropDownRoles = React.createClass({

    mixins: [AutoStyle, Translatable],

    translations: require(`epui-intl/dist/OrganizationDialog/${__LOCALE__}`),


    getStyles () {
     let theme = this.context.muiTheme;

     let styles = {
       root: {
         float: 'left',
       },
     }

     return styles;
   },

    propTypes: {
      nTextLabelText: PropTypes.string,
      items:PropTypes.array,
      onChange: PropTypes.func,
      value: PropTypes.string,
    },

    contextTypes: {
      muiTheme: PropTypes.object,
    },

    getDefaultProps() {
      return {
        value: null,
        nTextLabelText:'Roles',
        items:[{
          text:'Principal',
          value:'consigner',
        },{
          text:'Agent',
          value:'consignee',
        }]
      };
    },

    getInitialState() {
      return {
        value: this.props.value,
      };
    },

    clearValue(){
      this.setState({
        value: null,
      });
    },

    getValue() {
      return this.state.value;
    },

    render() {
      let { items }= this.props;
      let menuItems = _.map(items, item=>{
        return(
          <MenuItem
            key={item.value}
            value={item.value}
            primaryText={this.t('nLabel'+item.text)}
          />
        )
      })
      return (
        <SelectField
          style={this.style('root')}
          onChange={this._handleChange}
          value={this.state.value}
          floatingLabelText={this.props.nTextLabelText}
        >
          {menuItems}
        </SelectField>
      );
    },

    _handleChange(event, index, value) {
      this.setState({
        value:value
      })
    },
})

module.exports = DropDownRoles;
