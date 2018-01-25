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

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    getInvitationLetterTypes: PropTypes.func,
    getIssuingAuthorities: PropTypes.func,
    getSeamanClasses: PropTypes.func,
    invitationLetterTypes: PropTypes.object,
    issuingAuthorities: PropTypes.object,
    mode: PropTypes.string,
    style: PropTypes.object,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    productConfig: PropTypes.object,
    seaManClasses: PropTypes.object,
  },

  componentDidMount() {
    let {
      getInvitationLetterTypes,
      getIssuingAuthorities,
      getSeamanClasses,
      invitationLetterTypes,
      issuingAuthorities,
      seaManClasses,
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

    if (!seaManClasses || seaManClasses.size === 0) {
      if (_.isFunction(getSeamanClasses)) {
        getSeamanClasses();
      }
    }
  },

  getStyles() {
    let rootStyle = {
      display: 'bolck',
    };
    if(this.props.style) {
      _.merge(rootStyle, this.props.style);
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
      seaManClasses,
    } = this.props;

    return (
      <Form
        {...this.props}
        style={this.style('root')}
        ref='form'
        key='form'
        order={order}
        mode={mode}
        orderEntry={orderEntry}
        productConfig={productConfig}
      />
    );
  },
});

// render() {
//   return (
//     <AltContainer
//       ref='container'
//       render={this.renderForm}
//       stores={[store]}
//       inject={{
//         seaManClasses: this._getSeaManClasses,
//         invitationLetterTypes: this._getInvitationLetterTypes,
//         issuingAuthorities: this._getIssuingAuthorities
//       }}
//     />
//   );
// },

let {
  getInvitationLetterTypes,
  getIssuingAuthorities,
  getSeamanClasses,
} = global.api.epds;

module.exports = connect(
  (state, props) => {
    return {
      ...props,
      invitationLetterTypes: state.get('invitationLetterTypes'),
      issuingAuthorities: state.get('issuingAuthorities'),
      seaManClasses: state.get('seaManClasses'),
      getInvitationLetterTypes,
      getIssuingAuthorities,
      getSeamanClasses,
    };
  },
  null,
  null,
  {withRef: true}
)(FormContainer);
