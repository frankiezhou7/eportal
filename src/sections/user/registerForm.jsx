const React = require('react');
const PropTypes = React.PropTypes;
const Register = require('./register');
const { connect } = require('react-redux');
const { register, userExists } = global.api.user;

const RegisterForm = React.createClass({
  contextTypes: {
    muiTheme: PropTypes.object,
    router: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      available: {
        exists: false,
        loading: false,
      },
      info: {
        error: null,
        loading: false,
        username: null,
      },
    };
  },

  render() {
    return (
      <Register
        available={this.state.available}
        info={this.state.info}
        register={this._register}
        userExists={this._userExists}
      />
    );
  },

  _register(user, avatar) {
    let info = this.state.info;
    info.loading = true;

    this.setState({
      info: info,
    }, () => {
      register
        .promise(user, avatar)
        .then(res => {
          let response = res.response;
          let username = response.username;

          this.setState({
            info: {
              error: null,
              loading: false,
              username,
            },
          });
        })
        .catch(err => {
          this.setState({
            info: {
              loading: false,
              error: err,
              username: null,
            },
          });
        });
    });
  },

  _userExists(name) {
    let available = this.state.available;
    available.loading = true;

    this.setState({
      available: available,
    }, () => {
      userExists
        .promise(name)
        .then(res => {
          let response = res.response;
          let exists = response.exists;

          this.setState({
            available: {
              exists,
              loading: false,
            },
          });
        });
    });
  },
});

module.exports = RegisterForm;
