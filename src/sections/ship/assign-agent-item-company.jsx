let React = require('react');
let Router = require('react-router');
let TextField = require('epui-md/TextField/TextField');
let RaisedButton = require('epui-md/RaisedButton');
let FlatButton = require('epui-md/FlatButton');
let StylePropable = require('~/src/mixins/style-propable');
let Colors = require('epui-md/styles/colors');
let ClearFix = require('epui-md/internal/ClearFix');
let StarsBar = require('epui-md/starsbar');


let AssignAgentItemCompany = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    companyName: React.Props.string,

  },

  getDefaultProps() {
    return {
      showHover: false,
      companyName: '青岛亚瀚船舶代理有限公司',
    };
  },

  getInitialState() {
    return {
      isHovered: false
    };
  },

  _onMouseOver() {
    this.setState({
      isHovered: true
    });
  },

  _onMouseOut() {
    this.setState({
      isHovered: false
    });
  },

  _handleTouchTap(e) {
    if (this.props.handleTouchTap) {
      this.props.handleTouchTap(e);
    }
  },

  getStyles() {
    let props = this.props;

    let styles = {
      root: {
        width: '100%',
        height: '48px',
        cursor: (this.state.isHovered && this.props.showHover) ? 'pointer' : 'default',
        backgroundColor: (this.state.isHovered && this.props.showHover) ? '#C5CAE9' : Colors.white,
      },
      left: {
        root: {
          float: 'left',
          margin: '6px 0',
        },
        top: {
          height: '20px',
          fontSize: '14px',
        },
        bottom: {
          height: '16px',
          overflow: 'hidden',
        },
      },
      right: {
        root: {
          display: 'table-cell',
          width: '2000px',
          height: '48px',
        },
        wrapper: {
          float: 'right',
          height: '100%',
        },
        lNode: {
          float: 'left',
          marginRight: '40px',
          height: '100%',
          lineHeight: '48px',
          color: Colors.amberA200,
        },
        rNode: {
          root: {
            float: 'left',
            margin: '6px 0',
            height: '34px',
          },
          top: {
            height: '17px',
            fontSize: '12px',
            textAlign: 'right',
          },
          bottom: {
            height: '17px',
            fontSize: '12px',
            fontWeight: 'bold',
            textAlign: 'right',
            color: '#727272',
          },
        },
      },
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      companyName,
      rTopNode,
      rBottomNode,
      totalStars,
      activedStars,
      starColor,
      starHoverColor,
      style,
      ...other
    } = this.props;

    return (
      <div style={this.mergeAndPrefix(styles.root, style)}
        onMouseOver={this._onMouseOver}
        onMouseOut={this._onMouseOut}
        onTouchTap={this._handleTouchTap} >
        <div style={styles.left.root}>
          <div style={styles.left.top}>{companyName}</div>
          <div style={styles.left.bottom}>
            <StarsBar
              totalStars={5}
              activedStars={3}
              starSize={16}
              starHoverColor={starHoverColor} />
          </div>
        </div>
        <div style={styles.right.root}>
          <div style={styles.right.wrapper}>
            <div style={styles.right.lNode}>2个服务无法提供</div>
            <div style={styles.right.rNode.root}>
              <div style={styles.right.rNode.top}>预计报价</div>
              <div style={styles.right.rNode.bottom}>$23,200.00</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AssignAgentItemCompany;
