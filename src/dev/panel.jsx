const React = require('react');
const { bindActionCreators } = require('redux');
const { connect } = require('react-redux');
const PropTypes = React.PropTypes;
const store = require('../store')

const { fetchMe, login, logout } = global.api.user;
const { findAccountById } = global.api.order;

const Panel = React.createClass({
  propTypes: {
    user: PropTypes.object,
    fetchMe: PropTypes.func,
  },

  componentWillMount() {
  },

  componentWillReceiveProps(nextProps) {
  },

  componentDidMount() {

  },

  componentDidUpdate(prevProps, prevState) {
  },

  render() {
    let user = this.props.user;

    let isLoading = user && user.getMeta('loading');
    let error = user && user.getMeta('error');
    let actions = user && user.getMeta('actions');

    return (
      <div>
        <div>User._id:<span>{user && user._id}</span></div>
        <div>User.loading:<span>{isLoading ? 'true' : 'false'}</span></div>
        <div>User.error:<span>{error && error.message}</span></div>
        <div>User.actions:<span>{actions && actions.length}</span></div>
      </div>
    )
  }
});

module.exports = connect(
  (state, props) => {
    // let user = state.session.get('user');
    // debug('wiring props', user);
    return {
      user: state.session.get('user'),
      local: state.lastLogin,
    };
  },
  // (dispatch) => bindActionCreators({ fetchMe, login, logout, findAccountById }, dispatch)
)(Panel);

store.dispatch(fetchMe());
