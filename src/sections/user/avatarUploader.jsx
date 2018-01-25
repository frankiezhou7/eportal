const React = require('react');
const ReactDOM = require('react-dom');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const Colors = require('epui-md/styles/colors');
const DefaultAvatar = require('~/src/shared/pic/avatar/80');
const PropTypes = React.PropTypes;
const StylePropable = require('~/src/mixins/style-propable');
const Translatable = require('epui-intl').mixin;
const UploadCircularProgress = require('./uploadCircularProgress');

const AvatarUploader = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/AvatarUploader/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    file: PropTypes.object,
    nErrorTextImageType: PropTypes.number,
    nLabelAvatarUploaderNotice: PropTypes.string,
    percent: PropTypes.number,
    size: PropTypes.number,
    src: PropTypes.string,
    strokeColor: PropTypes.string,
    strokeWidth: PropTypes.number,
    uploadAvatar: PropTypes.func,
    showNotice: PropTypes.bool,
    style: PropTypes.object,
  },

  getDefaultProps() {
    return{
      percent: 0,
      size: 140,
      strokeWidth: 4,
      src: DefaultAvatar[Math.ceil(Math.random()*5)],
      showNotice: true,
    };
  },

  getInitialState() {
    let {
      percent,
      src,
    } = this.props;

    return {
      percent: percent,
      src: src,
    };
  },

  componentDidMount() {
    let { file } = this.props;
    let self = this;
    let reader = new FileReader();
    reader.onload = ((e) => { self.setState({ src: e.target.result }); });
    if (file) {
      reader.readAsDataURL(file);
    }
  },

  getTheme() {
    return this.context.muiTheme.palette;
  },

  getStyles() {
    let {
      size,
      strokeWidth,
      style,
    } = this.props;

    let marginLeft = size + strokeWidth;

    let styles = {
      root: {
        width: `${size}px`,
        height: `${size}px`,
        overflow: 'hidden',
        cursor: 'pointer',
      },
      p: {
        position: 'absolute',
        margin: (size - 40) / 2 + 'px ' + -((size - 100) / 2 + 100) + 'px',
        display: 'inline-block',
        width: '100px',
        height: '40px',
        textAlign: 'center',
        fontWeight: 'bold',
        color: Colors.darkWhite,
      },
      file: {
        position: 'absolute',
        display: 'none',
        width: '0px',
        height: '0px'
      },
      img: {
        display: 'inline-block',
        width: `${size - 2}px`,
        height: `${size - 2}px`,
        borderRadius: '50%',
        border: 'solid 1px rgba(0, 0, 0, 0.08)',
      },
      progress: {
        position: 'absolute',
        marginTop: `-${strokeWidth}px`,
        marginLeft: `-${marginLeft}px`,
      }
    };

    if(style){
      Object.assign(styles.root,style);
    }

    return styles;
  },

  chooseFile() {
    this._handleTouchTap();
  },

  render() {
    let {
      size,
      strokeColor,
      strokeWidth,
      ...other,
    } = this.props;

    let {
      percent,
      src,
    } = this.state;

    let styles = this.getStyles();

    size = size + strokeWidth * 2;

    return(
      <div
        onDrop={this._handleDrop}
        onDragEnter={this._handleDragEnter}
        onDragOver={this._handleDragOver}
        onTouchTap={this._handleTouchTap}
        style={this.style('root')}
      >
        <img
          src={src}
          style={this.style('img')}
        />
        {
          this.props.showNotice ?
            <p style={this.style('p')}>
              {this.t('nLabelAvatarUploaderNotice')}
            </p> :
          null
        }
        <input
          ref='upload'
          accept='image/*'
          onChange={this._handleFilesEvent}
          style={this.style('file')}
          type='file'
        />
        <UploadCircularProgress
          color={strokeColor}
          mode='determinate'
          size={size}
          strokeWidth={strokeWidth}
          style={this.style('progress')}
          value={percent}
        />
      </div>
    );
  },

  _onProgress(percent) {
    if (percent !== this.state.percent) {
      this.setState({
        percent: percent,
      });
    }
  },

  _handleTouchTap() {
    let upload = this.refs.upload;
    if(upload) upload.click();
  },

  _handleFiles(files) {
    for (let i = 0, len = files.length; i < len; i++) {
      let file = files[i];
      let imageType = /image.*/;

      if (!file.type.match(imageType)) {
        global.pushInfo(this.t('nErrorTextImageType'));
        continue;
      }

      let self = this;
      let reader = new FileReader();
      reader.onerror = this._handleError;
      reader.onprogress = this._handleProgress;
      reader.onload = ((e) => { self.setState({ src: e.target.result }); });
      reader.readAsDataURL(file);

      let fn = this.props.uploadAvatar;
      if (_.isFunction(fn)) {
        this.setState({
          percent: 0,
        }, fn(file, this._onProgress));
      }
    }
  },

  _handleFilesEvent(e) {
    let files = e.target.files;
    this._handleFiles(files);
  },

  _handleDragEnter(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  _handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  _handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    let dt = e.dataTransfer;
    let files = dt.files;

    this._handleFiles(files);
  },

  _handleError(e) {
    let error = e.target.error;
    switch (error.code) {
      case error.NOT_FOUND_ERR:
        global.pushInfo(this.t('nErrorTextFileNotFound'));
        break;
      case error.NOT_READABLE_ERR:
        global.pushInfo(this.t('nErrorTextFileNotReadable'));
        break;
      case error.ABORT_ERR:
        break;
      default:
        global.pushInfo(this.t('nErrorTextErrorWhenReading'));
    }
  },

  _handleProgress(e) {
    if (e.lengthComputable) {
      var percentLoaded = Math.round((e.loaded / e.total) * 100);
      this.setState({
        percent: percentLoaded,
      });
    }
  },
});

module.exports = AvatarUploader;
