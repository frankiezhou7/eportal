const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const ClearFix = require('epui-md/internal/ClearFix');
const Colors = require('epui-md/styles/colors');
const DropDownAccounts = require('~/src/shared/dropdown-accounts');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;
const TYPES = require('~/src/shared/constants').ACCOUNT_TYPE;

const AssignAccountForm = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Account/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    type: PropTypes.oneOf(_.values(TYPES)),
    ship: PropTypes.object,
    disabled: PropTypes.bool,
    nLabelConsigner: PropTypes.string,
    nLabelConsignee: PropTypes.string,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getValue() {
    let acc = this.refs.account;
    let account = acc.getValue();
    let val = {};

    if (account) {
      val._id = account.value;
      val.name = account.text;
    }

    return val;
  },

  getStyles() {
    let props = this.props;

    let styles = {
      root: {
        minHeight: '100%',
      },
      headerStyle: {
        color: Colors.indigo700,
        backgroundColor: '#C5CAE9',
      },
      bodyStyle: {
        height: '448px',
      },
      contentStyle: {
        root: {
          margin: '30px 40px',
        },
        tip: {
          marginBottom: '23px',
          fontSize: '12px',
          color: '#B6B6B6',
        },
        port: {
          marginLeft: '-25px',
          fontSize: '14px',
          width: '100%',
          maxWidth: 256,
        },
        row: {
          root: {
            width: '100%',
            height: '72px',
          },
          item: {
            display: 'inline-block',
            marginRight: '10px',
            width: '160px',
            verticalAlign: 'top'
          }
        }
      },
      footer: {
        button: {
          width: '82px',
        },
        buttonBig: {
          width: '120px',
        }
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      ship,
      type,
      disabled,
    } = this.props;

    return (
      <div style={styles.contentStyle.root}>
        <div style={styles.contentStyle.tip}>
        </div>
        <div style={styles.contentStyle.row.root}>
          <DropDownAccounts
            ref='account'
            disabled={disabled}
            type={type}
            label={type === TYPES.CONSIGNER ? this.t('nLabelConsigner') : this.t('nLabelConsignee')}
          />
        </div>
      </div>
    );
  },
});

module.exports = AssignAccountForm;
