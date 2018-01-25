const React = require('react');
const AddBerthDialog = require('./add-berth-dialog');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;
require('~/src/stores/berth');
// const store = alt.findStore('berth');
// const actions = alt.findActions('berth');


const AddBerthDialogContainer = React.createClass({

  mixins: [AutoStyle, Translatable],

  propTypes: {

  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  // render() {
  //   let styles = this.getStyles();
  //
  //   return (
  //     <AltContainer
  //       ref='container'
  //       store={store}
  //       inject={{
  //         createBerth() {
  //           return actions.createBerth;
  //         },
  //         createBerthInMode() {
  //           return actions.createBerthInMode;
  //         },
  //         findBerthByIdInMode() {
  //           return actions.findBerthByIdInMode;
  //         },
  //         updateBerthById() {
  //           return actions.updateBerthById;
  //         },
  //       }}
  //     >
  //       <AddBerthDialog />
  //     </AltContainer>
  //   );
  // }

  render() {
    return(
      <div>TODO: add berth dialog container</div>
    );
  },

});

module.exports = AddBerthDialogContainer;
