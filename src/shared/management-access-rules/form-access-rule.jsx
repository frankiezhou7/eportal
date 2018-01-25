const _ = require('eplodash');
const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const IconError = require('epui-md/svg-icons/alert/error');
const IconCheck = require('epui-md/svg-icons/action/check-circle');
const IconAdd = require('epui-md/svg-icons/content/add');
const IconDelete = require('epui-md/svg-icons/action/delete');
const IconEdit = require('epui-md/svg-icons/editor/mode-edit');
const IconButton = require('epui-md/IconButton');
const Toggle = require('epui-md/Toggle');
const TextField = require('epui-md/TextField');
const RaisedButton = require('epui-md/RaisedButton');

const PropTypes = React.PropTypes;


const FormAccessRule = React.createClass({
  mixins: [AutoStyle],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    resource: PropTypes.string.isRequired,
    style: PropTypes.object,
    loading: PropTypes.bool,
    rule: PropTypes.object,
    errorText: PropTypes.string,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    onSave: PropTypes.func,
  },

  getDefaultProps() {
    return {
      loading: false,
    };
  },

  getInitialState() {
    return {}
  },

  getStyles() {
    return {
      root: this.props.style,
      toggle: {
        marginTop: 16,
      },
      button: {
        marginTop: 16,
      }
    };
  },

  getValue() {
    const rule = this.props.rule;

    return {
      _id: rule && rule._id,
      __v: rule && rule.__v,
      resource: this.props.resource,
      name: this.refs.name.getValue(),
      comment: this.refs.comment.getValue(),
      forIndividual: this.refs.forIndividual.isToggled(),
    }
  },

  isAdding() {
    return !this.props.rule;
  },

  renderHeader() {
    const text = this.isAdding() ? 'Add new rule' : 'Edit rule';
    return (<span>{text}</span>);
  },

  render() {
    const { name, comment, forIndividual } = this.props.rule || {};
    const loading = this.props.loading;
    const isAdding = this.isAdding();

    return (
      <div style={this.s('root')}>
        {this.renderHeader()}
        <TextField
          ref='name'
          name='rule.name'
          disabled={loading}
          floatingLabelText='Name'
          defaultValue={name}
          fullWidth={true}
          errorText={this.props.errorText}
          onChange={this._handleChange}
        />
        <TextField
          ref='comment'
          name='rule.comment'
          disabled={loading}
          floatingLabelText='Comment'
          defaultValue={comment}
          fullWidth={true}
        />
        <Toggle
          ref='forIndividual'
          disabled={loading}
          style={this.s('toggle')}
          defaultToggled={forIndividual}
          label='Resource Entity Only'
        />
        <RaisedButton
          ref='save'
          disabled={loading}
          style={this.s('button')}
          label='Save'
          fullWidth={true}
          onTouchTap={this._handleSave}
        />
        { isAdding ? null : (
          <RaisedButton
            ref='delete'
            disabled={loading}
            style={this.s('button')}
            label='Delete'
            fullWidth={true}
            onTouchTap={this._handleDelete}
          />
        )}
      </div>
    );
  },

  _handleSave() {
    if(!this.props.onSave) { return; }
    const rule = this.getValue();
    debug('规则保存', rule);
    this.props.onSave(this, rule);
  },

  _handleDelete() {
    if(!this.props.onDelete) { return; }
    const rule = this.getValue();
    debug('规则删除', rule);
    this.props.onDelete(this, rule);
  },

  _handleChange() {
    if(!this.props.onChange) { return; }
    const rule = this.getValue();
    debug('规则更改', rule);
    this.props.onChange(this, rule);
  }
});

module.exports = FormAccessRule
