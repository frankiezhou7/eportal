const React = require('react');
const IconButton = require('epui-md/IconButton');
const NavigationMenu = require('epui-md/svg-icons/navigation/menu');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const MIDDLE_MARGIN_TOP = [7, 5]; //[min, differ]
const RIGHT_PADDING_TOP = [2, 11]; //[min, differ]

const EpAppBar = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    onRightIconButtonTouchTap: PropTypes.func,
    onFABTouchTap: PropTypes.func,
    showMenuIconButton: PropTypes.bool,
    showFAB: PropTypes.bool,
    style: PropTypes.object,
    iconClassNameLeft: PropTypes.string,
    iconClassNameRight: PropTypes.string,
    iconElementLeft: PropTypes.element,
    iconElementRight: PropTypes.element,
    iconStyleRight: PropTypes.object,
    leftNode: PropTypes.element,
    leftNodeStyles: PropTypes.object,
    rightNode: PropTypes.element,
    rightNodeStyles: PropTypes.object,
    bottomNode: PropTypes.element,
    bottomNodeStyles: PropTypes.object,
    middleNodeStyles: PropTypes.object,
    zDepth: PropTypes.number,
    maxHeight: PropTypes.number,
    minHeight: PropTypes.number,
    heightPercent: PropTypes.number,
  },

  getDefaultProps() {
    return {
      showMenuIconButton: true,
      showFAB: false,
      leftNode: '',
      rightNode: '',
      bottomNode: '',
      leftNodeStyles:{},
      rightNodeStyles:{},
      bottomNodeStyles:{},
      zDepth: 1,
      heightPercent: 0,
      maxHeight: 146,
      minHeight: 56,
    };
  },

  componentDidMount() {
    if (process.env.NODE_ENV !== 'production') {
      if (this.props.iconElementLeft && this.props.iconClassNameLeft) {
        console.warn(
          'Properties iconClassNameLeft and iconElementLeft cannot be simultaneously ' +
          'defined. Please use one or the other.'
        );
      }

      if (this.props.iconElementRight && this.props.iconClassNameRight) {
        console.warn(
          'Properties iconClassNameRight and iconElementRight cannot be simultaneously ' +
          'defined. Please use one or the other.'
        );
      }
    }
  },

  getStyles() {
    let spacing = this.context.muiTheme.spacing;
    let themeVariables = this.context.muiTheme.appBar;
    let iconButtonSize = this.context.muiTheme.button.iconButtonSize;
    let flatButtonSize = 36;

    let hp = this.props.heightPercent;
    hp = hp > 1 ? 1 : ((hp < 0) ? 0 : hp);

    let maxHeight = this.props.maxHeight;
    let minHeight = this.props.minHeight;
    let rootHeight = minHeight + (maxHeight - minHeight) * hp;
    let middleMarginTop = (MIDDLE_MARGIN_TOP[0] + MIDDLE_MARGIN_TOP[1] * hp) + 'px';
    let rightPaddingTop = (RIGHT_PADDING_TOP[0] + RIGHT_PADDING_TOP[1] * hp) + 'px';
    let fatMoveLength = (maxHeight - minHeight) *(1-hp);
    let styles = {
      root: {
        zIndex: 3,
        width: '100%',
        display: 'flex',
        minHeight: minHeight,
        backgroundColor: themeVariables.color,
        paddingLeft: '10px',
        paddingRight: '10px',
        position: 'fixed',
        height: rootHeight,
      },
      left:{
        paddingTop: (rootHeight - iconButtonSize) / 2,
        width: '10%',
        minWidth: 30
      },
      middle: {
        root:{
          width: '80%',
          textAlign: 'left',
          overflow: 'hidden'
        },
        content:{
          maxWidth: global.contentWidth,
          width: '100%',
          marginTop: middleMarginTop,
          marginBottom: 0,
          marginLeft: 'auto',
          marginRight: 'auto'
        }
      },
      right:{
        width: '10%',
        float: 'right',
        minWidth: 30
      },
      leftNode: {
        display: 'inline-block',
        width: '50%',
        minWidth: 200
      },
      rightNode: {
        display: 'inline-block',
        verticalAlign: 'top',
        paddingTop: rightPaddingTop,
        width: '50%',
        minWidth: 200
      },
      bottomNode: {
        maxWidth: 600,
      },
      mainElement: {
        boxFlex: 1,
        flex: '1',
      },
      iconButton: {
        style: {
          marginTop: (rootHeight - iconButtonSize) / 2,
          marginRight: 8,
          marginLeft: -16,
        },
        iconStyle: {
          fill: '#FFFFFF',//themeVariables.textColor,
          color: '#FFFFFF',
        },
      }
    };

    return styles;
  },

  render() {
    let props = this.props;
    let menuElementLeft;
    let menuElementRight;
    let styles = this.getStyles();
    let leftNode = props.leftNode;
    let rightNode = props.rightNode;
    let bottomNode = props.bottomNode;
    let leftNodeStyles = props.leftNodeStyles;
    let rightNodeStyles = props.rightNodeStyles;
    let bottomNodeStyles = props.bottomNodeStyles;
    let middleNodeStyles = props.middleNodeStyles
    let iconRightStyle = this.mergeAndPrefix(styles.iconButton.style, {
      marginRight: -16,
      marginLeft: 'auto',
    }, props.iconStyleRight);

    let leftNodeElement;
    if (leftNode) {
      leftNodeElement = _.isString(leftNode) ?
        <h1 style={this.mergeAndPrefix(styles.leftNode, styles.mainElement,leftNodeStyles)}>{leftNode}</h1> :
        <div style={this.mergeAndPrefix(styles.leftNode, styles.mainElement,leftNodeStyles)}>{leftNode}</div>;
    }

    let rightNodeElement;
    if(rightNode) {
      rightNodeElement = _.isString(rightNode) ?
        <h1 style={this.mergeAndPrefix(styles.rightNode, styles.mainElement,rightNodeStyles)}>{rightNode}</h1> :
        <div style={this.mergeAndPrefix(styles.rightNode, styles.mainElement,rightNodeStyles)}>{rightNode}</div>;
    }

    let bottomNodeElement;
    if(bottomNode) {
      bottomNodeElement = _.isString(bottomNode) ?
        <h1 style={this.mergeAndPrefix(styles.bottomNode, styles.mainElement,bottomNodeStyles)}>{bottomNode}</h1> :
        <div style={this.mergeAndPrefix(styles.bottomNode, styles.mainElement,bottomNodeStyles)}>{bottomNode}</div>;
    }

    let middleElement = (
      <div id='middle' style={this.mergeAndPrefix(styles.middle.root)}>
        <div style ={this.mergeAndPrefix(styles.middle.content,middleNodeStyles)}>
          {leftNodeElement}
          {rightNodeElement}
          {bottomNodeElement}
        </div>
      </div>);

    if (props.showMenuIconButton) {
      let iconElementLeft = props.iconElementLeft;

      if (iconElementLeft) {
        switch (iconElementLeft.type.name) {
          case 'IconButton':
            iconElementLeft = React.cloneElement(iconElementLeft, {
              iconStyle: this.mergeAndPrefix(styles.iconButton.iconStyle),
            });
            break;
        }

        menuElementLeft = (
          <div style={this.mergeAndPrefix(styles.left)}>
            {iconElementLeft}
          </div>
        );
      } else {
        let child = (props.iconClassNameLeft) ? '' : <NavigationMenu style={this.mergeAndPrefix(styles.iconButton.iconStyle)}/>;
        menuElementLeft = (
          <div style={this.mergeAndPrefix(styles.left)}>
            {child}
          </div>
        );
      }

      if (props.iconElementRight) {
        let iconElementRight = props.iconElementRight;

        switch (iconElementRight.type.name) {
          case 'IconButton':
            iconElementRight = React.cloneElement(iconElementRight, {
              iconStyle: this.mergeAndPrefix(styles.iconButton.iconStyle),
            });
            break;

          case 'FlatButton':
            iconElementRight = React.cloneElement(iconElementRight, {
              style: this.mergeStyles(styles.flatButton, iconElementRight.props.style),
            });
            break;
        }

        menuElementRight = (
          <div style={iconRightStyle}>
            {iconElementRight}
          </div>
        );
      } else if (props.iconClassNameRight) {
        menuElementRight = (
          <div style={this.mergeAndPrefix(styles.right)}>
            <IconButton
              style={iconRightStyle}
              iconStyle={this.mergeAndPrefix(styles.iconButton.iconStyle)}
              iconClassName={props.iconClassNameRight}
              onTouchTap={this._onRightIconButtonTouchTap}
            >
            </IconButton>
          </div>
        );
      }
    }

    return (
      <Paper
        ref="paper"
        className={props.className}
        rounded={false}
        style={this.mergeAndPrefix(styles.root, props.style)}
        zDepth={props.zDepth}
      >
        {menuElementLeft}
        {middleElement}
        {menuElementRight}
        {props.children}
      </Paper>
    );
  },

  _onRightIconButtonTouchTap(event) {
    if (this.props.onRightIconButtonTouchTap) {
      this.props.onRightIconButtonTouchTap(event);
    }
  },

});

module.exports = EpAppBar;
