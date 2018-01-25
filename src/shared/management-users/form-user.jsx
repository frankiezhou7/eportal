const _ = require('eplodash');
const React = require('react');
const Toggle = require('epui-md/Toggle');
const AutoStyle = require('epui-auto-style').mixin;
const Translatable = require('epui-intl').mixin;
const RaisedButton = require('epui-md/RaisedButton');

const { ComposedForm, use } = require('epui-composer');
const PropTypes = React.PropTypes;
const apiUser = global.api && global.api.user;


use(require('../text-field-username'));
use(require('../text-field-user-names'));
use(require('../text-field-email'));
use(require('../text-field-mobile'));

const FormUser = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/User/${__LOCALE__}`)
  ],

  propTypes: {
    mode: PropTypes.oneOf(['create', 'update']),
    style: PropTypes.object
  },

  getDefaultProps() {
    return {
      mode: 'create'
    };
  },

  getInitialState() {
    return { value: {} }
  },

  getValue() {
    if(!this.refs.form) { return; }
    return this.refs.form.getValue();
  },

  clearValue() {
    if(!this.refs.form) { return; }
    return this.refs.form.clearValue();
  },

  isValid() {
    if(!this.refs.form) { return; }
    return this.refs.form.isValid();
  },

  isChanged() {
    if(!this.refs.form) { return; }
    return this.refs.form.isChanged();
  },

  getStyles() {
    return {
      root: _.merge({

      }, this.props.style)
    };
  },

  getDefinitions() {
    return [{
      component: 'Section',
      props: {
        type: 'vertical',
        title: '@nTitleUserGeneralInfo',
      },
      children: [{
          component: 'TextFieldUsername',
          name: 'username',
          valuePath: 'username',
          props: {
            required: true
          },
        }, {
          component: 'TextFieldUserNames',
          name: 'name',
          valuePath: 'name',
          props: {
            required: true
          },
      }]
    }, {
      component: 'Section',
      props: {
        type: 'vertical',
        title: '@nTitleUserEmergencyContactInfo',
      },
      children: [{
          component: 'TextFieldEmail',
          name: 'emergencyEmail',
          valuePath: 'emergencyEmail',
          props: {
            required: true
          },
        }, {
          component: 'TextFieldMobile',
          name: 'emergencyMobile',
          valuePath: 'emergencyMobile'
      }]
    }]
  },

  render() {
    return (
      <div>
        <ComposedForm
          ref='form'
          definitions={this.getDefinitions()}
          translate={this.t}
          defaultValue={this.state.value}
          willCompose={this._handleWillCompose}
        />
        <RaisedButton
          label='GetValue'
          onTouchTap={this._handleGetValue}
        />
        <RaisedButton
          label='SetValue'
          onTouchTap={this._handleSetValue}
        />
        <RaisedButton
          label='Validate'
          onTouchTap={this._handleValidate}
        />
      </div>
    );
  },

  _handleWillCompose(ref) {
    const { mode } = this.props;

    return {
      username: {
        disabled: mode !== 'create'
      }
    };
  },

  _handleValidate() {
    // this.isValid().then(v => console.log(v));
  },

  _handleGetValue() {
    // console.log(this.getValue());
  },

  _handleSetValue() {
    this.setState({
      value: {
        username: 'TestUserName#',
        name: {
          givenName: 'Tommy',
          surname: 'George',
        },
        emergencyEmail: 'zhi@e-ports.com',
        emergencyMobile: '13401029473',
      }
    });
  },
});

module.exports = FormUser;
