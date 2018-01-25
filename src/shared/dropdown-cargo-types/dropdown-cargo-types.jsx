const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropDownCargoTypesInner = require('./dropdown-cargo-types-inner');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const DropDownCargoTypes = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: [
    require(`epui-intl/dist/Cargo/${__LOCALE__}`),
  ],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    floatingLabelText: PropTypes.string,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  clearValue() {
    let el = this._getRefs();
    el.clearValue();
  },

  getValue() {
    let el = this._getRefs();
    return el.getValue();
  },

  getStyles() {
    let styles = {
      root: {
        float: 'left',
        marginRight: '10px',
      },
    };

    return styles;
  },

  render() {
    let {
      floatingLabelText,
      style,
      ...other,
    } = this.props;

    let styles = this.getStyles();

    return(
      <DropDownCargoTypesInner
        {...other}
        ref='inner'
        floatingLabelText={floatingLabelText || this.t('nTextCargoType')}
        style={Object.assign(styles.root, style)}
      />
    );
  },

  _getRefs() {
    return this.refs.inner.getWrappedInstance();
  },
});

module.exports = DropDownCargoTypes;
