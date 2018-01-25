const _ = require('eplodash');
const React = require('react');
const Toggle = require('epui-md/Toggle');
const AutoStyle = require('epui-auto-style').mixin;
const IconError = require('epui-md/svg-icons/alert/error');
const IconCheck = require('epui-md/svg-icons/action/check-circle');
const IconAdd = require('epui-md/svg-icons/content/add');
const IconEdit = require('epui-md/svg-icons/editor/mode-edit');
const IconClose = require('epui-md/svg-icons/navigation/close');
const IconButton = require('epui-md/IconButton');
const RaisedButton = require('epui-md/RaisedButton');
const RawTextField = require('epui-md/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const { List, ListItem, MakeSelectable } = require('epui-md/List');

const PropTypes = React.PropTypes;
const TextField = Validatable(RawTextField);
const SelectableList = MakeSelectable(List);

const apiAuth = global.api && global.api.auth;

const FormAccessRole = React.createClass({
  mixins: [AutoStyle],

  propTypes: {
    style: PropTypes.object,
    loading: PropTypes.bool,
    value: PropTypes.object,
    onSave: PropTypes.func,
    validateCode: PropTypes.func,
    validateName: PropTypes.func,
  },

  getDefaultProps() {
    return {
      loading: false
    };
  },

  getValue() {
    const { _id, __v } = this.props.value || {};
    const { name, code, comment } = this.refs;

    return {
      _id,
      __v: __v || 0,
      name: name.getValue(),
      code: code.getValue(),
      comment: comment.getValue(),
    }
  },

  isValid() {
    const { name, code, comment } = this.refs;

    return new Promise((res, rej) => {
      Promise.all([
        name.isValid(),
        code.isValid(),
        comment.isValid()
      ]).then(OKs => {
        res(_.reduce(OKs, (res, yes) => res && yes, true));
      }).catch(rej);
    });
  },

  getStyles() {
    return {
      root: _.merge({

      }, this.props.style)
    };
  },

  render() {
    const value = this.props.value || {};
    const loading = this.props.loading;

    return (
      <div style={this.s('root')}>
        <TextField
          name='role.name'
          ref='name'
          disabled={loading}
          defaultValue={value.name}
          floatingLabelText='Name'
          floatingLabelFixed={true}
          fullWidth={true}
          minLength={4}
          maxLength={16}
          checkOnChange={true}
          validError='must have length between 4 and 32, and be unique in system'
          validFunc={this._validateName}
          required
        />
        <TextField
          name='role.code'
          ref='code'
          disabled={loading}
          defaultValue={value.code}
          floatingLabelText='Code'
          floatingLabelFixed={true}
          fullWidth={true}
          minLength={4}
          maxLength={16}
          checkOnChange={true}
          pattern={/^AR([A-Z0-9]*)$/}
          validError='must have length between 4 and 16, and start with "AR"'
          validFunc={this._validateCode}
          required
        />
        <TextField
          name='role.comment'
          ref='comment'
          disabled={loading}
          defaultValue={value.comment}
          floatingLabelText='Comment'
          floatingLabelFixed={true}
          multiLine={true}
          rows={3}
          rowsMax={3}
          maxLength={512}
          fullWidth={true}
        />
        <RaisedButton
          label='Save'
          disabled={loading}
          fullWidth={true}
          onTouchTap={this._handleTouchTapSave}
        />
      </div>
    );
  },

  _validateName(name) {
    if(this.props.validateName) {
      const { _id } = this.props.value || {};
      return this.props.validateName(name, _id);
    }
    return true;
  },

  _validateCode(code) {
    if(this.props.validateCode) {
      const { _id } = this.props.value || {};
      return this.props.validateCode(code, _id);
    }
    return true;
  },

  _handleTouchTapSave(e) {
    this.isValid().then(yes => {
      if(!yes) { return; }
      if(this.props.onSave) {
        this.props.onSave(this, this.getValue());
      }
    })
  }
});

module.exports = FormAccessRole;
