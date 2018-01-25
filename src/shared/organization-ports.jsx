const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Chips = require('epui-md/ep/Chips/Chips');
const Dialog = require('epui-md/Dialog');
const Checkbox = require('epui-md/Checkbox');
const DropDownPorts = require('~/src/shared/dropdown-ports');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;

const OrganizationPorts = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    value : PropTypes.array,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    showAll: PropTypes.bool,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    let { value, showAll } = this.props;
    return {
      open: false,
      value: [],
      checked: value && value.length > 0 ? false : showAll ? true : false,
    };
  },

  componentWillMount() {
    let { value } = this.props;
    if(_.isArray(value) && value.length > 0){
      for(let val of value){
        if(!_.isObject(val)) return;
      }
      this.setState({value});
    }else{
      this.setState({value:[]});
    }
  },

  getValue() {
    let { value } = this.state;
    if(this.refs.all && this.refs.all.isChecked()) { return value;}
    let newVal = [];
    for(let val of value){
      newVal.push(val._id)
    }
    return newVal;
  },

  handleCancel() {
    this.setState({
      open: false,
    });
  },

  handleChange() {},

  handleSubmit() {
    let { value } = this.state;
    let val = this.port.getFullValue();
    if(!val) return;
    let newVal = {
      name: val.text,
      _id: val.value
    };

    value.push(newVal);

    this.setState({
      open: false,
      value,
    });
  },

  handleTouchTap() {
    this.setState({
      open: true,
    });
  },

  handleRequestDelete(id) {
    let newVal = _.reject(this.state.value, ['_id', id]);
    if(newVal.length === 0) { this.setState({checked: true}); }
    this.setState({
      value:newVal
    });
  },

  getStyles() {
    let styles = {
      root: {
        display: 'flex',
        height: 24,
        alignItems: 'center',
      },
      label: {
        fontSize: 16,
        marginRight: 10,
      },
      allLabel: {
        width: 'auto',
        paddingRight: 5,
      },
    };
    styles.root = _.assign({}, styles.root, this.props.style);
    styles.label = _.assign({}, styles.label, this.props.labelStyle);
    return styles;
  },

  renderSelectAll(styles) {
    let { checked } = this.state;
    let allElement = (
        <Checkbox
          ref='all'
          label="All Ports"
          style={styles.allLabel}
          labelStyle={styles.allLabel}
          checked={checked}
          onCheck={this._handleCheck}
        />
    );
    return this.props.showAll ? allElement : null;
  },

  renderItems(value, styles) {
    let { label } = this.props;
    let chips = [];
    for (let val of value) {
      chips.push({
        id: val._id,
        label: val.name,
      });
    }

    return (
      <div style={styles.root}>
        {label && <span style={styles.label}>{`${label}:`}</span>}
        {this.renderSelectAll(styles)}
        {!this.state.checked && <Chips
          ref="chips"
          addButtonLabel="Add Port"
          chips={chips}
          onAdd={this.handleTouchTap}
          onRequestDelete={this.handleRequestDelete}
          primary
          showAddButton
          style={label && {width: 'auto'}}
        />}
      </div>
    );
  },

  render() {
    let {
      style,
      ...other,
    } = this.props;

    let {
      open,
      selected,
      value,
    } = this.state;

    let styles = this.getStyles();

    const actions = [
      <FlatButton
        label={this.t("nTextCancel")}
        primary
        onTouchTap={this.handleCancel}
      />,
      <FlatButton
        label={this.t("nButtonOk")}
        primary
        onTouchTap={this.handleSubmit}
      />,
    ];

    return (
      <div style={Object.assign(styles.root, style)}>
        {this.renderItems(value, styles)}
        <Dialog
          ref={(ref) => this.dialog = ref}
          actions={actions}
          open={open}
          title="Add Main Port"
        >
          <DropDownPorts
            ref={(ref) => this.port = ref}
            onChange={this.handleChange}
          />
        </Dialog>
      </div>
    );
  },

  _handleCheck(e, checked){
    this.setState({checked, value: []});
  }
});

module.exports = OrganizationPorts;
