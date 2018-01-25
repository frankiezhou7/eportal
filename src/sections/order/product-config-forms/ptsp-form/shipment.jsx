const React = require('react');
const IconButton = require('epui-md/IconButton');
const DeleteIcon = require('epui-md/svg-icons/action/delete');
const TextFieldUnit = require('epui-md/TextField/TextFieldUnit');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;


let Shipment = React.createClass({

  mixins: [StylePropable, Translatable,PureRenderMixin],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    item: PropTypes.object,
    nTextRemove: React.PropTypes.string,
    nTextHandlingCharge: React.PropTypes.string,
    nTextHandlingChargeUnit: React.PropTypes.string,
    nLabelTextProductWeight: React.PropTypes.string,
    nLabelTextProductWeightUnit: React.PropTypes.string,
    handleChargeCode: React.PropTypes.string,
    productWeightCode: React.PropTypes.string,
    disabled: PropTypes.bool,
    onTouchTapDeleteBtn: PropTypes.func,
  },

  getDefaultProps() {
    return {
      item:{},
      disabled: false
    };
  },

  getInitialState(){
    return{

    };
  },

  getTheme() {
    return this.context.muiTheme.rawTheme.palette;
  },

  getStyles() {
    let dropDownMenuMarginTop =0;
    let theme = this.getTheme();
    return {
      child:{
        marginRight: 10,
        display: 'inline-block',
        width: 256,
      },
      deleteIconStyle: {
        fill: theme.greyColor,
      },
      deleteIconButton:{
        verticalAlign: 'bottom',
      },
    };
  },

  render() {
    let styles = this.getStyles();
    return (
      <div>
        <TextFieldUnit
          ref={this.props.item[this.props.handleChargeCode].ref}
          key={this.props.item[this.props.handleChargeCode].key}
          defaultValue={1}
          floatingLabelText={this.t('nTextHandlingCharge')}
          unitLabelText= {this.t('nTextHandlingChargeUnit')}
          style= {this.mergeAndPrefix(styles.child)}
          disabled={this.props.item[this.props.handleChargeCode].disabled}
        />
        <TextFieldUnit
          ref={this.props.item[this.props.productWeightCode].ref}
          key={this.props.item[this.props.productWeightCode].key}
          defaultValue={this.props.item[this.props.productWeightCode].weight}
          floatingLabelText={this.t('nLabelTextProductWeight')}
          unitLabelText={this.t('nLabelTextProductWeightUnit')}
          style= {this.mergeAndPrefix(styles.child)}
          disabled={this.props.item[this.props.productWeightCode].disabled}
        />
        <IconButton
          title = {this.t('nTextRemove')}
          disabled={this.props.disabled}
          style={styles.deleteIconButton}
          onTouchTap={this._handleTouchTapRemove}>
          >
          <DeleteIcon style={styles.deleteIconStyle}/>
        </IconButton>
      </div>
    );
  },

  _handleTouchTapRemove(){
    if(this.props.onTouchTapDeleteBtn)
    this.props.onTouchTapDeleteBtn(this.props.item.id);
  },

});

module.exports = Shipment;
