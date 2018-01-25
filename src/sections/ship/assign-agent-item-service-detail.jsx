let React = require('react');
let StylePropable = require('~/src/mixins/style-propable');
let Colors = require('epui-md/styles/colors');
let SwapVert = require('epui-md/svg-icons/action/swap-vert');


let AssignAgentItemServiceDetail = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    serviceName: React.PropTypes.string,
    content: React.PropTypes.string,
    icon: React.PropTypes.element,
  },

  getDefaultProps() {
    return {
    };
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
        height: '48px',
      },
      left: {
        root: {
          float: 'left',
          maxWidth: '50%',
          height: '48px',
        },
        iconWrapper: {
          display: 'inline-block',
          float: 'left',
          margin: '8px 0',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: Colors.indigo700,
        },
        icon: {
          margin: '4px',
          fill: Colors.white,
        },
        serviceName: {
          display: 'inline-block',
          lineHeight: '48px',
          marginLeft: '10px',
          fontSize: '12px',
        }
      },
      right: {
        float: 'right',
        maxWidth: '50%',
        height: '48px',
        lineHeight: '48px',
        color: '#727272',
        fontSize: '12px',
      }
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      serviceName,
      content,
      icon,
      ...other
    } = this.props;

    return (
      <div style={styles.root}>
        <div style={styles.left.root}>
          <div style={styles.left.iconWrapper}>
            <SwapVert style={styles.left.icon} />
          </div>
          <div style={styles.left.serviceName}>{serviceName}</div>
        </div>
        <div style={styles.right}>
          {content}
        </div>
      </div>
    );
  }
});

module.exports = AssignAgentItemServiceDetail;
