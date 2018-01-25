const React = require('react');
const AddAnchorageDialog = require('./add-anchorage-dialog');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;

const PropTypes = React.PropTypes;
require('~/src/stores/anchorage');
// const store = alt.findStore('anchorage');
// const actions = alt.findActions('anchorage');


const AddAnchorageDialogContainer = React.createClass({

  mixins: [AutoStyle, Translatable],

  propTypes: {

  },

  getDefaultProps() {
    return {

    };
  },

  getInitialState() {
    return {

    };
  },

  getStyles() {
    let styles = {
      root: {

      }
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
  //         createAnchorage() {
  //           return actions.createAnchorage;
  //         },
  //         createAnchorageInMode() {
  //           return actions.createAnchorageInMode;
  //         },
  //         findAnchorageByIdInMode() {
  //           return actions.findAnchorageByIdInMode;
  //         },
  //         updateAnchorageById() {
  //           return actions.updateAnchorageById;
  //         },
  //       }}
  //     >
  //       <AddAnchorageDialog />
  //     </AltContainer>
  //   );
  // }

  render() {
    return(
      <div>TODO: add anchorage dialog</div>
    );
  },

});

module.exports = AddAnchorageDialogContainer;
