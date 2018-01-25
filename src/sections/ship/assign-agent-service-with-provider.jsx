const React = require('react');
const StylePropable = require('~/src/mixins/style-propable');
const Colors = require('epui-md/styles/colors');
const AssignAgentItemServiceDetail = require('./assign-agent-item-service-detail');

const AssignAgentServiceWithProvider = React.createClass({

  mixins: [StylePropable],

  translations: require(`epui-intl/dist/AgentService/${__LOCALE__}`),

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    itemArray: React.PropTypes.array,
    nLabelCompanyTextWithProvider: React.PropTypes.string,
    nLabelCompanyTextWithoutProvider: React.PropTypes.string,
    nLabelTotalPrice: React.PropTypes.string,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {

    };
  },

  getStyles() {
    let props = this.props;

    let styles = {
      root: {
        width: '100%',
        overflow: 'hidden',
      },
      row: {
        marginTop: '10px',
        width: '100%',
        overflow: 'hidden',
      },
      left: {
        root: {
          float: 'left',
          width: '50%',
        },
        top: {
          color: '#B6B6B6',
          fontSize: '12px',
        },
        bottom: {
          color: Colors.indigo700,
          fontSize: '14px',
        }
      },
      right: {
        root: {
          float: 'right',
          width: '50%',
        },
        wrapper: {
          float: 'right',
        },
        top: {
          color: '#B6B6B6',
          fontSize: '12px',
          textAlign: 'right',
        },
        bottom: {
          fontSize: '14px',
          textAlign: 'right',
        }
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      itemArray,
      nLabelCompanyTextWithProvider,
      nLabelCompanyTextWithoutProvider,
      nLabelTotalPrice,
      ...other
    } = this.props;

    let body = [];

    if (itemArray) {
      itemArray.forEach((item, index) => {
        let row = [];

        let companyText = item.companyName ? nLabelCompanyTextWithProvider : nLabelCompanyTextWithoutProvider;
        row.push(
          <div key={Math.random()} style={styles.left.root}>
            <div style={styles.left.top}>{companyText}</div>
            <div style={styles.left.bottom}>{item.companyName}</div>
          </div>
        );

        let priceText = item.totalPrice ? nLabelTotalPrice : '';
        row.push(
          <div key={Math.random()} style={styles.right.root}>
            <div style={styles.right.wrapper}>
              <div style={styles.right.top}>{priceText}</div>
              <div style={styles.right.bottom}>{item.totalPrice}</div>
            </div>
          </div>
        );

        body.push(
          <div key={index} style={styles.row}>
            {row}
          </div>
        );

        if (item.serviceList) {
          item.serviceList.forEach((child, i) => {
            body.push(
              <AssignAgentItemServiceDetail
                key={Math.random()}
                serviceName={child.serviceName}
                content={child.content} />
            );
          });
        }
      });
    }

    return (
      <div style={styles.root}>
        {body}
      </div>
    );
  }
});

module.exports = AssignAgentServiceWithProvider;
