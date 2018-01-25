const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const ConnectedOrganizationRoles = require('./connected-organization-roles');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const OrganizationRoles = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.array,
    title: PropTypes.string,
    style: PropTypes.object,
    accType: PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    const el = this.organization.getWrappedInstance();
    return el.getValue();
  },

  isChanged() {
    const el = this.organization.getWrappedInstance();
    return el.isChanged();
  },

  getStyles() {
    let styles = {
      root: {},
      title: {
        fontSize: 12,
        color: 'rgba(0,0,0,0.56)',
        marginBottom: 5,
      },
    };
    styles.root = _.assign({}, styles.root, this.props.style);
    return styles;
  },

  render() {
    let styles = this.getStyles();
    let { title, ...other } = this.props;

    return (
      <div style={styles.root}>
        <div style={styles.title}>{title}</div>
        <ConnectedOrganizationRoles
          ref={(ref) => this.organization = ref}
          value={this.props.value}
          {...other}
        />
      </div>
    );
  },
});

module.exports = OrganizationRoles;
