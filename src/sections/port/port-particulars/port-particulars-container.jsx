const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const PortParticulars = require('./port-particulars');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
require('~/src/stores/port');
// const store = alt.findStore('port');
// const actions = alt.findActions('port');

const PortParticularsContainer = React.createClass({

  mixins: [AutoStyle, Translatable],

  propTypes: {
    portId: PropTypes.string,
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
  //       actions={actions}
  //       store={store}
  //       inject={{
  //         portId: this.props.portId,
  //       }}
  //     >
  //       <PortParticulars />
  //     </AltContainer>
  //   );
  // }

  render() {
    return(
      <div>TODO: rewrite port particulars container</div>
    );
  },
});

module.exports = PortParticularsContainer;
