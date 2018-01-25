const React = require('react');
const _ = require('eplodash');
const AutoIncreaseList = require('epui-md/ep/AutoIncreaseList');
const AutoStyle = require('epui-auto-style').mixin;
const ContactInfoItem = require('./contact-info-item');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const ContactInfo = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {
      value: [{
        type: 'CMM',
        value: '',
      }, {
        type: 'CME',
        value: '',
      }, {
        type: 'CMF',
        value: '',
      }, {
        type: 'CMP',
        value: '',
      }],
    };
  },

  getInitialState() {
    return {};
  },

  getValue() {
    let info = this.contactInfo.getValue();
    let value = [];

    if (_.isArray(info)) {
      _.forEach(info, i => {
        if (i.value) {
          value.push(i);
        }
      });
    }

    return value;
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let {
      style,
      value,
    } = this.props;

    let item = <ContactInfoItem key="contactInfoItem" />;

    let styles = this.getStyles();

    return (
      <AutoIncreaseList
        key="payloadTypes"
        ref={(ref) => this.contactInfo = ref}
        item={item}
        items={value || []}
        styles={Object.assign(styles.root, style)}
      />
    );
  },
});

module.exports = ContactInfo;
