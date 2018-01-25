const _ = require('eplodash');
const { bindActionCreators } = require('redux');

function wrap(dispatch) {
  global.ui = {
    navigation: bindActionCreators(require('~/src/store/actions/navigation'), dispatch),
  };

  return global.ui;
};

module.exports = wrap;
