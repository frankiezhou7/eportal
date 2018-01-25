const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Form = require('./form');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');

const FormContainer = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/ProductConfig/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    invitationLetterTypes: PropTypes.object,
    issuingAuthorities: PropTypes.object,
    mode: PropTypes.string,
    style: PropTypes.object,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
  },

  componentDidMount() {
    let {
      invitationLetterTypes,
      issuingAuthorities,
    } = this.props;

    if (!invitationLetterTypes || invitationLetterTypes.size === 0) {
      if (_.isFunction(getInvitationLetterTypes)) {
        getInvitationLetterTypes();
      }
    }

    if (!issuingAuthorities || issuingAuthorities.size === 0) {
      if (_.isFunction(getIssuingAuthorities)) {
        getIssuingAuthorities();
      }
    }
  },

  getStyles() {
    let rootStyle = {
      display: 'bolck',
    };
    if(this.props.style){
      _.merge(rootStyle,this.props.style);
    }
    return {
      root: rootStyle,
    };
  },

  render() {
    let {
      mode,
      order,
      orderEntry,
      productConfig,
      issuingAuthorities
    } = this.props;

    return (
      <Form
        {...this.props}
        style={this.style('root')}
        ref='form'
        mode={mode}
        order={order}
        orderEntry={orderEntry}
        productConfig={productConfig}
      />
    );
  },
});

let {
  getInvitationLetterTypes,
  getIssuingAuthorities,
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      invitationLetterTypes: state.get('invitationLetterTypes'),
      issuingAuthorities: state.get('issuingAuthorities'),
      getInvitationLetterTypes,
      getIssuingAuthorities,
    };
  },
  null,
  null,
  {withRef: true}
)(FormContainer);
