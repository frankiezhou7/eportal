const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Chips = require('epui-md/ep/Chips/Chips');
const Dialog = require('epui-md/Dialog');
const DropDownNewsTypes = require('~/src/shared/dropdown-news-types');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const Translatable = require('epui-intl').mixin;

const NewsTypes = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  translations: [
    require(`epui-intl/dist/NewsDialog/${__LOCALE__}`),
  ],

  propTypes: {
    style: PropTypes.object,
    value : PropTypes.array,
    label: PropTypes.string,
    labelStyle: PropTypes.object,
    required : PropTypes.bool,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      open: false,
      value: [],
      tip: null,
    };
  },

  componentWillMount() {
    let { value } = this.props;
    if(value && value.length > 0){
      for(let val of value){
        if(!_.isObject(val)) return;
      }
      this.setState({value});
    }
    if(_.isObject(value)){
      value.text = value.value;
      delete value.value;
      this.setState({value: [value]});
    }
  },

  getValue() {
    let { value } = this.state;
    let newVal = [];
    for(let val of value){
      newVal.push(val._id)
    }
    return newVal[0];
  },

  isValid() {
    let valid = true;
    this.setState({tip: null});
    if(this.state.value.length === 0 && this.props.required) {
      valid = false;
      this.setState({tip: this.t('nTextMustChooseNewsType')});
    }
    return new Promise((res, rej) => {
      res(valid);
    });
  },

  handleCancel() {
    this.setState({
      open: false,
    });
  },

  handleChange() {},

  handleSubmit() {
    let { value } = this.state;
    let val = this.type.getFullValue();
    if(!val || !val.value) return;
    let newVal = {
      text: val.text,
      _id: val.value
    };

    value = [newVal];

    this.setState({
      open: false,
      value,
    });
  },

  handleTouchTap() {
    if(this.state.value.length === 0)
    this.setState({
      open: true,
    });
  },

  handleRequestDelete(id) {
    let newVal = _.reject(this.state.value, ['_id', id]);
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
      labelTip: {
        fontSize: 14,
        color: '#F44336',
      }
    };
    styles.root = _.assign({}, styles.root, this.props.style);
    styles.label = _.assign({}, styles.label, this.props.labelStyle);
    return styles;
  },

  renderItems(value, styles) {
    let { label } = this.props;
    let chips = [];
    for (let val of value) {
      chips.push({
        id: val._id,
        label: val.text,
      });
    }

    return (
      <div style={styles.root}>
        {label && <span style={styles.label}>{`${label}:`}</span>}
        <Chips
          ref="chips"
          addButtonLabel="Add News Type"
          chips={chips}
          onAdd={this.handleTouchTap}
          onRequestDelete={this.handleRequestDelete}
          primary
          showAddButton={value.length === 0}
          style={label && {width: 'auto'}}
        />
        {this.state.tip && <span style={styles.labelTip}>{this.state.tip + '!'}</span>}
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
          title="Add News Type"
        >
          <DropDownNewsTypes
            ref={(ref) => this.type = ref}
            onChange={this.handleChange}
          />
        </Dialog>
      </div>
    );
  },
});

module.exports = NewsTypes;
