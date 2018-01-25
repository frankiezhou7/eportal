let React = require('react');
let StylePropable = require('~/src/mixins/style-propable');
let Colors = require('epui-md/styles/colors');
let Clear = require('epui-md/svg-icons/content/clear');
let Dialog = require('epui-md/Dialog');


let DialogBase = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  propTypes: {
    title: React.PropTypes.string,
    contentNode: React.PropTypes.element,
    zDepth: React.PropTypes.number,
    showClearIcon: React.PropTypes.bool,
    style: React.PropTypes.object,
    headerStyle: React.PropTypes.object,
    headerLeftNodeStyle: React.PropTypes.object,
    headerRightNodeStyle: React.PropTypes.object,
    bodyStyle: React.PropTypes.object,
    footerStyle: React.PropTypes.object,
  },

  getTheme() {
    return this.context.muiTheme.component.textField;
  },

  getDefaultProps() {
    return {
      showClearIcon: true
    };
  },

  getInitialState() {
    return {

    };
  },

  dismiss() {
    this.refs.dialog.dismiss();
  },

  show() {
    this.refs.dialog.show();
  },

  _onDismiss(e) {
    this.dismiss();
    if (this.props.onDismiss) {
      this.props.onDismiss(e);
    }
  },

  getStyles(){
    let props = this.props;
    let theme = this.getTheme();

    let styles = {
      root: {
        width: '100%',
        height: '100%',
        minHeight: '672px',
        overflow: 'hidden',
      },
      header: {
        root: {
          width: '100%',
          height: '72px',
          lineHeight: '72px',
          verticalAlign: 'middle',
          color: Colors.white,
          backgroundColor: Colors.indigo700,
        },
        leftNode: {
          root: {
            float: 'left',
            marginLeft: '40px',
            height: '100%',
          },
          content: {
            display: 'inline-block',
            lineHeight: 'normal',
            verticalAlign: 'middle',
            fontSize: '24px',
            fontWeight: 'lighter',
          }
        },
        rightNode: {
          root: {
            float: 'right',
            marginRight: '40px',
            height: '100%',
          },
          content: {
            display: 'inline-block',
            lineHeight: 'normal',
            verticalAlign: 'middle',
            width: '24px',
            height: '24px',
            cursor: 'pointer',
          },
        },
        clearIcon: {
          fill: Colors.white,
        }
      },
      body: {
        width: '100%',
        height: '528px',
        overflow: 'hidden',
      },
      footer: {
        root: {
          width: '100%',
          height: '72px',
          lineHeight: '72px',
        },
        wrapper: {
          left: {
            root: {
              float: 'left',
              marginLeft: '40px',
            },
            content: {
            },
          },
          right: {
            root: {
              // display: 'table-cell',
              // width: '2000px',
              float: 'right',
            },
            content: {
              float: 'right',
              marginRight: '40px',
            },
          },
        },
      },
    };

    return styles;
  },

  render() {
    let styles = this.getStyles();

    let {
      title,
      contentNode,
      footerLeftNode,
      footerRightNode,
      showClearIcon,
      style,
      headerStyle,
      headerLeftNodeStyle,
      headerRightNodeStyle,
      contentStyle,
      footerStyle,
      zDepth,
      ...other
    } = this.props;

    let clearElement = showClearIcon ?
                        (<div style={styles.header.rightNode.content} onTouchTap={this._onDismiss}>
                            <Clear style={styles.header.clearIcon} />
                         </div>) : null;

    let titleElement = (
      <div style={this.mergeAndPrefix(styles.header.root, headerStyle)}>
        <div style={this.mergeAndPrefix(styles.header.leftNode.root, headerLeftNodeStyle)}>
          <div style={styles.header.leftNode.content}>{title}</div>
        </div>
        <div style={this.mergeAndPrefix(styles.header.rightNode.root, headerRightNodeStyle)}>
          {clearElement}
        </div>
      </div>
    );

    let actions = [
      <div key='actions' style={this.mergeAndPrefix(styles.footer.root, footerStyle)}>
        <div style={styles.footer.wrapper.left.root}>
          <div style={styles.footer.wrapper.left.content}>
            {footerLeftNode}
          </div>
        </div>
        <div style={styles.footer.wrapper.right.root}>
          <div style={styles.footer.wrapper.right.content}>
            {footerRightNode}
          </div>
        </div>
      </div>];

    return (
      <Dialog
        ref='dialog'
        open={true}
        title={titleElement}
        actions={actions}
        {...other}>
        <div style={this.mergeAndPrefix(styles.body, contentStyle)}>
          {contentNode}
        </div>
      </Dialog>
    );
  }
});

module.exports = DialogBase;
