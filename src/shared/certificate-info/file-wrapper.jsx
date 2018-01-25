const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const CancelButton = require('epui-md/svg-icons/navigation/cancel');
const DownloadButton = require('epui-md/svg-icons/file/file-download');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
const agent = require('superagent');
const filePath = '/files/';

const FileWrapper = React.createClass({
  mixins: [AutoStyle, PureRenderMixin],

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    children: PropTypes.element,
    field: PropTypes.string,
    file: PropTypes.object,
    isUploading: PropTypes.bool,
    nTextDownload: PropTypes.string,
    nTextRemove: PropTypes.string,
    onRemove: PropTypes.func,
    onUploadComplete: PropTypes.func,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    product: PropTypes.object,
    productConfig: PropTypes.object,
    style: PropTypes.object,
    uploaded: PropTypes.bool,
    view: PropTypes.bool,
    zDepth: PropTypes.number,
  },

  getDefaultProps() {
    return {
      isUploading: false,
      uploaded: false,
      zDepth: 1,
    };
  },

  getInitialState() {
    return {
      hover: false,
      progress: 0,
      zDepth: this.props.zDepth,
    };
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let height = 100;
    let rate = 1.4142857142857;
    let padding = 5;
    let coverOpacity = 0.9;
    let width = parseInt(height / rate);
    let paperStyle = {
      width: 322,
      height: 216,
    };
    if(this.props.style) {
      _.merge(paperStyle,this.props.style);
    }
    if(this.props.style.height && !this.props.style.width) {
      paperStyle.width = parseInt(parseInt(this.props.style.height) / rate);
    }
    let coverStyle = {
      opacity: coverOpacity,
      backgroundColor: theme.palette.greyColor,
      width: paperStyle.width,
      height: paperStyle.height - 24,
      borderRadius: '3px 3px 0px 0px',
      textAlign: 'center',
      boxSizing: 'border-box',
      position: 'relative',
    };
    let hoverStyle = {
      marginTop : -(parseInt(paperStyle.height) + parseInt(paperStyle.marginBottom)),
      width: paperStyle.width,
      height: paperStyle.height,
      display: this.state.hover ? 'block' : 'none',
      overflow: 'hidden',
      marginBottom: paperStyle.marginBottom,
      boxSizing: 'border-box',
    };
    let styles = {
      root: {
        cursor: 'pointer',
        float:'left',
        boxSizing: 'border-box',
        overflow: 'hidden',
        marginTop: '20px',
        marginRight: '60px',
        boxShadow: '0px 0px 2px 0px rgba(0,0,0,0.12), 0px 2px 2px 0px rgba(0,0,0,0.24)',
      },
      closeButton: {
        verticalAlign: 'bottom',
        opacity: coverOpacity,
        backgroundColor: theme.palette.greyColor,
        fill: theme.palette.accent1Color,
        position: 'absolute',
        top: '10px',
        right: '10px',
      },
      downloadButton: {
        verticalAlign: 'bottom',
        opacity: coverOpacity,
        backgroundColor: theme.palette.greyColor,
        fill: theme.palette.accent1Color,
        position: 'absolute',
        bottom: '10px',
        right: '149px',
      },
      actions: {
        opacity: coverOpacity,
        height: '24px',
        backgroundColor: theme.palette.greyColor,
      },
      fileName: {
        color: theme.palette.canvasColor,
        fontWeight: 500,
        wordBreak: 'break-word',
        paddingTop: coverStyle.height / 2 - 10 > 0 ? coverStyle.height / 2 - 10 : 0,
        display: 'block',
      },
      loadingBar: {
        width: paperStyle.width * (this.state.progress / 100),
        height: 1,
        backgroundColor: theme.palette.accent1Color,
        borderColor: 'transparent',
        marginTop: -1,
        marginLeft: -padding,
        display: this.props.isUploading ? 'block': 'none',
      },
      paper: paperStyle,
      cover: coverStyle,
      hover: hoverStyle,
    };

    return styles;
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if(!this.props.isUploading && !this.props.uploaded && nextProps.isUploading) {
      this.uploadFile();
    }
  },

  uploadFile(){
    let { field, file, onUploadComplete } = this.props;
    let { storeShipFile } = global.api.epds;
    if (_.isFunction(storeShipFile)) {
      storeShipFile
        .promise(field, {
          files: file.file,
        }, this._onProgress)
        .then(res => {
          if(res.status === 'OK'){
            let uploadedFile = res.response;
            if (_.isFunction(onUploadComplete)) {
              onUploadComplete(this.props.file,uploadedFile);
            }
          }
        })
        .catch(error => {
          //TODO: hanle error
        });
    }
  },

  render() {
    let cancelBtn = this.props.view
      ? null
      : (
          <CancelButton
            onClick={this._handleRemoveTouch}
            style={this.style('closeButton')}
            title ={this.props.nTextRemove}
          />
        );
    let downloadBtn = (
      <a
        href={this.props.file.id ? filePath+this.props.file.id : this.props.file.url}
        title={this.props.nTextDownload}
        download
      >
        <DownloadButton style={this.style('downloadButton')} />
      </a>
    );

    return (
      <div
        onClick={this._handleFileClick}
        onMouseOut={this._handleMouseOut}
        onMouseOver={this._handleMouseOver}
        style={this.style('root')}
      >
        <Paper
          style={this.style('paper')}
          zDepth={this.props.zDepth}
        >
          {this.props.children}
          <hr style={this.style('loadingBar')} />
        </Paper>
        <div style={this.style('hover')}>
          <div style={this.style('cover')}>
            {cancelBtn}
            {downloadBtn}
            <span style={this.style('fileName')}>
              {this.props.file.name}
            </span>
          </div>
          <div style={this.style('actions')}>
          </div>
        </div>
      </div>
    );
  },

  _handleMouseOver() {
    if (!this.state.hover) {
      this.setState({hover: true});
    }
  },

  _handleMouseOut() {
    if (this.state.hover) {
      this.setState({hover: false});
    }
  },

  _onProgress(percent) {
    if (this._isMounted) {
      this.setState({
        progress: percent,
      });
    }
  },

  _handleFileClick(e) {
    e.stopPropagation();
  },

  _handleRemoveTouch(e) {
    e.stopPropagation();
    if (this.props.onRemove) {
      this.props.onRemove(this.props.file);
    }
  },
});

module.exports = FileWrapper;
