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


const ActionForm = React.createClass({
  mixins: [AutoStyle],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    loading: PropTypes.bool,
    action: PropTypes.object,
    errorText: PropTypes.string,
    onChange: PropTypes.func,
    onSave: PropTypes.func,
  },

  getDefaultProps() {
    return {
      loading: false,
      canDelete: false,
    };
  },

  getInitialState() {
    return {}
  },

  getStyles() {
    return {
      root: this.props.style,
      button: {
        marginTop: 16,
      }
    };
  },

  getValue() {
    const action = this.props.action;

    return {
      action: this.refs.action.getValue(),
    };
  },

  isAdding() {
    return !this.props.action;
  },

  renderHeader() {
    const text = this.isAdding() ? 'Add new action' : 'Edit action';
    return (<span>{text}</span>);
  },

  render() {
    const loading = this.props.loading;
    const hasError = !!this.props.errorText;

    return (
      <div style={this.s('root')}>
        {this.renderHeader()}
        <TextField
          ref='action'
          name='action.name'
          disabled={loading}
          floatingLabelText='Name'
          fullWidth={true}
          errorText={this.props.errorText}
          onChange={this._handleChange}
        />
        <RaisedButton
          ref='save'
          disabled={loading || hasError}
          style={this.s('button')}
          label='Save'
          fullWidth={true}
          onTouchTap={this._handleSave}
        />
      </div>
    );
  },

  _handleSave() {
    if(!this.props.onSave) { return; }
    const act = this.getValue();
    debug('服务保存', act);
    this.props.onSave(this, act);
  },

  _handleChange() {
    if(!this.props.onChange) { return; }
    const act = this.getValue();
    debug('服务更改', act);
    this.props.onChange(this, act);
  }
});

module.exports = ActionForm
