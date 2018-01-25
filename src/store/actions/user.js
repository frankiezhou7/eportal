const LOGOFF = '@@USER/LOGOFF';
const RESET = '@@USER/RESET';

module.exports = {
  LOGOFF: LOGOFF,
  RESET: RESET,
  logoff: function () {
    return {
      type: LOGOFF,
    };
  },
  reset: function() {
    return {
      type: RESET,
    };
  },
}
