const React = require('react');
const Router = require('react-router');
const RouteHandler = Router.RouteHandler;
const Translatable = require('epui-intl').mixin;
require('~/src/stores/port');
const Port = require('./port');
// const store = alt.findStore('port');
// const actions = alt.findActions('port');

const PortForm = React.createClass({
  mixins: [Router.State, Translatable],

  propTypes: {
    router: React.PropTypes.func,
    params: React.PropTypes.object,
  },

  componentWillMount() {
    let portId = this.props.params.portId;

    if(!portId) {
      //TODO:
      return;
    }

    actions.findPortById(portId);
  },

  componentWillReceiveProps(nextProps) {
    let newId = nextProps.params.portId;
    let oldId = this.props.params.portId;
    if(newId !== oldId) {
      actions.findPortById(newId);
    }
  },

  _shouldComponentUpdate(props) {
    return true;
  },

  // render() {
  //   return (
  //     <AltContainer
  //       store={store}
  //       shouldComponentUpdate={this._shouldComponentUpdate}
  //     >
  //       <Port />
  //     </AltContainer>
  //   );
  // }

  render() {
    return(
      <div>TODO: rewrite port form</div>
    );
  },
});

module.exports = PortForm;
