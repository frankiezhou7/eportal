const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const Colors = require('epui-md/styles/colors');
const ClearFix = require('epui-md/internal/ClearFix');
const Translatable = require('epui-intl').mixin;
const DropDownOrganizations = require('~/src/shared/dropdown-organizations');
const PropTypes = React.PropTypes;

const AddOrgnizationForm = React.createClass({

  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Organization/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object
  },

  propTypes: {
    ship: PropTypes.object,
    disabled: PropTypes.bool,
    nLabelOrganization: PropTypes.string,
    nLabelInterestingOrganizations: PropTypes.string,
  },

  getDefaultProps() {
    return {
      disabled: false,
    };
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
  },

  getValue() {
    let organization = this.refs.organization.getValue();
    let val = {};

    if (organization) {
      val._id = organization._id;
      val.name = organization.name;
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
      disabled,
      ...other
    } = this.props;

    return (
      <div style={styles.contentStyle.root}>
        <div style={styles.contentStyle.tip}>
        </div>
        <div style={styles.contentStyle.row.root}>
          <DropDownOrganizations
            ref='organization'
            disabled={disabled}
            label={this.t('nLabelOrganization')}
          />
        </div>
      </div>
    );
  }
});

module.exports = AddOrgnizationForm;
