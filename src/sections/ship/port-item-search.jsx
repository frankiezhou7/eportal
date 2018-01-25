let React = require('react');
let StylePropable = require('~/src/mixins/style-propable');
let Colors = require('epui-md/styles/colors');
let Search = require('epui-md/svg-icons/action/search');
let Clear = require('epui-md/svg-icons/content/clear');
let Transitions = require('epui-md/styles/transitions');


let PortItemSearch = React.createClass({

  mixins: [StylePropable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    maxWidth: React.PropTypes.number,
    minWidth: React.PropTypes.number,
    height: React.PropTypes.number,
    hintText: React.PropTypes.string,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onFocus: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      maxWidth: 256,
      minWidth: 80,
      height: 60,
      isOpen: false,
      hintText: '搜索历史航程'
    };
  },

  getInitialState() {
    return {
      isFocused: false,
      value: undefined
    };
  },

  getTheme() {
    return this.context.muiTheme.textField;
  },

  getStyles() {
    let theme = this.getTheme();
    let leftNavStyles = this.context.muiTheme.leftNav;
    let height = this.props.height;
    let iconMarginVer = (height - 24) / 2;
    let iconMarginHor = ((this.props.minWidth - 24) / 2);
    let wraperHeight = (this.props.isOpen && this.state.isFocused && (this.state.value === undefined || this.state.value === '')) ? (height * 2) : height;
    let inputWraperWidth = this.props.isOpen ?
                            (this.props.maxWidth - this.props.minWidth - 20) : 0;

    let width = this.props.isOpen ? this.props.maxWidth : this.props.minWidth;

    let styles = {
      wraper: {
        position: 'relative',
        width: '100%',
        maxWidth: width + 'px',
        height: (wraperHeight + 2) + 'px',
        overflow: 'hidden',
        transition: Transitions.easeOut('300ms', 'height', '0ms') + ',' +
                    this.props.isOpen ? Transitions.easeOut('450ms', 'maxWidth', '0ms') : ''
      },
      root: {
        width: '100%',
        height: height + 'px',
        lineHeight: height + 'px',
        transition: Transitions.easeOut('450ms', 'width', '1000ms')
      },
      top: {
      },
      bottom: {
        textAlign: 'center',
        color: '#B6B6B6',
      },
      inputWraper: {
        display: 'inline-block',
        float: 'left',
        width: inputWraperWidth + 'px',
        height: height + 'px',
        paddingLeft: this.props.isOpen ? '20px' : 0,
        transition: this.props.isOpen ? Transitions.easeOut('450ms', 'width', '300ms')
                                      : Transitions.easeOut('0ms', 'width', '0ms'),
      },
      input: {
        width: '100%',
        height: '100%',
        tapHighlightColor: 'rgba(0,0,0,0)',
        padding: '0',
        position: 'relative',
        border: 'none',
        outline: 'none',
        fontSize: '16px',
        color: leftNavStyles.activeColor
      },
      iconWraper: {
        display: 'inline-block',
        float: 'right',
        width: this.props.minWidth + 'px',
        height: '100%',
        cursor: 'pointer',
      },
      icon: {
        marginTop: iconMarginVer + 'px',
        marginBottom: iconMarginVer + 'px',
        marginLeft: iconMarginHor + 'px',
        marginRight: iconMarginHor + 'px',
        fill: '#B6B6B6',
      },
      underline: {
        border: 'none',
        // borderBottom: 'solid 2px ' + leftNavStyles.activeColor,
        borderBottom: 'solid 2px #B6B6B6',
        position: 'absolute',
        width: '100%',
        margin: 0,
        MozBoxSizing: 'content-box',
        boxSizing: 'content-box',
        height: 0,
      }
    };

    styles.top = this.mergeAndPrefix(styles.top, styles.root);
    styles.bottom = this.mergeAndPrefix(styles.bottom, styles.root);
    styles.focusUnderline = this.mergeStyles(styles.underline, {
      borderBottom: 'solid 2px',
      borderColor: leftNavStyles.activeColor,
      transform: 'scaleX(0)',
      transition: Transitions.easeOut(),
    });

    styles.focusUnderline.transform = 'scaleX(1)';
    styles.underline.borderBottomColor = (this.state.isFocused || this.state.value)
          ? leftNavStyles.activeColor : '#B6B6B6';

    styles.focusUnderline.borderBottomColor = (this.state.isFocused || this.state.value)
          ? leftNavStyles.activeColor : '#B6B6B6';

    if (!this.state.isFocused) {
      styles.bottom.height = '0';
    }

    if (!this.props.isOpen) {
      styles.underline.borderBottomColor = this.state.value ? leftNavStyles.activeColor : Colors.white;
      styles.focusUnderline.borderBottomColor = this.state.value ? leftNavStyles.activeColor : Colors.white;
      if (this.state.value) {
        styles.icon.fill = leftNavStyles.activeColor;
      }
    }

    return styles;
  },

  _handleFocus(e) {
    this.setState({
      isFocused: true
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  },

  _handleBlur(e) {
    this.setState({
      isFocused: false
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  },

  _handleChange(e) {
    this.setState({
      value: e.target.value
    });

    if (this.props.onChange) {
      this.props.onChange(e);
    }
  },

  _handleIconTouchTap() {
    let value = this.state.value;

    if (value) {
      this.setState({
        value: undefined
      });
    }
  },

  render() {
    let styles = this.getStyles();

    let iconElement = (this.props.isOpen && this.state.value)
        ? (<Clear style={this.mergeAndPrefix(styles.icon)} />)
        : (<Search style={this.mergeAndPrefix(styles.icon)} />);

    let topElement = (
      <div style={this.mergeAndPrefix(styles.top)}>
        <div style={this.mergeAndPrefix(styles.inputWraper)}>
          <input ref='input'
            onFocus={this._handleFocus}
            onBlur={this._handleBlur}
            onChange={this._handleChange}
            disabled={!this.props.isOpen}
            style={this.mergeAndPrefix(styles.input)}
            value={this.state.value}
            placeholder={this.state.isFocused ? '' : this.props.hintText}
            type='text' />
        </div>
        <div style={this.mergeAndPrefix(styles.iconWraper)} onTouchTap={this._handleIconTouchTap}>
          {iconElement}
        </div>
      </div>
    );

    let bottomElement = (
      <div style={this.mergeAndPrefix(styles.bottom)}>
        可以输入港口或日期搜索历史航程
      </div>
    );

    return (
      <div style={this.mergeAndPrefix(styles.wraper)}>
        {topElement}
        <hr style={this.mergeAndPrefix(styles.underline)}/>
        <hr style={this.mergeAndPrefix(styles.focusUnderline)} />
        {bottomElement}
      </div>
    );
  }

});

module.exports = PortItemSearch;
