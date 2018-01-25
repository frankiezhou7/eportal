const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const ContactInfoListItem = require('./contact-info-item');
const DataTable = require('epui-md/ep/CustomizedTable/DataTable');
const Dialog = require('epui-md/Dialog');
const FlatButton = require('epui-md/FlatButton');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const Types = {
  mobile: 'CMM',
  email: 'CME',
  fax: 'CMF',
  phone: 'CMP',
  web: 'CMW',
};

const ContactInfoList = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/DataTable/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.array,
  },

  getDefaultProps() {
    return {
      value: [{
        mobile: '15165285065',
        email: 'li.wei@e-ports.com',
        fax: '123',
        phone: '15165285065',
        web: 'http://e-ports.com',
      }],
    };
  },

  getInitialState() {
    return {
      value: this.props.value,
      open: false,
    };
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  getValue() {
    let { value } = this.state;
    let keys = _.keys(Types);

    if (_.isArray(value)) {
      value = _.map(value, val => {
        let item = {};

        _.forEach(val, (v, k) => {
          if (_.includes(keys, k)) {
            item.type = Types[k];
            item.value = v;
          }
        });

        return item;
      });
    }

    return value;
  },

  handleAdd() {
    this.setState({
      add: true,
      edit: false,
      open: true,
    });
  },

  handleRemove(ids) {
    let { value } = this.state;

    if (_.isArray(ids)) {
      for (let id of ids) {
        _.remove(value, (v, i) => {
          return i === id;
        });
      }

      this.setState({
        value,
      });
    }
  },

  handleEdit(selectedIndex) {
    this.setState({
      add: false,
      edit: true,
      open: true,
      selectedIndex,
    });
  },

  handleTouchTapCancel() {
    this.setState({
      open: false,
    });
  },

  handleTouchTapOk() {
    this.item
      .isValid()
      .then(valid => {
        if (valid) {
          let val = this.item.getValue();
          let {
            add,
            edit,
            selectedIndex,
            value,
          } = this.state;

          if (add) {
            value.push(val);
          } else if (edit) {
            value[selectedIndex] = val;
          }

          this.setState({
            open: false,
            value,
          });
        }
      });
  },

  render() {
    let {
      edit,
      open,
      selectedIndex,
      value,
    } = this.state;

    let styles = this.getStyles();

    const structor = {
      mobile: this.t('nTextMobile'),
      email: this.t('nTextEmail'),
      fax: this.t('nTextFax'),
      phone: this.t('nTextPhone'),
      web: this.t('nTextWebSite'),
    };

    const actions = [
      <FlatButton
        key="cancel"
        secondary={true}
        label="cancel"
        onTouchTap={this.handleTouchTapCancel}
      />,
      <FlatButton
        key="ok"
        secondary={true}
        label="ok"
        onTouchTap={this.handleTouchTapOk}
      />,
    ];

    return (
      <div style={this.style('root')}>
        <DataTable
          ref='DataTable'
          structor={structor}
          data={value}
          pageSize={20}
          total={value.length}
          onAdd={this.handleAdd}
          onEdit={this.handleEdit}
          onRemove={this.handleRemove}
          showPager={false}
          showViewIcon={false}
        />
        <Dialog
          ref={(ref) => this.dialog = ref}
          actions={actions}
          open={open}
        >
          <ContactInfoListItem
            ref={(ref) => this.item = ref}
            value={edit && value[selectedIndex]}
          />
        </Dialog>
      </div>
    );
  },
});

module.exports = ContactInfoList;
