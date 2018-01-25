const INITIALIZE = '@@INITIALIZE';

module.exports = {
  INITIALIZE,
  initialize: function () {
    return {
      type: INITIALIZE,
    };
  },
}
