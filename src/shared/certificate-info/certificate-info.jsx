const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DragAndDropFiles = require('../drag-drop-files');
const PropTypes = React.PropTypes;
const Translatable = require('epui-intl').mixin;

const CertificateInfo = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Order/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    style: PropTypes.object,
    value: PropTypes.array,
  },

  getDefaultProps() {
    return {};
  },

  getInitialState() {
    return {
      open: false,
    };
  },

  getValue() {
    return {
      certificates: this.refs.dragAndDrop.getFiles(),
    };
  },

  getComponent() {
    return this.refs.dragAndDrop;
  },

  getStyles() {
    let styles = {
      root: {
        width: global.contentWidth,
        margin: '-20px 0px 30px 20px',
      },
      uploader:{
        height: 240,
      },
    };

    return styles;
  },

  handleCancel() {
    this.setState({
      open: false,
    });
  },

  handleChange() {},

  render() {
    let {
      style,
      value,
      ...other,
    } = this.props;

    let {
      open,
      selected
    } = this.state;

    let styles = this.getStyles();

    return (
      <div style={Object.assign(styles.root, style)}>
        <DragAndDropFiles
          key = 'dragAndDrop'
          ref = 'dragAndDrop'
          loadedFiles={value ? value : []}
          view={false}
          acceptVideo = {false}
          usage={'registerShip'}
          field ='dragAndDrop'
        />
      </div>
    );
  },
});

module.exports = CertificateInfo;
