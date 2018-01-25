const React = require('react');
const _ = require('eplodash');
const AutoStyle = require('epui-auto-style').mixin;
const DropZone = require('./drop-zone');
const FileModel = require('../drag-drop-files/file-model');
const FileWrapper = require('./file-wrapper');
const Paper = require('epui-md/Paper');
const PropTypes = React.PropTypes;
const RaisedButton = require('epui-md/RaisedButton');
const FileUpload = require('epui-md/svg-icons/file/file-upload');
const Snackbar = require('epui-md/Snackbar');
const Translatable = require('epui-intl').mixin;
const agent = require('superagent');
const FILE_TYPES_ACCEPTED = [ 'jpeg', 'jpg', 'bmp', 'png', 'pdf', 'doc', 'docx', 'xls', 'xlsx' ];
const IMAGE_TYPES = ['jpeg', 'jpg', 'bmp', 'png'];
const MAX_SIZE_IN_M = 5;
const MAX_SIZE_RATE = 1024 * 1024;
const VIDEO_MAX_SIZE_IN_M = 50;
const VIDEO_TYPES_ACCEPTED = [ 'rm', 'rmvb', 'wmv', 'avi', 'mp4', '3gp', 'mkv' ];

const DragAndDropFiles = React.createClass({
  mixins: [AutoStyle, Translatable],

  translations: require(`epui-intl/dist/Order/${__LOCALE__}`),

  contextTypes: {
    muiTheme: PropTypes.object,
  },

  propTypes: {
    acceptVideo: PropTypes.bool,
    disableClick: PropTypes.bool,
    dropzoneStyle: PropTypes.object,
    fetchOrderFilesURL: PropTypes.func,
    field: PropTypes.string,
    fileTypeAccepted: PropTypes.array,
    fileTypeIconPath: PropTypes.string,
    loadedFiles: PropTypes.array,
    maxFileSize: PropTypes.number,
    maxVideoSize: PropTypes.number,
    nLabelDrapZoneInfo: PropTypes.string,
    nLabelIsUploading: PropTypes.string,
    nLabelUpload: PropTypes.string,
    nLabelViewDrapZoneInfo: PropTypes.string,
    nTextFileTypeError: PropTypes.string,
    nTextFilesError: PropTypes.string,
    nTextMaxmumSize: PropTypes.string,
    onFilesChange: PropTypes.func,
    order: PropTypes.object,
    orderEntry: PropTypes.object,
    postURL: PropTypes.string,
    product: PropTypes.object,
    productConfig: PropTypes.object,
    style: PropTypes.object,
    title: PropTypes.string,
    titleStyle: PropTypes.object,
    videoTypeAccepted: PropTypes.array,
    view: PropTypes.bool,
    zDepth: PropTypes.number,
  },

  getDefaultProps() {
    return {
      acceptVideo: false,
      fileTypeAccepted: FILE_TYPES_ACCEPTED,
      fileTypeIconPath: '../images/',
      loadedFiles: [],
      maxFileSize: MAX_SIZE_IN_M,
      maxVideoSize: VIDEO_MAX_SIZE_IN_M,
      title: '',
      videoTypeAccepted: VIDEO_TYPES_ACCEPTED,
      view: false,
      zDepth: 0,
    };
  },

  getInitialState() {
    return {
      dragDropErrorOpen: false,
      errorFiles: '',
      fileTypeErrorOpen: false,
      files: this.props.loadedFiles,
      maxSize: MAX_SIZE_IN_M,
      uploadCount: 0,
      uploadError: '',
      uploadErrorOpen: false,
    };
  },

  componentWillMount() {
    this._initFiles(this.props.loadedFiles);
  },

  getStyles() {
    let theme = this.context.muiTheme;
    let height = 100;
    let rootStyle = {
      backgroundColor: 'transparent',
      height: 'inherit',
      marginBottom: '8px',
    };
    let titleStyle = {
      paddingBottom: 3,
      display: 'block',
      textAlign: 'left',
    };
    if (this.props.titleStyle) {
      _.merge(titleStyle, this.props.titleStyle);
    }
    if (this.props.style) {
      _.merge(rootStyle, this.props.style);
    }
    let dropzoneStyle = {
      marginTop: '20px',
      minHeight: height,
      float:'left',
    };
    if (this.props.dropzoneStyle) {
      _.merge(dropzoneStyle, this.props.dropzoneStyle);
    }
    if (parseInt(dropzoneStyle.minHeight) < 100) {
      dropzoneStyle.minHeight = 100;
    }
    let styles = {
      root: rootStyle,
      title: titleStyle,
      fileContainer: {
        marginTop: '10px',
      },
      fileWrapper: {
        marginTop: '0px',
        marginBottom: '0px',
        // height: dropzoneStyle.minHeight * 0.85,
      },
      file: {
        display: 'inline-block',
        width: '100%',
        height: '100%',
      },
      dropzone: dropzoneStyle,
      emptyFileStyle: {
        padding: dropzoneStyle.minHeight / 2 - 10,
        textAlign: 'center',
      },
      snackbar: {
        height: 'inherit',
        lineHeight: '28px',
      },
      uploadContainer: {
        textAlign: 'center',
      },
      uploadTag: {
        position: 'absolute',
        zIndex: '2',
        width: '318px',
        height: '216px',
        color: 'rgba(0,0,0,0.38)',
        fontSize: '16px',
        lineHeight: '240px',
      },
      icon: {
        position: 'absolute',
        left: '149px',
        top: '83px',
        color: '#666',
      },
      upload: {
        width: '318px',
        height: '216px',
        position: 'relative',
      },
      buttonStyle: {
        borderRadius: '0 0 3px 3px',
      }
    };

    return styles;
  },

  checkNeedInitFiles(nextProps) {
    let init = false;
    let preLoadedFiles = this.props.loadedFiles;
    let nextLoadedFiles = nextProps.loadedFiles;
    if (preLoadedFiles.length !== nextLoadedFiles.length){
      init = true;
    }else{
      if (preLoadedFiles.length > 0 && nextLoadedFiles.length > 0) {
        for(let i = 0, len = preLoadedFiles.length; i<len; i++){
          if(preLoadedFiles[i].id && preLoadedFiles[i].id !== nextLoadedFiles[i].id) {
            init = true;
            break;
          }
        }
      }
    }
    return init;
  },

  componentWillReceiveProps(nextProps, nextContext) {
    if (this.checkNeedInitFiles(nextProps)) {
      this._initFiles(nextProps.loadedFiles);
    }
  },

  onDrop(files) {
    this._onDropFile(files);
  },

  onOpenClick() {
    this.refs.dropzone.open();
  },

  getFiles() {
    let files = this.state.files;
    let uniqFiles = _.uniqBy(files, 'id');
    let values = _.map(uniqFiles, file => {
      return {
        id: file.id,
        name: file.name,
        url: file.url,
      };
    });

    return values;
  },

  isUploading() {
    return this.isUploadingFileCount() > 0;
  },

  isDirty() {
    return this.toUploadFileCount() > 0;
  },

  getFilesCount() {
     return this.props.loadedFiles ? this.props.loadedFiles.length : this.state.files.length;
  },

  checkUploadBtnStatus() {
    return this.toUploadFileCount() === 0 || this.isUploading();
  },

  toUploadFileCount() {
    let files = this.state.files;
    let toUploadeFiles = [];
    _.forEach(files, file => {
      if (file.toUpload) {
        toUploadeFiles.push(file);
      }
    });
    return toUploadeFiles.length;
  },

  isUploadingFileCount() {
    let files = this.state.files;
    let uploadingFiles = [];
    _.forEach(files, file => {
      if (file.isUploading) {
        uploadingFiles.push(file);
      }
    });
    return uploadingFiles.length;
  },

  renderFiles() {
    let fileContainer = null;
    let {
      field,
      view
    } = this.props;
    let { files } = this.state;
    let len = files ? files.length : 0;
    if (len > 0) {
      fileContainer = [];
      for (let i = 0; i < len; i++) {
        let file = files[i];
        let isImg = _.includes(IMAGE_TYPES, file.extension);
        let isVideo = _.includes(VIDEO_TYPES_ACCEPTED, file.extension);
        let url = null;
        if (isImg) {
          url = file.id ? '/files/'+file.id : file.url;
        } else {
          try {
            url = file.extension ? require(`../images/${file.extension}.svg`) : require(`../images/blank.svg`);
          } catch (e) {
            url = require(`../images/blank.svg`);
          }
        }
        let fileElem = (
          <img
            key={file.url}
            src={url}
            style={this.style('file')}
          />
        );

        if (url) {
          fileContainer.push(
            <FileWrapper
              {...this.props}
              ref={file.url}
              key={file.url}
              field={field}
              file={file}
              isUploading={file.isUploading ? true : false}
              onRemove ={this._handleRemoveClick}
              postURL={this.props.postURL}
              style={this.style('fileWrapper')}
              uploaded={file.uploaded ? true : false}
              view={view}
              zDepth={file.uploaded ? 0 : 1}
              onUploadComplete={this._handleUploadComplete}
            >
              {fileElem}
            </FileWrapper>
          );
        }
      }
    } else {
      fileContainer = null;
    }

    return fileContainer;
  },

  renderUploadBtn() {
    if(this.props.view) { return null; }

    return (
      <div style={this.style('uploadContainer')}>
        <RaisedButton
          buttonStyle = {this.style('buttonStyle')}
          disabled={this.checkUploadBtnStatus()}
          onClick={this._handleUploadTouch}
          style={this.style('upload')}
          backgroundColor={'#d8d8d8'}
          disabledBackgroundColor={'#d8d8d8'}
        >
          <div style={this.style('uploadTag')}>
            Upload Certificate
            <FileUpload style={this.style('icon')}/>
          </div>
        </RaisedButton>
      </div>
    );
  },

  renderTitle() {
    return (
      <span style={this.style('title')}>{this.props.title}</span>
    );
  },

  render() {
    let errorMessage = this.t('nTextMaxmumSize') + this.state.maxSize + 'M, ' + this.t('nTextFilesError') + this.state.errorFiles;
    let fileTypes = this.props.fileTypeAccepted;
    if (this.props.acceptVideo) {
      fileTypes = fileTypes.concat(this.props.videoTypeAccepted);
    }

    let {
      dragDropErrorOpen,
      uploadErrorOpen,
      fileTypeErrorOpen,
    } = this.state;

    return (
      <Paper
        style={this.style('root')}
        zDepth={this.props.zDepth}
      >
        {this.renderTitle()}
        {this.renderFiles()}
        <DropZone
          ref="dropzone"
          onDrop={this.onDrop}
          style={this.style('dropzone')}
          view={this.props.view}
        >

          {this.renderUploadBtn()}
        </DropZone>
        <Snackbar
          ref='dragDropError'
          autoHideDuration={5000}
          message={errorMessage}
          open={dragDropErrorOpen}
          style={this.style('snackbar')}
        />
        <Snackbar
          ref='uploadError'
          autoHideDuration={5000}
          message={this.state.uploadError}
          open={uploadErrorOpen}
          style={this.style('snackbar')}
        />
        <Snackbar
          ref='fileTypeError'
          autoHideDuration={5000}
          message={this.t('nTextFileTypeError') + fileTypes.join(', ')}
          open={fileTypeErrorOpen}
          style={this.style('snackbar')}
        />
      </Paper>
    );
  },

  _handleRemoveClick(file) {
    this._removeFile(file);
  },

  _handleUploadComplete(file,fileIds) {
    this._handleUploadSuccess(file,fileIds);
  },

  _removeFile(file) {
    let files = this.state.files;
    let newFiles = _.reject(files, (f)=>{
      if(file.id) return file.id === f.id;
      if(file.url) return file.url === f.url;
      return f === file
    });
    this.setState({files: newFiles});
  },

  _onDropFile(files) {
    let filesArr = this.state.files;
    let errorFiles = '';
    let fileTypeError = false;
    let maxSize = this.props.maxFileSize;
    let filterFiles = _.filter(files, (file) => {
      let name = file.name;
      let extension = name.substring(name.lastIndexOf('.') + 1, name.length);
      if (!extension) {
        fileTypeError = true;
        return false;
      }
      if (_.includes(this.props.videoTypeAccepted, extension.toLowerCase())) {
        maxSize = this.props.maxVideoSize;
      }
      if (file.size > maxSize * MAX_SIZE_RATE) {
        errorFiles += file.name + ', ';
      }
      let fileTypes = this.props.fileTypeAccepted;
      if (this.props.acceptVideo) {
        fileTypes = fileTypes.concat(this.props.videoTypeAccepted);
      }
      if (!_.includes(fileTypes, extension.toLowerCase())) {
        fileTypeError = true;
      }
      return file.size <= maxSize * MAX_SIZE_RATE && !fileTypeError;
    });
    filterFiles = _.map(filterFiles, file => {
      return (new FileModel()).initDroppedFile(file);
    });
    filesArr = filesArr.concat(filterFiles);
    if (errorFiles.length > 0) {
      errorFiles = errorFiles.substring(0, errorFiles.length - 2);
    }

    this.setState({
      dragDropErrorOpen: !fileTypeError && errorFiles.length > 0 ? true : false,
      errorFiles: errorFiles,
      fileTypeErrorOpen: fileTypeError ? true : false,
      files: filesArr,
      maxSize: maxSize,
    });
    this._handleFilesChange();
  },

  _handleUploadTouch(e) {
    e.stopPropagation();
    this._chooseOneFileToUpload();
  },

  _chooseOneFileToUpload(){
    let files = this.state.files;
    let hasFileToUpload = false;
    for(let i=0, len = files.length; i<len; i++){
      let file = files[i];
      if(file.toUpload){
        file.isUploading = true;
        file.toUpload = false;
        hasFileToUpload = true;
        break;
      }
    }
    if(hasFileToUpload) this.setState({files: files});
  },

  _handleUploadSuccess(file,uploadedFile){
    let files = this.state.files;
    _.forEach(files,f=>{
      if(f === file){
        f.isUploading =false;
        f.uploaded =true;
        f.id = uploadedFile.id;
      }
    });
    this.setState({
      files:files
    },()=>{
      this._chooseOneFileToUpload();
    });
  },

  _initFiles(files) {
    files = _.uniqBy(files, 'id');
    if (files.length > 0) {
      let loadedFiles = [];
      _.forEach(files, file => {
        let fileModel = (new FileModel()).initLoadedFile(file);
        loadedFiles.push(fileModel);
      });
      this.setState({files: loadedFiles});
    }
  },

  _handleFilesChange() {
    if (this.props.onFilesChange) {
      this.props.onFilesChange();
    }
  },
});

module.exports = DragAndDropFiles;
