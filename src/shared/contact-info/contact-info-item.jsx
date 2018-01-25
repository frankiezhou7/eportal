const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownMenu = require('epui-md/ep/EPDropDownMenu');
const MenuItem = require('epui-md/MenuItem');
const PropTypes = React.PropTypes;
const RawTextField = require('epui-md/TextField/TextField');
const Validatable = require('epui-md/HOC/Validatable');
const TextField = Validatable(RawTextField);
const Translatable = require('epui-intl').mixin;

const items = ['type', 'value'];

const ContactInfoItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/StorageYard/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onAdd: PropTypes.func,
    style: PropTypes.object,
    type: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.string,
    ]),
  },

  getDefaultProps() {
    return {
      value: {
        type: 'CMW',
        value: '',
      },
    };
  },

  getInitialState() {
    return {
      type: this.props.value.type,
    };
  },

  getValue() {
    let value = this.text.getValue();
    value = value ? value : null;

    return {
      type: this.state.type,
      value,
    };
  },

  isValid() {
    return this.text.isValid();
  },

  handleAdd() {
    let { onAdd } = this.props;
    if (_.isFunction(onAdd)) {
      onAdd();
    }
  },

  getStyles() {
    let styles = {
      root: {},
      item: {
        width: '200px',
        marginRight: '10px',
      },
      menu: {
        float: 'left',
        width: '95px',
      },
      textField: {
        float: 'left',
        boxSizing: 'border-box',
        top: '8px',
      },
    };

    return styles;
  },

  handleChange(event, index, value) {
    this.setState({
      type: value,
    }, () => {
      this.handleAdd();
    });
  },

  render() {
    let {
      style,
      value,
      ...other,
    } = this.props;

    let { type } = this.state;
    let val = value && value.value;
    let styles = this.getStyles();

    return (
      <div style={Object.assign(styles.root, style)}>
        <DropDownMenu
          key={type}
          ref={(ref) => this.type = ref}
          onChange={this.handleChange}
          style={styles.menu}
          value={type}
        >
          <MenuItem value='CMM' primaryText="Mobile" />
          <MenuItem value='CME' primaryText="Email" />
          <MenuItem value='CMF' primaryText="Fax" />
          <MenuItem value='CMP' primaryText="Phone" />
          <MenuItem value='CMW' primaryText="Website" />
        </DropDownMenu>
        <TextField
          ref={(ref) => this.text = ref}
          id ={Math.random()*1001}
          defaultValue={val}
          onChange={this.handleAdd}
          style={styles.textField}
        />
      </div>
    );
  },
});

module.exports = ContactInfoItem;
