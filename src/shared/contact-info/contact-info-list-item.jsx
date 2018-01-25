const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const PropTypes = React.PropTypes;
const TextFieldEmail = require('~/src/shared/text-field-email');
const TextFieldFax = require('~/src/shared/text-field-fax');
const TextFieldMobile = require('~/src/shared/text-field-mobile');
const TextFieldPhone = require('~/src/shared/text-field-phone');
const TextFieldWebsite = require('~/src/shared/text-field-website');
const Translatable = require('epui-intl').mixin;
const { ComposedForm, use } = require('epui-composer');

use(TextFieldEmail);
use(TextFieldFax);
use(TextFieldMobile);
use(TextFieldPhone);
use(TextFieldWebsite);

const defs = [{
  component: 'Section',
  props: {},
  children: [{
    component: 'TextFieldMobile',
    name: 'mobile',
    props: {
      style: {
        float: 'left',
        marginRight: '10px',
      },
      defaultValue: '#mobile',
    },
  }, {
    component: 'TextFieldEmail',
    name: 'email',
    props: {
      style: {
        float: 'left',
        marginRight: '10px',
      },
      defaultValue: '#email',
    },
  }, {
    component: 'TextFieldFax',
    name: 'fax',
    props: {
      style: {
        float: 'left',
        marginRight: '10px',
      },
      defaultValue: '#fax',
    },
  }, {
    component: 'TextFieldPhone',
    name: 'phone',
    props: {
      style: {
        float: 'left',
        marginRight: '10px',
      },
      defaultValue: '#phone',
    },
  }, {
    component: 'TextFieldWebsite',
    name: 'web',
    props: {
      style: {
        float: 'left',
        marginRight: '10px',
      },
      defaultValue: '#web',
    },
  }],
}];

const ContactInfoListItem = React.createClass({
  mixins: [AutoStyle, Translatable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    value: PropTypes.object,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {};
  },

  getValue() {
    return this.form.getValue();
  },

  isValid() {
    return this.form.isValid();
  },

  getStyles() {
    let styles = {
      root: {},
    };

    return styles;
  },

  render() {
    let { value } = this.props;

    let styles = this.getStyles();

    return (
      <ComposedForm
        ref={(ref) => this.form = ref}
        definitions={defs}
        value={value || {}}
      />
    );
  },
});

module.exports = ContactInfoListItem;
