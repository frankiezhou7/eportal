const React = require('react');
const AutoStyle = require('epui-auto-style').mixin;
const CancelButton = require('epui-md/svg-icons/navigation/cancel');
const DownloadButton = require('epui-md/svg-icons/file/file-download');
const DeleteButton = require('epui-md/svg-icons/action/delete');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const PureRenderMixin = require('react-addons-pure-render-mixin');
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

  componentDidMount() {
    this._isMounted = true;
  },

  componentWillUnmount() {
    this._isMounted = false;
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let height = 170;
    let rate = 1.4142857142857;
    let padding = 5;
    let coverOpacity = 0.9;
    let width = parseInt(height / rate);
    let paperStyle = {
      width: width,
      height: height,
      padding: padding,
      margin: 2 * padding,
    };
    if(this.props.style) {
      _.merge(paperStyle,this.props.style);
    }
    if(this.props.style.height && !this.props.style.width) {
      paperStyle.width = parseInt(parseInt(this.props.style.height) / rate);
    }
    let coverStyle = {
      opacity: 0.5 || coverOpacity,
      backgroundColor: '#000' || theme.palette.greyColor,
      width: paperStyle.width,
      height: 18,
      textAlign: 'center',
      boxSizing: 'border-box',
      position: 'absolute',
      bottom: 0,
      paddingTop: 2,
    };
    let hoverStyle = {
      marginTop : -(parseInt(paperStyle.height) + parseInt(paperStyle.marginBottom)),
      width: paperStyle.width,
      height: paperStyle.height,
      marginLeft: 2 * padding,
      display: this.state.hover ? 'block' : 'none',
      overflow: 'hidden',
      marginBottom: paperStyle.marginBottom,
      boxSizing: 'border-box',
      position: 'relative',
    };
    let styles = {
      root: {
        cursor: 'pointer',
        display: 'inline-block',
        boxSizing: 'border-box',
        overflow: 'hidden',
        marginTop: 25,
      },
      button: {
        verticalAlign: 'bottom',
        opacity: 1,
        // backgroundColor: theme.palette.greyColor,
        fill: '#fff' || theme.palette.accent1Color,
        width: 15,
        height: 15,
        float: 'right',
        margin: '0px 10px',
      },
      actions: {
        opacity: coverOpacity,
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

  uploadFile() {
    let {
      field,
      file,
      order,
      orderEntry,
      product,
      productConfig,
      onUploadComplete,
    } = this.props;
    let { storeOrderFile } = global.api.order;
    let productConfigProductId = '';
    productConfig.products.map(productArr => {
      if (productArr.get('product').get('_id') === product.get('_id')) {
        productConfigProductId = productArr.get('_id');
      }
    });
    if (_.isFunction(storeOrderFile)) {
      storeOrderFile
        .promise(order.get('_id'), orderEntry.get('_id'), productConfig.get('_id'), productConfigProductId, product.get('_id'), field, {
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
          <DeleteButton
            onClick={this._handleRemoveTouch}
            style={_.omit(this.style('button'),['margin'])}
            title ={this.props.nTextRemove}
          />
        );
    let downloadBtn = (
      <a
        href={this.props.file.id ? filePath+this.props.file.id : this.props.file.url}
        title={this.props.nTextDownload}
        download
      >
        <DownloadButton style={this.style('button')} />
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
            {/*<span style={this.style('fileName')}>
              {this.props.file.name}
            </span>*/}
            {downloadBtn}
            {cancelBtn}
          </div>
          {/*<div style={this.style('actions')}>
          </div>*/}
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
